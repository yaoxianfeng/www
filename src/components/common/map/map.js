const MY_MAP_KEY = "pYyi0ezfhpE9Exceq26QAcge";
const MY_MAP_SIZE = 18;

export default{
    data:function(){
        return {
            map_id: {
                type:String,
                default:""
            },
            polygon_location : {
                type:String,
                default:""
            },
            polygon_arr :{
                type:Array,
                default:[]
            },
            is_need_HYBRID_MAP :{
                type:Boolean,
                default:false
            },
            current_point : {
                type:Object,
                default: {
                    x:null,
                    y:null,
                    address:""
                }
            }
        }
    },
    methods: {
        getAddress(x, y, fan) {//获取点对应的地理位置
            let url = "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location="+y+","+x+"&output=json&pois=1&ak="+MY_MAP_KEY;
            let app = global.app;
            app.$http.jsonp(url).then(
                function (res) {
                    if(res.data.status == 0){
                        fan(res.data.result);
                    }
                }
            );
        },
        addMarker(point, src) {
            //创建地图上的标识物
            let that = this;
            //let BMap = that.$BMap;
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(point);

            let translateCallback = function (data){
                if(data.status === 0) {
                    let marker = new BMap.Marker(data.points[0], {icon: new BMap.Icon(src, new BMap.Size(21,25)) });
                    that.map.addOverlay(marker);
                }
            }
            convertor.translate(pointArr, 3, 5, translateCallback);
        },
        formart_location() {//格式化围栏
            let that = this;
            let _location = that.polygon_location;
            let arr_loaction = _location ? _location.split("|") : new Array();

            let _point_arr = [];
            for (let laction = 0; laction < arr_loaction.length; laction++) {
                let locat_str = arr_loaction[laction] + "";
                let _arr = locat_str.split(",");
                _point_arr.push(new BMap.Point(_arr[0], _arr[1]));
            }
            that.polygon_arr = _point_arr;
        },


        addPolygon() {
            //创建栅栏
            let that = this;
            //let BMap = that.$BMap;
            //that.map.centerAndZoom(new BMap.Point(this._point_x, this._point_y), MY_MAP_SIZE);

            let mapTypes = [BMAP_NORMAL_MAP];
            if (that.is_need_HYBRID_MAP) {
                mapTypes = [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP];
            }

            var mapType = new BMap.MapTypeControl({
                mapTypes
            });

            that.map.addControl(mapType);
            that.map.enableScrollWheelZoom();// 允许滚轮缩放
            //that.map.addControl(new BMap.NavigationControl());
            //console.log(that.polygon_arr);
            let polygon = new BMap.Polygon(that.polygon_arr, {
                strokeColor: "#675fd7",
                strokeWeight: 3,
                strokeOpacity: 1,
                fillOpacity: 0.1
            }); //创建多边形
            that.map.addOverlay(polygon); //增加多边形
            that.map.setViewport(that.polygon_arr);
        },
        initUserDeptPolygon() { //设置用户所在单位的围栏
            try {
                let userinfo = global.data.getUserInfo();
                let user_dept = userinfo.dept;
                let xyz = user_dept.location;
                let xyz_arr = xyz.split(",");
                if (xyz_arr && xyz_arr.length > 0) {
                    this._point_x = xyz_arr[0];
                    this._point_y = xyz_arr[1];
                }
                this.polygon_location = user_dept.xyz;
                this.formart_location();
                this.addPolygon();
            } catch (e){

            }
        },
        createMap() {

            if (!this.map_id) {
                return;
            }
            //let BMap = this.$BMap;
            let map = new BMap.Map(this.map_id, {enableMapClick:false});
            //map2.centerAndZoom(data.points[0], 15);
            //map.enableScrollWheelZoom();
            this.map = map;     //设置map

        },
        initMap(BMap) {
            this.$BMap = BMap;
            this.createMap();
        },
        getMapScript() {
            if (!global.BMap) {
                return new Promise((resolve, reject) => {
                    global._initBaiduMapFuc = function() {
                        resolve(global.BMap)
                        global.document.body.removeChild($script)
                        global._initBaiduMapFuc = null
                    }
                    const $script = document.createElement('script')
                    global.document.body.appendChild($script);
                    $script.src = '//api.map.baidu.com/api?v=2.0&ak=pYyi0ezfhpE9Exceq26QAcge&callback=_initBaiduMapFuc'
                    //$script.src = '//api.map.baidu.com/api?v=2.0&ak='+MY_MAP_KEY+'&callback=_initBaiduMapFuc';
                })
            }
            return Promise.resolve(global.BMap)
        }
    }
    //created:function(){
    //
    //},
    //mounted: function() {
    //    const {getMapScript,initMap} = this;
    //    getMapScript().then(initMap);
    //}
}