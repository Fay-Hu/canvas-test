import { DropShapeService } from './drop-shape.service';
import { DropShapeGroupDirective } from './drop-shape-group.directive';
import {
  Directive, ElementRef, Input, Output, Optional, OnChanges, Renderer2, EventEmitter, SimpleChanges
} from '@angular/core';


@Directive({
  selector: '[epgDropShape]'
})
export class DropShapeDirective {
  @Input() epgDropShape: boolean;

  constructor(
    public el: ElementRef,
    private dropShapeService:DropShapeService
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    changes['epgDropShape'].firstChange || this.dropShapeService.change.emit(this);
  }
}
