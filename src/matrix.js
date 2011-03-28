(function(jstat) {
	// Constructor
	function Matrix(vector, byrow, nrow) {
		if (!(this instanceof Matrix)) return new Matrix(vector, byrow, nrow);
		this._data = [];
		if(byrow === undefined) byrow = false;  // default behaviour is column major
		//
		// Construct from a vector
		if(vector instanceof jstat.Vector) {
			if(nrow === undefined) nrow = Math.sqrt(vector.length()); // try to infer number of cols
			if(nrow !== Math.floor(nrow)) {
				// not square
				nrow = 1;
			}

			// length of vector
			var len = vector.length();
			// number of rows
			var ncol = len / nrow;
			var i = 0, j = 1;
			if(byrow) {
				// row major
				for(i = 0; i < nrow; i++) {
					this._data[i] = [];
					for(j = 0; j <= ncol; j++) {
						// Vectors are indexed from 1
						this._data[i][j - 1] = vector.e(i*ncol + j);
					}
				}
			} else {
				// column major
				for(i = 0; i < nrow; i++) {
					this._data[i] = [];
					for(j = 0; j < ncol; j++) {
						// Vectors are indexed from 1
						this._data[i][j] = vector.e((i + nrow * j) + 1);
					}
				}
			}
		} else if(vector instanceof Array && vector[0] instanceof Array) {
			// construct from 2D array
			if(byrow) {
				nrow = vector.length;
				i = 0;
				for(; i < nrow; i++) {
					this._data[i] = vector[i];
				}
			} else {
				nrow = vector[0].length;
				ncol = vector.length;
				for(i = 0; i<nrow;i++) {
					this._data[i] = [];
					for(j = 0; j<ncol;j++) {
						this._data[i][j] = vector[j][i];
					}
				}
			}
		}
		return this;
	};

	Matrix.prototype = {
		// Multiply a matrix by a number, vector or another matrix
		multiply: function(k) {
			var nrow = this._data.length, ncol = this._data[0].length;
			var res;
			if(k instanceof Matrix) {
				if(this.cols() !== k.rows()) throw "non-conformable matrices";	// cant multiply

				k = k._data;
				// Matrix x Matrix multiplication
				var ni = this._data.length, ki = ni, i, nj, kj = k[0].length, j;
				var cols = this._data[0].length, elements = [], sum, nc, c;
				do {
					i = ki - ni;
					elements[i] = [];
					nj = kj;
					do {
						j = kj - nj;
						sum = 0;
						nc = cols;
						do {
							c = cols - nc;
							sum += this._data[i][c] * k[c][j];
						} while (--nc);
						elements[i][j] = sum;
					} while (--nj);
				} while (--ni);
				return new Matrix(elements);
			} else if(k instanceof jstat.Vector) {
				// Vector x Matrix multiplication
				res = [];
				for(i = 0; i < nrow; i++) {
					sum = 0;
					for(j = 0; j < ncol; j++) {
						sum += this._data[i][j] * k.e(j + 1);
					}
					res[i] = sum;
				}
				return new Vector(res);
			}
			// Scalar x Matrix multiplication
			res = [];   // res = this._data - by reference? removed
			for(i = 0;i<nrow;i++) {
				res[i] = [];
				for(j = 0;j<ncol;j++) {
					res[i][j] = this._data[i][j] * k;
				}
			}
			return new Matrix(res, true);
		},

		// Returns the matrix transpose
		transpose: function() {
			return new Matrix(this._data);
		},

		// Returns the element at row,col (indexed from 1)
		e: function(row, col) {
			return this._data[row-1][col-1];
		},

		// Returns the sum of two matricies
		add: function(matrix) {
			// TODO: check if matrices have the same dimensions
			var nrow = this._data.length;
			var ncol = this._data[0].length;
			var res = [];
			for(var i = 0; i < nrow; i++) {
				res[i] = [];
				for(var j = 0; j < ncol; j++) {
					res[i][j] = this.e(i+1,j+1) + matrix.e(i+1,j+1);
				}
			}
			return new Matrix(res);
		},

		// Returns the number of columns
		cols: function() {
			return this._data.length;
		},

		// Returns the number of rows
		rows: function() {
			// TODO: needs to be more robust.
			return this._data[0].length;
		},
		row: function(i) {
			if (i > this._data.length) {
				return null;
			}
			return new Vector(this._data[i-1]);
		},

		// Returns column k of the matrix as a vector
		col: function(j) {
			if (j > this._data[0].length) {
				return null;
			}
			var col = [], n = this._data.length, k = n, i;
			do {
				i = k - n;
				col.push(this._data[i][j-1]);
			} while (--n);
			return new Vector(col);
		}

	};

jstat.Matrix = Matrix;

})(this.jstat || this);