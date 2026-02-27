import jStat from './core.js';

function sub_regress(exog) {
  const var_count = exog[0].length;
  const modelList = jStat.arange(var_count).map((endog_index) => {
    const exog_index =
        jStat.arange(var_count).filter((i) => i !== endog_index);
    return ols(jStat.col(exog, endog_index).map((x) => x[0]),
               jStat.col(exog, exog_index))
  });
  return modelList;
}

// do OLS model regress
// exog have include const columns ,it will not generate it .In fact, exog is
// "design matrix" look at
//https://en.wikipedia.org/wiki/Design_matrix
function ols(endog, exog) {
  const nobs = endog.length;
  const df_model = exog[0].length - 1;
  const df_resid = nobs-df_model - 1;
  const coef = jStat.lstsq(exog, endog);
  const predict =
      jStat.multiply(exog, coef.map((x) => [x]))
          .map((p) => p[0]);
  const resid = jStat.subtract(endog, predict);
  const ybar = jStat.mean(endog);
  // constant cause problem
  // var SST = jStat.sum(endog.map(function(y) {
  //   return Math.pow(y-ybar,2);
  // }));
  const SSE = jStat.sum(predict.map((f) => Math.pow(f - ybar, 2)));
  const SSR = jStat.sum(endog.map((y, i) => Math.pow(y - predict[i], 2)));
  const SST = SSE + SSR;
  const R2 = (SSE / SST);
  return {
      exog:exog,
      endog:endog,
      nobs:nobs,
      df_model:df_model,
      df_resid:df_resid,
      coef:coef,
      predict:predict,
      resid:resid,
      ybar:ybar,
      SST:SST,
      SSE:SSE,
      SSR:SSR,
      R2:R2
  };
}

// H0: b_I=0
// H1: b_I!=0
function t_test(model) {
  const subModelList = sub_regress(model.exog);
  //var sigmaHat=jStat.stdev(model.resid);
  const sigmaHat = Math.sqrt(model.SSR / (model.df_resid));
  const seBetaHat = subModelList.map((mod) => {
    const SST = mod.SST;
    const R2 = mod.R2;
    return sigmaHat / Math.sqrt(SST * (1 - R2));
  });
  const tStatistic = model.coef.map((coef, i) => (coef - 0) / seBetaHat[i]);
  const pValue = tStatistic.map((t) => {
    const leftppf = jStat.studentt.cdf(t, model.df_resid);
    return (leftppf > 0.5 ? 1 - leftppf : leftppf) * 2;
  });
  const c = jStat.studentt.inv(0.975, model.df_resid);
  const interval95 = model.coef.map((coef, i) => {
    const d = c * seBetaHat[i];
    return [coef - d, coef + d];
  })
  return {
      se: seBetaHat,
      t: tStatistic,
      p: pValue,
      sigmaHat: sigmaHat,
      interval95: interval95
  };
}

function F_test(model) {
  const F_statistic =
      (model.R2 / model.df_model) / ((1 - model.R2) / model.df_resid);
  const fcdf = (x, n1, n2) => jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2);
  const pvalue = 1 - fcdf(F_statistic, model.df_model, model.df_resid);
  return { F_statistic: F_statistic, pvalue: pvalue };
}

function ols_wrap(endog, exog) {
  const model = ols(endog,exog);
  const ttest = t_test(model);
  const ftest = F_test(model);
  // Provide the Wherry / Ezekiel / McNemar / Cohen Adjusted R^2
  // Which matches the 'adjusted R^2' provided by R's lm package
  const adjust_R2 =
      1 - (1 - model.R2) * ((model.nobs - 1) / (model.df_resid));
  model.t = ttest;
  model.f = ftest;
  model.adjust_R2 = adjust_R2;
  return model;
}

jStat.models = { ols: ols_wrap };
