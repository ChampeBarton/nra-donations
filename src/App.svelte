<script>
	import { onMount } from 'svelte'
	import { Canvas } from 'svelte-canvas'
	import { mesh, feature } from "topojson-client"
	import { geoIdentity, geoPath, geoAlbersUsa } from "d3-geo"
    import {scaleLinear} from 'd3-scale';
    import { csv } from "d3-fetch"
	import Donor from './Donor.svelte'
    // import data from './geocoded.tsv';
	
	let width = 1000;
	$: height = width * .6256;

	$: projection = geoIdentity().scale(width / 975)
    $: albers = geoAlbersUsa().scale(width*1.33).translate([width*0.5, height*0.5])
	$: path = geoPath(projection)
	
	let us;
    let data;

    // console.log(data)


    let amount_scale = scaleLinear().domain([0, 6000]).range([0.75, 10])

    let ticker = 2010;
    let timeout;
    let duration = 1500;
    const loopPadding = 300; // time to wait between loops
    const loop = time => {
        timeout = setTimeout(() => {
        ticker = ticker < 2021 ? ticker + 1 : 2010
        
        loop(duration + loopPadding);
        }, time);
    };
    const startPlaying = () => loop(0)
    const stopPlaying = () => clearTimeout(timeout)

    $: playing = false;
    $: playing ? startPlaying() : stopPlaying();

	onMount(async () => {
		const shape = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
		us = await shape.json()

        data = await csv("https://raw.githubusercontent.com/ChampeBarton/nra-donations/main/geocoded.csv")
	})

    // $: console.log(data)

    $: if(data !== undefined) {
        data.forEach((d) => {
            d.lat = +d.lat
            d.long = +d.long
            d.amount = amount_scale(+d.amount)
            d.year = +d.year
        })
    }

    $: points = data !== undefined ? data.map(d => {
		var latlon = albers([d.long, d.lat])
        var lat = latlon !== null ? latlon[0] : null
        var lon = latlon !== null ? latlon[1] : null 

		var year = d.year
		var amount = d.amount
        
        var show = ticker == year ? true : false

		return({lat, lon, year, amount, show})
	}) : []

    // $: console.log(points)
    // $: console.log(toggle)
    // $: console.log(ticker)
					
</script>

<style>
	svg {
		position: absolute;
	}
	
	path {
		stroke: #000000;
		fill: transparent;
	}
</style>

<div bind:clientWidth={width}>
	<svg {width} {height}>
		{#if us}
			<path d={path(mesh(us, us.objects.states))} />
		{/if}
	</svg>
	<Canvas on:click ={() => playing = !playing} {width} {height} style="position: absolute">
        {#each points as {lat, lon, amount, show}}
            {#if show}
                <Donor {lat} {lon} {amount} />
            {/if}
        {/each}
	</Canvas>   
</div>
    <p>{ticker}</p>
