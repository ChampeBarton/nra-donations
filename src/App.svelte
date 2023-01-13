<script>
	import { onMount } from 'svelte'
	import { Canvas } from 'svelte-canvas'
	import { feature } from "topojson-client"
	import { geoIdentity, geoPath, geoAlbersUsa } from "d3-geo"
    import {scaleLinear} from 'd3-scale';
    import { csv } from "d3-fetch"
	import Point from './Point.svelte'
    import { Delaunay } from 'd3-delaunay';
    import Tooltip from './Tooltip.svelte'

	
	let width = 1000;
	$: height = width * .6256;

	$: projection = geoIdentity().scale(width / 975)
    $: albers = geoAlbersUsa().scale(width*1.33).translate([width*0.5, height*0.5])
	$: path = geoPath(projection)
	
	let us;
    let data;
    let features;
    let points = [];


    // console.log(data)


    let amount_scale = scaleLinear().domain([0, 30000]).range([1, 50])

    let ticker = 2022;
    // let timeout;
    // let duration = 1500;
    // const loopPadding = 300; // time to wait between loops
    // const loop = time => {
    //     timeout = setTimeout(() => {
    //     ticker = ticker < 2022 ? ticker + 1 : 2010
        
    //     loop(duration + loopPadding);
    //     }, time);
    // };
    // const startPlaying = () => loop(0)
    // const stopPlaying = () => clearTimeout(timeout)

    // $: playing = false;
    // $: playing ? startPlaying() : stopPlaying();

	onMount(async () => {
		const shape = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
		us = await shape.json()

        features = feature(us, us.objects.states).features

        csv("https://raw.githubusercontent.com/ChampeBarton/nra-donations/main/counties_ready.csv")
            .then(data =>
                points = data.filter(d => +d.amount != 0 && +d.year == ticker).map((d, id) => {
                    var latlon = albers([+d.lon, +d.lat])
                    var lat = latlon !== null ? latlon[0] : null
                    var lon = latlon !== null ? latlon[1] : null 

                    var year = +d.year
                    var amount = +d.amount == 0 ? 0 : amount_scale(+d.amount)
                    var change = +d.change !== +d.change ? 0 : +d.change
                    
                    var show = ticker == year ? true : false

                    var name = d.name
                    var state = d.state

                    return({lat, lon, year, amount, change, show, id, name, state})
                })
            )

	})

    // $: if(data !== undefined) {
    //     data.forEach((d) => {
    //         d.lat = +d.lat
    //         d.lon = +d.lon
    //         d.amount = +d.amount == 0 ? 0 : amount_scale(+d.amount)
    //         d.year = +d.year
    //         d.change = +d.change
    //     })
    // }

    // $: points = data !== undefined ? data.map((d, id) => {
	// 	var latlon = albers([d.lon, d.lat])
    //     var lat = latlon !== null ? latlon[0] : null
    //     var lon = latlon !== null ? latlon[1] : null 

	// 	var year = d.year
    //     var amount = d.amount
    //     var change = d.change !== d.change ? 0 : d.change
        
    //     var show = ticker == year ? true : false

    //     var name = d.name
    //     var state = d.state


	// 	return({lat, lon, year, amount, change, show, id, name, state})
	// }).filter(d => d.amount != 0) : []

    let picked, click = false;

    $: delaunay = Delaunay.from(
        points,
        d => d.lat,
        d => d.lon
    );


    $: console.log(points)
    $: console.log(picked)
					
</script>

<style>
	svg {
		position: absolute;
	}
	
	path {
		stroke: #000000;
		/* fill: transparent; */
	}


</style>

<div bind:clientWidth={width}>
	<svg {width} {height}>
		{#if us}
            <g fill="rgb(233,233,233)">
                {#each features as feature}
                    <path d={path(feature)}/>
                {/each}
            </g>
			
		{/if}
	</svg>
	<Canvas {width} {height} 
        style= "position: absolute; cursor: pointer"
        on:mousemove={({ clientX: x, clientY: y }) => {
            if (picked = delaunay.find(x - 2, y - 2))
                points = [...points.filter((_, i) => i !== picked), points[picked]]
        }}
        <!-- on:mousedown={() => (click = true)}
        on:mouseup={() => (click = false)} -->
		on:mouseout={() => (picked = null)}
    >
        {#each points as {lat, lon, show, amount, change, id} (id)}
            {#if show}
                <Point 
                    x = {lat} 
                    y = {lon} 
                    r = {picked && id === points.at(-1).id && !click ? amount + 2 : amount}
                    stroke = {picked && id === points.at(-1).id && '#FFFFFF'}
                    {change}
                />
            {/if}
        {/each}
        
	</Canvas>   
</div>
    <p>{ticker}</p>

<!-- on:click ={() => playing = !playing} -->