<script lang="ts">
    import Button from "$lib/ui/Button.svelte";
    import StateCalculator from '$lib/quantum/ui/StateCalculator.svelte';
    import { TrashBinOutline } from "flowbite-svelte-icons";
    import * as math from "mathjs";
    import { MutableQubitResult } from "../qubitCommon";
    import { page } from '$app/state';
    

    interface ComponentProps
    {
        currentAlpha?: math.Complex | number;
        currentBeta?: math.Complex | number;
    }

    const MAX_CALCULATORS = 5;
    let rootElement : HTMLDivElement;

    let calculators = $state(new Array<MutableQubitResult>());
    let canAddNewCalcs = $derived(verifyCanAddNewCalcs());
    let { currentAlpha = 0, currentBeta = 0 }: ComponentProps = $props();


    function verifyCanAddNewCalcs()
    {
        return (calculators.length < MAX_CALCULATORS);
    }


    function onAddNewCalcClick()
    {
        if(verifyCanAddNewCalcs())
        {
            calculators.push(new MutableQubitResult());
            //rootElement.scrollIntoView();
        }
    }


    function onRemoveCalcClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) 
    {
        const target = event.target as HTMLElement;                
        const calcId = target?.getAttribute("data-position");

        if(calcId)
        {
            calculators.splice(Number(calcId).valueOf(), 1);
        }   
    }
</script>


<div class="flex" bind:this={rootElement}>
    <div class="mr-3">
        <Button onclick={onAddNewCalcClick} disabled={!canAddNewCalcs}>
            <!-- svelte-ignore a11y_missing_attribute -->
            <img src="icon--state-calc.png" alt="Create a new state calculator" width="24px"/>
        </Button>
    </div>

    <div>
        {#each calculators as state, position}            
            <div class="item-row state-calculator-container {position > 0 ? 'state-calculator-container--alt-row' : ''}">                
                <StateCalculator currentAlpha={currentAlpha} currentBeta={currentBeta} bind:result={calculators[position]}/>
                <Button class="btn-item-row" onclick={onRemoveCalcClick} data-position={position}>
                    <TrashBinOutline pointer-events="none"/>
                </Button>                
            </div>
        {/each}
    </div>
</div>