<script lang="ts">
    import Button from "$lib/ui/Button.svelte";
	import { primaryGateUILabels, initialStateUILabels, sGateUILabels, tGateUILabels, rotationGateUILabels } from "./common";
    import * as QuC from '$lib/quantum/qubitCommon';
	import SplitButton from "$lib/ui/SplitButton.svelte";
	import AngleInput from "./AngleInput.svelte";


    interface ComponentProps
    {
        onGateClick?(gateKey : QuC.CoreGateKeys) : void; 
        onRotateGateClick?(gateKey : QuC.CoreGateKeys, value : number) : void;
        onResetClick?(stateKey : QuC.CommonStateKeys) : void;
    }

    let { onGateClick : onGateClickHandler, onResetClick : onResetClickHandler, onRotateGateClick : onRotateGateClickHandler} : ComponentProps = $props();
    let rotateInputTheta : number = $state(0);


    function onGateButtonClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement })
    {
        const target = event.target as HTMLElement;
        const key = target!.getAttribute("data-item");

        if(key)
        {   
            const gate : QuC.CoreGateKeys = Number(key);
            if(onGateClickHandler) onGateClickHandler(gate);
        }
    }


    function onResetClick(key : any)
    {
        if(key !== null && key !== undefined)
        {            
            const stateKey : QuC.CommonStateKeys = Number(key);            
            if(onResetClickHandler) onResetClickHandler(stateKey);    
        }
    }


    function onSpecialGateClick(key : any)
    {
        if(key)
        {
            const gate : QuC.CoreGateKeys = Number(key);
            if(onGateClickHandler) onGateClickHandler(gate);
        }
    }


    function onRotationGateButtonClick(key : any)
    {
        if(key)
        {
            const gate : QuC.CoreGateKeys = Number(key);
            if(onRotateGateClickHandler) onRotateGateClickHandler(gate, rotateInputTheta);
        }
    }
</script>



<div class="mb-12">
    <div class="w-min mb-8">
        <h3 class="ml-1">Initialize to</h3>
        <span class="fira-mono-regular">
            <SplitButton items={initialStateUILabels} selectedKey={initialStateUILabels.keys().next().value} onClick={onResetClick}></SplitButton>
        </span>
    </div>

    <div>
        <h3 class="ml-1">Gates</h3>
        <div class="inline-grid grid-cols-[auto_auto] gap-x-4">
            <div class="grid gird-cols-1 auto-rows-min gap-y-2">
                {#each primaryGateUILabels as gate}
                    <Button data-item={gate[0]} onclick={onGateButtonClick}>{@html gate[1]}</Button>
                {/each}
            </div>

            <div class="grid gird-cols-1 auto-rows-min gap-y-2">
                <SplitButton items={sGateUILabels} onClick={onSpecialGateClick}></SplitButton>
                <SplitButton items={tGateUILabels} onClick={onSpecialGateClick}></SplitButton>
                <div class="flex gap-2">
                    <SplitButton items={rotationGateUILabels} onClick={onRotationGateButtonClick}></SplitButton>
                    <AngleInput useRadians bind:value={rotateInputTheta}/>
                </div>
            </div>
        </div>
    </div>
</div>