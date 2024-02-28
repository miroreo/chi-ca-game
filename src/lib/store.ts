import { type Writable, writable, get } from 'svelte/store';
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import * as turf from '@turf/turf';

export const gameScore: Writable<{
    guessedCAs: string[],
    guessedCAsCount: number,
    guessedCAsArea: number,
}> = /*persist(*/writable({
    guessedCAs: [] as string[],
    guessedCAsCount: 0,
    guessedCAsArea: 0,
})/*, createLocalStorage(), 'CommunityArea_gameScore');*/