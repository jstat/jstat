## Regress Models

## Instance Functionality

### ols(endog,exog)

What's the `endog`, `exog`?

Please see:

http://statsmodels.sourceforge.net/stable/endog_exog.html

`ols` use ordinary least square(OLS) method to estimate linear model and return
a `model`object.

`model` object attribute is vrey like to `statsmodels` result object attribute
(nobs,coef,...).

The following example is compared by `statsmodels`. They take same result
exactly.

    var A=[[1,2,3],
           [1,1,0],
           [1,-2,3],
           [1,3,4],
           [1,-10,2],
           [1,4,4],
           [1,10,2],
           [1,3,2],
           [1,4,-1]];
    var b=[1,-2,3,4,-5,6,7,-8,9];
    var model=jStat.models.ols(b,A);
    //R2
    assert.epsilon(tol,model.R2,0.309);
    // t test
    assert.epsilon(tol,model.t.p[0],0.8377444317889267);
    assert.epsilon(tol,model.t.p[1],0.1529673615844231);
    assert.epsilon(tol,model.t.p[2],0.9909627983826588);
    // f test
    assert.epsilon(tol,model.f.pvalue,0.33063636718598743);
