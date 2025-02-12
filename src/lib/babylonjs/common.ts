import * as BABYLON from 'babylonjs';


export interface SceneFactory
{
    createScene(engine : BABYLON.Engine) : BABYLON.Scene;
}