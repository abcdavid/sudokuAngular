import * as _ from 'underscore';


export type SudokuJson = { _id: string, grid: string};


export class Sudoku {
  _id: string;
	theRoot: number=3;
	base: number = this.theRoot*this.theRoot; // width / height of grid
	grid:Square[][]=[]; // the actual squares of the grid
	// a count of each number in the columns / rows / sqaures
	cols:number[][]=[];
	rows:number[][]=[];
	squares:number[][]=[];
	readonly baseArray=_.range(1,this.base+1);


	constructor() {
		for (var i=0;i<=this.base;i++) {
			this.cols[i]=[];
			this.cols[i][0]=this.base; // how many empty cells in each column
			this.rows[i]=[];
			this.rows[i][0]=this.base; // how many empty cells in each row
			this.squares[i]=[];
			this.squares[i][0]=this.base; // how many empty cells in each square
		}
		for (var row=0;row<this.base;row++){
			this.grid[row]=[];
			for (var col=0;col<this.base;col++){
				this.grid[row][col]=new Square(this,col,row,this.theRoot*Math.floor(row/this.theRoot)+Math.floor(col/this.theRoot));
				this.cols[row][col+1]=0; // initialise count of number in each column to zero
				this.rows[row][col+1]=0; // initialise count of number in each row to zero
				this.squares[row][col+1]=0; // initialise count of number in each square to zero
			}
		}
	}
  toJson(): SudokuJson {
    let theGrid='';
    for (var row=0;row<this.base;row++) {
      for (var col=0;col<this.base;col++) {
        theGrid+=this.grid[row][col].getValue().toString(16);
      }
    }
    return { _id: this._id,grid: theGrid };
  }
  fromJson(o: SudokuJson): void {
    this._id=o._id;
    for (var i=0;i<o.grid.length;i++) {
      var col=i%this.base;
      var row=Math.floor(i/this.base);
      var value=parseInt(o.grid.charAt(i),16);
      this.grid[row][col].setValue(value);
    }
  }
}
export class Square {
	sudoku:Sudoku;
	private value=0;
	col:number;
	row:number;
	square:number;
	canChange=true;
	constructor(sudoku:Sudoku,col:number,row:number,square:number) {
		this.sudoku=sudoku;
		this.col=col;
		this.row=row;
		this.square=square;
	}
	getValue() {
		return this.value;
	}
	setValue(n:number){
		if (this.canChange && n>=0 && n<=this.sudoku.base && n!==this.value) {
			this.sudoku.cols[this.col][n]++;
			this.sudoku.rows[this.row][n]++;
			this.sudoku.squares[this.square][n]++;					
			this.sudoku.cols[this.col][this.value]--;
			this.sudoku.rows[this.row][this.value]--;
			this.sudoku.squares[this.square][this.value]--;
			this.value=n;
		}
	}
  getMinCountRemaining() : number { // returns a minimum count of empty grid cells in col, row or square
    return Math.min(this.sudoku.cols[this.col][0],this.sudoku.rows[this.row][0],this.sudoku.squares[this.square][0]);
  }
	hasDuplicate() : boolean {
		return this.value!==0 && (this.sudoku.cols[this.col][this.value]>1 || this.sudoku.rows[this.row][this.value]>1 || this.sudoku.squares[this.square][this.value]>1);
	}
	isValid() : boolean {
		return this.value===0 || (this.sudoku.cols[this.col][this.value]===1 && this.sudoku.rows[this.row][this.value]===1 && this.sudoku.squares[this.square][this.value]===1);
	}
	usedAlready(n: number) : boolean {
			return n!==0 && ((n===this.value && this.hasDuplicate()) || (n>0 && n<=this.sudoku.base && (this.sudoku.cols[this.col][n]>0 || this.sudoku.rows[this.row][n]>0 || this.sudoku.squares[this.square][n]>0)));
	}
	isPossible(n:number) : boolean {
		return n===0 || (n===this.value && this.isValid()) || (n>0 && n<=this.sudoku.base && this.sudoku.cols[this.col][n]===0 && this.sudoku.rows[this.row][n]===0 && this.sudoku.squares[this.square][n]===0);		
	}
  getPossibleValues(){
    if (this.value===0) {
      return _.reject(this.sudoku.baseArray,(num) => {
        return (this.sudoku.cols[this.col][num]>0 || this.sudoku.rows[this.row][num]>0 || this.sudoku.squares[this.square][num]>0);
      });
    }
    return [];
  }
 }
