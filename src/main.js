// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from './util/vue/app';

import 'babel-polyfill';
var Promise = require('es6-promise-polyfill').Promise;

import router from './router';

import my_global from './util/global/';
import store from './store/';

import echarts from 'echarts';

//console.log(Vue.prototype);
let App = Vue;
var app = new App({
  router,
  store
}).$mount("#base-main-content");

global.Promise = Promise;
global.echarts = echarts;
global.app = app;
global.router = router;
global.config = my_global.config;
global.data = my_global.data;
global.tools = my_global.tools;

