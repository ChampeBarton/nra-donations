<script>
	import { Layer, t } from 'svelte-canvas'
	// import { quadInOut } from 'svelte/easing'
	// import { piecewise } from 'd3-interpolate'
	// import { interpolateWarm } from 'd3-scale-chromatic'

	export let lat, lon, amount
	
	// const pieces = piecewise([ 
	// 	{ r: .005, alpha: 0.1 },
	// 	{ r: .02, alpha: 0.9 },
	// 	{ r: .005, alpha: 0.1 },
	// ])
	
	// const scale = t => pieces(quadInOut(t))
		
	$: render = ({ context, width }) => {
        context.fillStyle ="#4e3cc2"
        // context.globalAlpha = alpha;
        context.beginPath();
        context.arc(lat, lon, amount, 0, Math.PI * 2);
        context.fill();
	}
</script>

<Layer {render} />