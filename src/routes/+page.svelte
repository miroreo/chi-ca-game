<script lang="ts">
    import MapGame from '$lib/MapGame.svelte';
    import GameMenu from '$lib/GameMenu.svelte';
    import {  } from '$lib/store';
    import { validateGuess } from '$lib/validation';
    let handleGuess = (event: CustomEvent<string>) => {
        let guess = event.detail;
        console.log(guess);
        let result = validateGuess(guess);
    }
    let currentView = 1;

    const setView = (view: 1 | 2) => {
        return () => {
            currentView = view;
        }
    }
</script>

<main class="flex md:flex-row flex-col">
    <GameMenu on:guess={handleGuess}/>
    <MapGame/>
    <!-- <div class="md:invisible w-screen bottom-0 h-10 z-10">
        <button on:click={setView(1)}>Game</button>
        <button on:click={setView(2)}>Map</button>
    </div> -->
    <!-- <MapGame /> -->
</main>