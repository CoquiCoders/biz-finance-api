
'use strict';
/**
 * GET /
 * Version: 1.0.0
 */
var getIncentive = function(req, res, next){
  res.send({
    foo: 'bar'
  });
  return next();
};


exports.v100 = {
  'getIncentive': getIncentive,
};
