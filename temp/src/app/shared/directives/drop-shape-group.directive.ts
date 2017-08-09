import {
  Directive, ElementRef, Input, ContentChildren, OnInit, AfterViewInit, OnChanges, QueryList
} from '@angular/core';

import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';
import { DropShapeDirective } from './drop-shape.directive';

const DEFAULT_FILL = 'rgba(255,255,255,.9)';

@Directive({
  selector: '[appDropShapeGroup]'
})
export class DropShapeGroupDirective {

  stage: HTMLCanvasElement;
  stageContext: any;
  container: HTMLElement;

  circle: RoundRect;

  //options
  _appDropShapeGroup;
  get appDropShapeGroup() {
    return this._appDropShapeGroup;
  }
  @Input()
  set appDropShapeGroup(value: any) {
    this._appDropShapeGroup = value;
  }

  @ContentChildren(DropShapeDirective) dropShapes: QueryList<DropShapeDirective>;
  activeDropShape: DropShapeDirective;
  preActiveDropShape: DropShapeDirective;

  constructor(private el: ElementRef) {
    this.container = this.el.nativeElement;
    this.stage = document.createElement('canvas');
    this.stage.style.position = 'absolute';
    this.stage.style.pointerEvents = 'none';
    this.container.appendChild(this.stage);
  }

  ngOnInit() {
    this.stage.height = this.container.clientHeight;
    this.stage.width = this.container.clientWidth;
  }

  ngAfterViewInit() {
    this.activeDropShape = this.dropShapes.filter((v) => {
      return v.appDropShapeActived;
    })[0];

    let
      containerEle = this.el.nativeElement,
      activeEle = this.activeDropShape.el.nativeElement;

    this.circle = new RoundRect(this.stage, activeEle.offsetLeft - containerEle.offsetLeft, activeEle.offsetTop - containerEle.offsetTop, activeEle.clientWidth, activeEle.clientHeight, [0, 0, 0, 0]);

    this.circle.draw();
    this.preActiveDropShape = this.activeDropShape;

    setTimeout(() => { this.update(); }, 1000);
  }

  ngOnChanges() {
    //this.update();
  }

  update() {
    this.activeDropShape = this.dropShapes.toArray()[1];
    let
      activeEle = this.activeDropShape.el.nativeElement,
      preActiveEle = this.preActiveDropShape.el.nativeElement,

      preW = preActiveEle.clientWidth,
      preH = preActiveEle.clientHeight,
      preL = preActiveEle.offsetLeft - this.el.nativeElement.offsetLeft,
      preT = preActiveEle.offsetTop - this.el.nativeElement.offsetTop,

      w = activeEle.clientWidth,
      h = activeEle.clientHeight,
      l = activeEle.offsetLeft - this.el.nativeElement.offsetLeft,
      t = activeEle.offsetTop - this.el.nativeElement.offsetTop,

      //transform states
      transforms = [
        { duration: 500, circle: new RoundRect(this.stage, preL + (preW - preW / 2) / 2, preT, preW / 2, preH, [preH / 2, preH / 2, preH / 2, preH / 2]) },
        { duration: 300, circle: new RoundRect(this.stage, preL + (preW - preW / 2) / 2, t - preT + (t - preT < 0 ? preH : -preH), w / 2, preH + h, [h / 2, h, h, h / 2]) },
        { duration: 300, circle: new RoundRect(this.stage, l + (w - w / 2) / 2, t, w / 2, h, [h / 2, h / 2, h / 2, h / 2]) },
        { duration: 500, circle: new RoundRect(this.stage, l, t, w, h, [0, 0, 0, 0]) }
      ];
    this.circle.transformTo(transforms);
    this.preActiveDropShape = this.activeDropShape;
  }

  destory() {
    this.stage.parentNode.removeChild(this.stage);
  }

}

class RoundRect {
  canvas: HTMLCanvasElement;
  ctx: any;
  x: number;
  y: number;
  w: number;
  h: number;
  r0: number;
  r1: number;
  r2: number;
  r3: number;
  fill: string;
  scaleX: number = 1;
  scaleY: number = 1;

  constructor(canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number, r: [number, number, number, number], fill: string = DEFAULT_FILL) {
    _.extend(this, {
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      x: x,
      y: y,
      w: w,
      h: h,
      r0: r[0],
      r1: r[1],
      r2: r[2],
      r3: r[3],
      fill: fill
    });
  }

  draw() {
    let ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    ctx.save();
    ctx.fillStyle = this.fill;
    let { x, y, w, h, r0, r1, r2, r3 } = this;
    ctx.beginPath();
    ctx.moveTo(x + r0, y);
    ctx.arcTo(x + w, y, x + w, y + h, r0);
    ctx.arcTo(x + w, y + h, x, y + h, r1);
    ctx.arcTo(x, y + h, x, y, r2);
    ctx.arcTo(x, y, x + w, y, r3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * 
   * @param targetState 
   */
  transformTo(circles: any[]) {
    let _animate = (time) => {
      requestAnimationFrame(_animate);
      TWEEN.update(time);
    };

    let
      tweens = [],
      coords = {
        x: this.x, y: this.y,
        r0: this.r0, r1: this.r1, r2: this.r2, r3: this.r3,
        w: this.w, h: this.h
      };

    _.each(circles, (v, i) => {
      let circle = v.circle;
      tweens.push(
        new TWEEN.Tween(coords)
          .to(circle, v.duration)
          // easing
          .easing(v.easing || TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            _.extend(this, coords);
            this.draw();
          })
      );
      //动画链
      i > 0 && tweens[i - 1].chain(tweens[i]);
    });
    tweens[0].start();

    requestAnimationFrame(_animate);
  }

}
