import * as BABYLON from 'babylonjs';
import * as BABYLONMAT from 'babylonjs-materials';
import type { SceneFactory } from '$lib/babylonjs/common';
import fontData from '$lib/fontData/Fira_Mono_Regular.json';
import earcut from 'earcut';
import * as math from "mathjs";


export interface BlochSceneStyle
{
    backgroundColor? : string;
    sphereColor? : string;
    sphereOpacity? : number;
    stateMarkerColor? : string;
}


interface BlochSceneStyleInternal
{
    backgroundColor : string;
    sphereColor : string;
    sphereOpacity : number;
    stateMarkerColor : string;
    amplitudeMarkerColor : string;
}



export class BlochScene implements SceneFactory
{
    private readonly SphereRadius = 1;
    private readonly CenterVector = new BABYLON.Vector3(0, 0, 0);
    private readonly IKetVector = new BABYLON.Vector3(1.0, 0.0, 0.0);
    private readonly MinusIKetVector = new BABYLON.Vector3(-1.0, 0.0, 0.0);
    private readonly ZeroKetVector = new BABYLON.Vector3(0, 1.0, 0.0);
    private readonly OneKetVector = new BABYLON.Vector3(0, -1.0, 0.0);
    private readonly PlusKetVector = new BABYLON.Vector3(0, 0, 1.0);
    private readonly MinusKetVector = new BABYLON.Vector3(0, 0, -1.0);

    private readonly DEFAULT_STYLE : BlochSceneStyleInternal = {
        "backgroundColor" : "#1E1F2200",
        "sphereColor" : "#000000",
        "sphereOpacity" : 0.1,
        "stateMarkerColor" : "#F7DE8B",
        "amplitudeMarkerColor" : "#955AE0"
    }
    

    private camera : BABYLON.ArcRotateCamera | undefined;
    private polarAmplitudeDisc : BABYLON.Mesh | undefined;
    private azimuthAmplitudeDisc : BABYLON.Mesh | undefined;
    private stateMarker : BABYLON.Mesh | undefined;
    private isSceneCreated = false;
    private styleConfig : BlochSceneStyleInternal = this.DEFAULT_STYLE;

    

    public createScene(engine : BABYLON.Engine, style? : BlochSceneStyle) : BABYLON.Scene 
    {
        this.styleConfig = this.validateStyle(style);

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color4.FromHexString(this.styleConfig.backgroundColor);

        // Add a camera to the scene and attach it to the canvas
        this.camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / (Math.PI * 1.3), Math.PI / 2.6, 6, new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.lowerRadiusLimit = 3.5;
        this.camera.upperRadiusLimit = 3.5;
        this.camera.lowerBetaLimit = Math.PI * 0.275;
        this.camera.upperBetaLimit = Math.PI * 0.8;
        this.camera.attachControl(engine.getRenderingCanvas(), true);


        // Add light to the scene
        const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(2, 5, -4), scene);
        light1.intensity = 0.7;

