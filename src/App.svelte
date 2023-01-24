<script>
    import { mobile, innerWidth, scrollY} from './store.js'
	import { onMount } from 'svelte'
	import { Canvas } from 'svelte-canvas'
	import { feature } from "topojson-client"
	import { geoIdentity, geoPath, geoAlbersUsa } from "d3-geo"
    import {scaleLinear} from 'd3-scale';
    import { csv } from "d3-fetch"
	import Point from './Point.svelte'
    import { Delaunay } from 'd3-delaunay';
    import Legend from './Legend.svelte'

   

    // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //     mobile = true          
    // }
	
	let bodyWidth = 1000;

    $: width = bodyWidth > 1200 ? 1000 : bodyWidth
	$: height = width * .6256;

    // $: headerMargin = width < 1000 ? 0 : (document.body.clientWidth - 1000)/2

	$: projection = geoIdentity().scale(width / 975)
    $: albers = geoAlbersUsa().scale(width*1.33).translate([width*0.5, height*0.5])
	$: path = geoPath(projection)
	
	let us;
    let data;
    let offset = {};
    let features;
    let points = [];

    let reference_year = 2020;

    // let amount_scale = !$mobile ? scaleLinear().domain([0, 30000]).range([1, 50]) : scaleLinear().domain([0, 30000]).range([1, 30])
    let amount_scale = scaleLinear().domain([0, 30000]).range([1, 50])
    let mobile_amount_scale = scaleLinear().domain([0, 30000]).range([1, 30])

    let display = 2022;

	onMount(async () => {
		const shape = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
		us = await shape.json()

        features = feature(us, us.objects.states).features

        data = await csv("https://raw.githubusercontent.com/ChampeBarton/nra-donations/main/election_ready.csv")

        offset = {left: document.querySelector('#nradonations').offsetLeft, top: document.querySelector('.donationContainer').offsetTop}
	})

    $: if(data !== undefined) {
        data.forEach((d) => {
            d.lat = +d.lat
            d.lon = +d.lon
            d.scaled_amount = +d.amount == 0 ? 0 : !$mobile ? amount_scale(+d.amount) : mobile_amount_scale(+d.amount)
            d.year = +d.year
            d.change = +d.change
        })

    }

    $: points = data !== undefined ? data.filter(d => +d.amount != 0 && +d.year == display).map((d, id) => {
		var latlon = albers([d.lon, d.lat])
        var lat = latlon !== null ? latlon[0] : null
        var lon = latlon !== null ? latlon[1] : null 

		var year = +d.year
        var scaled_amount = +d.scaled_amount
        var amount = +d.amount
        var change = +d.change !== +d.change ? 0 : +d.change
        
        var show = display == year ? true : false

        var name = d.name
        var state = d.state


		return({lat, lon, year, amount, scaled_amount, change, show, id, name, state})
	}).sort((a, b) => Math.abs(a.change) - Math.abs(b.change))  : []

    let picked, click = false;

    $: delaunay = Delaunay.from(
        points,
        d => d.lat,
        d => d.lon
    );

    // $: console.log(offset)
					
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<!-- svelte-ignore non-top-level-reactive-declaration -->
<style>
	svg {
        z-index: 5;
	}
	
	path {
		stroke: #000000;
		/* fill: transparent; */
	}

    h1 {
		color: #333;
		font-size: 25px;
		font-family: "aktiv grotesk", sans-serif;
        font-weight: 800;
        margin-bottom: 5px;
        text-align: left;
	}

    h2 {
		color: #777;
		font-size: 18px;
		font-family: "aktiv grotesk", sans-serif;
        font-weight: 200;
        text-align: left;
        margin-top: 0;
	}

    p {
        color: #888;
        font-size: .6rem;
        font-family: "Spezia Mono", monospace;
        text-align: left
    }


</style>

<svelte:window bind:innerWidth={$innerWidth} bind:scrollY={$scrollY}/>
{#if $innerWidth}
    <!-- {#if !$mobile} -->
        <div bind:clientWidth={bodyWidth} class="donationContainer">
            <header style="width: {width}px; position: relative;">
                <h1>Explore How Much the NRA's PAC Raised by County in 2022</h1>
                {#if $mobile}
                    <h2 style="margin-bottom: 25px ">The Political Victory Fund saw a decline in total donations for the first time in at least five federal election years, raising barely half of 2020's total.</h2>
                {:else}
                    <h2 style="margin-bottom: 15px ">The Political Victory Fund saw a decline in total donations for the first time in at least five federal election years. The drop from 2020 came in some of the organization's fundraising strongholds.</h2>
                {/if}
                    <Legend {width} {height} {reference_year}></Legend>
            </header>  
            {#if $mobile}
                <div style="clear:both;" />
            {/if}
            <Canvas {width} height = {!$mobile ? height : height + 75} 
                style= "position: absolute; cursor: pointer; z-index: 6"
                on:mousemove={({ offsetX: x, offsetY: y }) => {
                    if (!$mobile) {
                        if (picked = delaunay.find(x, y))
                        points = [...points.filter((_, i) => i !== picked), points[picked]]
                    }}
                }
                on:mouseout={() => (picked = null)}
            >
                {#each points as {lat, lon, show, amount, scaled_amount, change, id, name, state} (id)}
                    {#if show}
                        <Point 
                            x = {lat} 
                            y = {lon} 
                            r = {!$mobile ? picked && id === points.at(-1).id && !click ? scaled_amount + 2 : scaled_amount : scaled_amount}
                            stroke = {!$mobile ? picked && id === points.at(-1).id && '#000' : null}
                            {change}
                            {name}
                            {state}
                            {amount}
                            {reference_year}
                            {width}
                            {height}
                            {offset}
                        />
                    {/if}
                {/each}
            </Canvas>   
            <svg {width} height={!$mobile ? height : height + 100}>
                {#if us}
                    <g fill="rgb(233,233,233)">
                        {#each features as feature}
                            <path d={path(feature)}/>
                        {/each}
                    </g>
                    
                {/if}
            </svg>
            <p>Source: Federal Election Commission, U.S. Census Bureau </p>
        </div>
    <!-- {:else}
        <div {width}>
            <img style = "max-width: 100%" src = "https://raw.githubusercontent.com/ChampeBarton/nra-donations/7859c7cf1887caccf534e6bbcb4f3a12f9ff1fd1/mobile-version.png" alt="Map of NRA donations broken down by U.S. County" >
        </div>
    {/if} -->
{/if}

<!-- on:click ={() => playing = !playing} -->
<!-- style = "margin-bottom: {!$mobile ? 0 : 30}px" -->