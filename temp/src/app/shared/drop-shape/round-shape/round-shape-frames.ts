import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';

import { RoundShape, ControlPoints, ConrolePointsFrame } from './round-shape';

export const roundShapeFrams = (
	x: number, y: number, W: number, H: number, preX: number, preY: number, preW: number, preH: number, dir: number
): ConrolePointsFrame[] => {
	let
		state_1 = {
			duration: 200,
			easing: TWEEN.Easing.Quadratic.Out,
			points: (_ => {
				let
					// simple deep copy
					state = JSON.parse(JSON.stringify(getRectPoints(preX, preY, preW, preH))),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([a, c, f, h, a1, c1], (v) => {
					v[0] += preW * .2;
				});

				_.each([b, d, e, g, e1, g1], (v) => {
					v[0] -= preW * .2;
				});

				b1[1] -= preH * .2;
				h1[1] -= preH * .5;

				d1[1] += preH * .5;
				f1[1] += preH * .2;

				return state;
			})(_)
		},
		state_2 = {
			duration: 200,
			points: (_ => {
				let
					state = JSON.parse(JSON.stringify(state_1.points)),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				b1[1] = preY;
				b[0] = preW / 2;
				c[0] = preW / 2;

				_.each([a, d, a1], (v) => {
					v[1] += preH * .1;
				});

				_.each([h, e, e1], (v) => {
					v[1] -= preH * .1;
				});

				f1[1] += preH * .6;
				return state;
			})(_)
		},
		state_3 = {
			duration: 100,
			points: (_ => {
				let
					state = JSON.parse(JSON.stringify(state_2.points)),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([a, d], (v) => {
					v[1] += preH * .1;
				});

				_.each([h, e, e1], (v) => {
					v[1] -= preH * .1;
				});

				f1[1] += H * dir;

				return state;
			})(_)
		},
		state_4 = {
			duration: 100,
			points: (_ => {
				let
					state = JSON.parse(JSON.stringify(state_3.points)),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				a[0] += W * .1;
				a1[0] += W * .1;
				d[0] -= W * .1;
				_.each([g, g1, h, h1, a], (v) => {
					v[0] = a[0];
					v[1] = a[1];
				});
				_.each([e, d1, f, e1], (v) => {
					v[0] = d[0];
					v[1] = d[1];
				});

				_.each([a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1], (v) => {
					v[1] += (y - preY) / 2;
				});
				return state;
			})(_)
		},
		state_5 = {
			duration: 100,
			points: (_ => {
				let
					state = JSON.parse(JSON.stringify(state_4.points)),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1], (v) => {
					v[1] += (y - preY) / 2;
				});
				f1[1] -= H * dir;
				return state;
			})(_)
		},
		state_6 = {
			duration: 100,
			points: (_ => {
				let
					state = JSON.parse(JSON.stringify(state_5.points)),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([g, g1, h, h1, a, d, e, d1, e1], (v) => {
					v[1] = y + H / 2;
				});

				return state;
			})(_)
		},
		state_7 = {
			duration: 0,
			points: (_ => {
				let
					state = getRectPoints(x, y, W, H),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([a, c, f, h, a1, c1], (v) => {
					v[0] += W * .3;
				});

				_.each([b, d, e, g, e1, g1], (v) => {
					v[0] -= W * .3;
				});

				h1[0] += W * .1;
				h1[1] -= H * .5;
				d1[0] -= W * .1;
				d1[1] += H * .5;
				return state;
			})(_)
		},
		state_8 = {
			duration: 100,
			points: (_ => {
				let
					state = getRectPoints(x, y, W, H),
					{ a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

				_.each([a, c, f, h, a1, c1], (v) => {
					v[0] += W * .1;
				});

				_.each([b, d, e, g, e1, g1], (v) => {
					v[0] -= W * .1;
				});
				h1[1] -= H * .5;
				d1[1] += H * .5;
				return state;
			})(_)
		},
		state_end = {
			duration: 100,
			points: getRectPoints(x, y, W, H)
		};
	return [state_1, state_2, state_3, state_4, state_5, state_7, state_8, state_end];
};


/**
 *
 * @param x recy.x
 * @param y recy.y
 * @param w recy.width
 * @param h recy.height
 */
export function getRectPoints(x: number, y: number, w: number, h: number): ControlPoints {
	return {
		a: [x, y], a1: [x, y],
		b: [x + w / 2, y], b1: [x + w / 2, y],
		c: [x + w / 2, y], c1: [x + w / 2, y],
		d: [x + w, y], d1: [x + w, y],
		e: [x + w, y + h], e1: [x + w, y + h],
		f: [x + w / 2, y + h], f1: [x + w / 2, y + h],
		g: [x + w / 2, y + h], g1: [x + w / 2, y + h],
		h: [x, y + h], h1: [x, y + h]
	};
}