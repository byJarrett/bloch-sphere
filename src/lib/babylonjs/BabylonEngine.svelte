<script lang="ts">
    import { onMount, onDestroy, setContext, tick } from 'svelte';
    import * as BABYLON from 'babylonjs';
    import type { SceneFactory } from '$lib/babylonjs/common';
	import type { Action } from 'svelte/action';


    interface ComponentProps
    {
        sceneFactory? : SceneFactory;
    }



    let engine : BABYLON.Engine | undefined = $state();
    let { sceneFactory }: ComponentProps = $props();


    const onCanvasMount : Action = (node) => 
    {
        //Initialize the engine and attach the canvas
        const canvas = node as unknown as HTMLCanvasElement;
        engine = new BABYLON.Engine(canvas, true);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () 
        {
            engine?.resize(); 
        });

        //Force the first resize and render
        tick().then(() => { engine?.resize(); });
    };


    onDestroy(() =>
    {
        if(engine) engine.stopRenderLoop();
    });

    
    $effect(() => 
    {
        if(engine)
        {
            const scene = sceneFactory?.createScene(engine);

            if(scene)
            {
                engine.runRenderLoop(function () 
                {
                    scene?.render();                    
                });
            }
        }

        if(sceneFactory === undefined)
        {
            if(engine) engine.stopRenderLoop();
        }
    })
</script>


<canvas use:onCanvasMount class="canvas"></canvas>


<style>
    .canvas
    {
        width : 550px;
        height : 550px;
        touch-action:none
    }
</style>