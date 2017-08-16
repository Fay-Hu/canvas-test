import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';

import {RoundShape, ControlPoints, ConrolePointsFrame} from './round-shape';

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
        var
          state_0 = {
            duration: 0,
            easing: TWEEN.Easing.Quadratic.Out,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: preY + preH / 2,
              r: h / 2*1.2,
            }, {
              x: preX,
              y: preY,
              w: preW,
              h: preH,
              r: 0
            }, {
              x: x + w / 2,
              y: y + h / 2,
              w: 0,
              h: 0,
              r: h / 2
            })
          },
          state_1 = {
            duration: 400,
            easing: TWEEN.Easing.Quadratic.In,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: y - h/2,
              r: h / 2/4,
            }, {
              x: preX + preW/4,
              y: preY,
              w: preW/2,
              h: preH,
              r: preH/2
            }, {
              x: x + w/4,
              y: y + h/4,
              w: w/2,
              h: h/2,
              r: h / 2
            })
          },
          state_2 = {
            duration: 400,
            easing: TWEEN.Easing.Quadratic.In,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: y - h/2,
              r: h / 2/4,
            }, {
              x: preX + preW/2,
              y: preY + preH/2,
              w: 0,
              h: 0,
              r: 0
            }, {
              x: x,
              y: y,
              w: w,
              h: h,
              r: 0
            })
          };
        return [state_0, state_1,state_2];
      },
      down: () => {
        var
          state_0 = {
            duration: 0,
            easing: TWEEN.Easing.Quadratic.Out,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: preY + preH / 2,
              r: h / 2*1.2,
            }, {
              x: preX,
              y: preY,
              w: preW,
              h: preH,
              r: 0
            }, {
              x: x + w / 2,
              y: y + h / 2,
              w: 0,
              h: 0,
              r: h / 2
            })
          },
          state_1 = {
            duration: 400,
            easing: TWEEN.Easing.Quadratic.In,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: y + h/2,
              r: h / 2/4,
            }, {
              x: preX + preW/4,
              y: preY,
              w: preW/2,
              h: preH,
              r: preH/2
            }, {
              x: x + w/4,
              y: y + h/4,
              w: w/2,
              h: h/2,
              r: h / 2
            })
          },
          state_2 = {
            duration: 400,
            easing: TWEEN.Easing.Quadratic.In,
            points: RoundShape.getPoints({
              x: preX + preW / 2,
              y: y + h/2,
              r: h / 2/4,
            }, {
              x: preX + preW/2,
              y: preY + preH/2,
              w: 0,
              h: 0,
              r: 0
            }, {
              x: x,
              y: y,
              w: w,
              h: h,
              r: 0
            })
          };
        return [state_0, state_1,state_2];
      }
    };

    return frames[dir]();

  }
  ;
