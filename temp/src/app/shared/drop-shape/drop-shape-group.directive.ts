import {
  ContentChildren, Directive, ElementRef, Input, QueryList
} from '@angular/core';
import * as _ from 'underscore';
import { DropShapeDirective } from './drop-shape.directive';
import { DropShapeService } from './drop-shape.service';
import { RoundShape } from './round-shape/round-shape';
import { getRectPoints, roundShapeFrams } from './round-shape/round-shape-frames';

type direction = 'left' | 'right' | 'up' | 'down';

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


    if (this._getStyle(this.container, 'position') === 'static') {
      this.container.style.position = 'relative';
    }

    this.activeDropShape = this.dropShapes.filter((v) => {
      return v.epgDropShape;
    })[0];

    let
      containerEle = this.el.nativeElement,
      activeEle = this.activeDropShape.el.nativeElement,
      w = activeEle.offsetWidth,
      h = activeEle.offsetHeight,
      l = activeEle.offsetLeft,
      t = activeEle.offsetTop;

    if (this._getStyle(activeEle, 'position') !== 'static') {
      this.stage.style.top = -t + 'px';
      this.stage.style.left = -l + 'px';
    } else {
      this.stage.style.top = '0px';
      this.stage.style.left = '0px';
    }
    console.log(t)

    this._prependChild(activeEle, this.stage);
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
      preL = preActiveEle.offsetLeft,
      preT = preActiveEle.offsetTop,

      w = activeEle.offsetWidth,
      h = activeEle.offsetHeight,
      l = activeEle.offsetLeft,
      t = activeEle.offsetTop,

      dir = <1 | -1>t > preT ? 1 : -1;

    if (this._getStyle(activeEle, 'position') !== 'static') {
      this.stage.style.top = -t + 'px';
      this.stage.style.left = -l + 'px';
    }

    this._prependChild(activeEle, this.stage);
    this.shape.transformTo(roundShapeFrams(l, t, w, h, preL, preT, preW, preH, dir));
    this.preActiveDropShape = this.activeDropShape;
  }

  private _prependChild(parent, newChild: HTMLElement) {
    if (parent.firstChild) {
      if (parent.firstChild.nodeName === '#text') {
        let tempWraper = document.createElement('span');
        tempWraper.appendChild(parent.firstChild);
        parent.appendChild(tempWraper);
      }
      parent.firstChild.style.position = 'relative';
      parent.insertBefore(newChild, parent.firstChild);
    } else {
      parent.appendChild(newChild);
    }
    return parent;
  }

  private _getStyle(element, attr: string) {
    if (typeof
      window.getComputedStyle != 'undefined') {
      return window.getComputedStyle(element, null)[attr];
    } else if (element.currentStyle) {
      return element.currentStyle[attr];
    }
  }

  resize(force?: boolean) {
    let
      containerEle = this.el.nativeElement,
      activeEle = this.activeDropShape.el.nativeElement,
      w = activeEle.offsetWidth,
      h = activeEle.offsetHeight,
      l = activeEle.offsetLeft - containerEle.offsetLeft,
      t = activeEle.offsetTop - containerEle.offsetTop;

    if (force) {
      this.shape.controlPoints = getRectPoints(l, t, w, h);
      this.stage.height = this.container.clientHeight;
      this.stage.width = this.container.clientWidth;
      this.shape.draw();
    }
  }

  destory() {
    this.stage.parentNode.removeChild(this.stage);
  }

}
