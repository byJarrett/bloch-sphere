<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang="ts">
    import { onMount, tick } from "svelte";
    import * as QC from '$lib/quantum/quantumCommon';


    interface ComponentProps
    {
        value : number;
        valueChanged?(value : number) : void;
        onCloseClick?() : void;
    }


    let { value = $bindable(0), valueChanged : valueChangedHandler, onCloseClick : onCloseClickHandler } : ComponentProps = $props();
    

    let rotationReferenceMarkerCenter : number;
    let rotationReferenceMarkerCenterInnerBand : number;
    let rotationReferenceMarkerCenterOuterBand : number;
    let rotationReferenceMarkerRadius : number;
    let rotationMarkerRadius : number;
    let rotationMarker : SVGElement;
    let rotationReferenceMarker : SVGElement;


    onMount(() =>
    {
        tick().then(() => 
        { 
            rotationReferenceMarkerCenter = rotationReferenceMarker.clientWidth * 0.5;
            rotationReferenceMarkerCenterInnerBand = rotationReferenceMarkerCenter * 0.65;
            rotationReferenceMarkerCenterOuterBand = rotationReferenceMarkerCenter * 1.4;
            rotationMarkerRadius = rotationMarker.clientWidth * 0.5;
            rotationReferenceMarkerRadius = rotationReferenceMarkerCenter - rotationMarkerRadius;

            setRotationMarker(value);
        });
    });


    function setRotationMarker(theta : number)
    {
        let workingTheta = theta % QC.Rotations.PI_2;        
        workingTheta = (workingTheta < 0) ? QC.Rotations.PI_2 - workingTheta : workingTheta;

        value = workingTheta;
        if(valueChangedHandler) valueChangedHandler(value);

        const ox = rotationReferenceMarkerCenter + rotationReferenceMarkerRadius * Number(Math.cos(workingTheta).toPrecision(5));
        const oy = rotationReferenceMarkerCenter + -1 * rotationReferenceMarkerRadius * Number(Math.sin(workingTheta).toPrecision(5));

        rotationMarker.style.top = String((oy - rotationMarkerRadius) + "px");
        rotationMarker.style.left = String((ox - rotationMarkerRadius) + "px");
    }


    function setRotationMarkerByPosition(x : number, y : number)
    {
        const mx = x - rotationReferenceMarkerCenter;
        const my = rotationReferenceMarkerCenter - y;
        const d = Math.abs(mx) + Math.abs(my);
        
        if(d >= rotationReferenceMarkerCenterInnerBand && d <= rotationReferenceMarkerCenterOuterBand)
        { 
            const theta = Math.atan(my / mx) + (mx < 0 ? QC.Rotations.PI : 0) + (mx > 0 && my < 0 ? QC.Rotations.PI_2 : 0);
            setRotationMarker(theta);
        }
    }


    function onDragCircle(evt : MouseEvent)
    {
        if(evt.buttons == 1 && evt.button == 0)
        {
            setRotationMarkerByPosition(evt.offsetX, evt.offsetY);
        }
    }


    function onRotationTargetClick(evt : MouseEvent)
    {
        setRotationMarkerByPosition(evt.offsetX, evt.offsetY);        
    }



    function onMarkClick(evt : MouseEvent)
    {
        const el = evt.currentTarget as HTMLElement;
        const markValue = Number(el.getAttribute("data-value"));

        if(!Number.isNaN(markValue))
        {
            setRotationMarker(markValue);
        }
    }


    function onCloseClick()
    {
        if(onCloseClickHandler) onCloseClickHandler();
    }


</script>


<div class="p-1">
    <div class="flex place-content-end -mb-3">
        <button class="icon-button flex place-content-center" onclick={onCloseClick} aria-label="Open radians picker dialog">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 11L1 1" stroke="#27282E" stroke-linecap="round"/>
            </svg>
        </button>
    </div>


    <div class="w-fit h-fit grid grid-cols-min grid-rows-min">        
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="w-fit h-fit grid p-1" style="grid-column:2; grid-row:2; margin:auto auto;" onmousemove={onDragCircle} onclick={onRotationTargetClick}>
            <svg bind:this={rotationMarker} style="position:relative; grid-column:1; grid-row:1; pointer-events:none" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#57965C"/>
            </svg>
        
            <svg bind:this={rotationReferenceMarker} width="180" height="180" viewBox="0 0 227 227" fill="none" xmlns="http://www.w3.org/2000/svg" style="grid-column:1; grid-row:1;">
                <path d="M217.849 113.461L226.219 113.461V111.37H217.828C217.842 112.065 217.849 112.762 217.849 113.461Z" fill="#27282E"/>
                <path d="M8.60996 111.37H0.218994V113.461H8.58947C8.58947 112.762 8.59632 112.065 8.60996 111.37Z" fill="#27282E"/>
                <path d="M113.219 8.83147V0.460938H111.126V8.85198C111.822 8.83833 112.52 8.83147 113.219 8.83147Z" fill="#27282E"/>
                <path d="M113.219 218.091C112.52 218.091 111.822 218.084 111.126 218.07V226.461H113.219V218.091Z" fill="#27282E"/>
                <path d="M39.2349 187.446C38.7418 186.952 38.2536 186.454 37.7703 185.952L31.8368 191.885L33.3161 193.364L39.2349 187.446Z" fill="#27282E"/>
                <path d="M185.71 38.0123C186.212 38.4956 186.71 38.9838 187.204 39.4769L193.122 33.5582L191.643 32.079L185.71 38.0123Z" fill="#27282E"/>
                <path d="M187.203 187.446C186.71 187.939 186.212 188.427 185.709 188.91L191.643 194.844L193.122 193.364L187.203 187.446Z" fill="#27282E"/>
                <path d="M39.2347 39.4769L33.316 33.5582L31.8367 35.0375L37.7701 40.9709C38.2533 40.468 38.7416 39.97 39.2347 39.4769Z" fill="#27282E"/>
                <path d="M215.759 113.461C215.759 170.092 169.85 216.001 113.219 216.001C56.5877 216.001 10.6791 170.092 10.6791 113.461C10.6791 56.8299 56.5877 10.9212 113.219 10.9212C169.85 10.9212 215.759 56.8299 215.759 113.461Z" stroke="#27282E" stroke-width="4.17939"/>
            </svg>
        </div>

        <button class="label-button--top-bottom" style="grid-column:2; grid-row:1" onclick={onMarkClick} data-value={QC.Rotations.PI_OF2}><span>π/2</span></button>
        <button class="label-button--left-right" style="grid-column:3; grid-row:2" onclick={onMarkClick} data-value={0}>0</button>
        <button class="label-button--left-right" style="grid-column:1; grid-row:2" onclick={onMarkClick} data-value={QC.Rotations.PI}><span class="w-full text-right">π</span></button>
        <button class="label-button--top-bottom" style="grid-column:2; grid-row:3" onclick={onMarkClick} data-value={QC.Rotations.PI_3OF2}>3π/2</button>
    </div>
</div>