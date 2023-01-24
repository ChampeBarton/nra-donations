<svelte:head>
  <!-- <link href="../fonts/Aktiv Grotesk Regular.otf" rel="preload" as="font" type="font/otf" crossorigin>
  <link href="../fonts/Aktiv Grotesk XBold.otf" rel="preload" as="font" type="font/otf" crossorigin>
  <link href="../fonts/SpeziaMonoWeb-Medium.ttf" rel="preload" as="font" type="font/ttf" crossorigin> -->
</svelte:head>

<script>
    import { mobile } from './store.js'
    import {scaleLinear} from 'd3-scale';

    export let width, height, reference_year;

	let small = "$1000"
    let large = "$10,000"

    // let mobile_small = "$1,000 in 2022"
    // let desktop_title = "2022 Donations"

    let amount_scale = scaleLinear().domain([0, 30000]).range([1, 50])
    let mobile_amount_scale = scaleLinear().domain([0, 30000]).range([1, 30])

    let circle1 = amount_scale(100)
    let circle2 = amount_scale(1000)
    let circle3 = amount_scale(10000)

    let mobileCircle1 = mobile_amount_scale(100)
    let mobileCircle2 = mobile_amount_scale(1000)
    let mobileCircle3 = mobile_amount_scale(10000)

    $: circle2height = height/6
    $: circle3height = circle2height - 15

    $: circleX = width - width/4
    $: mobileCircleX = width/2 - 100

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
        font-family: "Aktiv Grotesk";
        src: url('../fonts/Aktiv Grotesk Regular.otf');
    }

    @font-face {
        font-family: "Aktiv Grotesk XBold";
        src: url('../fonts/Aktiv Grotesk XBold.otf');
    }

    @font-face {
        font-family: "SpeziaMonoWeb-Medium";
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
        font-size: 14px;
		font-family: "SpeziaMonoWeb-Medium";
    }

    text.mobile-number {
        font-size: .6rem;
		font-family: "SpeziaMonoweb-Medium";
    }

    div {
		background: linear-gradient(to right, var(--gradient-1), var(--gradient-2), var(--gradient-3));
        margin: auto;
	}

    svg {
        position: absolute;
    }

    h2.desktop {
        font-size: 12px;
		font-family: "Aktiv Grotesk XBold";
        position: absolute;
        margin-top: 8px;
    }

    h2.mobile {
        font-size: 12px;
		font-family: "Aktiv Grotesk XBold";
        margin: 0px 0px 30px 0px;
        padding: 5px 0px 0px 0px;
    }

    /* h3 {
        font-size: .5rem;
		font-family: "Aktiv Grotesk";
        font-weight: 400;
        text-align: center;
        color: #777;
        margin: 0px;
        padding: 30px 0px 0px 0px;
    } */

    /* text.header {
        font-size: 14px;
		font-family: "Aktiv Grotesk XBold";
    } */

    .legend-text {
        position: relative;
    }



</style>
{#if !$mobile}
    <div
        style="
            --deg: 90deg;
            --gradient-1:{colors[0]};
            --gradient-2:{colors[1]};
            --gradient-3:{colors[2]};
            width: {width/2.5}px;
            height: 10px;
            margin-top: 40px;
        "
    ></div>
    <h2 class="desktop" style="right: {width/2 - width/2.5/2}px; color: {colors[2]};">{increase_text}</h2>
    <h2 class="desktop" style="left: {width/2 - width/2.5/2}px; color: {colors[0]};">{decrease_text}</h2>
    <br style="clear: both;"/>
    <svg {width} {height}>
        
        <!-- <circle cx={width/2 + width/2.5/2 + 40} cy=20 r={circle1}></circle> -->
        <circle cx={circleX} cy={circle2height} r={circle2}></circle>
        <circle cx={circleX} cy={circle3height} r={circle3}></circle>

        <g fill="none" stroke="black" stroke-width="1">
            <path stroke-dasharray="3,3" d="M{circleX} {circle2height - 2.5} l28 0" />
            <path stroke-dasharray="3,3" d="M{circleX} {circle3height - 17.5} l28 0" />
        </g>

        <!-- <text class="header" x={circleX - circle3} y={circle3height - 35}>{desktop_title}</text>
        <line x1={circleX - circle3} y1={circle3height - 33} x2={circleX - circle3 + 107}  y2={circle3height - 33} stroke="black" /> -->
        <text class="number" x={circleX + 28} y={circle2height + 2.5}>{small}</text>
        <text class="number" x={circleX + 28} y={circle3height - 12.5}>{large}</text>   
    </svg>

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
    <div class="legend-text" >
        <h2 class="mobile" style="float: right; color: {colors[2]};">{increase_text}</h2> 
        <h2 class="mobile" style="float: left; color: {colors[0]};">{decrease_text}</h2>
        <!-- <h3> Cirlce size is proportional to donation amount</h3> -->
    </div>
    <svg width = {width/2} {height}>
        
        <!-- <circle cx={width/2 + width/2.5/2 + 40} cy=20 r={circle1}></circle> -->
        <circle cx={mobileCircleX} cy={circle2height + 13.5} r={mobileCircle2}></circle>
        <circle cx={mobileCircleX} cy={circle3height + 20} r={mobileCircle3}></circle>

        <g fill="none" stroke="black" stroke-width="1">
            <path stroke-dasharray="3,3" d="M{mobileCircleX} {circle2height + 11.5} l28 0" />
            <path stroke-dasharray="3,3" d="M{mobileCircleX} {circle3height + 9.3} l28 0" />
        </g>

        <text class="mobile-number" x={mobileCircleX + 30} y={circle2height + 15}>{small}</text>
        <text class="mobile-number" x={mobileCircleX + 30} y={circle3height + 12}>{large}</text>   
    </svg>
    <!-- <svg {width} height=80>
        <text class="mobile-number" x={width/2 - 80} y=52.5>{left_text}</text>
        <circle cx={width/2 - 30} cy=50 r={circle1}></circle>
        <circle cx={width/2 - 20} cy=50 r={circle2}></circle>
        <circle cx={width/2 + 5} cy=50 r={circle3}></circle>
        <text class="mobile-number" x={width/2 + 35} y=52.5>{right_text}</text>   
    </svg> -->
{/if}

