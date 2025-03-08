<script lang="ts">
    import Button from "$lib/ui/Button.svelte";
    import StateCalculator from '$lib/quantum/ui/StateCalculator.svelte';
    import { TrashBinOutline } from "flowbite-svelte-icons";
    import * as math from "mathjs";
    import { MutableQubitResult } from "../qubitCommon";
    import { page } from '$app/state';
	import PhiKet from "$lib/icons/PhiKet.svelte";
	import { Tooltip } from "flowbite-svelte";
    

    interface ComponentProps
    {
        currentAlpha?: math.Complex | number;
        currentBeta?: math.Complex | number;
    }

    const MAX_CALCULATORS = 1;
    let rootElement : HTMLDivElement;

    let calculators = $state(new Array<MutableQubitResult>());
    let canAddNewCalcs = $derived(verifyCanAddNewCalcs());
    let { currentAlpha = 0, currentBeta = 0 }: ComponentProps = $props();
    let showCalculators = $state(false);
    let showCalculatorsClass = $derived(showCalculators ? "inline" : "hidden");


    function verifyCanAddNewCalcs()
    {
        return (MAX_CALCULATORS === 1 || calculators.length < MAX_CALCULATORS);
    }


    function onAddNewCalcClick()
    {
        if(MAX_CALCULATORS > 1)
        {
            if(verifyCanAddNewCalcs())
            {
                calculators.push(new MutableQubitResult());
                //rootElement.scrollIntoView();
                showCalculators = true;
            }
        }
        else
        {
            showCalculators = !showCalculators;

            if(showCalculators && calculators.length === 0)
            {
                calculators.push(new MutableQubitResult());
            }
        }

        console.log(showCalculators);
    }


    function onRemoveCalcClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) 
    {
        if(MAX_CALCULATORS > 1)
        {
            const target = event.target as HTMLElement;                
            const calcId = target?.getAttribute("data-position");

            if(calcId)
            {
                calculators.splice(Number(calcId).valueOf(), 1);
            }
        }   
    }
</script>


<div class="grid place-items-end" bind:this={rootElement}>
    <div class="mr-3">
        <Button onclick={onAddNewCalcClick} disabled={!canAddNewCalcs}>
            {#if MAX_CALCULATORS > 1}
                <!-- svelte-ignore a11y_missing_attribute -->
                <img src="icon--state-calc.png" alt="Create a new state calculator" width="24px"/>
            {:else}
                <PhiKet/>
            {/if}
        </Button>
        <Tooltip type="custom" class="tooltipCustom" placement="top-end">
            <span class="block w-[143px]">Toggle state calculator</span>
        </Tooltip>
    </div>
    <div class="{showCalculatorsClass}">
        {#each calculators as state, position}            
            <div class="item-row state-calculator-container {position > 0 ? 'state-calculator-container--alt-row' : ''}">                
                <StateCalculator currentAlpha={currentAlpha} currentBeta={currentBeta} bind:result={calculators[position]}/>
                
                {#if MAX_CALCULATORS > 1}
                    <Button class="btn-item-row" onclick={onRemoveCalcClick} data-position={position}>
                        <TrashBinOutline pointer-events="none"/>
                    </Button>
                {/if}
            </div>
        {/each}
    </div>
</div>