<script>
	import { Layer, t } from 'svelte-canvas'
        import { interpolateRdYlBu } from "d3-scale-chromatic"
        import { scaleSequential} from 'd3-scale'
        import { interpolate} from 'd3-interpolate'
         import { spring } from 'svelte/motion'

	export let x, y, r, change, stroke

        let strokeWidth = 2;

        let colorScale = scaleSequential(interpolateRdYlBu).domain([30000, -30000])

        const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
        $: radius.set(r);
		
	$: render = ({ context }) => {
                context.globalAlpha = 0.9
                context.fillStyle = colorScale(change)
                context.strokeStyle = "#FFFFFF"
                context.stroke();
                context.beginPath();
                context.arc(x, y, $radius, 0, Math.PI * 2);
                context.fill();

                if (stroke) {
                        context.strokeStyle = stroke;
                        context.lineWidth = strokeWidth;
                        context.beginPath();
                        context.arc(x, y, $radius + strokeWidth / 2, 0, 2 * Math.PI);
                        context.stroke();
    }
	}

</script>

<Layer {render} />
