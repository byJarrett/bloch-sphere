<script lang="ts">
    import * as math from "mathjs";
    import * as BEM from '$lib/math';
	import { Tooltip } from "flowbite-svelte";


    interface ComponentProps
    {
        alphaAmplitude : math.Complex;
        betaAmplitude : math.Complex;
        polarAngle : number;
        azimuthAngle : number;
    }

    const { alphaAmplitude, betaAmplitude, polarAngle, azimuthAngle } : ComponentProps = $props();
    const alpha         = $derived(BEM.formatPrecision(alphaAmplitude.re) as number);
    const alphaProbOut  = $derived(math.round(100 * math.square(alpha)).toString() + "%");
    const betaProbOut   = $derived(math.round(math.square(math.abs(betaAmplitude) as unknown as number) * 100) + "%"); //Typescript gets confused, but abs(complex) returns a number type.
    const polarOut      = $derived(math.round(polarAngle, 5).toPrecision(5));
    const azimuthOut    = $derived(math.round(azimuthAngle, 5).toPrecision(5));
    const alphaOut      = $derived(alpha.toString());
    const betaOut       = $derived(BEM.formatPrecision(betaAmplitude, BEM.RoundingLogic.Round, 4).toString());
</script>

<div>
    <table class="state-data-view--table">
        <thead>
            <tr>
                <td></td>
                <td class="state-data-view--label !text-left w-[90px]">
                    <span class="fira-mono-medium">|0&gt;</span>
                    <Tooltip type="custom" class="tooltipCustom">Alpha is the amplitude or probability is the |0&gt; state.</Tooltip>
                </td>
                <td class="state-data-view--label !text-left w-[100px]">
                    <span class="fira-mono-medium">|1&gt;</span>
                    <Tooltip type="custom" class="tooltipCustom">Beta is the amplitude or probability is the |1&gt; state.</Tooltip>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="state-data-view--label">
                    Amplitudes
                </td>
                <td class="state-data-view--data">
                    <span>{alphaOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{alphaOut}</Tooltip>
                </td>
                <td class="state-data-view--data">
                    <span>{betaOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{betaOut}</Tooltip>
                </td>
            </tr>
            <tr>
                <td class="state-data-view--label">
                    Probabilities
                </td>
                <td class="state-data-view--data">
                    <span>{alphaProbOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{alphaProbOut}</Tooltip>
                </td>
                <td class="state-data-view--data">
                    <span>{betaProbOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{betaProbOut}</Tooltip>
                </td>
            </tr>  

            <tr>
                <td class="state-data-view--divider"></td>
            </tr>

            <tr>
                <td class="state-data-view--label">
                    Polar Angle
                </td>
                <td class="state-data-view--data" colspan="2">
                    <span>{polarOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{polarOut}</Tooltip>
                </td>
            </tr>
            <tr>
                <td class="state-data-view--label">
                    Azimuth Angle
                </td>
                <td class="state-data-view--data" colspan="2">
                    <span>{azimuthOut}</span>
                    <Tooltip type="custom" class="tooltipCustom">{azimuthOut}</Tooltip>
                </td>
            </tr>  
        </tbody>
    </table>
</div>