## Linear Algebra

## Instance Functionality

### add( arg )

Add value to all entries.

    jStat([[1,2,3]]).add( 2 ) === [[3,4,5]];

### subtract( arg )

Subtract all entries by value.

    jStat([[4,5,6]]).subtract( 2 ) === [[2,3,4]];

### divide( arg )

Divide all entries by value.

    jStat([[2,4,6]]).divide( 2 ) === [[1,2,3]];

### multiply( arg )

Multiply all entries by value.

    jStat([[1,2,3]]).multiply( 2 ) === [[2,4,6]];

### dot( arg )

Take dot product.

### pow( arg )

Raise all entries by value.

    jStat([[1,2,3]]).pow( 2 ) === [[1,4,9]];

### abs()

Return the absolute values of all entries.

    jStat([[1,-2,-3]]).abs() === [[1,2,3]];

### norm()

Compulte the norm of a vector. Note that if a matrix is passed, then the
first row of the matrix will be used as a vector for norm().

### angle( arg )

Compute the angle between two vectors.

## Static Functionality

### add( arr, arg )

Add arg to all entries of the array

### subtract( arr, arg )

Subtract all entries of the array by arg

### divide( arr, arg )

Divide all entries of the array by arg.

### multiply( arr, arg )

Multiply all entries of the array by arg.

### dot( arr1, arr2 )

Take dot product of array 1 and array 2.

### pow( arr, arg )

Raise all entries of the array to the power of arg

### abs(arr)

Return the absolute values of all entries in the array

### norm(arr)

Compulte the norm of a vector.

### angle( arr1, arr2 )

Compute the angle between two vectors.

### aug(A,B)

Augments matrix A by matrix B

### det(A)

Calculates the determinant of matrix A.

### inv(A)

Returns the inverse of the matrix A.

### gauss_elimination(A,B)

Performs Gaussian Elimination on matrix A augmented by matrix B.

### gauss_jordan(A,B)

Performs Gauss-Jordan Elimination on matrix A augmented by matrix B.

### lu(A,B)

Performs the LU-Decomposition on matrix A.

### cholesky(A)

Performs the Cholesky decomposition on matrix A.

### gauss_jacobi(A,b,x,r)

Solves the linear system Ax = b using the Gauss-Jacobi method with an initial guess of r.

### gauss_seidel(A,b,x,r)

Solves the linear system Ax = b using the Gauss-Seidel method with an initial guess of r.

### SOR(A,b,x,r,w)

Solves the linear system Ax = b using the sucessive over-relaxation method with an initial guess of r and parameter w (omega).

### householder(A)

Performs the householder transformation on the matrix A.

### QR()

### jacobi()

### rungekutta()

### romberg()

### richardson()

### simpson()

### hermite()

### lagrange()

### cubic_spline()

### gauss_quadrature()

### PCA()
