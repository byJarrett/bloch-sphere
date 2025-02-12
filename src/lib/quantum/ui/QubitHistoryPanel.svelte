<script lang="ts">
    import QubitHistoryNode from '$lib/quantum/ui/QubitHistoryNode.svelte';
    import * as QuC from '$lib/quantum/qubitCommon';
	import type { QubitResultHistory } from '$lib/quantum/qubitCommon';
    import { commonStateUILabels } from '$lib/quantum/ui/common';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';


    interface ComponentProps
    {
        data?: Array<QubitResultHistory>;
        onSelect?(result : QubitResultHistory, index : number) : void;
    }



    let {data : historyValues = new Array<QubitResultHistory>(), onSelect : onSelectHandler } : ComponentProps = $props();
    let initialState = $state(QuC.CommonStates.getStateKey(historyValues.at(0)?.initialStateAsMatrix()));
    let divQubitHistory : HTMLDivElement;
    let showLeftMoreIndicator = $state(false);
    let showRightMoreIndicator = $state(false);

        
    $effect(() => 
    {
        initialState = QuC.CommonStates.getStateKey(historyValues.at(0)?.initialStateAsMatrix());
        divQubitHistory.children.item(divQubitHistory.children.length - 1)?.scrollIntoView({inline : "end"});
        calculateMoreIndicators();
    });


    function calculateMoreIndicators()
    {
        const firstElementWidth = divQubitHistory.firstElementChild ? divQubitHistory.firstElementChild!.clientWidth : 0;
        showLeftMoreIndicator = divQubitHistory.scrollLeft - firstElementWidth > 0;
        showRightMoreIndicator = divQubitHistory.scrollWidth - divQubitHistory.scrollLeft != divQubitHistory.clientWidth;
    }


    function onHistoryButtonClick(result : QubitResultHistory, context : string)
    {
        if(onSelectHandler) onSelectHandler(result, Number(context));
    }


    function onHistoryScroll()
    {
        calculateMoreIndicators();
    }


    function onLeftMoreClick()
    {
        if(showLeftMoreIndicator) divQubitHistory.children.item(0)?.scrollIntoView({inline : "start"});
    }


    function onRightMoreClick()
    {
        if(showRightMoreIndicator) divQubitHistory.children.item(divQubitHistory.children.length - 1)?.scrollIntoView({inline : "end"});
    }
</script>



<div class="w-full overflow-x-auto pt-2.5 pr-4 inline-flex items-center">
    <div class="min-w-5 w-fit pb-3">    
        <Button outline={false} class="!p-2 margin-auto hover:border-none active:border-none focus:border-none focus-within:border-none focus-visible:border-none focus-within:ring-0 focus-visible:ring-0 {showLeftMoreIndicator ? 'inline' : 'hidden'}" onclick={onLeftMoreClick}>
            <ChevronLeftOutline class="w-8 h-8"></ChevronLeftOutline>
        </Button>    
    </div>

    <div bind:this={divQubitHistory} class="w-full overflow-x-auto mx-2 pb-3 inline-flex items-center" onscroll={onHistoryScroll}>
        {#if initialState !== undefined}
            <div class="text-[theme(colors.textSecondary)] grid pointer-events-none">
                <svg width="50" height="50" style="grid-row:1; grid-column:1">
                    <circle cx="25" cy="25" r="24" fill-opacity="0" stroke-width="2" class="stroke-[theme(colors.accent1)]"/>
                </svg>
                <span class="m-auto fira-mono-regular" style="grid-row:1; grid-column:1">{@html commonStateUILabels.get(initialState)}</span>
            </div>
            
            <div class="h-0.5 w-8 bg-[theme(colors.componentStrokeDisabled)] shrink-0"></div>
        {/if}
        {#each historyValues as history, index}
            {#if index > 0}
                <div class="h-0.5 w-8 bg-[theme(colors.componentStrokeDisabled)] shrink-0"></div>
            {/if}
            <QubitHistoryNode context={index.toString()} data={history} onSelect={onHistoryButtonClick} buttonClass={(index === historyValues.length - 1) ? 'border-[theme(colors.accent2)]' : ''} />  <!--disabled={(index === historyValues.length - 1)}-->
        {/each}
    </div>

    <div class="min-w-5 w-fit pb-3">
        <Button outline={false} class="!p-2 margin-auto border-none hover:border-none active:border-none focus:border-none focus-within:border-none focus-visible:border-none focus-within:ring-0 focus-visible:ring-0 {showRightMoreIndicator ? 'inline' : 'hidden'}" onclick={onRightMoreClick}>
            <ChevronRightOutline class="w-8 h-8 margin-auto {showRightMoreIndicator ? 'inline' : 'hidden'}"></ChevronRightOutline>
        </Button>
    </div>
</div>

