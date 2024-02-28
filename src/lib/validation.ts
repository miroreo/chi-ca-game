import {get} from 'svelte/store';
import { gameScore } from './store';
import * as turf from '@turf/turf';
import _cas from "$lib/communityAreas.json";

const CommunityAreas = _cas as {
    [key: string]: GeoJSON.Feature<GeoJSON.MultiPolygon>
}
export const validateGuess = (guess: string) => {
    guess = guess.toUpperCase();
    let score = get(gameScore);
    if(score.guessedCAs?.includes(guess)) {
        return;
    }
    const guessedArea = CommunityAreas[guess];
    if(!guessedArea) {
        return;
    }
    gameScore.update(sc => {
        console.log(sc);
        sc.guessedCAs.push(guess);
        sc.guessedCAsCount = sc.guessedCAsCount++;
        sc.guessedCAsArea += turf.area(guessedArea);
        return sc;
    });
}