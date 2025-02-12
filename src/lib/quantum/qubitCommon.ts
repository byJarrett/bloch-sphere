import * as math from "mathjs";


/*** Gates ***/

export enum CommonStateKeys
{
    Zero = 0,
    One,
    Plus,
    Minus,
    I,
    MinusI
}


export class CommonStates
{
    static readonly ALPHA_MATRIX_INDEX = [0, 0];
    static readonly BETA_MATRIX_INDEX = [1, 0];

    static readonly Zero : math.Matrix  = math.matrix([[math.complex(1, 0)], [math.complex(0, 0)]], "dense");
    static readonly One : math.Matrix   = math.matrix([[math.complex(0, 0)], [math.complex(1, 0)]], "dense");
    static readonly Plus : math.Matrix = math.matrix([[math.complex(Math.SQRT1_2, 0)], [math.complex(Math.SQRT1_2, 0)]], "dense");
    static readonly Minus : math.Matrix = math.matrix([[math.complex(Math.SQRT1_2, 0)], [math.complex(-Math.SQRT1_2, 0)]], "dense");
    static readonly I : math.Matrix = math.matrix([[math.complex(Math.SQRT1_2, 0)], [math.complex(0, Math.SQRT1_2)]], "dense");
    static readonly MinusI : math.Matrix = math.matrix([[math.complex(Math.SQRT1_2, 0)], [math.complex(0, -Math.SQRT1_2)]], "dense");

    static getAlpha(state : math.Matrix)
    {
        //TODO: Validate input
        return state.get(this.ALPHA_MATRIX_INDEX);
    }

    static getBeta(state : math.Matrix)
    {
        //TODO: Validate input
        return state.get(this.BETA_MATRIX_INDEX);
    }


    private static readonly stateMap = new Map<CommonStateKeys, math.Matrix>([
        [CommonStateKeys.Zero, this.Zero],
        [CommonStateKeys.One, this.One],
        [CommonStateKeys.Plus, this.Plus],
        [CommonStateKeys.Minus, this.Minus],
        [CommonStateKeys.I, this.I],
        [CommonStateKeys.MinusI, this.MinusI]
    ]);

    
    public static getState(key : CommonStateKeys) : math.Matrix | undefined
    {
        return CommonStates.stateMap.get(key);
    }


    public static getStateKey(state : math.Matrix | undefined) : CommonStateKeys | undefined
    {        
        let returnValue : CommonStateKeys | undefined = undefined;

        if(state !== undefined)
        {
            for(const item of this.stateMap.entries())
            {
                if(math.deepEqual(item[1], state))
                {
                    returnValue = item[0];
                    break;
                }
            }
        }

        return returnValue;
    }
}





/*** Gates ***/

export enum CoreGateKeys
{
    H = 0,
    X,
    Y,
    Z,
    S,
    St,
    T,
    Tt,
    Rx,
    Ry,
    Rz
};



export class CoreGates
{

    static readonly I : math.Matrix = math.matrix([[1, 0], [0, 1]]);

    static readonly X : math.Matrix = math.matrix([[0, 1], [1, 0]]);
    static readonly Y : math.Matrix = math.matrix([[0, math.complex(0, -1)], [math.complex(0, 1), 0]]);
    static readonly Z : math.Matrix = math.matrix([[1, 0], [0, -1]]);

    static readonly H : math.Matrix = math.matrix([[Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2, -Math.SQRT1_2]], "dense");

    static readonly S : math.Matrix = math.matrix([[1, 0], [0, math.complex(0, 1)]]);
    static readonly St : math.Matrix = math.matrix([[1, 0], [0, math.complex(0, -1)]]);

    static readonly T : math.Matrix = math.matrix([[1, 0], [0, math.complex(Math.SQRT1_2, Math.SQRT1_2)]]);
    static readonly Tt : math.Matrix = math.matrix([[1, 0], [0, math.complex(Math.SQRT1_2, -Math.SQRT1_2)]]);
   

