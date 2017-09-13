Array.prototype.remDub = Array.prototype.remDub || function () {
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
        if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};


import {data} from './data'
import tools from './tools'
var config=require('../../config/config.js');

export default {
    config:config,
    data:data,
    tools:tools
};