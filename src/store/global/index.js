var state=require('./state');
var mutations=require('./mutations');
var getters=require('./getters');
var actions=require('./actions');


module.exports = {
    state:state,
    mutations:mutations.default,
    getters:getters,
    actions:actions.default
};