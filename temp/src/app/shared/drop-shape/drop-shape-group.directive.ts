import {
  ContentChildren, Directive, ElementRef, Input, QueryList
} from '@angular/core';
import * as _ from 'underscore';
import { DropShapeDirective } from './drop-shape.directive';
import { DropShapeService } from './drop-shape.service';
import { RoundShape} from './round-shape/round-shape';
import { getRectPoints, roundShapeFrams } from './round-shape/round-shape-frames';

@Directive({
  selector: '[epgDropShapeGroup]'
})
export class DropShapeGroupDirective {

  stage: HTMLCanvasElement;
  stageContext: any;
  container: HTMLElement;

  shape: RoundShape;

  //options
  _options: any = {};
  get epgDropShapeGroup() {
    return this._options;
  }
  @Input()
  set epgDropShapeGroup(value: any) {
    this._options = _.extend(DropShapeGroupDirective.Defaults, value);
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
    this._options = _.extend(this._options, DropShapeGroupDirective.Defaults);
  }

  static get Defaults() {
    return {
      fillColor: 'rgba(255,255,255,1)'
    };
  }

  ngAfterViewInit() {
    this.stage.height = this.container.clientHeight;
    this.stage.width = this.container.clientWidth;

    this.activeDropShape = this.dropShapes.filter((v) => {
      return v.epgDropShape;
    })[0];

    let
      containerEle = this.el.nativeElement,
      activeEle = this.activeDropShape.el.nativeElement,
      w = activeEle.offsetWidth,
      h = activeEle.offsetHeight,
      l = activeEle.offsetLeft - containerEle.offsetLeft,
      t = activeEle.offsetTop - containerEle.offsetTop;

    // rectØ
    this.shape = new RoundShape(this.stage, getRectPoints(l, t, w, h), this._options.fillColor);

    this.shape.draw();
    this.preActiveDropShape = this.activeDropShape;

    this.dropShapeService.change.subscribe((dropShape: DropShapeDirective) => {
      dropShape.epgDropShape && this.update(dropShape);
    })
  }

  update(dropShape: DropShapeDirective) {
    this.activeDropShape = dropShape;

    let
      activeEle = this.activeDropShape.el.nativeElement,
      preActiveEle = this.preActiveDropShape.el.nativeElement,

      preW = preActiveEle.offsetWidth,
      preH = preActiveEle.offsetHeight,
      preL = preActiveEle.offsetLeft - this.el.nativeElement.offsetLeft,
      preT = preActiveEle.offsetTop - this.el.nativeElement.offsetTop,

      w = activeEle.offsetWidth,
      h = activeEle.offsetHeight,
      l = activeEle.offsetLeft - this.el.nativeElement.offsetLeft,
      t = activeEle.offsetTop - this.el.nativeElement.offsetTop,

      dir = <1 | -1>t > preT ? 1 : -1;

    this.shape.transformTo(roundShapeFrams(l, t, w, h, preL, preT, preW, preH, dir));
    this.preActiveDropShape = this.activeDropShape;
  }

  destory() {
    this.stage.parentNode.removeChild(this.stage);
  }

}
