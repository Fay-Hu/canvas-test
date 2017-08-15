import * as TWEEN from '@tweenjs/tween.js';
import * as _ from 'underscore';


const DEFAULT_FILL = 'rgba(255,255,255,1)';


export interface Point {
	x: number,
	y: number
}

export interface Circle {
	x: number,
	y: number,
	r: number
}

export interface ControlPoints {
	c1: Circle;
	c2: Circle;
	//bezier control points
	a: Point;
	b: Point;
	c: Point;
	d: Point;
	m: Point;
	n: Point;
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
	tweenGroup: any = new TWEEN.Group();

	constructor(canvas: HTMLCanvasElement, c1: Circle, c2: Circle, fill: string = DEFAULT_FILL) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.fill = fill;

		this.controlPoints = RoundShape.getPoints(c1, c2);

		let _animate = (time) => {
			requestAnimationFrame(_animate);
			TWEEN.update(time);
		};
		requestAnimationFrame(_animate);
	}

	draw() {
		let ctx = this.ctx;

		ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		ctx.save();
		ctx.fillStyle = this.fill;

		let {
      a, b, c, d, m, n, c1, c2
    } = this.controlPoints;

		ctx.beginPath();
		ctx.arc(c1.x, c1.y, c1.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(c2.x, c2.y, c2.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.quadraticCurveTo(m.x, m.y, d.x, d.y);
		ctx.lineTo(c.x, c.y);
		ctx.quadraticCurveTo(n.x, n.y, b.x, b.y);
		ctx.lineTo(a.x, a.y);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

  /**
   *
   * @param frames
   */
	transformTo(frames: ConrolePointsFrame[], callback?) {
		let
			tweenGroup = this.tweenGroup,
			coords = this._getCoords(this.controlPoints);

		_.each(tweenGroup.getAll(), (tween) => {
			tween.stop();
		});
		tweenGroup.removeAll();

		_.each(frames, (v, i) => {
			let points = v.points;
			tweenGroup.add(
				new TWEEN.Tween(coords)
					.to(this._getCoords(points), v.duration)
					// easing
					.easing(v.easing || TWEEN.Easing.Quadratic.In)
					.onUpdate(() => {
						_.extend(this.controlPoints, RoundShape.getPoints(
							{
								x: coords.x1,
								y: coords.y1,
								r: coords.r1
							},
							{
								x: coords.x2,
								y: coords.y2,
								r: coords.r2
							}
						));
						this.draw();
					})
					.onComplete(() => {
						if (i === frames.length - 1) {
							typeof callback === 'function' && callback.call(this);
						}
					})
			);
			//animation chain
			i > 0 && tweenGroup.getAll()[i - 1].chain(tweenGroup.getAll()[i]);
		});
		tweenGroup.getAll()[0].start();

	}

  /**
   * coords to points
   * @param points
   */
	private _getCoords(points: ControlPoints) {
		return {
			x1: points.c1.x,
			y1: points.c1.y,
			r1: points.c1.r,
			x2: points.c2.x,
			y2: points.c2.y,
			r2: points.c2.r
		};
	}


	/**
	 * get points whitch depends on circle1 and circle2
	 * @param c1 {Circle}
	 * @param c2 {Circle}
	 */
	static getPoints(c1: Circle, c2: Circle) {
		let
			D = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2)),
			sinTheta = (c2.x - c1.x) / D,
			cosTheta = (c2.y - c1.y) / D;

		let basePoints = {
			c1: c1,
			c2: c2,
			a: {
				x: c1.x - c1.r * cosTheta,
				y: c1.y + c1.r * sinTheta
			},
			b: {
				x: c1.x + c1.r * cosTheta,
				y: c1.y - c1.r * sinTheta
			},
			c: {
				x: c2.x + c2.r * cosTheta,
				y: c2.y - c2.r * sinTheta
			},
			d: {
				x: c2.x - c2.r * cosTheta,
				y: c2.y + c2.r * sinTheta
			}
		};
		return {
			...basePoints,
			m: {
				x: (c2.x + c1.x)/2,
				y: (c2.y + c1.y)/2
			},
			n: {
				x: (c2.x + c1.x)/2,
				y: (c2.y + c1.y)/2
			}
			// m: {
			// 	x: basePoints.a.x + D / 2 * sinTheta,
			// 	y: basePoints.a.y + D / 2 * cosTheta
			// },
			// n: {
			// 	x: basePoints.b.x + D / 2 * sinTheta,
			// 	y: basePoints.b.y + D / 2 * cosTheta
			// }
		};
	}
}
