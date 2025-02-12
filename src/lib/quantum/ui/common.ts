import * as QuC from '$lib/quantum/qubitCommon';
import * as BEM from '$lib/math';




const primaryGateUILabelsInternal = new Map<QuC.CoreGateKeys, string>();
primaryGateUILabelsInternal.set(QuC.CoreGateKeys.H, "H");
primaryGateUILabelsInternal.set(QuC.CoreGateKeys.X, "X");
primaryGateUILabelsInternal.set(QuC.CoreGateKeys.Y, "Y");
primaryGateUILabelsInternal.set(QuC.CoreGateKeys.Z, "Z");

export const primaryGateUILabels = Object.freeze(primaryGateUILabelsInternal);



const commonStateUILabelsInternal = new Map<QuC.CommonStateKeys, string>();
commonStateUILabelsInternal.set(QuC.CommonStateKeys.Zero, "|0>");
commonStateUILabelsInternal.set(QuC.CommonStateKeys.One, "|1>");
commonStateUILabelsInternal.set(QuC.CommonStateKeys.Plus, "|+>");
commonStateUILabelsInternal.set(QuC.CommonStateKeys.Minus, "|->");
commonStateUILabelsInternal.set(QuC.CommonStateKeys.I, "|i>");
commonStateUILabelsInternal.set(QuC.CommonStateKeys.MinusI, "|-i>");

export const commonStateUILabels = Object.freeze(commonStateUILabelsInternal);



const initialStateUILabelsInternal = new Map<QuC.CommonStateKeys, string>();
initialStateUILabelsInternal.set(QuC.CommonStateKeys.Zero, commonStateUILabelsInternal.get(QuC.CommonStateKeys.Zero)!);
initialStateUILabelsInternal.set(QuC.CommonStateKeys.One, commonStateUILabelsInternal.get(QuC.CommonStateKeys.One)!);

export const initialStateUILabels = Object.freeze(initialStateUILabelsInternal);


const sGateUILabelsInternal = new Map<QuC.CoreGateKeys, string>();
sGateUILabelsInternal.set(QuC.CoreGateKeys.S, "S");
sGateUILabelsInternal.set(QuC.CoreGateKeys.St, "S<sup>&#x2020;</sup>");

export const sGateUILabels = Object.freeze(sGateUILabelsInternal);


const tGateUILabelsInternal = new Map<QuC.CoreGateKeys, string>();
tGateUILabelsInternal.set(QuC.CoreGateKeys.T, "T");
tGateUILabelsInternal.set(QuC.CoreGateKeys.Tt, "T<sup>&#x2020;</sup>");

export const tGateUILabels = Object.freeze(tGateUILabelsInternal);


const rotationGateUILabelsInternal = new Map<QuC.CoreGateKeys, string>();
rotationGateUILabelsInternal.set(QuC.CoreGateKeys.Rx, "R<sub>x</sub>");
rotationGateUILabelsInternal.set(QuC.CoreGateKeys.Ry, "R<sub>y</sub>");
rotationGateUILabelsInternal.set(QuC.CoreGateKeys.Rz, "R<sub>z</sub>");

export const rotationGateUILabels = Object.freeze(rotationGateUILabelsInternal);



export function getComplexOutputString(value : math.Complex)
{
    const real = BEM.formatPrecision(value.re, BEM.RoundingLogic.Round, 2) as number;
    const isComplex = real === 0;
    let returnValue = 0;

    if(isComplex)
    {
        returnValue = BEM.formatPrecision(value.im) as number;
    }
    else
    {
        returnValue = BEM.formatPrecision(value.re) as number;
    }


    return returnValue.toString();
}