<script>
	import { Layer, t } from 'svelte-canvas'

	export let lat, lon, amount
		
	$: render = ({ context }) => {
        context.fillStyle ="#4e3cc2"
        context.beginPath();
        context.arc(lat, lon, amount, 0, Math.PI * 2);
        context.fill();
	}
</script>

<Layer {render} />