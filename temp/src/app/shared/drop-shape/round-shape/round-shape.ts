import * as TWEEN from '@tweenjs/tween.js';
import * as _ from 'underscore';


const DEFAULT_FILL = 'rgba(255,255,255,1)';

//Point->[x,y]
type Point = [number, number];

export interface ControlPoints {
  //bezier base points
  a: Point;
  b: Point;
  c: Point;
  d: Point;
  e: Point;
  f: Point;
  g: Point;
  h: Point;
  //bezier control points
  a1: Point;
  b1?: Point;
  c1: Point;
  d1?: Point;
  e1: Point;
  f1?: Point;
  g1: Point;
  h1?: Point;
}
export interface ConrolePointsFrame {
  duration?: number;
  easing?: any;
  points: ControlPoints;
}

export class RoundShape {
  canvas: HTMLCanvasElement;
  ctx: any;
  fill: string;
  controlPoints: ControlPoints;

  constructor(canvas: HTMLCanvasElement, points: ControlPoints, fill: string = DEFAULT_FILL) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fill = fill;
    this.controlPoints = points;
  }

  draw() {
    let ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    ctx.save();
    ctx.fillStyle = this.fill;

    let {
      a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1
    } = this.controlPoints;

    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);

    _.each([b, c, d, e, f, g, h, a], (v, i) => {
      // 97 = unicode('a')
      ctx.quadraticCurveTo(eval(`${String.fromCharCode((97 + i))}1`)[0], eval(`${String.fromCharCode((97 + i))}1`)[1], v[0], v[1]);
    });

    ctx.fill();
    ctx.restore();
  }

  /**
   *
   * @param frames
   */
  transformTo(frames: ConrolePointsFrame[]) {
    TWEEN.removeAll();
    let _animate = (time) => {
      requestAnimationFrame(_animate);
      TWEEN.update(time);
    };

    let
      tweens = [],
      coords = this._getCoords(this.controlPoints);

    _.each(frames, (v, i) => {
      let points = v.points;
      tweens.push(
        new TWEEN.Tween(coords)
          .to(this._getCoords(points), v.duration)
          // easing
          .easing(v.easing || TWEEN.Easing.Quadratic.In)
          .onUpdate(() => {
            _.extend(this.controlPoints, this._getPoints(coords));
            this.draw();
            console.log(i)
          })
      );
      //animation chain
      i > 0 && tweens[i - 1].chain(tweens[i]);
    });
    tweens[0].start();

    requestAnimationFrame(_animate);
  }

  /**
   * coords to points
   * @param points
   */
  private _getCoords(points: ControlPoints) {
    let coords = {};

    _.each(points, (val, key) => {
      coords[key + 'X'] = val[0];
      coords[key + 'Y'] = val[1];
    });
    return coords;
  }

  /**
   * points to coords
   * @param coords
   */
  private _getPoints(coords: any) {
    let points = JSON.parse(JSON.stringify(this.controlPoints));

    _.each(points, (val, key) => {
      points[key] = [coords[key + 'X'], coords[key + 'Y']];
    });
    return points;
  }
}
