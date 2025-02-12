<script lang="ts">
    import * as math from "mathjs";
    import { Dropdown, DropdownItem, DropdownDivider, Tooltip } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import * as QuC from '$lib/quantum/qubitCommon';
    import * as QC from '$lib/quantum/quantumCommon';
    import { Qubit } from "../qubit";
    import * as BEM from '$lib/math';
	import { getComplexOutputString } from "./common";

    const INPUT_ERROR_CLASS_NAME = "number-input-error";
    const INPUT_STEP = 0.00001;
    const INPUT_MAX_LENGTH = 6;
    const VALIDATION_PATTERN = "^((-?1(\\.\\d*)?i?)|0|(0(\\.\\d*)i?)|-?i)$"; 
    const DIVIDER_CONTENT = "-";


    enum InputElementKeys
    {
        alpha = 0,
        beta,
        m00,
        m01,
        m10,
        m11
    }


    interface ComponentProps
    {
        currentAlpha : math.Complex | number;
        currentBeta : math.Complex | number;
        containerClass? : string;
        result? : QuC.MutableQubitResult;
    }


    interface ComponentState
    {
        isStateDropdownOpen : boolean;
        isGateDropdownOpen : boolean;

        alpha : string;
        beta : string;
    
        m00 : string;
        m01 : string;
        m10 : string;
        m11 : string;

        resultAlpha : string;
        resultBeta : string;
        disabled : HTMLButtonAttributes['disabled'];
    }
    
    
    let {currentAlpha = 0, currentBeta = 0, containerClass, result = $bindable(new QuC.MutableQubitResult())} : ComponentProps = $props();
        
    let state = $state({
        "isStateDropdownOpen" : false,
        "isGateDropdownOpen" : false,
        "alpha" : BEM.formatPrecision(result.alpha).toString(),
        "beta" : BEM.formatPrecision(result.beta).toString(),
        "m00" : formatGateElementDisplayValue(result.gate.get([0, 0])),
        "m01" : formatGateElementDisplayValue(result.gate.get([0, 1])),
        "m10" : formatGateElementDisplayValue(result.gate.get([1, 0])),
        "m11" : formatGateElementDisplayValue(result.gate.get([1, 1])),
        "resultAlpha" : BEM.formatPrecision(result.alpha).toString(),
        "resultBeta" : BEM.formatPrecision(result.beta).toString(),
        "hasValidInputs" : true
    });

    updateStateFromResultProp();

    let alphaInput : HTMLInputElement;
    let betaInput : HTMLInputElement;


    enum StateOptionKeys
    {
        current = 0,
        last,
        super,
        zero,
        one,
        plus,
        minus,
        i,
        minusI,
        div
    }


    const stateOptions = [
        { key : StateOptionKeys.current, content: "Current State"},
        { key : StateOptionKeys.last, content: "Last Result"},
        { key : StateOptionKeys.super, content: "Superposition"},
        { key : StateOptionKeys.div, content: DIVIDER_CONTENT},
        { key : StateOptionKeys.zero, content: "|0>"},
        { key : StateOptionKeys.one, content: "|1>"},
        { key : StateOptionKeys.plus, content: "|+>"},
        { key : StateOptionKeys.minus, content: "|->"},
        { key : StateOptionKeys.i, content: "|i>"},
        { key : StateOptionKeys.minusI, content: "|-i>"}
    ];


    const gateOptions = [
        { key : QuC.CoreGateKeys.H, content: "H"},
        { key : QuC.CoreGateKeys.X, content: "X"},
        { key : QuC.CoreGateKeys.Y, content: "Y"},
        { key : QuC.CoreGateKeys.Z, content: "Z"},
        { key : QuC.CoreGateKeys.S, content: "S"},
        { key : QuC.CoreGateKeys.St, content: "S<sup>&#x2020;</sup>"},
        { key : QuC.CoreGateKeys.T, content: "T"},
        { key : QuC.CoreGateKeys.Tt, content: "T<sup>&#x2020;</sup>"}
    ]



    async function calculate()
    {
        if(state.hasValidInputs)
        {
            const gateMatrix = math.matrix([[math.complex(state.m00), math.complex(state.m01)], [math.complex(state.m10), math.complex(state.m11)]]);
            let qubit = new Qubit(math.complex(state.alpha), math.complex(state.beta));
            qubit.applyMatrix(gateMatrix);
            
            result.resultAlpha = qubit.getAlphaAmplitude();
            result.resultBeta = qubit.getBetaAmplitude();
            
            state.resultAlpha = BEM.formatPrecision(result.resultAlpha.re, BEM.RoundingLogic.Round).toString();
            state.resultBeta = getComplexOutputString(result.resultBeta);
        }
    }


    function formatGateElementDisplayValue(value : number | math.Complex) : string
    {
        return BEM.formatPrecision(value, BEM.RoundingLogic.Round, INPUT_MAX_LENGTH).toString();
    }


    function onGateOptionSelection(selection : QuC.CoreGateKeys)
    {
        let gate = QuC.CoreGates.getGate(selection);

        if(gate != undefined)
        {
            console.log(gate);
            state.m00 = formatGateElementDisplayValue(gate.get([0, 0]));
            state.m01 = formatGateElementDisplayValue(gate.get([0, 1]));
            state.m10 = formatGateElementDisplayValue(gate.get([1, 0]));
            state.m11 = formatGateElementDisplayValue(gate.get([1, 1]));
            
            //ASSUMPTION: All values are valid; validation is baked into the HTML element
            updatePropsState(InputElementKeys.m00, state.m00);
            updatePropsState(InputElementKeys.m01, state.m01);
            updatePropsState(InputElementKeys.m10, state.m10);
            updatePropsState(InputElementKeys.m11, state.m11);

            calculate();
        }

        state.isGateDropdownOpen = false;
    }


    function onStateOptionSelection(selection : StateOptionKeys)
    {
        let workingAlpha = math.complex(state.alpha);
        let workingBeta = math.complex(state.beta);

        switch(selection)
        {
            case StateOptionKeys.current:
                workingAlpha = math.complex(currentAlpha);
                workingBeta = math.complex(currentBeta);
                break;

            case StateOptionKeys.super:      
                workingAlpha = math.complex(QC.Amplitudes.Superposition);
                workingBeta = workingAlpha;
                break;

            case StateOptionKeys.last:
                workingAlpha = result.resultAlpha;
                workingBeta = result.resultBeta;
                break;

            case StateOptionKeys.one:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.One);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.One);
                break;

            case StateOptionKeys.zero:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.Zero);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.Zero);
                break;

            case StateOptionKeys.plus:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.Plus);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.Plus);
                break;

            case StateOptionKeys.minus:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.Minus);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.Minus);
                break;                

            case StateOptionKeys.i:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.I);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.I);
                break;    
                
            case StateOptionKeys.minusI:
                workingAlpha = QuC.CommonStates.getAlpha(QuC.CommonStates.MinusI);
                workingBeta = QuC.CommonStates.getBeta(QuC.CommonStates.MinusI);
                break;                    

            default:
                //Do nothing
                break;
        }

        state.alpha = BEM.formatPrecision(workingAlpha, BEM.RoundingLogic.Ceiling).toString();
        state.beta = BEM.formatPrecision(workingBeta, BEM.RoundingLogic.Ceiling).toString();

        //ASSUMPTION: All values are valid; validation is baked into the HTML element
        updatePropsState(InputElementKeys.alpha, state.alpha);
        updatePropsState(InputElementKeys.beta, state.beta);

        calculate();

        state.isStateDropdownOpen = false;
    }



    function onInputValueChange(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) 
    {
        state.hasValidInputs = checkInputValidity(event.currentTarget);
        const keyString = event.currentTarget.getAttribute("data-key");

        if(state.hasValidInputs && keyString)
        {
            updatePropsState(Number(keyString) as InputElementKeys, event.currentTarget.value);
            calculate();
        }
    }



    function onInputValueInput(event: Event & { currentTarget: EventTarget & HTMLInputElement; })
    {
        state.hasValidInputs = checkInputValidity(event.currentTarget);
    }


    function updatePropsState(key : InputElementKeys, value : string)
    {
        const workingValue = math.complex(value);
        switch(key)
        {
            case InputElementKeys.alpha:
                result.alpha = workingValue;
                break;

            case InputElementKeys.beta:
                result.beta = workingValue;
                break;

            case InputElementKeys.m00:
                result.gate.set([0, 0], workingValue);
                break;

            case InputElementKeys.m01:
                result.gate.set([0, 1], workingValue);
                break;

            case InputElementKeys.m10:
                result.gate.set([1, 0], workingValue);
                break;

            case InputElementKeys.m11:
                result.gate.set([1, 1], workingValue);
                break;
        }
    }


    function checkInputValidity(element : HTMLInputElement) : boolean
    {
        const isValid = element.checkValidity();
        if(isValid) 
        {
            element.classList.remove(INPUT_ERROR_CLASS_NAME);
        }
        else
        {            
            if(!element.classList.contains(INPUT_ERROR_CLASS_NAME))
            {
                element.classList.add(INPUT_ERROR_CLASS_NAME);
            }
        }

        return isValid;
    }


    function updateStateFromResultProp()
    {
        state.alpha = BEM.formatPrecision(result.alpha).toString();
        state.beta = BEM.formatPrecision(result.beta).toString();

        state.resultAlpha = BEM.formatPrecision(result.resultAlpha).toString();
        state.resultBeta = BEM.formatPrecision(result.resultBeta).toString();

        state.m00 = BEM.formatPrecision(result.gate.get([0, 0])).toString();
        state.m01 = BEM.formatPrecision(result.gate.get([0, 1])).toString();
        state.m10 = BEM.formatPrecision(result.gate.get([1, 0])).toString();
        state.m11 = BEM.formatPrecision(result.gate.get([1, 1])).toString();
    }


    $effect(() => 
    {
        updateStateFromResultProp();
    });