        const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(-4, 10, 2), scene);
        light2.intensity = 2.0;

        //Add a sphere
        const sphere = this.createBlochShere(scene);
        this.applySphereDecorators(sphere, scene);
        this.stateMarker = this.createQuantumStateMarker(scene);;

        this.isSceneCreated = true;
        return scene;
    }


    private validateStyle(styleConfig? : BlochSceneStyle) : BlochSceneStyleInternal
    {
        let finalStyle = this.DEFAULT_STYLE;
        if(styleConfig)
        {
            //TODO: Validate styleConfig values and fallback to default when invalid
        }

        return finalStyle;
    }


    private createBlochShere(scene : BABYLON.Scene) : BABYLON.Mesh
    {
        const sphereMat = new BABYLON.StandardMaterial("sphereMat", scene);
        sphereMat.specularColor = BABYLON.Color3.FromHexString(this.styleConfig.sphereColor);
        sphereMat.alpha = this.styleConfig.sphereOpacity;

        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: this.SphereRadius * 2, segments: 32}, scene);
        sphere.material = sphereMat;
        
        return sphere;
    }


    private createQuantumStateMarker(scene : BABYLON.Scene) : BABYLON.Mesh
    {
        const sphereMat = new BABYLONMAT.GradientMaterial('sphereMat', scene);
        const color = BABYLON.Color3.FromHexString(this.styleConfig.stateMarkerColor);
        sphereMat.topColor = color;
        sphereMat.bottomColor = color.multiplyByFloats(0.8, 0.8, 0.8);
        sphereMat.offset = 0.2;
        sphereMat.backFaceCulling = false;
        
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.08 }, scene);
        sphere.material = sphereMat;
        sphere.isPickable = false;
        sphere.position = this.CenterVector;

        return sphere;
    }


    private applySphereDecorators(sphere : BABYLON.Mesh, scene : BABYLON.Scene)
    {
        //Create the equator
        let equatorPoints :BABYLON.Vector3[] = [];
        const equatorRadius = 1.001;
        const equatorSegments = 50;
        const equatorDeltaTheta = Math.PI / equatorSegments;
        let equatorTheta = 0;
        const equatorY = 0;
        for(let i = 0; i < Math.PI * equatorSegments; i++)
        {
            equatorPoints.push(new BABYLON.Vector3(equatorRadius * Math.cos(equatorTheta), equatorY, equatorRadius * Math.sin(equatorTheta)));
            equatorTheta += equatorDeltaTheta;
        }
        const equatorLine = BABYLON.MeshBuilder.CreateDashedLines("equatorLines", {points: equatorPoints, updatable: true}, scene);
        equatorLine.isPickable = false;
        equatorLine.parent = sphere;
        equatorLine.color = new BABYLON.Color3(0.6, 0.6, 0.6);

        //Create the amplitude ring points
        let amplitudeMarkerPoints :BABYLON.Vector3[] = [];
        const amplitudeMarkerRadius = 1.01;
        const amplitudeMarkerSegments = 100;
        const amplitudeMarkerDeltaTheta = Math.PI / amplitudeMarkerSegments;
        equatorTheta = 0;
        for(let i = 0; i < Math.PI * amplitudeMarkerSegments; i++)
        {
            amplitudeMarkerPoints.push(new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(equatorTheta), equatorY, amplitudeMarkerRadius * Math.sin(equatorTheta)));
            equatorTheta += amplitudeMarkerDeltaTheta;
        }



        //Array of points to construct Bloch X axis line
        var xAxisPoints = [
            this.MinusKetVector,
            this.PlusKetVector
        ];

        //Array of points to construct Bloch Y axis line
        var yAxisPoints = [
            this.MinusIKetVector,
            this.IKetVector
        ];

        //Array of points to construct Bloch Z axis line
        var zAxisPoints = [
            this.ZeroKetVector,
            this.OneKetVector
        ];

        //Create lines
        const axisLineColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        const xAxisLine = BABYLON.MeshBuilder.CreateLines("xAxisLine", { points: xAxisPoints }, scene);
        xAxisLine.color = axisLineColor;
        xAxisLine.isPickable = false;
        xAxisLine.parent = sphere;

        const yAxisLine = BABYLON.MeshBuilder.CreateLines("yAxisLine", { points: yAxisPoints }, scene);
        yAxisLine.color = axisLineColor;
        yAxisLine.isPickable = false;
        yAxisLine.parent = sphere;

        const zAxisLine = BABYLON.MeshBuilder.CreateLines("zAxisLine", { points: zAxisPoints }, scene);
        zAxisLine.color = axisLineColor;
        zAxisLine.isPickable = false;
        zAxisLine.parent = sphere;


        //Axis Labels
        const zeroKetAxisLabel      = this.createAxisLabel("zeroKet-axis-label", "|0>", new BABYLON.Vector3(0, 1.15, 0), scene);
        const oneKetAxisLabel       = this.createAxisLabel("oneKet-axis-label", "|1>", new BABYLON.Vector3(0, -1.2, 0), scene);
        const plusKetAxisLabel      = this.createAxisLabel("plusKet-axis-label", "|+>", new BABYLON.Vector3(0, 0.08, -1.2), scene);
        const minusKetAxisLabel     = this.createAxisLabel("minusKet-axis-label", "|->", new BABYLON.Vector3(0, 0.08, 1.2), scene);
        const iKetAxisLabel         = this.createAxisLabel("iKet-axis-label", "|i>", new BABYLON.Vector3(1.2, 0.08, 0), scene);
        const minusIKetAxisLabel    = this.createAxisLabel("minusIKet-axis-label", "|-i>", new BABYLON.Vector3(-1.2, 0.08, 0), scene);


        //Vertical & Horizontal Slices
        
        const discMat = new BABYLON.StandardMaterial("discMat", scene);
        const color = BABYLON.Color3.FromHexString(this.styleConfig.amplitudeMarkerColor);
        discMat.emissiveColor = color;
        discMat.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        discMat.disableLighting = true;
        discMat.backFaceCulling = false;
        discMat.alpha = 1.0;

        const segLength = 2 * math.pi / 3;
        const f1 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength), equatorY, amplitudeMarkerRadius * Math.sin(segLength));
        const s1 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength * 2), equatorY, amplitudeMarkerRadius * Math.sin(segLength * 2));
        const t1 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength * 3), equatorY, amplitudeMarkerRadius * Math.sin(segLength * 3));

        const arc = BABYLON.Curve3.ArcThru3Points(f1, s1, t1, 64, false, true);
        this.azimuthAmplitudeDisc = BABYLON.MeshBuilder.CreateLines("arc", { points : arc.getPoints(), updatable: true, material: discMat }, scene);
        this.azimuthAmplitudeDisc.isPickable = false;
        this.azimuthAmplitudeDisc.parent = sphere;
        this.azimuthAmplitudeDisc.rotate(this.PlusKetVector, Math.PI * 0.55);

        const f2 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength), equatorY, amplitudeMarkerRadius * Math.sin(segLength));
        const s2 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength * 2), equatorY, amplitudeMarkerRadius * Math.sin(segLength * 2));
        const t2 = new BABYLON.Vector3(amplitudeMarkerRadius * Math.cos(segLength * 3), equatorY, amplitudeMarkerRadius * Math.sin(segLength * 3));
        const arc2 = BABYLON.Curve3.ArcThru3Points(f2, s2, t2, 128, false, true);

        this.polarAmplitudeDisc = BABYLON.MeshBuilder.CreateLines("arc", { points : arc.getPoints(), updatable: true, useVertexAlpha : false, material : discMat }, scene);
        this.polarAmplitudeDisc.isPickable = false;
        this.polarAmplitudeDisc.parent = sphere;
    }


    private createAxisLabel(label : string, text : string, position : BABYLON.Vector3, scene : BABYLON.Scene) :  BABYLON.Mesh
    {
        const textMesh = BABYLON.MeshBuilder.CreateText(label, text, fontData as BABYLON.IFontData, {
            size : 0.06,
            resolution: 64,
            depth: 0.001
        }, scene, earcut);
        
        if(textMesh != null)
        {
            const mat = new BABYLON.StandardMaterial("sphereMat", scene);
            mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);        
            mat.alpha = 1.0;
            mat.backFaceCulling = false;

            textMesh.position = position;
            textMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            textMesh.isPickable = false;
            textMesh.material = mat;
        }

        return textMesh!;
    }


    public setAngles(polar : number, azimuth : number)
    {
        if(!this.isSceneCreated) return;

        const xPosition = Math.sin(polar) * Math.sin(azimuth);
        const yPosition = Math.cos(polar);
        const zPosition = -Math.sin(polar) * Math.cos(azimuth);
        this.stateMarker!.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);


        //Update Disc Positions
        const discPosition = math.abs(yPosition);
        if(discPosition == 1)
        {
            this.polarAmplitudeDisc!.scaling = this.CenterVector;
        }
        else
        {
            this.polarAmplitudeDisc!.position = new BABYLON.Vector3(0, yPosition, 0);
            const polarAmpDiscScaling = BABYLON.Vector3.Distance(this.polarAmplitudeDisc!.position, this.stateMarker!.position);
            this.polarAmplitudeDisc!.scaling = new BABYLON.Vector3(polarAmpDiscScaling, polarAmpDiscScaling, polarAmpDiscScaling);
        }

        const targetRot = new BABYLON.Vector3(0, -azimuth, Math.PI * 0.5);
        this.azimuthAmplitudeDisc!.rotationQuaternion = targetRot.toQuaternion();
    }
}