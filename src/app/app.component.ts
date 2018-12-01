import { Component,Input,OnInit } from '@angular/core';
import { Sudoku,SudokuJson } from './sudoku';
import { DataStoreService } from './data-store.service';

@Component({
  selector: 'app-sudoku',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sudokus';
  showHints=false;
  sudoku=new Sudoku();
  @Input() id: string;

  constructor(private dataStore: DataStoreService) {
  }
  ngOnInit() {
    var query={};
//    this.id='5bfbd4a4b43365c9f161c82c';
    if (this.id) {
      query={_id: this.id};
      console.log(query);
    }
    this.openGrid(query);
  }

  toggleHints() {
  	this.showHints=!this.showHints;
  }
  createNew() {
    this.sudoku=new Sudoku();
  }
  deleteCurrent() {
    if (this.sudoku._id) {
      this.dataStore.deleteData(this.sudoku._id).subscribe(
        data => {
          console.log('grid deleted');
          this.openGrid({});
        }, error => {

        }
      );   
    }
  }
  openGrid(query:object) {
    this.dataStore.queryData(query).subscribe(
      data => {
        console.log(data);
        if ((<SudokuJson[]>data).length>0) {
          this.sudoku.fromJson(data[0]);
        }
      }, error =>{

      }

    );

  }
  isSaveDisabled():boolean {
    return this.sudoku._id===null;
  }
  saveData() {
  	console.log('saveData called');
    if (!this.sudoku._id)  { // first time save
      this.dataStore.saveData(this.sudoku.toJson()).subscribe(
      data=>{
        console.log('saved:'+data);
        this.sudoku._id=(<any>data).id;
      },error=>{
      });
    } else { // update thereafter
      this.dataStore.updateData(this.sudoku._id,this.sudoku.toJson()).subscribe(
      data=>{
        console.log('updated:'+this.sudoku._id);
      },error=>{
      });
    }
  }
}
