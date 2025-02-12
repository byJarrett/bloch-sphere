<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    type ComponentProps = HTMLButtonAttributes & 
    {
        class? : string;
        children? : import('svelte').Snippet;
        [key: string] : any;
        disabled? : boolean;
    }

    let { type = 'button', children, class : classOverride, disabled = false, ...rest } : ComponentProps = $props();
</script>


{#if disabled}
    <label class="button-primary {classOverride}">
        {@render children?.()}
    </label> 
{:else}
    <button {type} {...rest} class="button-primary {classOverride}">
        {@render children?.()}
    </button>
{/if}