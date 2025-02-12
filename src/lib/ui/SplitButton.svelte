<script lang="ts">
    import { Dropdown, DropdownItem } from "flowbite-svelte";
    import { ChevronDownOutline } from 'flowbite-svelte-icons';


    interface ComponentProps {
        items: Map<any, string>;
        selectedKey? : any;
        onSelectionChanged?(key : any) : void;
        onClick?(key : any) : void
    }

    let { items, selectedKey = $bindable(null), onSelectionChanged : onSelectionChangedHandler, onClick : onClickHandler } : ComponentProps = $props();
    
    validateSelectedKey();
    
    let isDropdownOpen = $state(false);
    let itemsList = $derived(Array.from(items));
    let selectedIndex = $derived(itemsList.findIndex((value) => { return value[0] == selectedKey }));
    


    function validateSelectedKey()
    {
        if(selectedKey === null && items.size > 0)
        {
            selectedKey = items.keys().next().value;
        }

        if(!items.has(selectedKey))
        {
            selectedKey = (items.size > 0) ? items.keys().next().value : null;
        }
    }


    function onButtonClick(evt : FocusEvent)
    {
        if(onClickHandler)
        {
            evt.preventDefault();
            onClickHandler(selectedKey);
        }
    
        isDropdownOpen = false;
    }


    function onSplitButtonClick(evt : FocusEvent)
    {
        evt.preventDefault();  
        isDropdownOpen = false; 

        let el = evt.target as HTMLElement;
        const selectedIndex = Number(el.getAttribute("data-index"));
        selectedKey = itemsList[selectedIndex][0];

        if(onSelectionChangedHandler)
        {
            onSelectionChangedHandler(selectedKey);
        }
    }
</script>


{#if items.size > 0}
    <div class="splitButton-container">
        <div class="splitButton-content">
            <button onclick={onButtonClick} data-key={selectedKey}>                  
                {@html items.get(selectedKey)}                                
            </button>
        </div>

        <div class="splitButton-split">
            <ChevronDownOutline class="w-6 h-6"></ChevronDownOutline>
            <Dropdown bind:open={isDropdownOpen} placement="bottom-start" containerClass="bg-[theme(colors.backgroundSecondary)] overflow-clip">
                {#each items as item, index}
                    <DropdownItem  onclick={onSplitButtonClick} data-key={item[0]} data-index={index} class="text-[theme(colors.textTertiary)] hover:bg-[theme(colors.backgroundTertiary)] overflow-clip">
                        {@html item[1]}
                    </DropdownItem>
                {/each}
            </Dropdown>
        </div>
    </div>
{/if}