<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang="ts">
    import { Dropdown } from "flowbite-svelte";
    import * as QC from '$lib/quantum/quantumCommon';
	import RadiansPicker from "./RadiansPicker.svelte";


    interface ComponentProps
    {
        useRadians : boolean;
        value : number;
        valueChanged?(value : number) : void;
    }


    let { useRadians, value = $bindable(0), valueChanged : valueChangedHandler } : ComponentProps = $props();

    const INPUT_STEP = 0.00001;
    const INPUT_MAX_LENGTH = 8;
    const INPUT_PRECISION = INPUT_MAX_LENGTH - 2; //Should always be 2 less than the value INPUT_MAX_LENGTH;
    const HIGH_RANGE = (useRadians) ? (QC.Rotations.PI * 2) : 360.0;
    const VALIDATION_PATTERN = "/^-?\d+(\.?\d*)?$/gm";

    let isValid : Boolean = $state(true);
    let isDropdownOpen = $state(false);
    let inputElement : HTMLInputElement;
    




    function onInputValueChange(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) 
    {
        onValueChanged();
    }


    function onInputValueInput()
    {
        checkValidity();
        if(isValid && valueChangedHandler) valueChangedHandler(value);
    }


    function checkValidity()
    {
        const valueNum = inputElement.valueAsNumber;
        isValid = inputElement.checkValidity() && !Number.isNaN(valueNum);
    }


    function onValueChanged(normalizeValue : boolean = true)
    {
        checkValidity();
        let valueNum = inputElement.valueAsNumber;

        if(isValid && normalizeValue)
        {     
            inputElement.value = formatUIValue(valueNum);       
        }

        value = valueNum;
    }


    function formatUIValue(newValue : number) : string
    {
        newValue = newValue % HIGH_RANGE;
        return newValue.toPrecision(INPUT_PRECISION);
    }


    function setUIValue(newValue : number)
    {
        inputElement.value = formatUIValue(value);
    }


    function onRadiansPickerClose()
    {
        isDropdownOpen = false;
    }


    $effect(() =>
    {
        setUIValue(value);
    })
</script>


<div class:errorClass={!isValid} class="angleInput">
    <div class="flex h-full">
        <input bind:this={inputElement} class="block w-16 h-full border-none bg-transparent my-auto mx-1 p-0 focus:border-transparent focus:outline-transparent focus:ring-transparent focus:shadow-transparent" type="number" step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} oninput={onInputValueInput} onchange={onInputValueChange} pattern={VALIDATION_PATTERN}/>
        <div class="w-6 border-l-2 border-[theme(colors.componentStroke)] hover:bg-[theme(colors.componentFillHover)] active:bg-[theme(colors.componentFillActive)]">
            <div class="h-full inline-flex items-center">
                <svg class="m-auto" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5.5" cy="5.5" r="5.5" fill="#494B57"/>
                </svg>
            </div>
            <Dropdown bind:open={isDropdownOpen} placement="right-start" containerClass="bg-[theme(colors.backgroundSecondary)] overflow-clip z-500">
                <RadiansPicker bind:value={value} onCloseClick={onRadiansPickerClose}/>
            </Dropdown>
        </div>
    </div>
</div>