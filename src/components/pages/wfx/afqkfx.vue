<template>
    <!-- 案发情况分析 -->
    <div class="cs-wfx-afqkfx-page">
        <div class="cs-wfx-fifter-box">
            <el-form class="demo-ruleForm cs-wfx-fifter-form">
                <el-form-item class="cs-fifter-time-box">
                    <el-col :span="4">
                        <el-form-item>
                            <el-date-picker type="date" placeholder="选择日期" v-model="startTime" :editable="false" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line cs-wfx-item-label" :span="1">至</el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-date-picker type="date" placeholder="选择日期" v-model="endTime" :editable="false" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line cs-wfx-item-label" :span="1">&nbsp;</el-col>
                    <el-col :span="6" class="cs-wfx-areabox">
                        <el-form-item>
                            <el-select v-model="deptId" placeholder="全部区域" clearable>
                                <el-option v-for="item in dept_options" :label="item.name" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="cs-button" @click="getData">搜索</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
        <div class="cs-dmap-dashboard" :style="mapStyle" >
            <i class="cs-backInitMap" v-on:click="backinitposition" :style="mainMarginLeft"></i>

            <ha-amap :vid="'heat-amap-vue'" :zoom="map_option.zoom"  :map-manager="amapManager" :plugin="plugin">

                <ha-amap-polygon v-for="polygon in polygons" :path="polygon.path" :key="this" :vid="'alarm_fx_polygon_comp'"
                                 :strokeColor="map_option.strokeColor" :strokeOpacity="map_option.strokeOpacity"
                                 :strokeWeight="map_option.strokeWeight"
                                 :fillColor="map_option.fillColor" :fillOpacity="map_option.fillOpacity" @setFitView="backinitposition">

                </ha-amap-polygon>

                <ha-amap-marker-cluster :clusterMarkers="clusterMarkers" >

                </ha-amap-marker-cluster>

            </ha-amap>

            <div class="map_echarts" id="myecharts" :style="mapStyle2"></div>
        </div>
    </div>
</template>
<script>
import {lazyAMapApiLoaderInstance} from '../../common/amap/services/injected-amap-api-instance';
import { AMapManager } from '../../common/amap';
let amap_manager = new AMapManager();

