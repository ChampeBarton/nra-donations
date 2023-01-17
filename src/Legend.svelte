<script>
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

    let ramp_width = width/3

</script>

<style>
    circle {
        fill: none;
        stroke: #000;
        stroke-width: 1px;
        position: absolute;
        padding: 10 10 10 10;
    }

    text.number {
        font-size: 15px;
		font-family: "SpeziaMonoWeb-Medium";
    }

    div {
		background: linear-gradient(to right, var(--gradient-1), var(--gradient-2), var(--gradient-3));
        margin: auto;
	}

    h2 {
        font-size: 12px;
		font-family: "Aktiv Grotesk Xbold";
        position: fixed;
    }



</style>

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
        width: {ramp_width}px;
        height: 10px;
	"
></div>
<h2 style="left: {width/2 - ramp_width/2}px; color: {colors[0]};">{decrease_text}</h2>
<h2 style="left: {width/2 + ramp_width/2 - 55}px; color: {colors[2]};">{increase_text}</h2>

