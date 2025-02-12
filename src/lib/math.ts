import * as math from "mathjs";


export const DEFAULT_PRECISION = 5;


export enum RoundingLogic
{
    Round = 0,
    Ceiling,
    Floor
}


export function formatPrecision(inValue : math.Complex | number | math.Matrix) : math.Complex | number  | math.Matrix;
export function formatPrecision(inValue : math.Complex | number | math.Matrix, roundingLogic : RoundingLogic) : math.Complex | number  | math.Matrix;
export function formatPrecision(inValue : math.Complex | number | math.Matrix, roundingLogic : RoundingLogic, precision : number) : math.Complex | number  | math.Matrix;
export function formatPrecision(inValue : math.Complex | number | math.Matrix, roundingLogic : RoundingLogic = RoundingLogic.Floor, precision = DEFAULT_PRECISION) : math.Complex | number  | math.Matrix
{
    //TODO: Handle precision bug when value is negative -- counts negative value as part of the precision
    //console.log("--- format precision ---");
    //console.log(inValue);
    type T = typeof inValue;
    const fixedPrecision = math.fix(precision);
    //console.log(fixedPrecision);
    const scalar = 10**fixedPrecision;
    let workingValue = math.multiply(inValue, scalar) as T;
    //console.log(workingValue);
    
    switch(roundingLogic)
    {
        case RoundingLogic.Ceiling:
            workingValue = math.ceil(workingValue);
            break;

        case RoundingLogic.Floor:
            workingValue = math.floor(workingValue);
            break;
            
        default:
            workingValue = math.round(workingValue);
            break;
    }
    //console.log(x);
    workingValue = math.floor(workingValue);    
    workingValue = math.divide(workingValue, scalar) as T;
    //console.log(x);
    //console.log("------");
    return workingValue;
}



export function clampNumber(inValue : number, low : number = -1, high : number = 1) : number
{
    return (inValue < low) ? low : (inValue > high) ? high : inValue;
}



export function clampComplex(inValue : math.Complex, low : number = -1, high : number = 1) : math.Complex
{
    let returnValue = inValue.clone();
    returnValue.re = clampNumber(returnValue.re, low, high);
    returnValue.im = clampNumber(returnValue.im, low, high);
    return returnValue;
}