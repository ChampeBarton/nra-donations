<svelte:head>
  <link href="../fonts/Aktiv Grotesk Regular.otf" rel="preload" as="font" type="font/otf" crossorigin>
  <link href="../fonts/Aktiv Grotesk XBold.otf" rel="preload" as="font" type="font/otf" crossorigin>
  <link href="../fonts/SpeziaMonoWeb-Medium.ttf" rel="preload" as="font" type="font/ttf" crossorigin>
</svelte:head>

<script>
    import { mobile } from './store.js'
    import {scaleLinear} from 'd3-scale';

    export let width, reference_year;

	let left_text = "$100"
    let right_text = "$10,000"

    let amount_scale = scaleLinear().domain([0, 30000]).range([1, 50])

    let circle1 = amount_scale(100)
    let circle2 = amount_scale(1000)
    let circle3 = amount_scale(10000)

    let decrease_text = "↓ from " + reference_year
    let increase_text = "↑ from " + reference_year

    let colors = [
		"#a50026",
        "#ffffbf",
		"#313695"
	]


</script>

<style>
    /* @font-face {
        font-family: "aktiv grotesk";
        src: url('../fonts/Aktiv Grotesk Regular.otf');
    }

    @font-face {
        font-family: "aktiv grotesk xbold";
        src: url('../fonts/Aktiv Grotesk XBold.otf');
    }

    @font-face {
        font-family: "speziamonoweb-medium";
        src: url('../fonts/SpeziaMonoWeb-Medium.ttf');
    } */
    
    circle {
        fill: none;
        stroke: #000;
        stroke-width: 1px;
        position: absolute;
        padding: 10 10 10 10;
    }

    text.number {
        font-size: 15px;
		font-family: "sSpeziaMonoWeb-Medium";
    }

    /* text.mobile-number {
        font-size: .8rem;
		font-family: "speziamonoweb-medium";
    } */

    div {
		background: linear-gradient(to right, var(--gradient-1), var(--gradient-2), var(--gradient-3));
        margin: auto;
	}

    h2 {
        font-size: 12px;
		font-family: "Aktiv Grotesk XBold";
        position: absolute;
    }

    h3 {
        font-size: .5rem;
		font-family: "Aktiv Grotesk";
        font-weight: 400;
        text-align: center;
        margin-top: 35px;
        color: #777;

    }



</style>
{#if !$mobile}
    <svg {width} height=40>
        <text class="number" x={width/2 - 80} y=22.5>{left_text}</text>
        <circle cx={width/2 - 30} cy=20 r={circle1}></circle>
        <circle cx={width/2 - 20} cy=20 r={circle2}></circle>
        <circle cx={width/2 + 5} cy=20 r={circle3}></circle>
        <text class="number" x={width/2 + 35} y=22.5>{right_text}</text>   
    </svg>
    <div
        style="
            --deg: 90deg;
            --gradient-1:{colors[0]};
            --gradient-2:{colors[1]};
            --gradient-3:{colors[2]};
            width: {width/3}px;
            height: 10px;
        "
    ></div>
    <h2 style="left: {width/2 - width/3/2}px; color: {colors[0]};">{decrease_text}</h2>
    <h2 style="left: {width/2 + width/3/2 - 81}px; color: {colors[2]};">{increase_text}</h2>

{:else}
    <div
        style="
            --deg: 90deg;
            --gradient-1:{colors[0]};
            --gradient-2:{colors[1]};
            --gradient-3:{colors[2]};
            width: {width}px;
            height: 10px;
        "
    ></div>
    <h2 style="left: 0px; color: {colors[0]};">{decrease_text}</h2>
    <h2 style="left: {width - 81}px; color: {colors[2]};">{increase_text}</h2> 
    <h3> Cirlce size is proportional to donation amount</h3>
    <!-- <svg {width} height=80>
        <text class="mobile-number" x={width/2 - 80} y=52.5>{left_text}</text>
        <circle cx={width/2 - 30} cy=50 r={circle1}></circle>
        <circle cx={width/2 - 20} cy=50 r={circle2}></circle>
        <circle cx={width/2 + 5} cy=50 r={circle3}></circle>
        <text class="mobile-number" x={width/2 + 35} y=52.5>{right_text}</text>   
    </svg> -->
{/if}

