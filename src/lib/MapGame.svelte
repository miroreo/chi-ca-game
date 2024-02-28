<script lang="ts">
    import type { Map, LineLayer } from "mapbox-gl";
    import MapboxDraw from '@mapbox/mapbox-gl-draw';
    // import type { Map } from "mapbox-gl";
    import MapboxMap from "./MapboxMap.svelte";
    import { onMount } from "svelte";
    import CHICAGO_BOUNDS from "$lib/chibounds.geo.json";
    import * as turf from '@turf/turf';
    import { gameScore } from "./store";
    import { get } from "svelte/store";
    import GameMenu from "./GameMenu.svelte";
    import _cas from "$lib/communityAreas.json";

    const CommunityAreas = _cas as {
        [key: string]: GeoJSON.Feature<GeoJSON.MultiPolygon>
    }
    export let isVisible = true;

    const initialState = {
        lng: -87.6278269,
        lat: 41.8820096,
        zoom: 11
    };
    let map: Map
    
    const mapInit = async (event: CustomEvent<{map: Map}>) => {
        let initedMap = event.detail.map;
        map = initedMap;
        window['map'] = initedMap;
        // initedMap.addControl(new MapboxDraw({
        //     displayControlsDefault: false,
        //     controls: {
        //         polygon: true,
        //         trash: true
        //     }
        // }));
        initedMap.setMinZoom(10);
        initedMap.addSource('chicago-bounds', {
            type: 'geojson',
            // data: "https://chidatarepo.tessa.ooo/CHI-bounds-inverted.json"
            data: CHICAGO_BOUNDS as GeoJSON.Feature<GeoJSON.Geometry>,
            });
        let chicagoParts = [
            turf.polygon(CHICAGO_BOUNDS.geometry.coordinates[0]),
            turf.polygon(CHICAGO_BOUNDS.geometry.coordinates[1]),
        ]
        let chicago = turf.union(chicagoParts[0], chicagoParts[1]);
        let chicagoInvert = turf.mask(
            chicagoParts[0], 
            undefined);
        let chicagoInvert2 = turf.mask(
            chicagoParts[1], 
            chicagoInvert
        )
        initedMap.addSource('chicago-invert', {
            type: 'geojson',
            data: chicagoInvert as GeoJSON.Feature<GeoJSON.Geometry>,
        })
        initedMap.addLayer({ 
            id: 'chicago-bounds',
            type: 'fill',
            source: 'chicago-invert',
            layout: {
                
            },
            paint: {
                'fill-color': '#111',
                'fill-opacity': 1,
            },
        });
    }
    gameScore.subscribe((score) => {
        if(!map) return;
        if(score.guessedCAsCount = 0) {
            console.log("Resetting Map");
            const guessedLayers = map.getStyle().layers.filter((layer) => {
                return layer.id.startsWith("guessed-");
            });
            if(guessedLayers.length > 0) {
                guessedLayers.forEach((layer) => {
                    map.removeLayer(layer.id);
                    map.removeSource(layer.id);
                });
            }
        }
        let newCAs = score.guessedCAs.filter(ca => {
            console.log("checking for new CA:" + ca);
            return map.getStyle().layers.filter(layer => {
                if(!layer.id.startsWith("guessed-")) return false;
                if(layer.id.slice(8) === ca) return true;
            }).length === 0;
        });
        let oldCAs = map.getStyle().layers.filter(layer => {
            if(!layer.id.startsWith("guessed-")) return false;
            if(newCAs.includes(layer.id.slice(8))) return false;
        });
        oldCAs.forEach(ca => {
            map.removeLayer(ca.id);
        });
        newCAs.forEach(ca => {
            console.log("Adding Layer for " + ca)
            map.addLayer({
                id:"guessed-" + ca,
                type: "fill",
                source: {
                    type: "geojson",
                    data: CommunityAreas[ca]
                },
                paint: {
                    "fill-color": "#f00",
                    "fill-opacity": 0.5
                }
            })
        })
    })
</script>
<main class="max-h-96 md:max-h-screen md:visible">
    <MapboxMap on:ready={mapInit}/>
</main>