

# Bloch Sphere

A [Bloch sphere](https://en.wikipedia.org/wiki/Bloch_sphere) is a visual way of illustrating the quantum state of a qubit.  Manipulate the state by applying quantum gates to the qubit.

Clicking on a history node reverts the qubit back to that state.

Run it from Github: [https://byjarrett.github.io/bloch-sphere/](https://byjarrett.github.io/bloch-sphere/) 

<br/><br/>

## Technicals

Bloch Sphere is built using [Node](https://nodejs.org/en/download), [Svelte/SvelteKit](https://svelte.dev/), [vite](https://vite.dev/) and these key libraries
- [mathjs](https://mathjs.org/)
- [BabylonJS](https://www.babylonjs.com/)
- [Tailwindcss](https://tailwindcss.com/)
- [Flowbite](https://flowbite-svelte.com/)

<br/><br/>
## Run the project

First use npm to install all third-party dependencies.

```bash
# Installs all third-party libraries from npm.  Only need to run it once.
npm install
```
<br/>


### Run the project in dev mode

```bash
# Starts the vite server in dev mode on localhost
npm run dev
```
<br/>


### Run the project in prod mode

```bash
# Builds the application as static site -- https://svelte.dev/docs/kit/adapter-static
npm run build


# Starts the vite server in prod mode on localhost
npm run preview
```


<br/><br/>

## References and inspirations
I used these sources to learn about quantum computing.  All bugs and flaws in this project are my own.  I am sure I've misunderstood something or incorrectly implemented a logic detail or calculation.  Some blame belongs to Javascripts floating point implementation and rounding errors.


In no specific order:

 1. [Grok Bloch](https://javafxpert.github.io/grok-bloch/)
 2. [QuVis](https://www.st-andrews.ac.uk/physics/quvis/simulations_html5/sims/blochsphere/blochsphere.html)
 3. [Bits and Electrons](https://bits-and-electrons.github.io/bloch-sphere-simulator)
 4. [Blochy](https://github.com/kherb27/Blochy)
 5. [desmos](https://www.desmos.com/calculator/amdxlc3jeh)
 6. [Rennie Data Science's Bloch](https://renniedatascience.com/Bloch)
 7. [Attila-Kun's Bloch](https://github.com/attila-kun/bloch)
 8. [Nielson and Chuang, Quantum Computation and Quantum Information](https://a.co/d/fHcyweg)
 9. [Wong, Thomas, Introduction to Classical and Quantum Computing ](https://a.co/d/7SadB0G)
10. [Sutor, Robert, Dancing with Qubits](https://a.co/d/hBlTLYh)
11. [Woody, Leonard, Essential Mathematics for Quantum Computing](https://a.co/d/29bbJfk)
12. [Savov, Ivan, No bullshit guide to linear algebra](https://a.co/d/iKXIoeO)
