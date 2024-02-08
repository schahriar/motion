// https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
export const fitCurve = (points: number[][], epsilon: number): number[][] => {
  let maxDistance = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const point = points[i];
    const lineStart = points[0];
    const lineEnd = points[points.length - 1];

    let dx = lineEnd[0] - lineStart[0];
    let dy = lineEnd[1] - lineStart[1];
    const mag = Math.hypot(dx, dy);

    if (mag > 0) {
      dx /= mag;
      dy /= mag;
    }
    const pvx = point[0] - lineStart[0];
    const pvy = point[1] - lineStart[1];
    const pvDot = dx * pvx + dy * pvy;
    const ax = pvx - pvDot * dx;
    const ay = pvy - pvDot * dy;
    const distance = Math.hypot(ax, ay);

    if (distance > maxDistance) {
      index = i;
      maxDistance = distance;
    }
  }

  if (maxDistance > epsilon) {
    return [
      ...fitCurve(points.slice(0, index + 1), epsilon).slice(0, -1),
      ...fitCurve(points.slice(index), epsilon)
    ];
  }

  return [points[0], points[points.length - 1]];
}