import './polyfills';

const upperCamelCase = require('uppercamelcase')
//import upperCamelCase from 'uppercamelcase';

// 初始化接口
import {initAMapApiLoader} from './services/injected-amap-api-instance';

// 组建导入
import AMap from './src/amap.vue';
import AMapMarker from './src/amap-marker.vue';
import AMapPolygon from './src/amap-polygon.vue';
import AMapPositionPicker from './src/amap-position-picker.vue';
import AMapHeatMap from './src/amap-heatmap.vue';
import AMapMarkerCluster from './src/amap-marker-cluster';
import AMapGroundImg from './src/amap-ground-img.vue';

// managers
import AMapManager from './managers/amap-manager';

let components = [
  AMap,
  AMapMarker,
  AMapPolygon,
  AMapPositionPicker,
  AMapHeatMap,
  AMapMarkerCluster,
  AMapGroundImg
];

let VueAMap = {
  initAMapApiLoader,
  AMapManager
};

VueAMap.install = (Vue) => {
  if (VueAMap.installed) return;
  Vue.config.optionMergeStrategies.deferredReady = Vue.config.optionMergeStrategies.created;
  components.map(_component => {
    Vue.component(_component.name, _component);
    VueAMap[upperCamelCase(_component.name).replace(/^Ha/, '')] = _component;
  });
};

const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;

  VueAMap.install(Vue);
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);

  // window.VueAmap = VueAMap;
};

export default VueAMap;

export {
    AMapManager,
    initAMapApiLoader
};
export { lazyAMapApiLoaderInstance } from './services/injected-amap-api-instance';