    private static readonly gateMap = new Map<CoreGateKeys, math.Matrix>([
        [CoreGateKeys.H, this.H],
        [CoreGateKeys.X, this.X],
        [CoreGateKeys.Y, this.Y],
        [CoreGateKeys.Z, this.Z],
        [CoreGateKeys.S, this.S],
        [CoreGateKeys.St, this.St],
        [CoreGateKeys.T, this.T],
        [CoreGateKeys.Tt, this.Tt],
    ]);


    public static getGate(key : CoreGateKeys) : math.Matrix | undefined
    {
        return CoreGates.gateMap.get(key);
    }


    static rotate(axisGate : CoreGateKeys, theta : number) : math.Matrix
    {
        let returnValue : math.Matrix = math.matrix([[1,1], [1,1]]);
        switch(axisGate)
        {
            case CoreGateKeys.Rx:
                returnValue = this.rotateX(theta);
                break;
            
            case CoreGateKeys.Ry:
                returnValue = this.rotateY(theta);
                break;

            case CoreGateKeys.Rz:
                returnValue = this.rotateZ(theta);
                break;
        }


        return returnValue;
    }


    static rotateX(theta : number) : math.Matrix
    {
        //Assumption: theta is in radians
        const cosTheta = math.cos(theta);
        const sinTheta = math.multiply(math.complex(0, -1), math.sin(theta)) as math.Complex;
        return math.matrix([[cosTheta, sinTheta], [sinTheta, cosTheta]], "dense");
    }


    static rotateY(theta : number) : math.Matrix
    {
        //Assumption: theta is in radians
        const cosTheta = math.cos(theta);
        const sinTheta = math.sin(theta);
        
        return math.matrix([[cosTheta, -sinTheta], [sinTheta, cosTheta]], "dense");
    }


    static rotateZ(theta : number) : math.Matrix
    {
        //Assumption: theta is in radians
        return math.matrix([[math.exp(math.multiply(math.complex(0, -1), theta) as math.Complex), 0],
                           [0, math.exp(math.multiply(math.complex(0, 1), theta) as math.Complex)]], "dense");
    }
};



export interface IQubitResult
{
    alpha : math.Complex;
    beta : math.Complex;
    gate : math.Matrix;
    resultAlpha : math.Complex;
    resultBeta : math.Complex;
}


const DEFAULT_QUBITRESULT : IQubitResult = {
    alpha : CommonStates.getAlpha(CommonStates.Zero) as math.Complex,
    beta: CommonStates.getBeta(CommonStates.Zero) as math.Complex,
    gate: CoreGates.I,
    resultAlpha: CommonStates.getAlpha(CommonStates.Zero) as math.Complex,
    resultBeta: CommonStates.getBeta(CommonStates.Zero) as math.Complex
}



export class QubitResult implements IQubitResult
{
    public readonly alpha : math.Complex;
    public readonly beta : math.Complex;
    public readonly gate : math.Matrix;
    public readonly resultAlpha : math.Complex;
    public readonly resultBeta : math.Complex;


    constructor(source : IQubitResult = DEFAULT_QUBITRESULT)
    {
        this.alpha          = source.alpha;
        this.beta           = source.beta;
        this.gate           = source.gate;
        this.resultAlpha    = source.resultAlpha;
        this.resultBeta     = source.resultBeta;        
    }


    initialStateAsMatrix()
    {
        return math.matrix([[this.alpha], [this.beta]], "dense");
    }

    resultAtMatrix()
    {
        return math.matrix([[this.resultAlpha], [this.resultBeta]], "dense");
    }
}



export class QubitResultHistory extends QubitResult
{
    public readonly label : string | undefined;

    constructor(source : IQubitResult = DEFAULT_QUBITRESULT, label : string)
    {
        super(source);
        this.label          = label;
    }
}


export class MutableQubitResult extends QubitResult
{
    declare public alpha : math.Complex;
    declare public beta : math.Complex;
    declare public gate : math.Matrix;
    declare public resultAlpha : math.Complex;
    declare public resultBeta: math.Complex;


    constructor(source : IQubitResult = DEFAULT_QUBITRESULT)
    {
        super(source);       
    }
}