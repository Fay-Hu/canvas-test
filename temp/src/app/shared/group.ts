import {
  ContentChildren, Directive, ElementRef, Input, QueryList
} from '@angular/core';
import * as _ from 'underscore';
import { DropShapeDirective } from './drop-shape.directive';
import { DropShapeService } from './drop-shape.service';
import { RoundShape, ControlPoints } from './round-shape';

@Directive({
  selector: '[appDropShapeGroup]'
})
export class DropShapeGroupDirective {

  stage: HTMLCanvasElement;
  stageContext: any;
  container: HTMLElement;

  shape: RoundShape;

  //options
  _options;
  get appDropShapeGroup() {
    return this._options;
  }
  @Input()
  set appDropShapeGroup(value: any) {
    this._options = value;
  }

  @ContentChildren(DropShapeDirective)
  dropShapes: QueryList<DropShapeDirective>;

  activeDropShape: DropShapeDirective;
  preActiveDropShape: DropShapeDirective;

  constructor(private el: ElementRef, private dropShapeService: DropShapeService) {
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
      activeEle = this.activeDropShape.el.nativeElement,
      w = activeEle.clientWidth,
      h = activeEle.clientHeight,
      l = activeEle.offsetLeft - containerEle.offsetLeft,
      t = activeEle.offsetTop - containerEle.offsetTop;

    // rect
    this.shape = new RoundShape(this.stage, this._getRectPoints(l, t, w, h));

    this.shape.draw();
    this.preActiveDropShape = this.activeDropShape;

    this.dropShapeService.change.subscribe((dropShape: DropShapeDirective) => {
      dropShape.appDropShapeActived && this.update(dropShape);
    })
  }

  update(dropShape: DropShapeDirective) {
    this.activeDropShape = dropShape;

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

      dir = t > preT ? 1 : -1,

      //transform frames
      state_1 = {
        duration: 300,
        points: (_ => {
          // simple deep copy
          let
            state = JSON.parse(JSON.stringify(this.shape.controlPoints)),
            { a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

          _.each([a, c, f, h], (v) => {
            v[0] += preW * .2;
          });

          _.each([b, d, e, g], (v) => {
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
        duration: 300,
        points: (_ => {
          // simple deep copy
          let
            state = JSON.parse(JSON.stringify(state_1.points)),
            { a, b, c, d, e, f, g, h, a1, b1, c1, d1, e1, f1, g1, h1 } = state;

          b1[1] = preT;
          b[0] = preW / 2;
          c[0] = preW / 2;

          _.each([a, d], (v) => {
            v[1] += preH * .05;
          });

          _.each([h, e], (v) => {
            v[1] -= preH * .05;
          });

          a1 = [a[0], a[1]];
          c1 = [d[0], c[1]];
          e1 = [f[0], e[1]];
          g1 = [h[0], g[1]];

          f1[1] += preH * .4;
          console.log(a, a1)
          return state;
        })(_)
      },
      state_end = {
        duration: 300,
        points: this._getRectPoints(l, t, w, h)
      };

    this.shape.transformTo([state_1, state_2]);
    this.preActiveDropShape = this.activeDropShape;
  }

  destory() {
    this.stage.parentNode.removeChild(this.stage);
  }

  /**
   *
   * @param l rect.x
   * @param t rect.y
   * @param w rect.width
   * @param h rect.height
   */
  private _getRectPoints(l: number, t: number, w: number, h: number): ControlPoints {
    return {
      a: [l, t], a1: [l, t],
      b: [l + w / 2, t], b1: [l + w / 2, t],
      c: [l + w / 2, t], c1: [l + w / 2, t],
      d: [l + w, t], d1: [l + w, t],
      e: [l + w, t + h], e1: [l + w, t + h],
      f: [l + w / 2, t + h], f1: [l + w / 2, t + h],
      g: [l + w / 2, t + h], g1: [l + w / 2, t + h],
      h: [l, t + h], h1: [l, t + h]
    };
  }

}
