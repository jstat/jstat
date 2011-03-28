(function(jstat) {

// utility functions
var slice = Array.prototype.slice;
function asc(a, b) { return a - b; };
function desc(a, b) { return b - a; };

/*
 * Vector object
 */
function Vector() {
	var args = (arguments[0] instanceof Array) ? arguments[0] : slice.call(arguments);
	if (!(this instanceof Vector)) return new Vector(args);

	this._data = (args[0] instanceof Array)
		? args[0]
	: (args.length !== 0)
		? args
	: [];
};

Vector.prototype = {
	// Add a vector, or scalar, to this vector
	add : function(k) {
		if (k instanceof Vector) {
			// Vector addition
			var V = k._data || k;
			if (this._data.length != V.length) {
				return null;	// TODO: what to do if different lenghts? Return null or throw exception?
			}
			return this.map(function(x, i) {
				return x + V[i - 1];
			});
		}
		// Scalar addition
		return this.map(function(x, i) {
			return x + k;
		});
	},

	// Divide this vector by a scalar or vector
	divide : function(k) {
		if(k instanceof Vector) {
			// Vector division
			var V = k._data || k;
			if (this._data.length != V.length) {
				return null;
			}
			return this.map(function(x, i) {
				return x / V[i - 1];
			});
		}
		// Scalar division
		return this.map(function(x) {
			return x / k;
		});
	},

	// Maps the vector to another vector according to the given function
	map : function(fn) {
		var elements = [];
		this.each(function(x, i) {
			elements.push(fn(x, i));
		});
		return new Vector(elements);
	},

	// Multiply the vector by a scalar or vector
	multiply : function(k) {
		if (k instanceof Vector) {
			// vector multiplication
			var V = k._data || k;
			if (this._data.length != V.length) {
				return null;
			}
			return this.map(function(x, i) {
				return x * V[i - 1];
			});
		}
		// Scalar multiplication
		return this.map(function(x) {
			return x * k;
		});
	},

	// Alias for them multiply method
	x : function(k) {
		return this.multiply(k);
	},

	// Subtract a vector or scalar from this vector
	subtract : function(k) {
		if (k instanceof Vector) {
			// Vector subtraction
			var V = k._data || k;
			if (this._data.length != V.length) {
				return null;
			}
			return this.map(function(x, i) {
				return x - V[i-1];
			});
		}
		// Scalar subtraction
		return this.map(function(x) {
			return x - k;
		})
	},

	// Return the element at a given index (Indexed from 1)
	e : function(i) {
		return (i < 1 || i > this._data.length) ? null : this._data[i - 1];
	},

	// Calls the iterator for each element of the vector in turn
	each : function(fn) {
		var n = this._data.length, k = n, i;
		do {
			i = k - n;
			fn(this._data[i], i + 1);
		} while (--n);
	},

	// Raises every element by a scalar, or vector
	pow : function(k) {
		if (k instanceof Vector) {
			// vector multiplication
			var V = k._data || k;
			if (this._data.length != V.length) {
				return null;
			}
			return this.map(function(x, i) {
				return Math.pow(x, V[i - 1]);
			});
		}
		// Scalar multiplication
		return this.map(function(x) {
			return Math.pow(x, k);
		});
	},

	// Returns the absolute values of the vector
	abs : function() {
		return this.map(function(x) {
			return Math.abs(x);
		});
	},

	// returns the maximum value in the vector
	max : function() {
		return Math.max.apply(null, this._data);
	},

	// Returns the minimum value in the vector
	min : function() {
		return Math.min.apply(null, this._data);
	},

	// Returns the sum of all values in the vector
	sum : function() {
		var sum = 0, i = this._data.length;
		while(--i >= 0) {
			sum += this._data[i];
		}
		return sum;
	},

	// Returns the number of elements in the vector
	length : function() {
		return this._data.length;
	},

	// Returns the number of elements in the vector
	size : function() {
		return this._data.length;
	},

	// Computes the dot product
	dot : function(k) {
		if (k instanceof Vector) {
			return this.multiply(k).sum();
		}
		return null;
	},

	// Set all values to zero
	clear : function() {
		var len = this.length();
		while(--len >= 0) {
			this._data[len] = 0;
		}
	},

	// Computes the norm of the vector
	norm : function() {
		return Math.sqrt(this.dot(this));
	},

	// Computes the angle between two vectors
	angle : function(k) {
		if (k instanceof Vector) {
			var theta = Math.acos(this.dot(k) / (this.norm() * k.norm()));
			return theta;
		}
		return null;
	},

	// Sorts the vector into ascending order
	sort : function(arg) {
		this._data.sort((arg == 'desc') ? desc : asc);
		return this;
	},

	// Selects a portion from the end of the vector
	right : function(num) {
		return new Vector(this._data.slice(0 - num));
	},

	// Selects a portion from the start of the vector
	left : function(num) {
		return new Vector(this._data.slice(0, num));
	},

	// Selects the middle portion of elements
	mid : function(start, num) {
		return new Vector(this._data.slice(start - 1, num));
	},

	// Returns the transpose of the vector (as a 1 row Matrix)
	transpose : function() {
		return new Matrix(this, true, 1);
	},

	// Returns a string representation of the vector
	toString : function() {
		var str = "[" + this.length() + "] ";
		this.each(function(x) {
			str += x + " ";
		});
		return str.trim();
	}
};

// Creates a vector of specified length, filled with a given number
Vector.fill = function(value, num) {
	var res = new Array(num);
	while (--num >= 0) {
		res[num] = value;
	}
	return new Vector(res);
}

// Creates a vector of specified length full of zeros
Vector.zeros = function(num) {
	return Vector.fill(0, num);
}

// Creates a vector of specified length full of ones
Vector.ones = function(num) {
	return Vector.fill(1, num);
}

jstat.Vector = Vector;

})(this.jstat || this);
