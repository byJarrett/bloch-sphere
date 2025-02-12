<script lang="ts">
    import { onMount, tick } from 'svelte';
    import * as math from 'mathjs';
    import QubitStateDataView from '$lib/quantum/ui/QubitStateDataView.svelte';
	import QubitGatesPanel from '$lib/quantum/ui/QubitGatesPanel.svelte';
    import * as QuC from '$lib/quantum/qubitCommon';
	import BabylonEngine from '$lib/babylonjs/BabylonEngine.svelte';
    import { BlochScene } from '$lib/quantum/ui/Bloch';
    import { Qubit } from "$lib/quantum/qubit";
    import { QubitHistory } from '$lib/quantum/qubitHistory';
	import { primaryGateUILabels, sGateUILabels, tGateUILabels, rotationGateUILabels } from '$lib/quantum/ui/common';
	import QubitHistoryPanel from '$lib/quantum/ui/QubitHistoryPanel.svelte';
	import StateCalculatorPanel from '$lib/quantum/ui/StateCalculatorPanel.svelte';
    import { PUBLIC_APP_TITLE } from '$env/static/public';
	
    let blochScene : BlochScene = $state(new BlochScene());

    let q0 = $state(new Qubit());

    let alphaAmp : math.Complex = $state(math.complex(0, 0));
    let betaAmp : math.Complex = $state(math.complex(0, 0));
    let polarAngle : number = $state(0);
    let azimuthAngle : number = $state(0); 
    let qubitHistory = $state(new QubitHistory());
    let historyValues = $state(new Array<QuC.QubitResultHistory>());

    let headerDecorationLine : HTMLDivElement;
    let mainBodyDiv : HTMLDivElement;

    onMount(() =>
    {
        tick().then(() => 
        { 
            updateUIDataBindings();
        });
    });


    function onGateClick(gateKey : QuC.CoreGateKeys)
    {
        applyGate(gateKey);
    }


    function onRotateGateClick(gateKey : QuC.CoreGateKeys, value : number)
    {
        applyGateMatrix(QuC.CoreGates.rotate(gateKey, value), rotationGateUILabels.get(gateKey));
        updateUIDataBindings();
    }


    function onResetClick(stateKey : QuC.CommonStateKeys)
    {
        switch(stateKey)
        {
            case QuC.CommonStateKeys.Zero:
                q0.setZeroState();
                break;

            case QuC.CommonStateKeys.One:
                q0.setOneState();
                break;
            //case QuC.CommonStateKeys.Plus:
            //case QuC.CommonStateKeys.Minus:
            //case QuC.CommonStateKeys.I:
            //case QuC.CommonStateKeys.MinusI:
        }
        
        qubitHistory.clear();
        updateUIDataBindings();
    }


    function applyGate(gate : QuC.CoreGateKeys)
    {
        const gateMatrix = QuC.CoreGates.getGate(gate);

        if(gateMatrix != undefined)
        {
            let label = primaryGateUILabels.get(gate);
            if(label === undefined) label = sGateUILabels.get(gate);
            if(label === undefined) label = tGateUILabels.get(gate);
            
            applyGateMatrix(gateMatrix, label);
        }
    }


    function applyGateMatrix(mat : math.Matrix, label? : string)
    {
        let result = q0.applyMatrix(mat);             
        qubitHistory.add(result, label ? label : "Unknown");
        updateUIDataBindings();
    }


    function updateUIDataBindings()
    {
        alphaAmp        = q0.getAlphaAmplitude();
        betaAmp         = q0.getBetaAmplitude();
        polarAngle      = q0.getPolarAngle();
        azimuthAngle    = q0.getAzimuthAngle();
        historyValues   = qubitHistory.toArray();

        blochScene.setAngles(polarAngle, azimuthAngle);
    }
   

    function onHistoryItemSelected(result : QuC.QubitResultHistory, index : number)
    {
        qubitHistory.rollback(index);
        q0.setState(result.resultAlpha, result.resultBeta);
        updateUIDataBindings();
    }
</script>


<div class="flex">
    <div class="flex-grow flex gap-x-0 -ml-2 -mt-12 min-w-14">
        <div bind:this={headerDecorationLine} class="bg-[theme(colors.accent2)] mt-[72.5px] h-[1px] w-full flex-grow opacity-70"></div>
    
        <svg width="100" height="125" viewBox="0 0 100 125" fill="none" class="flex-none -ml-[45px] stroke-[theme('colors.textPrimary')]" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.69922 54.9888L93.7555 91.8164"/>
            <path d="M0.498045 92.7818L99.2409 53.6973M33.0591 53.6973L67.2858 92.7818M18.6717 109.331L81.2188 36.7958M62.2881 40.8452L37.7539 105.986M36.8452 34.5072L63.1968 111.444M50.021 125L50.021 4.22606e-07"/>
            <line x1="50" y1="72.6787" x2="91.0015" y2="72.6787"/>
        </svg>
    </div>
    <div bind:this={mainBodyDiv} class="w-[1140px] flex-grow-0 z-500">
        <div>
            <h1>{PUBLIC_APP_TITLE}</h1>
            <h4 class="-mt-2">A frivol <a href="https://github.com/byJarrett">byJarrett</a> </h4>
        </div>

        <div class="grid grid-flow-col grid-cols-auto w-fit">
            <div class="w-fit place-content-end mb-9">
                <QubitGatesPanel onGateClick={onGateClick} onRotateGateClick={onRotateGateClick} onResetClick={onResetClick}/>
            </div>
            <div>
                <BabylonEngine sceneFactory={blochScene}></BabylonEngine>
            </div>
            <div class="min-w-72 place-content-end mb-18 -m-l-2">
                <QubitStateDataView alphaAmplitude={alphaAmp} betaAmplitude={betaAmp} polarAngle={polarAngle} azimuthAngle={azimuthAngle}></QubitStateDataView>
            </div>
        </div>

        <div class="-mt-10 w-[88%] pr-6"> 
            <QubitHistoryPanel data={historyValues} onSelect={onHistoryItemSelected}/>
        </div>

        <!--div class="mt-8 w-full"> 
            <StateCalculatorPanel currentAlpha={alphaAmp} currentBeta={betaAmp}/>
        </div--> 
    </div>
    <div class="grow min-w-12"></div>
</div>


