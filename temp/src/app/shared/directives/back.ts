import { Directive, ElementRef, Input } from '@angular/core';
import * as _ from 'underscore';
import * as TWEEN from '@tweenjs/tween.js';

const DEFAULT_FILL = '#fff';

@Directive({
  selector: '[appDropShape]'
})
export class DropShapeDirective {

  stage: HTMLCanvasElement;
  stageContext: any;
  container: HTMLElement;

  _appDropShape;
  get appDropShape() {
    return this._appDropShape;
  }
  @Input()
  set appDropShape(value: any) {
    this._appDropShape = value;
  }

  constructor(private el: ElementRef) {
    this.container = this.el.nativeElement;
    this.stage = document.createElement('canvas');
    this.stage.style.position = 'absolute';
    this.container.appendChild(this.stage);
  }

  ngOnInit() {
    this.stage.height = this.container.clientHeight;
    this.stage.width = this.container.clientWidth;

    let
      circle = new Circle(this.stage, 60, 20, 60),
      transformCicle = new Circle(this.stage, 60, 20, 20);

    transformCicle.scaleX = .8;
    circle.draw();
    //circle.transformTo(transformCicle);
  }

}

class Circle {
  canvas: HTMLCanvasElement;
  ctx: any;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  fill: string;
  scaleX: number = 1;
  scaleY: number = 1;

  constructor(canvas: HTMLCanvasElement, x: number, y: number, r: number, fill: string = DEFAULT_FILL) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
  }

  draw() {
    let ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    ctx.save();
    ctx.scale(this.scaleX, this.scaleY);
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  clear() {

  }

  /**
   * 
   * @param targetState 
   */
  transformTo(targetState: Circle) {
    let _animate = (time) => {
      requestAnimationFrame(_animate);
      TWEEN.update(time);
    };

    let
      coords = { x: this.x, y: this.y, r: this.r, scaleX: this.scaleX, scaleY: this.scaleY },
      tween = new TWEEN.Tween(coords)
        .to({
          x: targetState.x, y: targetState.y, r: targetState.r, scaleX: targetState.scaleX, scaleY: targetState.scaleY
        })
        // easing
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          _.extend(this, coords);
          this.draw();
        })
        .start();

    requestAnimationFrame(_animate);
  }
}