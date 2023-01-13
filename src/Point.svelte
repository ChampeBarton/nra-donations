<script>
	import { Layer, t } from 'svelte-canvas'

	export let lat, lon, amount
		
	$: render = ({ context }) => {
        context.fillStyle ="rgba(78, 60, 194, 0.7)"
        context.strokeStyle = "#FFFFFF"
        context.stroke();
        context.beginPath();
        context.arc(lat, lon, amount, 0, Math.PI * 2);
        context.fill();
	}
</script>

<Layer {render} />