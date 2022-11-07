<script>
	import { Layer, t } from 'svelte-canvas'
	// import { quadInOut } from 'svelte/easing'
	// import { piecewise } from 'd3-interpolate'
	// import { interpolateWarm } from 'd3-scale-chromatic'
    import data from '../../geocoded.tsv';
	import {scaleLinear} from 'd3-scale';
    // import { geoIdentity } from "d3-geo"
    import { geoPath, geoAlbersUsa } from 'd3-geo';

	export let x, y, toggle, width
    

    let donors = []
    let amount_scale = scaleLinear().domain([0, 5000]).range([0.5, 2])

    const projection = geoAlbersUsa().scale(1300).translate([487.5, 305])

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
	
    $: console.log(toggle)
    $: console.log(yearly_donations)
	// const pieces = piecewise([ 
	// 	{ r: .005, alpha: 0.1 },
	// 	{ r: .02, alpha: 0.9 },
	// 	{ r: .005, alpha: 0.1 },
	// ])
	
	// const scale = t => pieces(quadInOut(t))
		
	$: render = ({ context, width }) => {
		// const { r, alpha } = scale(($t / 25 + i * 3) % 100 / 100);
		
		// context.fillStyle = interpolateWarm(1 - i / 50);

        for(let i = 0; i < yearly_donations.length; i++) {
			if(yearly_donations[i]["show"] == true) {
				context.fillStyle = yearly_donations[i]["year"] == 2020 ? "#4e3cc2" : "#c2733c"
                // context.globalAlpha = alpha;
				context.beginPath()
				context.arc(x, y, yearly_donations[i]["amount"] * width, 0, 2 * Math.PI)

				context.fill()
			}
		}
	}
</script>

<Layer {render} />