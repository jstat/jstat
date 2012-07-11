## Optimization Routines

It provides methods for finding the optimized value for a given function. It returns the point at which the given function has the optimized value.

Besides, it uses the optimizer to elicitate the probability distribution for an unknown variable providedthe quartiles.

Two Optimization methods are implemented: Nelder-Mead and Scaled Conjugate Gradient

### jStat.optimizer( inputs, opt_method, f)

Given the function f, initial input points and the optimisation method, return an object containing
optimized value, point at and the log of intermediate points.

### jStat.elicitate( inputs, opt_method, option )

Given the initial quartiles(inputs) for an unknown variable, return the object containing the
estimated best fit distribution for that variable.

It finds the optimized beta, gamma, normal and lognormal distributions for the given variable and
from these, finds the best fit.

### jStat.optim( params, func, opt_method, options )

It is the function which calls the optimization routines based in opt_method, given the initial
point and function to be optimized.

#### jStat.optim.get_sum()

calculate the column sum of the parameter matrix.

#### jStat.optim.amotry( ihi, fac)

#### jStat.optim.optimize()

This method implements the optimization routines and return the jStat.optim_return_obj containing the
optimized value and point of optimization.

### jStat.optim_return_obj()

Return object for jStat.optim, contains function valule, point, log of intermediate points and values
and the distribution (in case of jStat.elicitate)

### jStat.cost(inputs, dist)

Given a distribution and the quartiles, return the sum of squared errors.

#### jStat.cost.value(params, obj)

Given the parameters, returns the sum of squared errors at that point.

#### jStat.cost.gradf(params)

Returns the gradient of the cost function at the particular point(params).

### jStat.fnc()

Function passsed to jStat.optimizer. Different from jStat.cost in the sense that it is generalized
function, its value and gradf can be defined as per need. jStat.cost function is for elicitation
purpose.

#### jStat.fnc.value(params)

returns the value of function at the passed point(params).

#### jStat.fnc.gradf(params)

returns the gradient of the function at the passed point(params).
