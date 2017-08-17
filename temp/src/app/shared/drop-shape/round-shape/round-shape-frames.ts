import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';

import { RoundShape, ControlPoints, ControlFrame } from './round-shape';

export type direction = 'left' | 'right' | 'up' | 'down';
export const roundShapeFrams = (x: number, y: number, w: number, h: number, preX: number, preY: number, preW: number, preH: number, dir: direction): ControlFrame[] => {

	let frames = {
		left: () => {
			return [];
		},
		right: () => {
			return [];
		},
		up: () => {
			return [];
		},
		down: () => {
			var
				step_0 = {
					duration: 0,
					easing: TWEEN.Easing.Quadratic.Out,
					state: {
						circle: {
							x: preX + preW / 2,
							y: preY + preH / 2,
							r: preH / 4
						},
						rect1: {
							x: preX,
							y: preY,
							w: w,
							h: h
						},
						rect2: {
							x: x + w / 2,
							y: y + h / 2,
							w: 0,
							h: 0
						}
					}
				},
				step_1 = {
					duration: 1000,
					easing: TWEEN.Easing.Quadratic.In,
					state: {
						circle: {
							x: x + w / 2,
							y: y - preY + h,
							r: 0
						},
						rect1: {
							x: preX + preW / 2,
							y: preY + preH / 2,
							w: 0,
							h: 0
						},
						rect2: {
							x: x ,
							y: y ,
							w: w ,
							h: h
						}
					}
				};
			return [step_0, step_1];
		}
	};

	return frames[dir]();
}
