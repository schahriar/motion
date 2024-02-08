<script lang="ts">
  import { createSpringSolver } from "../spring";
  import { computeMotion } from "../motion";
  import Knob from "@bismuthsoft/svelte-dj-knob/ElegantKnob.svelte";

  let shape;
  let duration;
  let mass = 1;
  let stiff = 30;
  let damp = 10;
  let vel = 5;

  let motion: ReturnType<typeof computeMotion>;

  $: {
    motion = computeMotion(createSpringSolver(mass, stiff, damp, vel));
    duration = motion.duration;
    const curve = motion.smooth;
    const steps = curve.length;

    shape = `M0 0`;
    for (let i = 0; i < steps; i++) {
      const [x, y] = curve[i];

      shape = `${shape} L${x * 1000} ${y * 1000}`;
    }

    document.body.style.setProperty("--transition", motion.curve);
    document.body.style.setProperty("--dur", `${motion.duration / 1000}s`);
  }

	let color = "#cccccc";

  let props = {
    size: "8rem",
    fgColor: "#888",
    valueColor: "rgb(0 0 0 / 16%)",
    bgColor: "#ffffff",
  };
</script>

<div class="container">
  <section>
    <section class="graph">
      <svg viewBox="0 0 2400 802">
        <g class="canvas">
          <g class="subgraph">
            <g>
              <path
								class="rounded-path"
                d={shape}
                stroke={color}
                stroke-width="20"

								stroke-miterlimit="222"
								stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
							<path
                d={"M1000 1000 L4000 1000"}
                stroke={color}
                stroke-width="10"
                stroke-linejoin="round"
                fill="none"
              />
            </g>

						<circle r="30" stroke={color} stroke-width="15" fill={color} cx="1000" cy="1000">
						</circle>
          </g>
        </g>
      </svg>
    </section>
    <section class="controls">
      <section style:--h-rotate="0deg">
        <Knob
          min={1}
          max={10}
          step={0.1}
          numTicks={10}
          {...props}
          bind:value={mass}
        />
        <label>Mass</label>
      </section>
      <section style:--h-rotate="45deg">
        <Knob
          min={1}
          max={100}
          numTicks={10}
          step={1}
          {...props}
          bind:value={stiff}
        />
        <label>Stiffness</label>
      </section>
      <section style:--h-rotate="105deg">
        <Knob
          min={1}
          max={50}
          numTicks={25}
          step={0.5}
          {...props}
          bind:value={damp}
        />
        <label>Damping</label>
      </section>
      <section style:--h-rotate="200deg">
        <Knob min={0} max={100} step={1} numTicks={5} {...props} bind:value={vel} />
        <label>Velocity</label>
      </section>
			<div class="duration">
				{duration / 1000}s
			</div>
    </section>
  </section>
  <section class="f1">
    <section class="preview">
			<div
      class="ball"
    />
		<div
			style="position: absolute; opacity: 0.5; top: 0; filter: grayscale(0.8); z-index: -1;"
      class="ball"
			style:animation-delay="0.1s"
    />
		<button>Hover to preview</button>
		</section>
  </section>
</div>

