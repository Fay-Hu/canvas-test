import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': "_highlight"
  }
})
export class HignlightDirective {

  _highlight:string;
  get appHighlight(){
    return this._highlight;
  }

  @Input() 
  set appHighlight(val: string){
    this._highlight = val || 'red';
  }
  
  

  constructor(private eleRef: ElementRef) {
    
  }

  ngOnInit(){
    //this.eleRef.nativeElement.style.backgroundColor = this.appHighlight;
  }

}
