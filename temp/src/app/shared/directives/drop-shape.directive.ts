import { Directive, ElementRef, Input } from '@angular/core';


@Directive({
  selector: '[appDropShape]'
})
export class DropShapeDirective {
  @Input() appDropShapeActived:boolean;

  constructor(public el:ElementRef) { }
}