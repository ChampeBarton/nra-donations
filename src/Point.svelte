<svelte:head>
  <!-- <link href="../fonts/Aktiv Grotesk Regular.otf" rel="preload" as="font" type="font/otf" crossorigin>
  <link href="../fonts/Aktiv Grotesk XBold.otf" rel="preload" as="font" type="font/otf" crossorigin> -->
</svelte:head>

<script>
        import { mobile } from './store.js'
	import { Layer, t } from 'svelte-canvas'
        import { interpolate, piecewise } from "d3-interpolate"
        import { scaleSequential} from 'd3-scale'

	export let x = 0,
                y = 0,
                r = 1,
                stroke = null,
                change, 
                name, 
                state, 
                amount, 
                reference_year,
                height,
                offset;

        let colorScale = scaleSequential(piecewise(interpolate, ["#d73027", "#ffffbf", "#4575b4"])).domain([-10000, 10000])

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

        let mobile_annotate = header_text in {"Orange County, CA": 1}

        let orange = header_text == "Orange County, CA"
        let harris = header_text == "Harris County, TX"
        let losangeles = header_text == "Los Angeles County, CA"
        let newcastle = header_text == "New Castle County, DE"
		
	$: render = ({ context }) => {

                context.save();
                context.globalAlpha = 0.9;
                context.fillStyle = color;
                context.strokeStyle = !$mobile ? "#000" : "#999";
                context.lineWidth = !$mobile ? 1 : .5;
                context.beginPath();
                context.arc(x, y, r, 0, Math.PI * 2);
                context.stroke();
                context.fill();
                context.restore();

                if ($mobile) {
                        if (orange) {
                                context.beginPath();
                                context.moveTo(x, y);
                                context.quadraticCurveTo(x - 30, height - 20, x - 5, height + 40 );
                                context.strokeStyle = color;
                                context.stroke()
                                
                                context.font = ".6rem Aktiv Grotesk";
                                context.fillStyle = "#000";
                                context.fillText(amount_text_middle, x, height + 60)

                                context.font = ".6rem Aktiv Grotesk";
                                context.fillStyle = color;
                                context.fillText(" (" + change_text + ")", x + context.measureText(amount_text_middle).width, height + 60)

                                context.font = ".7rem Aktiv Grotesk XBold";
                                context.fillStyle = "#000";
                                context.fillText(header_text, x, height + 45);
                        }

                        // if (harris) {
                        //         context.beginPath();
                        //         context.moveTo(x, y);
                        //         context.quadraticCurveTo(x - 15, height - 10, x - 5, height + 20 );
                        //         context.strokeStyle = color;
                        //         context.stroke()
                                
                        //         context.font = ".6rem Aktiv Grotesk";
                        //         context.fillStyle = "#000";
                        //         context.fillText(amount_text_middle, x, height + 40)

                        //         context.font = ".6rem Aktiv Grotesk";
                        //         context.fillStyle = color;
                        //         context.fillText(" (" + change_text + ")", x + context.measureText(amount_text_middle).width, height + 40)

                        //         context.font = ".7rem Aktiv Grotesk XBold";
                        //         context.fillStyle = "#000";
                        //         context.fillText(header_text, x, height + 25); 
                        // }

                        if (newcastle) {
                                context.beginPath();
                                context.moveTo(x, y);
                                context.quadraticCurveTo(x + 30, height - 50, x + 5, height + 20 );
                                context.strokeStyle = color;
                                context.stroke()
                                
                                context.font = ".6rem Aktiv Grotesk";
                                context.fillStyle = "#000";
                                context.fillText(amount_text_middle, x - context.measureText(header_text).width, height + 40)

                                context.font = ".6rem Aktiv Grotesk";
                                context.fillStyle = color;
                                context.fillText(" (" + change_text + ")", x - context.measureText(header_text).width + context.measureText(amount_text_middle).width, height + 40)

                                context.font = ".7rem Aktiv Grotesk XBold";
                                context.fillStyle = "#000";
                                context.fillText(header_text, x - context.measureText(header_text).width, height + 25);
                        }
                }

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
                        // var edge_y = document.querySelector("Canvas").getBoundingClientRect().bottom - 115
                        var edge_y = 704

                        var box_width = header_text_width >= change_text_width + compared_text_width
                        ? header_text_width + 30
                        : change_text_width + compared_text_width + 30

                        box_width = box_width - 30 > amount_text_width 
                        ? box_width 
                        : amount_text_width + 30

                        var box_height = 120

                        var screen_adjust_x = x + offset.left + 15 + box_width > edge_x ? x - 15 - box_width : x + 15
                        var screen_adjust_y = y + box_height + 100 > edge_y ? y - box_height : y

                        console.log("x: " + x + ", box_height: " + box_width)
                        console.log("x + box_height + 100: " + (y + box_width + 100))
                        console.log("edge_x: " + edge_x)

                        context.strokeStyle = stroke;
                        context.lineWidth = 2;
                        context.beginPath();
                        context.arc(x, y, r, 0, 2 * Math.PI);
                        context.stroke();

                        CanvasRenderingContext2D.prototype.roundyRect = function (x, y, w, h, r) {
                                if (w < 2 * r) r = w / 2;
                                if (h < 2 * r) r = h / 2;
                                this.beginPath();
                                this.moveTo(x+r, y);
                                this.arcTo(x+w, y,   x+w, y+h, r);
                                this.arcTo(x+w, y+h, x,   y+h, r);
                                this.arcTo(x,   y+h, x,   y,   r);
                                this.arcTo(x,   y,   x+w, y,   r);
                                this.closePath();
                                return this;
                        }

                        context.beginPath();
                        context.roundyRect(screen_adjust_x, screen_adjust_y, box_width, box_height, 10);
                        context.strokeStyle = "#FFFFFF"
                        context.fillStyle = change < -14000 ? "rgba(150, 150, 150, 0.95)" : "rgba(0, 0, 0, 0.8)"
                        context.stroke();
                        context.fill();

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

<style>
        /* @font-face {
                font-family: "Aktiv Grotesk";
                src: url('../fonts/Aktiv Grotesk Regular.otf');
        }

        @font-face {
                font-family: "Aktiv Grotesk XBold";
                src: url('../fonts/Aktiv Grotesk XBold.otf');
        } */
</style>


<Layer {render} />