export default {
    data: () => ({
        startTime: new Date(global.tools.getCurrentDate() - 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(),
        deptId: '',
        dept_options: [],
        polygons: [
            {
                path: []
            }
        ],
        map_option: {
            zoom: 17,
            strokeColor: "#0066e8", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.1//填充透明度
        },
        heatmapOptions:{
            radius: 25, //给定半径
            opacity: [0, 0.8],
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
        },
        clusterMarkers: [],

        _point_x: null,
        _point_y: null,
        point_arr: [],
        user_dept_level: "",
        amapManager: amap_manager,
        plugin: 'ToolBar'
    }),

    methods: {
        backinitposition() {
            // this.mybmap.centerAndZoom(new BMap.Point(this._point_x, this._point_y), 16);
            //this.mybmap.setViewport(this.point_arr);


            let comp =  this.amapManager.getComponent("alarm_fx_polygon_comp");
            if(comp) {
                this.getMap().setFitView(comp);
            }


        },
//        convertFrom :function (points, callback) {
//            //添加坐标转换 [ 如果后台换成高德就不要了，放开最下面的注释，注释掉第一句]
//
//            AMap.convertFrom(points, 'baidu', callback);
//
////                callback('success', {
////                    "info": 'ok',
////                    "locations": points
////                })
//
//        },
        getMap: function() {
            return this.amapManager.getMap();
        },
        getPolygon : function() {
            let that  = this;
            let userinfo = global.data.getUserInfo();
            let user_dept = userinfo.dept;

            if (this.user_dept_level == 5 && this.deptId) {
                this.dept_options.forEach(function(item, index) {
                    if (item.id == that.deptId) {
                        user_dept = item;
                        return false;
                    }
                });
            }

            let _location = user_dept.xyz;
            let arr_loaction = _location ? _location.split("|") : new Array();
            let _polygons_arr = [];
            for (let laction = 0; laction < arr_loaction.length; laction++) {
                let locat_str = arr_loaction[laction] + "";
                let _arr = locat_str.split(",");
                _polygons_arr.push(_arr);
            }

//            this.convertFrom (_polygons_arr, (meg, result) => {
//                if (result.info = "ok") {
//                this.polygons[0].path = result.locations;
//
//                setTimeout(()=>{
//                    this.backinitposition();
//            }, 500)
//
//            }

            this.polygons[0].path = _polygons_arr;
//            this.backinitposition();
//        });

//            this.polygons[0].path = _polygons_arr;
        },
        setMydata(data){

            var points = new Array();
            if (data!=null || data.length > 0) {
                data.forEach(function(seg, index) {
                    if (seg && seg.length > 2) {
                        points.push({
                            position: [seg[0],seg[1]],
                            icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                            offset: {x: -8,y: -34}
                        });
                    }
                })
            }
            this.clusterMarkers = points;
        },
        reloadData() {
            let that = this;
            that.getPolygon();
        },
        createMap() {
            let that = this;
            that.getPolygon();
        },
        getData: function() {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }

            if (!that.startTime || !that.endTime) {
                this.$message({
                    type: 'warning',
                    message: "时间不能为空"
                });
                return false;
            }

            if (that.startTime > that.endTime) {
                this.$message({
                    type: 'warning',
                    message: "开始时间不能大于结束时间"
                });
                return false;
            }

            if (this.endTime > new Date()) {
                this.$message({
                    message: '截止时间不能大于当前时间',
                    type: 'warning'
                });
                return false;
            }

            if (that.startTime < that.endTime - 15 * 24 * 60 * 60 * 1000) {
                this.$message({
                    type: 'warning',
                    message: "只能查询15天以内的结果"
                });
                return false;
            }

            let _startTime = global.tools.formartDate(that.startTime, 'YYYY-MM-DD');
            let _endTime = global.tools.formartDate(that.endTime, 'YYYY-MM-DD');

            let _formdata = {
                startTime: _startTime,
                endTime: _endTime
            };
            _formdata.token = token;
            let _userinfo = global.data.getUserInfo();

            if (that.deptId) {
                _formdata.deptId = that.deptId;
            };
            this.$http.get(global.config.weburl + "api/analysis/getAlertMapChart.do", {
                    params: _formdata
                })
                .then(function(res) {
                    if (res.data.code == 0) {
                        that.reloadData();
                        //that.mydata = res.data.data.bmap;
                        that.setMydata(res.data.data.bmap);

                    } else {
                        global.tools.handleError(res.data);
                    }

                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑
                    that.$message({
                        type: 'error',
                        message: "获取数据失败"
                    });

                });
        },
        initMap() {
            let that = this;
            that.createMap();
        },
        getDeptData: function() {
            let that = this;
            let _dept = global.data.getUserInfo() ? global.data.getUserInfo().dept : {};
            let _deptid = _dept.id;
            let _level = _dept.level;
            that.user_dept_level = _level;
            if (5 == _level) {
                //派出所
                global.tools.getAllPoliceDept().then(function(ResultJson) {
                    //通过拿到的数据渲染页面
                    that.dept_options = ResultJson;
                    that.getData();
                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑
                });
            } else {
                global.tools.getAllArea().then(function(ResultJson) {
                    //通过拿到的数据渲染页面
                    that.dept_options = ResultJson;
                    that.getData();
                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑
                });
            }
        }
    },

    computed: {
        mainMarginLeft() {
            return {
                left: 40 + 'px'
            }
        },
        mapStyle() {
            let _height = this.$store.getters.getPageInfos.content_height-70;
            let _width =this.$store.getters.getPageInfos.main_width;
            return {
                "height": _height + "px",
                "width": _width+ "px",
            }
        },
        mapStyle2() {
            let _height = this.$store.getters.getPageInfos.content_height-20;
            let _width =this.$store.getters.getPageInfos.main_width;
            return {
                "height": _height + "px",
                "width": _width+ "px"
            }
        }
    },
    beforeCreate() {
        this._loadPromise = lazyAMapApiLoaderInstance.load();
    },

    created() {
        // let that = this;
        // let _Height = document.documentElement.offsetHeight - 168;
        // this.mapStyle = {
        //     height: _Height + "px",
        //     width: '100%'
        // }

    },
    mounted() {
        let that = this;
        that.initMap()
        this._loadPromise.then(() => {
            that.getDeptData();
        });


    }

}
</script>
<style scoped>
.cs-fifter-time-box {
    margin-top: 10px;
    padding-left:20px ;
    box-sizing: border-box;
}

.cs-backInitMap {
    position: absolute;
    bottom: 40px;
    z-index: 99999;
    text-indent: -9999px;
    background: url('/static/img/position.png') no-repeat 0 0;
    width: 34px;
    height: 34px;
}
.map_echarts{margin-left: 20px;}
.cs-dmap-dashboard{overflow: hidden;position: relative;}

</style>
