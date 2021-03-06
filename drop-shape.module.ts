import { DropShapeService } from './drop-shape.service';
import { DropShapeGroupDirective } from './drop-shape-group.directive';
import { DropShapeDirective } from './drop-shape.directive';
import { NgModule } from '@angular/core';


@NgModule({
	imports: [],
	exports: [DropShapeDirective, DropShapeGroupDirective],
	declarations: [DropShapeDirective, DropShapeGroupDirective],
	providers: [DropShapeService]
})
export class DropShapeModule { }
