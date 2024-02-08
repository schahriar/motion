import { fitCurve } from "./simplify";
import { createSpringSolver } from "./spring";

export {createSpringSolver};

export interface Solver {
  solve: (t: number) => number;
  maxDuration?: number;
}

const getLinearCurve = (v: ReturnType<typeof fitCurve>): string => {
  return `linear(${v.reduce((accu, v) => `${accu.length ? `${accu}, ` : ""} ${v[1]} ${v[0] * 100}%`, "")})`;
}

export const computeMotion = (solver: Solver) => {
  let t = 0;
  const stepSize = 1 / 12;
  const totalSteps = ((solver.maxDuration || 1000) / 1000) * 30;
  const steps: number[] = [];

  let threshold = 15; // 15 low delta steps before we stop the animation
  for (let i = 0; i < totalSteps; i++) {
    steps.push(solver.solve(t));
    if (Math.abs(1 - steps[i]) < 0.001) {
      threshold--;
    } else {
      threshold = 15;
    }

    t += stepSize;
    if (threshold <= 0) {
      steps.push(1);
      break;
    };
  }

  const duration = Math.round((steps.length * 1000) / 30);
  const smooth = steps.map((v, i) => [i / (steps.length - 1), v]);
  const fitted = fitCurve(smooth, 0.005);

  return {
    duration,
    steps,
    smooth,
    fitted,
    totalSteps,
    curve: getLinearCurve(smooth),
  };
};

class StyleSheet {
  prefix: string;
  node: HTMLStyleElement;

  constructor(prefix, node) {
    this.prefix = prefix;
    this.node = node;
  }

  registerMotion(name: string, solver: Solver) {
    const {duration, curve} = computeMotion(solver);
    const computedName = `${this.prefix}-${name}`;
    const style = `
      :root {
        --${computedName}-duration: ${duration / 1000}s;
        --${computedName}-timing-function: ${curve};
      }

      .${computedName} {
        transition-duration: var(--${computedName}-duration);
        transition-timing-function: var(--${computedName}-timing-function);
      }
    `;
    
    this.node.textContent += style;

    return this;
  }
}

const attach = (prefix: string = "motion", node: HTMLElement = document.head): StyleSheet => {
  const style = document.createElement('style');
  style.setAttribute("type", "text/css");
  node.appendChild(style);

  return new StyleSheet(prefix, style);
};

window["motion"] = {
  attach,
  createSpringSolver,
};

attach().registerMotion("plastic", createSpringSolver(1, 30, 10, 5)).registerMotion("glass", createSpringSolver(2.5, 60, 25, 6));
