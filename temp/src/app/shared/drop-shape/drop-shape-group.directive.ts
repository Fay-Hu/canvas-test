import {ContentChildren, Directive, ElementRef, Input, Output, QueryList, EventEmitter} from "@angular/core";
import * as _ from "underscore";
import {DropShapeDirective} from "./drop-shape.directive";
import {DropShapeService} from "./drop-shape.service";
import {RoundShape, BasicMetaball, RectMetaball} from "./round-shape/round-shape";
import {direction, roundShapeFrams} from "./round-shape/round-shape-frames";


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

  @Output() onAnimationEnd: EventEmitter<any> = new EventEmitter();
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

    this._prependShape(activeEle, this.stage);
    // rect
    this.shape = new RoundShape(
      this.stage,
      new BasicMetaball(l + w / 2, t + h / 2, 0),
      new RectMetaball(l, t, w, h),
      new RectMetaball(0, 0, 0, 0),
      this._options.fillColor
    );

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

      dir = l > preL ? 'right' : l < preL ? 'left' : t > preT ? 'down' : 'up';

    if (this._getStyle(activeEle, 'position') !== 'static') {
      this.stage.style.top = -t + 'px';
      this.stage.style.left = -l + 'px';
    }

    this._prependShape(activeEle, this.stage);
    this.shape.transformTo(roundShapeFrams(l, t, w, h, preL, preT, preW, preH, <direction>dir), () => {
      this.onAnimationEnd.emit(activeEle);
    });
    this.preActiveDropShape = this.activeDropShape;
  }

  private _prependShape(parent, newChild: HTMLElement) {
    _.each(parent.childNodes, (node) => {
      if (node.nodeName === '#text' && node.textContent.trim() !== '') {
        let tempWraper = document.createElement('span');
        tempWraper.appendChild(node);
        parent.appendChild(tempWraper);
      }

      if (node.nodeName !== '#comment' && node.nodeName !== '#text' && this._getStyle(node, 'position') === 'static') {
        node.style.position = 'relative';
      }
    });

    if (parent.firstChild) {
      parent.insertBefore(newChild, parent.firstChild);
    } else {
      parent.appendChild(newChild);
    }
    return parent;
  }

  private _getStyle(element, attr: string) {
    if (typeof window.getComputedStyle != 'undefined') {
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
      // this.shape.controlPoints = getRectPoints(l, t, w, h);
      this.stage.height = this.container.clientHeight;
      this.stage.width = this.container.clientWidth;
      this.shape.draw();
    }
  }

  destory() {
    this.stage.parentNode.removeChild(this.stage);
  }

}
