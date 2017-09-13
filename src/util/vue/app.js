import Vue from 'vue'
import moment  from 'moment'
import VideoPlayer from 'vue-video-player'
import VueResource from 'vue-resource'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Viewer from "viewerjs"
import "viewerjs/dist/viewer.min.css"

import plugins from '../../plugins/'
import VueWebsocket from "vue-websocket"


import AMap from '../../components/common/amap'


global.eventHub = new Vue();

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.use(ElementUI);
Vue.use(plugins);

Vue.use(VueWebsocket, "wss://www.huaaotech.tech");
//console.log(Vue.prototype.$socket);

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
Vue.http.options.crossOrigin = true;
Vue.http.options.emulateHTTP = true;

Vue.use(AMap);
AMap.initAMapApiLoader({
    // 申请的高德key
    key: '3e74593a62d11396bc655ca9c64f8efd',
    // 插件集合
    plugin: ['ToolBar', 'MapType', 'PolyEditor','MarkerClusterer','Geocoder']
});



Vue.filter('moment', function (value, formatString) {
    if(!value){return "";}
    formatString = formatString || 'YYYY-MM-DD HH:mm';
    return moment(value).format(formatString);
});

Vue.filter('myfilter', function (value,) {
    return this.ruleForm.catename = row.name.replace(/\([^\)]*\)/g,"");
});

Vue.filter('imgpathformat', function (value) {
    if (typeof (value) !=undefined && value && (value.indexOf("http") != 0 && value.indexOf("//")  != 0 ) ) {
        return global.config.weburl+'upload/'+value;
    } else {
        return value;
    }
});

Vue.filter('showNullStr', function (value) {
    if (global.tools.isNullString(value)) {
        return "内容缺省";
    } else {
        return value;
    }
});






export default Vue.extend({});











