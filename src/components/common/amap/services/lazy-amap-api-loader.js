import {
  assign
} from '../utils/polyfill';

const DEFAULT_AMP_CONFIG = {
  key: null,
  v: 1.3,
  protocol: 'https',
  hostAndPath: 'webapi.amap.com/maps',
  plugin: [],
  callback: 'amapInitComponent'
};


const DEFAULT_AMP_PLUGIN_CONFIG = {
  url: [
    'https://webapi.amap.com/ui/1.0/main.js'
    //,'https://a.amap.com/jsapi_demos/static/resource/heatmapData.js'
  ]
};



export default class AMapAPILoader {
  /**
   * @param config required 初始化参数
   */
  constructor(config) {
    this._config = assign({}, DEFAULT_AMP_CONFIG, config);
    this._document = document;
    this._window = window;
    this._scriptLoaded = false;
    this._queueEvents = [];
  }

  load() {
    if (this._window.AMap) {
      return Promise.resolve();
    }



    if (this._scriptLoadingPromise) return this._scriptLoadingPromise;


    let _that = this;


    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = this._getScriptSrc();




    this._scriptLoadingPromise = new Promise((resolve, reject) => {
      this._window['amapInitComponent'] = () => {
        this._queueEvents.forEach(event => event());
        while (this._queueEvents && this._queueEvents.length) {
          this._queueEvents.pop().apply();
        }


        //加载其他插件
        DEFAULT_AMP_PLUGIN_CONFIG.url.forEach(function(item, index) {
          const script2 = _that._document.createElement('script');
          script2.type = 'text/javascript';
          script2.async = true;
          script2.defer = true;
          script2.src = item;
          _that._document.head.appendChild(script2);
        });

        return resolve();
      };
      script.onerror = error => reject(error);
    });

    this._document.head.appendChild(script);

    return this._scriptLoadingPromise;
  }

  _getScriptSrc() {
    // amap plugin prefix reg
    const amap_prefix_reg = /^AMap./;

    const config = this._config;
    const paramKeys = ['v', 'key', 'plugin', 'callback'];

    // check 'AMap.' prefix
    if (config.plugin && config.plugin.length > 0) {
      // push default types
      //config.plugin.push('Autocomplete', 'PlaceSearch', 'PolyEditor', 'CircleEditor');
      //config.plugin.push('PolyEditor');

      config.plugin = config.plugin.map(item => {
        return (amap_prefix_reg.test(item)) ? item : 'AMap.' + item;
      });
    }

    const params = Object.keys(config)
                         .filter(k => paramKeys.indexOf(k) !== -1)
                         .filter(k => config[k] != null)
                         .filter(k => {
                           return !Array.isArray(config[k]) ||
                                (Array.isArray(config[k]) && config[k].length > 0);
                         })
                         .map(k => {
                           let v = config[k];
                           if (Array.isArray(v)) return { key: k, value: v.join(',')};
                           return {key: k, value: v};
                         })
                         .map(entry => `${entry.key}=${entry.value}`)
                         .join('&');
    return `${this._config.protocol}://${this._config.hostAndPath}?${params}`;
  }


};
