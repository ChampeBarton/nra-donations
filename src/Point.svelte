<script>
	import { Layer, t } from 'svelte-canvas'
        import { interpolateRdYlGn } from "d3-scale-chromatic"
        import { scaleSequential} from 'd3-scale'

	export let x = 0,
                y = 0,
                r = 1,
                stroke = null,
                change, 
                name, 
                state, 
                amount, 
                reference_year;

        let colorScale = scaleSequential(interpolateRdYlGn).domain([-10000, 10000])

        let header_text = name + ", " + state
        let change_text = change > 0 
                ? "↑$" + Math.abs(Math.trunc(change)).toLocaleString("en-US") 
                : change < 0 
                ? "↓$" + Math.abs(Math.trunc(change)).toLocaleString("en-US") 
                : "→$0 "
        let amount_text_beginning = "Donated " 
        let amount_text_middle = "$"+ Math.abs(Math.trunc(amount)).toLocaleString("en-US") + "  "
        let amount_text_end = " in 2022"
        
        let color = colorScale(change)
		
	$: render = ({ context }) => {

                context.save();
                context.globalAlpha = 0.9;
                context.fillStyle = color;
                context.strokeStyle = "#000";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, r, 0, Math.PI * 2);
                context.stroke();
                context.fill();
                context.restore();

                if (stroke) {
                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "rgba(1, 1, 1, 0)";
                        context.fillText(amount_text_beginning + amount_text_end, x + 30, y + 70)
                        context.font = "15px Aktiv Grotesk XBold"
                        context.fillStyle = "rgba(1, 1, 1, 0)"
                        context.fillText(amount_text_middle, x + 30, y + 70)
                        var amount_text_width = context.measureText(amount_text_beginning + amount_text_middle + amount_text_end).width

                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "rgba(1, 1, 1, 0)";
                        context.fillText(change_text, x + 30, y + 100);
                        var change_text_width = context.measureText(change_text).width

                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "rgba(1, 1, 1, 0)";
                        context.fillText(" compared to 2020", x + 30 + context.measureText(change_text).width, y + 100)
                        var compared_text_width = context.measureText(" compared to " + reference_year).width

                        context.font = "20px Aktiv Grotesk XBold";
                        context.fillStyle = "rgba(1, 1, 1, 0)";
                        context.fillText(header_text, x + 30, y + 30);
                        var header_text_width = context.measureText(header_text).width

                        var edge_x = document.querySelector("Canvas").getBoundingClientRect().right - 10
                        var edge_y = document.querySelector("Canvas").getBoundingClientRect().bottom - 115

                        var box_width = header_text_width >= change_text_width + compared_text_width
                        ? header_text_width + 30
                        : change_text_width + compared_text_width + 30

                        box_width = box_width - 30 > amount_text_width 
                        ? box_width 
                        : amount_text_width + 30

                        var box_height = 150

                        var screen_adjust_x = x + 15 + box_width > edge_x ? x - 15 - box_width : x + 15
                        var screen_adjust_y = y + box_height > edge_y ? y - box_height : y


                        context.beginPath();
                        context.roundRect(screen_adjust_x, screen_adjust_y, box_width, box_height, 10);
                        context.strokeStyle = "#FFFFFF"
                        context.fillStyle = "rgba(27, 29, 35,0.9)"
                        context.stroke();
                        context.fill();

                        context.strokeStyle = stroke;
                        context.lineWidth = 2;
                        context.beginPath();
                        context.arc(x, y, r, 0, 2 * Math.PI);
                        context.stroke();

                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "#FFFFFF";
                        context.fillText(amount_text_beginning, screen_adjust_x + 15, screen_adjust_y + 70)

                        context.font = "15px Aktiv Grotesk XBold";
                        context.fillStyle = "#FFFFFF";
                        context.fillText(amount_text_middle, screen_adjust_x + 15 + context.measureText(amount_text_beginning).width, screen_adjust_y + 70)

                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "#FFFFFF";
                        context.fillText(amount_text_end, screen_adjust_x + 15 + context.measureText(amount_text_beginning).width + context.measureText(amount_text_middle).width, screen_adjust_y + 70)
                        
                        context.font = "15px Aktiv Grotesk XBold";
                        context.fillStyle = color;
                        context.fillText(change_text, screen_adjust_x + 15, screen_adjust_y + 100);

                        context.font = "15px Aktiv Grotesk";
                        context.fillStyle = "#FFFFFF";
                        context.fillText(" compared to " + reference_year, screen_adjust_x + 15 + context.measureText(change_text).width, screen_adjust_y + 100)

                        context.font = "20px Aktiv Grotesk XBold";
                        context.fillStyle = "#FFFFFF";
                        context.fillText(header_text, screen_adjust_x + 15, screen_adjust_y + 30);
                  
    }
	}

</script>




<Layer {render} />
