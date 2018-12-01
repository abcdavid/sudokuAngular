import { Component,OnInit, Input, TemplateRef } from '@angular/core';
import { Square } from '../sudoku';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  modalRef: BsModalRef;
	@Input() square: Square;
	@Input() showHints: boolean;

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
 
	 ngOnInit() {}

	 setValue(n:number) {
	 	this.modalRef.hide();
    console.log(this.square.getPossibleValues()); // debug
	 	if (n===this.square.getValue()) {
	 		this.square.setValue(0);
	 	} else {
		 	this.square.setValue(n); 	
	 	}
	 	console.log('square set to:'+n);
	 }
	 hintHasDuplicate(): boolean {
	 	return this.showHints && this.square.hasDuplicate();
	 }
	 hintUsedAlready(n:number) {
	 	return this.showHints && this.square.usedAlready(n);
	 }
   hintLastGrid() {
    return this.showHints && this.square.getValue()===0 && this.square.getMinCountRemaining()===1;
   }
   hintSinglePossibleValue() {
    return (this.showHints && this.square.getPossibleValues().length===1);
   }
}
