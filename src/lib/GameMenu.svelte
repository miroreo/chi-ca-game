<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {  } from "./store";
    import type { ChangeEventHandler } from "svelte/elements";
    import { get } from "svelte/store";
    import { gameScore } from "./store";

    const dispatcher = createEventDispatcher();
    export let isVisible = true;
    let currentStreetName = "";
    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        dispatcher("guess", currentStreetName);
        currentStreetName = "";
    }

</script>
<main class="md:h-screen overflow-y-scroll bg-gray-900 text-white p-5 flex flex-col max-w-7xl">
    <h1 class="text-xl font-extrabold my-2"><span class="text-blue-300">CHI</span> Community Areas Game</h1>
    <form on:submit={handleSubmit}>
        <p class="py-2">Enter a Community Area name below.</p>
        <div class="flex flex-row w-full gap-x-2 py-2">
            <input type="text" placeholder="" bind:value={currentStreetName} class="px-3 py-2 rounded-lg bg-gray-700 w-full"/>
            <button type="submit">Guess</button><br />
        </div>
    </form>
    <h2 class="text-lg font-bold my-2">Guessed Community Areas</h2>
    <ul>
        {#each $gameScore.guessedCAs as CA}
        <li>{CA}</li>
    {/each}
    </ul>
    
</main>