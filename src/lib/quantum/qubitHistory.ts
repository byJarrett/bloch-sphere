import * as QuC from '$lib/quantum/qubitCommon'


export interface IIterateIQubitResult
{
    [Symbol.iterator]() : IterableIterator<QuC.QubitResultHistory>;
}



export class QubitHistory
{
    private _History : Array<QuC.QubitResultHistory> = new Array<QuC.QubitResultHistory>();
    


    add(result : QuC.IQubitResult, label : string)
    {
        this._History.push(new QuC.QubitResultHistory(result, label));
    }


    rollback(position : number)
    {
        if(position >= 0 && position < this._History.length)
        {
            this._History.splice(position + 1);
        }
    }


    count() : number { return this._History.length; }
    clear() { this._History.length = 0; }


    getCurrentState() : QuC.QubitResultHistory | null
    {
        return (this._History.length > 0) ? this._History[this._History.length - 1] : null;
    }


    [Symbol.iterator]() : IterableIterator<QuC.IQubitResult>
    {
        return this._History.values();
    }


    values() : IterableIterator<QuC.IQubitResult>
    {
        return this._History.values();
    }


    toArray() : Array<QuC.QubitResultHistory>
    {
        return new Array<QuC.QubitResultHistory>(...this._History);
    }
}

