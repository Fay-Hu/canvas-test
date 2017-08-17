import * as TWEEN from '@tweenjs/tween.js';
import * as _ from 'underscore';

const DEFAULT_FILL = 'rgba(255,255,255,1)';

export type ControlPoints  = {
  circle: BasicMetaball;
  rect1: RectMetaball,
  rect2: RectMetaball
}

export interface ControlFrame {
  duration?: number;
  easing?: any;
  state: any;
}

export class RoundShape {
  canvas: HTMLCanvasElement;
  tempCanvas: HTMLCanvasElement;
  ctx: any;
  fill: string;
  tweenGroup: any = new TWEEN.Group();

  controlPoints: ControlPoints;
  threshold: number = 64;

  constructor(canvas: HTMLCanvasElement,
              circle: BasicMetaball,
              rect1: RectMetaball,
              rect2?: RectMetaball,
              fill: string = DEFAULT_FILL) {

    this.canvas = canvas;
    this.tempCanvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d');
    this.fill = fill;

    this.controlPoints = {
      circle: circle,
      rect1: rect1,
      rect2: rect2
    };
    let _animate = (time) => {
      requestAnimationFrame(_animate);
      TWEEN.update(time);
    };
    requestAnimationFrame(_animate);
  }

  draw() {
    let
      ctx = this.ctx,
      {rect1, rect2} = this.controlPoints;

    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    ctx.save();
    ctx.fillStyle = this.fill;

    this.metabalize();
    ctx.restore();
  }

  metabalize() {
    let
      tempCtx = this.tempCanvas.getContext('2d'),
      width = this.canvas.clientWidth,
      height = this.canvas.clientHeight,
      {circle, rect1, rect2} = this.controlPoints;

    tempCtx.clearRect(0, 0, width, height);

    this.drawRect(rect1, tempCtx);
    this.drawRect(rect2, tempCtx);

    let
      imgData = tempCtx.getImageData(0, 0, width, height),
      data = _.toArray(_.groupBy(imgData.data, (v, i) => {
        return Math.floor(i / 4)
      }));


    _.each(data, (v, i) => {
      let
        y = Math.ceil(i / imgData.width),
        x = parseInt(i % imgData.width),
        f1 = circle.equation(x, y),
        f2 = rect1.equation(x, y),
        f3 = rect2.equation(x, y),
        f = f1 + f2 + f3;

      if (f > this.threshold) {
        v = [255, 255, 255, 255];
      } else {
        v = [255, 255, 255, 0];
      }
    });

    tempCtx.clearRect(0, 0, width, height);
    tempCtx.putImageData(_.extend(imgData,{data:_.flatten(data)}), 0, 0);
    this.ctx.drawImage(this.tempCanvas, 0, 0, width, height);
  }

  drawRect(rect: RectMetaball, ctx: any = this.ctx) {
    let
      {x, y, w, h} = rect;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }

  /**
   *
   * @param frames
   */
  transformTo(frames: ControlFrame[], callback?) {
    let
      tweenGroup = this.tweenGroup,
      coords = this._getCoordsFromPoints(this.controlPoints);

    _.each(tweenGroup.getAll(), (tween) => {
      tween.stop();
    });
    tweenGroup.removeAll();

    _.each(frames, (v, i) => {
      tweenGroup.add(
        new TWEEN.Tween(coords)
          .to(v.state, v.duration)
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
    let {circle, rect1, rect2} = points;
    return {
      circleX: circle.x,
      circleY: circle.y,
      circleR: circle.r,
      rect1X: rect1.x,
      rect1Y: rect1.y,
      rect1W: rect1.w,
      rect1H: rect1.h,
      rect2X: rect2.x,
      rect2Y: rect2.y,
      rect2W: rect2.w,
      rect2H: rect2.h,
    };
  }

  /**
   *
   * @param coords
   * @returns
   * @private
   */
  private _getPointsFromCoords(coords: any) {
    let {circleX, circleY, circleR, rect1X, rect1Y, rect1W, rect1H, rect2X, rect2Y, rect2W, rect2H} = coords;

    return {
      circle: {
        x: circleX,
        y: circleY,
        r: circleR
      },
      rect1: {
        x: rect1X,
        y: rect1Y,
        w: rect1W,
        h: rect1H
      },
      rect2: {
        x: rect2X,
        y: rect2Y,
        w: rect2W,
        h: rect2H
      }
    };
  }

}

export class BasicMetaball {
  r: number;
  x: number;
  y: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.r = radius;
  }

  equation(tx: number, ty: number): number {
    let {r, x, y} = this;

    return r * r / ((x - tx) * (x - tx) + (y - ty) * (y - ty));
  }
}

export class RectMetaball {
  x: number;
  y: number;
  ox: number;
  oy: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  equation(tx: number, ty: number): number {
    let {w, h, x, y} = this;

    let
      ox = x + w / 2,
      oy = y + h / 2;

    if (tx > ox - w / 2 && tx < ox + w / 2) {
      return h * h / (4 * (ty - oy) * (ty - oy));
    } else {
      return w * w / (4 * (tx - ox) * (tx - ox));
    }
  }
}
