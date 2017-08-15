import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';

import { RoundShape, ControlPoints, ConrolePointsFrame } from './round-shape';

export type direction = 'left' | 'right' | 'up' | 'down';
export const roundShapeFrams = (x: number, y: number, w: number, h: number, preX: number, preY: number, preW: number, preH: number, dir: direction): ConrolePointsFrame[] => {

	let frames = {
		left: () => {
			return [];
		},
		right: () => {
			return [];
		},
		up: () => {
			return frames['down']();
		},
		down: () => {
			var
				state_1 = {
					duration: 500,
					easing: TWEEN.Easing.Quadratic.Out,
					points: RoundShape.getPoints({
						x: preX + preW / 2,
						y: preY + preH / 2,
						r: 0,
					}, {
							x: x + w / 2,
							y: y + h / 2,
							r: h / 3
						})
				};
			return [state_1];
		}
	};

	return frames[dir]();

};
