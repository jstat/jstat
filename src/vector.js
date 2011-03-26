/** Sublcassing function:
 *  http://stackoverflow.com/questions/3817409/is-john-resigs-oo-javascript-implementation-production-safe
 */
Function.prototype.makeSubclass= function() {
    function Class() {
        if (!(this instanceof Class))
            throw 'Constructor function requires new operator';
        if ('_init' in this)
            this._init.apply(this, arguments);
    }
    if (this!==Object) {
        Function.prototype.makeSubclass.nonconstructor.prototype= this.prototype;
        Class.prototype= new Function.prototype.makeSubclass.nonconstructor();
    }
    return Class;
};
Function.prototype.makeSubclass.nonconstructor= function() {};



/* 
 * Vector object
 */
var Vector = Object.makeSubclass();

// Constructor takes either an array, or comma separated list of values
Vector.prototype._init= function(arr) {
    if(arr instanceof Array) {
        // Array initialisation
        this._data = arr; 
    } else {
        // Argument initialisation
		this._data = Array.prototype.slice.call(arguments);
    }
    
}

/*** Instance methods ***/

// Add a vector, or scalar, to this vector
Vector.prototype.add = function(k) {
    if(k instanceof Vector) {
        // Vector addition
        var V = k._data || k;
        if (this._data.length != V.length) {
            return null;    // TODO: what to do if different lenghts? Return null or throw exception?
        }
        return this.map(function(x, i) {
            return x + V[i-1];
        });
    } 
    // Scalar addition
    return this.map(function(x,i) {
        return x + k; 
    });  
}

// Divide this vector by a scalar or vector
Vector.prototype.divide = function(k) {
    if(k instanceof Vector) {
        // Vector division
        var V = k._data || k;
        if (this._data.length != V.length) {
            return null;
        }
        return this.map(function(x, i) {
            return x / V[i-1];
        });
    }
    // Scalar division
    return this.map(function(x) {
        return x / k; 
    });
}

// Maps the vector to another vector according to the given function
Vector.prototype.map = function(fn) {
    var elements = [];
    this.each(function(x, i) {
        elements.push(fn(x, i));
    });
    return new Vector(elements);
}

// Multiply the vector by a scalar or vector
Vector.prototype.multiply = function(k) {
    if(k instanceof Vector) {
        // vector multiplication
        var V = k._data || k;
        if (this._data.length != V.length) {
            return null;
        }
        return this.map(function(x, i) {
            return x * V[i-1];
        });
    }
    // Scalar multiplication
    return this.map(function(x) {
        return x*k;
    });
}

// Alias for them multiply method
Vector.prototype.x = function(k) {
    return this.multiply(k);
}

// Subtract a vector or scalar from this vector
Vector.prototype.subtract = function(k) {
    if(k instanceof Vector) {
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
    
}

// Return the element at a given index (Indexed from 1)
Vector.prototype.e = function(i) {
    return (i < 1 || i > this._data.length) ? null : this._data[i-1];
}

// Calls the iterator for each element of the vector in turn
Vector.prototype.each = function(fn) {
    var n = this._data.length, k = n, i;
    do {
        i = k - n;
        fn(this._data[i], i+1);
    } while (--n);
}

// Raises every element by a scalar, or vector
Vector.prototype.pow = function(k) {
    if(k instanceof Vector) {
        // vector multiplication
        var V = k._data || k;
        if (this._data.length != V.length) {
            return null;
        }
        return this.map(function(x, i) {
            return Math.pow(x, V[i-1]);
        });
    }
    // Scalar multiplication
    return this.map(function(x) {
        return Math.pow(x, k);
    });
}

// Returns the absolute values of the vector
Vector.prototype.abs = function() {
    return this.map(function(x) {
        return Math.abs(x); 
    });
}

// returns the maximum value in the vector
Vector.prototype.max = function() {
    return Math.max.apply(null, this._data);
}

// Returns the minimum value in the vector
Vector.prototype.min = function() {
    return Math.min.apply(null, this._data);
}

// Returns the sum of all values in the vector
Vector.prototype.sum = function() {
    var sum = 0, i = this._data.length;
    while(--i >= 0) {
        sum += this._data[i];
    }
    return sum;
}

// Returns the number of elements in the vector
Vector.prototype.length = function() {
    return this._data.length;
}

// Returns the number of elements in the vector
Vector.prototype.size = function() {
    return this._data.length;
}

// Computes the dot product
Vector.prototype.dot = function(k) {
    if(k instanceof Vector) {
        return this.multiply(k).sum();
    }
    return null;
}

// Set all values to zero
Vector.prototype.clear = function() {
    var len = this.length();
    while(--len >= 0) {
        this._data[len] = 0;
    }
}

// Computes the norm of the vector
Vector.prototype.norm = function() {
    return Math.sqrt(this.dot(this));
}

// Computes the angle between two vectors
Vector.prototype.angle = function(k) {
    if(k instanceof Vector) {
        var theta = Math.acos(this.dot(k) / (this.norm() * k.norm()));
        return theta;
    }
    return null;
}

// Sorts the vector into ascending order
Vector.prototype.sort = function() {
    this._data.sort();
}

// Selects a portion from the end of the vector
Vector.prototype.right = function(num) {
    return new Vector(this._data.slice(0-num));
}

// Selects a portion from the start of the vector
Vector.prototype.left = function(num) {
    return new Vector(this._data.slice(0,num));
}

// Selects the middle portion of elements
Vector.prototype.mid = function(start, num) {
    return new Vector(this._data.slice(start - 1, num));
}


/*** Static methods (constructors mainly) ***/

// Creates a vector of specified length, filled with a given number
Vector.fill = function(value, num) {
    var res = new Array(num);
    while(--num >= 0) {
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




/** jStat methods **/

// jstat object
var jstat = {};

// Creates a vector from a comma separated list of values
jstat.c = function() {
    // Argument initialisation
    var len = arguments.length;
    var res = [];
    for(var i = 0; i < len; i++) {
        res[i] = arguments[i];
    }
    return new Vector(res);
}

// Creates a vector of specified length filled with a given value
jstat.rep = function(value, num) {
    return Vector.fill(value, num);
}