</script>



<div class={containerClass}>
    <div class="w-fit grid grid-cols-min grid-rows-auto gap-x-2 gap-y-4 justify-center overflow-hidden">
        <div class="w-fit grid grid-cols-min grid-rows-1" style="grid-column:1">
            <div class="matrix-container" style="grid-column:1">
                <div>
                    <input data-key={InputElementKeys.alpha} bind:this={alphaInput} type="string" bind:value={state.alpha} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:1" oninput={onInputValueInput} onchange={onInputValueChange}/>
                    <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.alpha}</Tooltip>
                </div>
                <div>
                    <input data-key={InputElementKeys.beta} bind:this={betaInput} type="string" bind:value={state.beta} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:2" oninput={onInputValueInput} onchange={onInputValueChange}/>
                    <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.beta}</Tooltip>
                </div>
            </div>
            <div class="matrix-container-context-menu" style="grid-column:2">
                <ChevronDownOutline class="w-6 h-6"></ChevronDownOutline>
                <Dropdown bind:open={state.isStateDropdownOpen} placement="bottom-start" containerClass="bg-[theme(colors.backgroundSecondary)] overflow-clip">
                    {#each stateOptions as stateOption (stateOption.key)}
                        {#if stateOption.content == DIVIDER_CONTENT}
                            <DropdownDivider divClass="dropdown-divider"/>
                        {:else}
                            <DropdownItem class="text-[theme(colors.textTertiary)] hover:bg-[theme(colors.backgroundTertiary)] overflow-clip" onclick={() => onStateOptionSelection(stateOption.key)}>{stateOption.content}</DropdownItem>
                        {/if}
                    {/each}            
                </Dropdown>
            </div>
        </div>

        <div class="w-fit grid grid-cols-min grid-rows-1" style="grid-column:2">
            <div class="matrix-container" style="grid-column:1">
                <div class="grid grid-cols-min grid-rows-min" style="grid-column:1">
                    <div>
                        <input data-key={InputElementKeys.m00} type="string" bind:value={state.m00} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:1" oninput={onInputValueInput} onchange={onInputValueChange}/>
                        <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.m00}</Tooltip>
                    </div>
                    <div>
                        <input data-key={InputElementKeys.m01} type="string" bind:value={state.m01} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:2" oninput={onInputValueInput} onchange={onInputValueChange}/>
                        <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.m01}</Tooltip>
                    </div>
                </div>

                <div class="grid grid-cols-min grid-rows-min" style="grid-column:2">
                    <div>
                        <input data-key={InputElementKeys.m10} type="string" bind:value={state.m10} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:1" oninput={onInputValueInput} onchange={onInputValueChange}/>
                        <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.m10}</Tooltip>
                    </div>
                    <div>
                        <input data-key={InputElementKeys.m11} type="string" bind:value={state.m11} step={INPUT_STEP} maxlength={INPUT_MAX_LENGTH} pattern={VALIDATION_PATTERN} class="number-input" style="grid-row:2" oninput={onInputValueInput} onchange={onInputValueChange}/>
                        <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.m11}</Tooltip>
                    </div>
                </div>
            </div>
            <div class="matrix-container-context-menu" style="grid-column:2">
                <ChevronDownOutline class="w-6 h-6"></ChevronDownOutline>
                <Dropdown bind:open={state.isGateDropdownOpen} placement="bottom-start" containerClass="bg-[theme(colors.backgroundSecondary)] overflow-clip">
                    {#each gateOptions as gateOption (gateOption.key)}
                        <DropdownItem class="text-[theme(colors.textTertiary)] hover:bg-[theme(colors.backgroundTertiary)] overflow-clip" onclick={() => onGateOptionSelection(gateOption.key)}>
                            {@html gateOption.content}
                        </DropdownItem>
                    {/each}            
                </Dropdown>
            </div>
        </div>

        <div class="flex h-full" style="grid-column:3"><span class="content-center">=</span></div>
        
        <div class="matrix-container p-3" style="grid-column:4;">
            <span class="my-1 mx-2 text-right pb-1" style="gird-row:1">{state.resultAlpha}</span>
            <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.resultAlpha}</Tooltip>
            <span class="my-1 mx-2 text-right pt-1" style="gird-row:2">{state.resultBeta}</span>
            <Tooltip type="custom" class="tooltipCustom" trigger="hover">{state.resultBeta}</Tooltip>
        </div>
    </div>
</div>