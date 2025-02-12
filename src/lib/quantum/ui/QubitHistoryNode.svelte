<script lang="ts">
    import Button from "$lib/ui/Button.svelte";
    import type { QubitResultHistory } from "../qubitCommon";
    import { Popover } from "flowbite-svelte";
    import * as math from "mathjs";
    import * as QM from '$lib/math'


    interface ComponentProps 
    {
        context : string;
        data : QubitResultHistory;
        onSelect?(result : QubitResultHistory, context : string) : void;
        buttonClass? : string;
        disabled? : boolean;
    }


    let { context, data, onSelect : onSelectCallback, buttonClass, disabled = false } : ComponentProps = $props();
    let alphaProbOut = getProbabilityOutput(data.resultAlpha);
    let betaProbOut = getProbabilityOutput(data.resultBeta);
    
    
    function getProbabilityOutput(value : math.Complex)
    {
        let x =  math.multiply(math.square(value), 100) as math.Complex;
        x = math.round(math.abs(x));        
        return QM.formatPrecision(x, QM.RoundingLogic.Round, 2);
    }


    function onHistoryButtonClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement })
    {
        if(onSelectCallback && !disabled) onSelectCallback(data, context);
    }


    function formatQuantumValue(value : math.Complex | number)
    {
        return QM.formatPrecision(value, QM.RoundingLogic.Round, 5).toString();
    }
</script>





<div class="inline-block">
    <Button id="qubit-history-node-{context}" data-item={context} onclick={onHistoryButtonClick} class={buttonClass} disabled={disabled}>{@html data.label}</Button>
    <Popover triggeredBy="#qubit-history-node-{context}" trigger="hover" arrow={false} placement="bottom" class="bg-[theme(colors.backgroundSecondary)]">
        <div class="min-w-48 text-sm text-[theme(colors.textTertiary)]">
            <div class="w-full text-center p-1 text-lg font-medium">{@html data.label}</div>
            <div class="w-fit grid grid-cols-min grid-rows-auto gap-x-2 justify-center overflow-hidden text-right mx-auto">
                <div class="matrix-container--popup" style="grid-row:2; grid-column:1">
                    <span style="grid-row:1">{formatQuantumValue(data.alpha)}</span>
                    <span style="grid-row:2">{formatQuantumValue(data.beta).toString()}</span>
                </div>

                <div class="matrix-container--popup" style="grid-row: 2; grid-column:2">
                    <div class="grid grid-cols-min grid-rows-min w-fit" style="grid-column:1">
                        <span style="grid-row:1">{formatQuantumValue(data.gate.get([0,0]))}</span>
                        <span style="grid-row:2">{formatQuantumValue(data.gate.get([0,1]))}</span>
                    </div>

                    <div class="grid grid-cols-min grid-rows-min w-fit ml-2" style="grid-column:2">
                        <span style="grid-row:1">{formatQuantumValue(data.gate.get([1,0]))}</span>
                        <span style="grid-row:2">{formatQuantumValue(data.gate.get([1,1]))}</span>
                    </div>
                </div>
        
                <div class="flex h-full" style="grid-row: 2; grid-column:3"><span class="content-center">=</span></div>
                
                <div class="matrix-container--popup" style="grid-row: 2; grid-column:4;">
                    <span>{formatQuantumValue(data.resultAlpha)}</span>
                    <span>{formatQuantumValue(data.resultBeta)}</span>
                </div>            
            </div>

            <div style="grid-row:3" class="w-full col-span-4 flex pt-2">
                <div class="w-fit">
                    {alphaProbOut}% <span class="history-zero-label">|0&gt;</span>
                </div>
                <div class="w-full flex px-1 py-0.5 min-w-24">
                    <div class="bg-[theme(colors.componentFillDisabled)]" style="width:{alphaProbOut}%"></div>
                    <div class="bg-[theme(colors.accent2)]" style="width:{betaProbOut}%"></div>
                </div>
                <div class="w-fit">
                    <span class="history-one-label">|1&gt;</span> {betaProbOut}%
                </div>
            </div>
        </div>    
    </Popover>
</div>