import * as math from "mathjs";
import * as QM from '$lib/math'
import * as QuC from '$lib/quantum/qubitCommon'
import * as QC from '$lib/quantum/quantumCommon'


const ALPHA_MATRIX_INDEX = [0, 0];
const BETA_MATRIX_INDEX = [1, 0];
const DEFAULT_ALPHA = QuC.CommonStates.Zero.get(ALPHA_MATRIX_INDEX) as math.Complex;
const DEFAULT_BETA = QuC.CommonStates.Zero.get(BETA_MATRIX_INDEX) as math.Complex;

export class Qubit
{
    private _State : math.Matrix;
    private _PolarAngle : number;
    private _AzimuthAngle : number;

  
    constructor(alpha : math.Complex = DEFAULT_ALPHA, beta : math.Complex = DEFAULT_BETA)
    {
        this._State = QuC.CommonStates.Zero.clone();
        this.setAmplitudeState(ALPHA_MATRIX_INDEX, alpha as math.Complex);
        this.setAmplitudeState(BETA_MATRIX_INDEX, beta as math.Complex);
        this._PolarAngle = 0;
        this._AzimuthAngle = 0;
    }


    getState()
    {
        return this._State.clone();
    }


    getAmplitudes()
    {
        return this._State.toArray();
    }


    getAlphaAmplitude() : math.Complex
    {
        return this.getAmplitudeState(ALPHA_MATRIX_INDEX);
    }


    getBetaAmplitude() : math.Complex
    {
        return this.getAmplitudeState(BETA_MATRIX_INDEX);
    }


    getPolarAngle() : number
    {
        return this._PolarAngle;
    }


    getAzimuthAngle() : number
    {
        return this._AzimuthAngle;
    }


    setState(alpha : math.Complex, beta : math.Complex)
    {
        this.setAmplitudeState(ALPHA_MATRIX_INDEX, alpha);
        this.setAmplitudeState(BETA_MATRIX_INDEX, beta);
        this.calculateGeometry(this.getAlphaAmplitude(), this.getBetaAmplitude());
    }


    setZeroState()
    {
        this._State = QuC.CommonStates.Zero.clone();
        this.calculateGeometry(this.getAlphaAmplitude(), this.getBetaAmplitude());
    }


    setOneState()
    {
        this._State = QuC.CommonStates.One.clone();
        this.calculateGeometry(this.getAlphaAmplitude(), this.getBetaAmplitude());
    }


    getProbability()
    {
        const a = this.getAlphaAmplitude();
        const b = this.getBetaAmplitude();
        return [math.square(a), math.square(b)];
    }


    calculateGeometry(alpha : math.Complex, beta : math.Complex)
    {
        //Calculate the geometry
        this._PolarAngle = math.multiply(2.0, math.acos(math.abs(alpha))).valueOf() as number;
        let workingAzimuth = beta.toPolar().phi - alpha.toPolar().phi;
        this._AzimuthAngle = (workingAzimuth + QC.Rotations.PI_2) % QC.Rotations.PI_2;

        //console.log("polar: " + this.polarAngle);
        //console.log("azimuthAngle: " + this.azimuthAngle);
    }


    applyMatrix(mat : math.Matrix) : QuC.QubitResult
    {
        //The gymnastics in this logic accounts for JS math precision challenges 
        const DEBUG_MODE = false;
        if(DEBUG_MODE) console.log("Apply gate -------")
        if(DEBUG_MODE) console.log("mat: " + mat.toString());
        if(DEBUG_MODE) console.log("before state: " + this._State.toString());

        const originalAlpha = this.getAlphaAmplitude();
        const originalBeta = this.getBetaAmplitude();

        if(DEBUG_MODE) console.log("originalAlpha: " + originalAlpha);
        if(DEBUG_MODE) console.log("originalBeta: " + originalBeta);


        //Apply the matrix to the current state
        let psi =  math.multiply(mat, this._State);

        if(DEBUG_MODE) console.log("psi: " + psi.toString());

        let alpha = QM.clampComplex(this.getAmplitudeState(ALPHA_MATRIX_INDEX, psi));
        let beta = QM.clampComplex(this.getAmplitudeState(BETA_MATRIX_INDEX, psi));

        if(DEBUG_MODE) console.log("pre-alpha: " + alpha);
        if(DEBUG_MODE) console.log("pre-beta: " + beta);

        this.calculateGeometry(alpha, beta);
        if(DEBUG_MODE) console.log("Polar : " + this._PolarAngle);
        if(DEBUG_MODE) console.log("Azimuth : " + this._AzimuthAngle);
        
        //Normalize the state based on the geometry
        const halfPolar = this._PolarAngle * 0.5;
        if(DEBUG_MODE) console.log("halfPolar: " + halfPolar);

        alpha = math.complex(math.cos(halfPolar), 0);
        const sinHalfPolar = math.sin(halfPolar);
        beta = math.multiply(math.complex(math.cos(this._AzimuthAngle), math.sin(this._AzimuthAngle)), sinHalfPolar) as math.Complex;
        if(DEBUG_MODE) console.log("alpha: " + alpha);
        if(DEBUG_MODE) console.log("beta: " + beta);

        //Update the current state
        this.setAmplitudeState(ALPHA_MATRIX_INDEX, alpha as math.Complex);
        this.setAmplitudeState(BETA_MATRIX_INDEX, beta as math.Complex);

        if(DEBUG_MODE) console.log("after state: " + this._State.toString());
        if(DEBUG_MODE) console.log(this._State);
        if(DEBUG_MODE) console.log("-----------------------");
        
        return new QuC.QubitResult({
            alpha : originalAlpha,
            beta : originalBeta,
            gate : mat,
            resultAlpha : alpha,
            resultBeta : beta
        });
    }


    toString()
    {
        return math.format(this._State);
    }


    private getAmplitudeState( index : number[], state : math.Matrix = this._State) : math.Complex
    {
        return state.get(index);
    }


    private setAmplitudeState(index : number[], value : math.Complex, state : math.Matrix = this._State)
    {
        state.set(index, value);
    }
}