<script>
	// https://github.com/topojson/us-atlas
	// https://github.com/d3/d3-geo
	// https://observablehq.com/@mbostock/u-s-state-map
	// TODO: https://observablehq.com/@d3/u-s-map
	// TODO: https://observablehq.com/@jeantimex/us-state-county-map
	
	import { onMount } from 'svelte';
	import * as topojson from 'topojson-client';
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import data from '../../geocoded.tsv';
	import {scaleLinear} from 'd3-scale';

	$: toggle = true
	$: console.log(toggle)

	var viewbox_width = 1500
	var viewbox_height = 975
	var width = 1000
	var height = 650
	var x_scale = viewbox_width/width
	var y_scale = viewbox_height/height

	var amount_scale = scaleLinear().domain([0, 5000]).range([0.5, 2])

	let donors = []
	
	// https://github.com/topojson/us-atlas#us-atlas-topojson
	const projection = geoAlbersUsa().scale(1300).translate([487.5, 305])
	
	const path = geoPath().projection(null);
	
	let features = []
	let mesh


	data.forEach((d) => {
		d.lat = +d.lat
		d.long = +d.long
		d.amount = +d.amount
		d.year = +d.year

		var latlon = projection([d.long, d.lat])
		d.latitude = latlon[0]
		d.longitude = latlon[1]

		donors.push({lat: d.latitude, lon: d.longitude, year: d.year, amount: amount_scale(d.amount)})
	})
	console.log(donors)
	
	$: yearly_donations = donors.map(d => {
		var lat = d.lat
		var lon = d.lon
		var year = d.year
		var amount = d.amount
		var show = toggle ? d.year == 2010 ? true : false : d.year == 2020 ? true : false

		return({lat, lon, year, amount, show})
	})

	$: console.log(yearly_donations)

	var context
	var canvas
	var scale = window.devicePixelRatio


	
	onMount(async () => {
		const us = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json')
			.then(d => d.json())
		
		features = topojson.feature(us, us.objects.states).features;
		
		mesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
		
		context = canvas.getContext("2d")
        context.scale(scale, scale)
        draw()
	})

	function draw() {
		for(let i = 0; i < yearly_donations.length; i++) {
			if(yearly_donations[i]["show"] == true) {
				context.fillStyle = yearly_donations[i]["year"] == 2020 ? "#4e3cc2" : "#c2733c"
				context.beginPath()
				context.arc(yearly_donations[i]["lat"]/x_scale, yearly_donations[i]["lon"]/y_scale, donors[i]["amount"], 0, 2 * Math.PI)

				context.fill()
			}
		}
	}
</script>

<svg class="map" width = {width} height = {height} viewbox="0 0 {viewbox_width} {viewbox_height}" >
	<!-- State shapes -->
	<g fill="white" stroke="black">
		{#each features as feature, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<path d={path(feature)} class="state"  />
		{/each}
				

	</g>
		
	<!-- Interior lines -->
<!-- 	<path d={path(mesh)} fill="none" stroke="black" /> -->
		

</svg>
<canvas on:click ={() => toggle = !toggle} class="points" bind:this={canvas} style="width: {width}px; height: {height}px" width={Math.floor(scale*width)} height={Math.floor(scale*height)}/>
	
<style>
	.map {
		position: absolute;
		z-index: 0;
	}

	.points {
		position: absolute;
		z-index: 1;
	}
</style>