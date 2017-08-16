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

export interface RoundRect {
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
}


export interface ControlPoints {
	c1: Circle;
	rR1: RoundRect,
	rR2: RoundRect,
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

	constructor(canvas: HTMLCanvasElement,
		c1: Circle,
		rR1?: RoundRect,
		rR2?: RoundRect,
		fill: string = DEFAULT_FILL) {

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.fill = fill;

		rR2 = rR2 || {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			r: 0
		};

		this.controlPoints = RoundShape.getPoints(c1, rR1, rR2);

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

		this.drawRoundRect(this.controlPoints.rR1);
		this.drawRoundRect(this.controlPoints.rR2);

		ctx.restore();
	}

	//metaBall
	drawMetaBall() {
		let
			ctx = this.ctx,
			{
        a, b, c, d, m, n, c1
      } = this.controlPoints;

		ctx.beginPath();
		ctx.arc(c1.x, c1.y, c1.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.quadraticCurveTo(m.x, m.y, d.x, d.y);
		ctx.lineTo(c.x, c.y);
		ctx.quadraticCurveTo(n.x, n.y, b.x, b.y);
		ctx.lineTo(a.x, a.y);
		ctx.closePath();
		ctx.fill();
	}

	//RoundRect
	drawRoundRect(roundRect: RoundRect) {

		if (!roundRect) return;
		let
			ctx = this.ctx,
			{ x, y, w, h, r } = roundRect;

		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;

		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		// this.arcTo(x+r, y);
		ctx.closePath();
		ctx.fill();
	}

  /**
   *
   * @param frames
   */
	transformTo(frames: ConrolePointsFrame[], callback?) {
		let
			tweenGroup = this.tweenGroup,
			coords = this._getCoordsFromPoints(this.controlPoints);

		_.each(tweenGroup.getAll(), (tween) => {
			tween.stop();
		});
		tweenGroup.removeAll();

		_.each(frames, (v, i) => {
			let points = v.points;
			tweenGroup.add(
				new TWEEN.Tween(coords)
					.to(this._getCoordsFromPoints(points), v.duration)
					// easing
					.easing(v.easing || TWEEN.Easing.Quadratic.In)
					.onUpdate(() => {
						_.extend(this.controlPoints, this._getPointsFromCoords(coords));
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
	private _getCoordsFromPoints(points: ControlPoints) {
		return {
			x1: points.c1.x,
			y1: points.c1.y,
			r1: points.c1.r,
			rR1X: points.rR1.x,
			rR1Y: points.rR1.y,
			rR1W: points.rR1.w,
			rR1H: points.rR1.h,
			rR1R: points.rR1.r,
			rR2X: points.rR2.x,
			rR2Y: points.rR2.y,
			rR2W: points.rR2.w,
			rR2H: points.rR2.h,
			rR2R: points.rR2.r
		};
	}

  /**
   *
   * @param coords
   * @returns
   * @private
   */
	private _getPointsFromCoords(coords: any) {
		let c1 = {
			x: coords.x1,
			y: coords.y1,
			r: coords.r1
		},
			rR1 = {
				x: coords.rR1X,
				y: coords.rR1Y,
				w: coords.rR1W,
				h: coords.rR1H,
				r: coords.rR1R
			},
			rR2 = {
				x: coords.rR2X,
				y: coords.rR2Y,
				w: coords.rR2W,
				h: coords.rR2H,
				r: coords.rR2R
			};

		return RoundShape.getPoints(c1, rR1, rR2);
	}

  /**
   * get points which depends on circle1 and circle2
   * @param c1
   * @param c2
   * @param rR1
   * @param rR2
   * @returns
   */
	static getPoints(c1: Circle, rR1: RoundRect, rR2?: RoundRect) {
		let
			D = Math.sqrt(Math.pow(rR1.x + rR1.w / 2 - c1.x, 2) + Math.pow(rR1.y + rR1.h / 2 - c1.y, 2)),
			sinTheta = (rR1.x + rR1.w / 2 - c1.x) / D,
			cosTheta = (rR1.y + rR1.h / 2 - c1.y) / D;

		let basePoints = {
			c1: c1,
			rR1: rR1,
			rR2: rR2,
			a: {
				x: c1.x - c1.r * cosTheta,
				y: c1.y + c1.r * sinTheta
			},
			b: {
				x: c1.x + c1.r * cosTheta,
				y: c1.y - c1.r * sinTheta
			},
			c: {
				x: rR1.x + rR1.h / 2,
				y: rR1.y + rR1.h - 1
			},
			d: {
				x: rR1.x + rR1.w - rR1.h / 2,
				y: rR1.y + rR1.h - 1

			}
		};
		return {
			...basePoints,
			m: {
				x: (c1.x + rR1.x + rR1.w / 2) / 2,
				y: (c1.y + rR1.y + rR1.h / 2) / 2
			},
			n: {
				x: (c1.x + rR1.x + rR1.w / 2) / 2,
				y: (c1.y + rR1.y + rR1.h / 2) / 2
			}
		};
	}
}

export class BasicMetaball {
	radius: number;
	x: number;
	y: number;
	original_radius: number;
	vx: number;
	vy: number;

	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.original_radius = radius;
		this.radius = radius * radius; //保存半径的平方  
	}

	equation(tx: number, ty: number): number {
		let { radius, x, y } = this;
		//Metaball的方程
		return radius / ((x - tx) * (x - tx) + (y - ty) * (y - ty));
	}
}