<style>
  :root {
    scrollbar-gutter: stable;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    gap: 16px;
  }

	.controls > section {
		position: relative;
	}

	.controls > section > label {
		position: absolute;
		bottom: 6px;
		opacity: 0.5;
		left: 50%;
		transform: translateX(-50%);
		font-weight: 500;
		font-size: 0.8em;
		z-index: 10;
	}

	.rounded-path {
    stroke-linejoin: round;
    stroke-miterlimit: 2;
    stroke-linecap: round;
	}

	.duration {
		position: absolute;
		top: -40px;
		font-size: 2em;
	}

	.timing {
		animation-timing-function: var(--transition);
		transition: all var(--dur) var(--transition);
	}

	.controls > section {
		--h-rotate: 45deg;
		filter: drop-shadow(0px 0px 2px rgba(0,0,0,0)) contrast(1);
		transition: all;
    transition-duration: 2.6s;
    transition-timing-function: linear(0 0%, 0.379316 1.2987%, 0.689644 2.5974%, 0.939247 3.8961%, 1.13591 5.19481%, 1.28688 6.49351%, 1.39881 7.79221%, 1.47775 9.09091%, 1.52917 10.3896%, 1.55794 11.6883%, 1.56835 12.987%, 1.56417 14.2857%, 1.54865 15.5844%, 1.52461 16.8831%, 1.49442 18.1818%, 1.46006 19.4805%, 1.42319 20.7792%, 1.38515 22.0779%, 1.34703 23.3766%, 1.30967 24.6753%, 1.27371 25.974%, 1.23963 27.2727%, 1.20776 28.5714%, 1.17831 29.8701%, 1.15139 31.1688%, 1.12704 32.4675%, 1.10523 33.7662%, 1.08588 35.0649%, 1.06887 36.3636%, 1.05406 37.6623%, 1.0413 38.961%, 1.03042 40.2597%, 1.02124 41.5584%, 1.0136 42.8571%, 1.00732 44.1558%, 1.00225 45.4545%, 0.998232 46.7532%, 0.995127 48.0519%, 0.992802 49.3506%, 0.991138 50.6494%, 0.990029 51.9481%, 0.989376 53.2468%, 0.989097 54.5455%, 0.989114 55.8442%, 0.989364 57.1429%, 0.98979 58.4416%, 0.990345 59.7403%, 0.990989 61.039%, 0.991688 62.3377%, 0.992416 63.6364%, 0.99315 64.9351%, 0.993873 66.2338%, 0.994572 67.5325%, 0.995237 68.8312%, 0.99586 70.1299%, 0.996438 71.4286%, 0.996967 72.7273%, 0.997447 74.026%, 0.997879 75.3247%, 0.998262 76.6234%, 0.9986 77.9221%, 0.998895 79.2208%, 0.999149 80.5195%, 0.999367 81.8182%, 0.999551 83.1169%, 0.999705 84.4156%, 0.999832 85.7143%, 0.999935 87.013%, 1.00002 88.3117%, 1.00008 89.6104%, 1.00013 90.9091%, 1.00016 92.2078%, 1.00019 93.5065%, 1.0002 94.8052%, 1.00021 96.1039%, 1.00021 97.4026%, 1.00021 98.7013%, 1 100%);
	}

	.controls > section:hover {
		filter: drop-shadow(0px 8px 8px rgba(0,0,0,0.05)) contrast(1.05);
	}

  .container {
    display: flex;
    flex-direction: row;
    font-family: inherit;
  }

  .graph {
		width: 100vw;
    min-height: 100vw;
    max-height: 100vh;
    overflow: hidden;
		position: fixed;
    pointer-events: none;
    opacity: 0.5;
    z-index: -1;
    top: -120px;
  }

  svg {
    width: 100%;
    overflow: visible;
    margin: 0 20px 0 0;
  }

  g.subgraph {
    transform: scale(1);
  }

	.preview {
		position: absolute;
		top: 5vh;
	}

	.preview button {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 200px;
		height: 50px;
		transform: translate(-50%, -50%);
		transition: all var(--dur) var(--transition);
		background-color: transparent;
		border: 1px solid #ccc;
		color: #333;
		cursor: pointer;
		font-weight: 400;
		font-family: inherit;
		border-radius: 15px;
	}

	.preview button:hover {
		background-color: rgba(255, 170, 0, 0.2);
		border-color: rgba(255, 170, 0, 0.3);
		backdrop-filter: blur(4px);
		border-width: 3px;
		letter-spacing: 1px;
		border-radius: 10px;
		font-weight: 500;
		height: 200px;
		transform: translate(-50%, -50%) scale(2);
	}

	@keyframes ball {
		0% {
			transform: translateX(70vw);
		}
		50% {
			transform: translateX(30vw);
		}
		100% {
			transform: translateX(70vw);
		}
	}

  .ball {
    width: 80px;
    height: 80px;
    background-color: orange;
    border-radius: 50%;
		animation-name: ball;
		animation-iteration-count: infinite;
    animation-duration: calc(var(--dur) * 2);
		animation-timing-function: var(--transition);
		transition: all var(--dur) var(--transition);
  }

  .canvas {
    overflow: visible;
  }

  .f1 {
    flex: 1;
  }
</style>
