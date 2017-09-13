
<template>
    <div id="page-content" :style="main_style">
        <div class="cs-main-btn-group" :style="topbar_style">
            <!-- <el-button class="cs-btn-showList" @click="gotoList" :disabled="show_list">
                <i class="ha-icon-list"></i>列表展示
            </el-button> -->
            <router-link to="/wlf/list" class="ha-navbar-goback wsbx_back mpa_back"><i class="ha-icon-list"></i><span>列表展示</span></router-link>
            <div class="ha-flexend btn_list">
                <button class="cs-dep"><span class="cs-dept">{{this.dep}}</span><span class="cs-triangle"></span></button>
                <button @click="toggle(1)" :class="[list_type==1?'btn_type_highlight':'']">警力{{userlist.data.length}}人</button>
                <button @click="toggle(2)" :class="[list_type==2?'btn_type_highlight':'']">警情{{alarmlist.length}}条</button>
                <button @click="toggle(3)" :class="[list_type==3?'btn_type_highlight':'']">站点{{sitelist.length}}个</button>
            </div>
            
        </div>
        <div class="cs-map-view" :style="content_sytle">
            <div class="icon_group">
                    <div @click="toggleIcon(1)" class="item"><div :class="[markers.is_show_alarms?'is_show_jingqing':'no_show_jingqing','icon-commom']"><span>警情</span></div></div>
                    <div @click="toggleIcon(2)" class="item"><div :class="[markers.is_show_members?'is_show_jingli':'no_show_jingli','icon-commom']"><span>警力</span></div></div>
                    <div @click="toggleIcon(3)" class="item "><div :class="[markers.is_show_sites?'is_show_zhandian':'no_show_zhandian','icon-commom']"><span>站点</span></div></div>
            </div>

            <i class="cs-backInitMap" @click="backinitposition"></i>
            <div class="member-sport" :style="membertop">
                <transition name="member" mode="out-in">
                    <membercomponent v-if="list_type == 1"
                                     :member_loading="markers.member_loading"
                                     :userlist="userlist"
                                     @hide="hideListComponent"
                                     @show_contact="show_contact">
                    </membercomponent>
                    <alarmListComponent v-if="list_type == 2"
                                       :undo_alarm_loading="markers.alarm_loading"
                                       :undo_alarmlist="alarmlist"
                                       @hide="hideListComponent"
                                       @show_contact="show_alarms_detail">
                    </alarmListComponent>

                    <siteListComponent v-if="list_type == 3"
                                       :member_loading="markers.site_loading"
                                       :sitelist="sitelist"
                                       @hide="hideListComponent"
                                       @show_contact="show_site_detail2">
                    </siteListComponent>
                </transition>
            </div>

            <!-- 覆盖物 -->
            <ha-amap :vid="'amap-vue'" :zoom="map_option.zoom"  :map-manager="amapManager" :plugin="plugin" :center="center">
                <!-- 多边形 -->
                <ha-amap-polygon v-for="(polygon, index) in polygons" :key="index" :path="polygon.path"  :vid="'alarm_polygon_comp'"
                                 :strokeColor="map_option.strokeColor" :strokeOpacity="map_option.strokeOpacity"
                                 :strokeWeight="map_option.strokeWeight"
                                 :fillColor="map_option.fillColor" :fillOpacity="map_option.fillOpacity" @setFitView="backinitposition">
                </ha-amap-polygon>


                <ha-amap-polygon v-for="(polygon, index) in childPoliceDeptPloygon" :key="index" :path="polygon.path" :vid="'child_police_polygon_comp'"
                                 :strokeColor="strokeColorArr[index%20]" :strokeOpacity="ploygon_option.strokeOpacity"
                                 :strokeWeight="ploygon_option.strokeWeight"
                                 :fillColor="ploygon_option.fillColor" :fillOpacity="ploygon_option.fillOpacity" :extData="{'index':index, 'data': polygon}" :events="ploygonEvent" >
                </ha-amap-polygon>

                <!--警力-->
                <div v-for="marker_member_data in marker_member_arr">
                    <ha-amap-marker v-for="(marker, index) in marker_member_data.data" :key="index" :vid="'mb_'+marker.extData.id"  :events="marker_member_data.events" :extData="marker.extData" :icon="marker_member_data.icon" :position="marker.position"></ha-amap-marker>
                </div>

                <!-- 警情 -->
                <div v-for="marker_alarm_data in marker_alarm_arr">
                    <ha-amap-marker v-for="(marker, index) in marker_alarm_data.data" :key="index" :vid="'al_'+marker.extData.alertId"   :events="marker_alarm_data.events" :extData="marker.extData" :icon="marker_alarm_data.icon"  :position="marker.position"></ha-amap-marker>
                </div>

                <!-- 站点 -->
                <div v-for="marker_sites_data in marker_site_arr">
                    <ha-amap-marker v-for="(marker, index) in marker_sites_data.data" :key="index"  :vid="'si_'+marker.extData.id"   :events="marker_sites_data.events" :extData="marker.extData" :icon="marker_sites_data.icon" :label="{content:marker.extData.entityName,offset:[30,-30]}"  :position="marker.position"></ha-amap-marker>
                </div>

                <!-- 圈内卫星地图 -->
                <ha-amap-ground-img :vid="'police_ground_img'"
                        v-if="isShowGroundImg"
                        :bounds="bounds_position"
                        :url="groundImage">
                </ha-amap-ground-img>

            </ha-amap>

        </div>
        
        <!-- 右侧滑动信息 -->
        <transition name="zddetail" mode="out-in">
            <zddetailcomponent v-if="is_zddetail" :zd_detail="zd_detail" @hidezddetail="hidezddetail"></zddetailcomponent>
            <contactcomponent v-if="is_contact" :userdetails="userdetails" @hidden_contact="hidden_contact"></contactcomponent>
            <bjxqcomponent v-if="isShow_bjxq" :jqfb_list_detail="jqfb_list_detail" @hide_bjxq="hide_bjxq" @doto_refresh_list="doto_refresh_list"></bjxqcomponent>
        </transition>

    </div>
</template>
<script>
    import mystyle from '../../../../util/vue/style';

//    import {lazyAMapApiLoaderInstance} from '../../../common/amap/services/injected-amap-api-instance';

    import { AMapManager } from '../../../common/amap';
    import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button";
    let amapManager = new AMapManager();

    export default {
        mixins: [mystyle],
        data: function() {
            let _member_init_arr = [
                {
                    icon : '/static/img/icon/ba.png',
                    data : [],
                    type : 1,
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_contact(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/mj.png',
                    data : [],
                    type : 2,
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_contact(_extData);
                        }
                    }
                 }
            ];
            let _alarm_init_arr = [
                {
                    icon : '/static/img/icon/yjbj.png',
                    data : [],
                    type : 1,    //警情[一键报警]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_alarms_detail(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/ssj.png',
                    data : [],
                    type : 2,    //警情[随手拍]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_alarms_detail(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/ssp.png',
                    data : [],
                    type : 3,    //警情[随手拍]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_alarms_detail(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/jqbl.png',
                    data : [],
                    type : 4,    //警情[警情补录]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_alarms_detail(_extData);
                        }
                    }
                }
            ];
            let _site_init_arr = [
                {
                    icon : '/static/img/icon/jt.png',
                    data : [],
                    type : 1,    //站点[警亭]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_site_detail(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/jws.png',
                    data : [],
                    type : 2,    //站点[警务室]
                    events: {
                         click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_site_detail(_extData);
                         }
                    }
                },
                {
                    icon : '/static/img/icon/jj.png',
                    data : [],
                    type : 3,    //站点[警局]
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_site_detail(_extData);
                        }
                    }
                },
                {
                    icon : '/static/img/icon/jt.png',
                    data : [],
                    type : 5,    //其他
                    events: {
                        click: (e) => {
                            let _extData = e.target.G.extData;
                            this.show_site_detail(_extData);
                        }
                    }
                }
            ];


            return {
                map_option: {
                    zoom: 15,
                    strokeColor: "#0066e8", //线颜色
                    strokeOpacity: 0, //线透明度
                    strokeWeight: 2,    //线宽
                    fillColor: "#1791fc", //填充色
                    fillOpacity: 0//填充透明度
                },
                center : null,
                strokeColorArr :[
                    '#C1232B','#27727B','#FCCE10','#E87C25','#B5C334',
                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                ],
                ploygon_option: {
                    strokeColor: "#0066e8", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 2,    //线宽
                    fillColor: "#1791fc", //填充色
                    fillOpacity: 0.1//填充透明度
                },

                userlist : {
                    data: []
                },
                sitelist:[],
                alarmlist:[],

                userdetails: {},
                zd_detail: {},
                jqfb_list_detail: {},

                is_member: 0, //人员详情

                is_contact: false,
                is_zddetail: false, //站点分布
                isShow_bjxq: false, //报警详情

                markers: {
                    is_show_members : true, //警力显示
                    is_show_alarms : true,  //警情显示
                    is_show_sites : true,   //站点显示

                    member_loading :false,
                    alarm_loading :false,
                    site_loading :false,

                    marker_members: _member_init_arr.concat([]),     //警力
                    marker_alarms: _alarm_init_arr.concat([]),       //警情
                    marker_sites: _site_init_arr.concat([])          //站点
                },
                polygons: [
                    {
                        path: []
                    }
                ],
                ploygonEvent:{
                    click : (event) => {
                        this.ploygonClick(event);
                    }
                },
                amapManager: amapManager,
                plugin: 'ToolBar',
                groundImage : "",
                bounds_position : [],
                childPoliceDept : [],
                childPoliceDeptPloygon : [],
                dep:'',
                list_type:0,
                show_list:false

            }
        },
        components: {
            ElButton,
            membercomponent: function(resolve, reject) {
                require(['../member.vue'], resolve)
            },
            siteListComponent: function(resolve, reject) {
                require(['../list/site_list.vue'], resolve)
            },
            alarmListComponent: function(resolve, reject) {
                require(['../list/alarm_list.vue'], resolve)
            },
            contactcomponent: function(resolve, reject) {
                require(['../contact.vue'], resolve)
            },
            zddetailcomponent: function(resolve, reject) {
                require(['../zddetail.vue'], resolve)
            },
            bjxqcomponent: function(resolve, reject) {
                require(['../bjxq.vue'], resolve)
            }
        },
        methods: {
            toggle:function(flag){
                this.is_zddetail=false;
                this.is_contact=false;
                this.isShow_bjxq=false;
                if (flag != this.list_type) {
                    this.list_type = flag;
                } else {
                    this.list_type = 0;
                }

            },
            toggleIcon:function (flag) {

                if(flag==1){

                    this.markers.is_show_alarms = !this.markers.is_show_alarms;

                }else if(flag==2){
                    this.markers.is_show_members = !this.markers.is_show_members;

                }else if(flag==3){
                    this.markers.is_show_sites = !this.markers.is_show_sites;

                }
            },
            hideListComponent:function() {
                this.list_type = 0;
            },

//            toggle_members: function () {
//                this.markers.is_show_members = !this.markers.is_show_members;
//                this.getMembersData();
//            },
//            toggle_alarms: function () {
//                this.markers.is_show_alarms = !this.markers.is_show_alarms;
//                this.getAlarmsData();
//            },
//            toggle_sites: function () {
//                this.markers.is_show_sites = !this.markers.is_show_sites;
//                this.getSitesData();
//            },


            show_contact: function(obj) {
//                if (obj && obj.img && obj.img.indexOf("http") != 0 && obj.img.indexOf("//") != 0) {
//                    obj.img = global.config.imgbaseurl + obj.img;
//                }

                obj && (obj.img = global.tools.imgpathformat(obj.img));

                let _position = obj.position;
                if (_position && this.markers.is_show_members) {
                    let arr = _position.split(",");
                    (arr && arr.length==2) && this.updateCenter(arr);

                    let _member_point = this.amapManager.getComponent("mb_"+obj.id);
                    if (typeof (_member_point) != undefined && _member_point) {
                        _member_point.setzIndex(10);
                        _member_point.setAnimation("AMAP_ANIMATION_DROP");
                    }

                }
                this.userdetails = obj;
                this.isShow_bjxq = false;
                this.is_zddetail = false;
                this.is_contact = true;
            },

            show_alarms_detail(data) {
                let that = this;
                that.is_zddetail = false;
                that.is_contact = false;
                if (!data || !data.alertId) {
                    that.$message({
                        type: 'error',
                        message: "未找到对应的警情，请重新尝试"
                    });
                    return;
                }

                let _position = data.location;
                if (_position && this.markers.is_show_alarms) {
                    let arr = _position.split(",");
                    (arr && arr.length==2) && this.updateCenter(arr);


                    let _alarm_point = this.amapManager.getComponent("al_"+data.alertId);
                    if (typeof (_alarm_point) != undefined && _alarm_point) {
                        _alarm_point.setzIndex(10);
                        _alarm_point.setAnimation("AMAP_ANIMATION_DROP");
                    }
                }
                that.$http.post(
                        global.config.weburl + 'api/alert/queryAlert.do', {
                            token: global.data.getToken(),
                            status: 0,
                            alertIds: data.alertId
                            //                            page:1,
                            //                            pageSize:10000
                        }).
                then(function(res) {
                    if (res.data.code != 0) {
                        global.tools.handleError(res.data);
                        return;
                    }
                    var arr = res.body.data;
                    var local = [];

                    if (arr && arr.length > 0) {
                        that.jqfb_list_detail = arr[0];
                        that.isShow_bjxq = true;
                    } else {
                        that.$message({
                            type: 'error',
                            message: "未找到对应的警情，请重新尝试"
                        });
                    }

                }, function(error) {

                });

            },

            show_site_detail2 (data) { //需要把百度转成高德
                this.is_contact = false;
                this.isShow_bjxq = false;

                let _position = data.location;
                if (_position && this.markers.is_show_sites) {
                    let arr = _position.split(",");

                   // this.convertFrom (arr, (meg, result) => {
                   //     if (result.info = "ok") {
                   //         let _center_arr = [result.locations[0].lng, result.locations[0].lat];
                   //         this.updateCenter(_center_arr);

                   //         let _site_point = this.amapManager.getComponent("si_"+data.id);
                   //         if (typeof (_site_point) != undefined && _site_point) {
                   //             _site_point.setzIndex(10);
                   //             _site_point.setAnimation("AMAP_ANIMATION_DROP");
                   //         }

                   //     }
                   // });



                    (arr && arr.length==2) && this.updateCenter(arr);
                    let _site_point = this.amapManager.getComponent("si_"+data.id);
                    if (typeof (_site_point) != undefined && _site_point) {
                        _site_point.setzIndex(10);
                        _site_point.setAnimation("AMAP_ANIMATION_DROP");
                    }


                }

                this.zd_detail = data;
                this.is_zddetail = true;
            },
            show_site_detail (data) {

//                this.is_contact = false;
//                this.isShow_bjxq = false;
//
//                let _position = data.location;
//                if (_position && this.markers.is_show_sites) {
//                    let arr = _position.split(",");
//
//                    this.convertFrom (arr, (meg, result) => {
//                        if (result.info = "ok") {
//                        let _center_arr = [result.locations[0].lng, result.locations[0].lat];
//                        this.updateCenter(_center_arr);
//                        this.amapManager.getComponent("si_"+data.id).setzIndex(10);
//                        this.amapManager.getComponent("si_"+data.id).setAnimation("AMAP_ANIMATION_DROP");
//                    }
//                });
//
//                }
//
//                this.zd_detail = data;
//                this.is_zddetail = true;

                this.is_contact = false;
                this.isShow_bjxq = false;

                let _position = data.location;
                if (_position && this.markers.is_show_sites) {
                    let arr = _position.split(",");
                    (arr && arr.length==2) && this.updateCenter(arr);
                    //this.amapManager.getComponent("si_"+data.id).setAnimation("AMAP_ANIMATION_DROP");
                }


                this.zd_detail = data;
                this.is_zddetail = true;
            },
            hidezddetail:function() {
                //隐藏站点详情
                this.is_zddetail = false;
            },
            hidden_contact: function() {
                this.is_contact = false;
            },
            hide_bjxq: function() {
                this.isShow_bjxq = false;
            },

            hideMember:function() {
                if(this.is_member){
                    if(this.is_member==1){
                        this.is_member=2;
                    }else{
                        this.is_member=1;
                    }
                }else{
                    this.is_member=1;
                }
            },

            doto_refresh_list: function() {
                this.isShow_bjxq = false;
                this.getAlarmsData();
            },

            formatMember: function(arr) {
                let _arr1 = [];
                let _arr2 = [];
                let local = [];
                arr.forEach(function(value, index, array) {


                    if (value.position && value.position.split(",").length == 2) {
                        local = value.position.split(",");
                        if (value.type == "1") {
                            _arr1.push({
                                extData :value,
                                position :local
                            });
                        } else  {
                            _arr2.push({
                                extData :value,
                                position :local
                            });
                        }
                    }
                });
                this.markers.marker_members[0]['data'] = _arr1;
                this.markers.marker_members[1]['data'] = _arr2;

            },
            getMembersData: function() {
                let that = this;
                if (!that.markers.is_show_members) {
                    return false;
                }

                that.markers.member_loading=true;
                that.$http.post(global.config.weburl + 'api/user/queryUserList.do', {
                        token: global.data.getToken(),
                        type: "backUser",
                        auth: "authed",
                        sortby: "is_online desc, realname asc"
                    }).then(function(res) {

                        if (res.data.code != 0) {
                            that.markers.member_loading=false;
                            global.tools.handleError(res.data);
                            return;
                        }

                        var arr = res.data.data;
                        that.userlist = {
                            data: arr
                        };
                        that.formatMember(arr);

                        that.markers.member_loading=false;

                    }, function(error) {
                        that.markers.member_loading=false;
                    }
                );
            },
            formatAlarms: function(arr) {

                let _arr1 = [];
                let _arr2 = [];
                let _arr3 = [];
                let _arr4 = [];

                let local = [];
                arr.forEach(function(value, index, array) {
                    if (value.location && value.location.split(",").length == 2) {

                        local = value.location.split(",");
                        switch (value.type) {
                            case 1 :
                                _arr1.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            case 2 :
                                _arr2.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            case 3 :
                                _arr3.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            case 4 :
                                _arr4.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                        }
                    }
                });

                this.markers.marker_alarms[0]['data'] = _arr1;
                this.markers.marker_alarms[1]['data'] = _arr2;
                this.markers.marker_alarms[2]['data'] = _arr3;
                this.markers.marker_alarms[3]['data'] = _arr4;


            },
            getAlarmsData: function () {//获取警情数据
                let that = this;
                if (!that.markers.is_show_alarms) {
                    return false;
                }
                that.markers.alarm_loading=true;

                that.$http.post(
                    global.config.weburl + 'api/alert/allAlertItem.do', {
                        token: global.data.getToken(),
                        status: 0
                        //                            page:1,
                        //                            pageSize:10000
                    }).
                then(function(res) {
                    // console.log(res);
                    if (res.data.code != 0) {
                        that.markers.alarm_loading = false;
                        global.tools.handleError(res.data);
                        return;
                    }

                    var arr = res.body.data;
                    that.alarmlist =arr;
                    that.formatAlarms(arr);
                    that.markers.alarm_loading = false;

                }, function(error) {
                    that.markers.alarm_loading = false;
                });

            },
            formatSite: function(arr) {
                let _arr1 = [];
                let _arr2 = [];
                let _arr3 = [];
                let _other = [];
                let local = [];
//
//                let _my_point_arr = [];
//                let _real_data_arr = [];


                /*** 百度转高德 start **/

//                arr.forEach(function(value, index, array) {
//                    if (value.location) {
//                        _my_point_arr.push(value.location.split(","));
//                        _real_data_arr.push(value);
//                    }
//                })

//                this.convertFrom (_my_point_arr, (meg, result) => {
//                    if (result.info = "ok") {
//                        _my_point_arr = result.locations;

//                        _real_data_arr.forEach(function(value, index, array) {
//                            if (value.location) {
//                                local = _my_point_arr[index];
//                                switch (value.type) {
//                                    case 1 :
//                                        _arr1.push({
//                                            extData :value,
//                                            position :[local.lng, local.lat]
//                                        });
//                                        break;
//                                    case 2 :
//                                        _arr2.push({
//                                            extData :value,
//                                            position :[local.lng, local.lat]
//                                        });
//                                        break;
//                                    case 3 :
//                                        _arr3.push({
//                                            extData :value,
//                                            position :[local.lng, local.lat]
//                                        });
//                                        break;
//                                    default:
//                                        _other.push({
//                                            extData :value,
//                                            position :[local.lng, local.lat]
//                                        });
//                                        break;
//                                }
//                            }
//                        });
//
//                        this.markers.marker_sites[0].data = _arr1;
//                        this.markers.marker_sites[1].data = _arr2;
//                        this.markers.marker_sites[2].data = _arr3;
//                        this.markers.marker_sites[3].data = _other;

//                    }
//                });




                /*** 百度转高德 end **/


                arr.forEach(function(value, index, array) {
                    if (value.location && value.location.split(",").length == 2) {
                        local = value.location.split(",");
                        switch (value.type) {
                            case 1 :
                                _arr1.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            case 2 :
                                _arr2.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            case 3 :
                                _arr3.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                            default:
                                _other.push({
                                    extData :value,
                                    position :local
                                });
                                break;
                        }
                    }
                });



                this.markers.marker_sites[0].data = _arr1;
                this.markers.marker_sites[1].data = _arr2;
                this.markers.marker_sites[2].data = _arr3;
                this.markers.marker_sites[3].data = _other;

            },
            getSitesData: function () {//获取站点数据
                let that = this;
                if (!that.markers.is_show_sites) {
                    return false;
                }
                that.markers.site_loading = true;

                that.$http.get(
                    global.config.weburl + 'api/entity/list.do', {
                        params: {
                            token: global.data.getToken()
                        }
                    }).
                then(function(res) {
                    if (res.data.code != 0) {
                        that.markers.site_loading = false;
                        global.tools.handleError(res.data);
                        return;
                    }

                    var arr = res.body.data;

                    that.sitelist = arr;

                    that.formatSite(arr);

                    that.markers.site_loading = false;

                }, function(error) {
                    that.markers.site_loading = false;
                });
            },
            gotoList :function() {
                this.show_list=true;
                this.$router.push("/wlf/list");
            },
            backinitposition :function() {
                let comp =  this.amapManager.getComponent("alarm_polygon_comp");
                if(comp) {
                    this.getMap().setFitView(comp);
                }

            },
            getPolygon : function() {

                let userinfo = global.data.getUserInfo();
                let user_dept = userinfo.dept;


                //获取中心点的位置
                let _point = user_dept.location;

                if (_point) {

//                    this.convertFrom (_point.split(","), (meg, result) => {
//                        if (result.info = "ok") {
//                            this.center = [result.locations[0].lng, result.locations[0].lat];
//                        }
//                    });
                    let _point_arr = _point.split(",");
                    (_point_arr && _point_arr.length==2) && (this.center = _point_arr);
                }



                //获取围栏位置
                let _location = user_dept.xyz;
                let arr_loaction = _location ? _location.split("|") : new Array();
                let _polygons_arr = [];
                for (let laction = 0; laction < arr_loaction.length; laction++) {
                    let locat_str = arr_loaction[laction] + "";
                    let _arr = locat_str.split(",");
                    _arr && _polygons_arr.push(_arr);
                }
                //this.polygons[0].path = _polygons_arr;

//                this.convertFrom (_polygons_arr, (meg, result) => {
//                    if (result.info = "ok") {
//                        this.polygons[0].path = result.locations;
//
//                        setTimeout(()=>{
//                            this.backinitposition();
//                        }, 300)
//
//                    }
//                });
                this.polygons[0].path = _polygons_arr;


                //获取覆盖图的位置
                this.groundImage = user_dept.bgImagePath;
                let _bounds_position = [];
                let _mybounds = [];

                _bounds_position = user_dept.bgImageSpot ? user_dept.bgImageSpot.split("|") : [];
                if (_bounds_position.length == 2) {

                    _mybounds.push(_bounds_position[0].split(","));
                    _mybounds.push(_bounds_position[1].split(","));

                }
                this.bounds_position = _mybounds;

                //this.backinitposition();


            },
            getDeptPloygon(dept) {
                let that = this;
                let _location = dept.xyz;
                let arr_loaction = _location ? _location.split("|") : new Array();
                let _polygons_arr = [];
                for (let i = 0; i < arr_loaction.length; i++) {
                    let locat_str = arr_loaction[i] + "";
                    let _arr = locat_str.split(",");
                    _arr && _polygons_arr.push(_arr);
                }

//                _polygons_arr && (_polygons_arr.length>0) && this.convertFrom (_polygons_arr, (meg, result) => {
//                    if (result.info = "ok") {
//                        that.childPoliceDeptPloygon.push({
//                            path:result.locations
//                        });
//                    }
//                });


                if (_polygons_arr && (_polygons_arr.length>0)) {
                    that.childPoliceDeptPloygon.push({
                        path:_polygons_arr
                    });
                }

            },
            loadChildPoliceDept (){
                let that = this;

                that.childPoliceDeptPloygon = [];
                that.childPoliceDept.forEach(
                    function(item, index) {
                        that.getDeptPloygon(item);
                    }
                );
            },
            convertFrom :function (points, callback) {
                //添加坐标转换 [ 如果后台换成高德就不要了，放开最下面的注释，注释掉第一句]

                // AMap.convertFrom(points, 'baidu', callback);

                callback('success', {
                    "info": 'ok',
                    "locations": points
                })

            },

            getChildPoliceDept () {
                let that = this;
                let userinfo = global.data.getUserInfo();
                let user_dept = userinfo.dept;

                global.tools.getChildPoliceDept(user_dept.id).then(function(ResultJson) {

                    //通过拿到的数据渲染页面
                    that.childPoliceDept = ResultJson;
                    that.loadChildPoliceDept();


                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑
                });

            },

            getMap: function() {
                return this.amapManager.getMap();
            },
            ploygonClick:function(e) {
                //console.log(e);
            },

            updateCenter(center) {
                this.center = center;
                this.map_option.zoom = 20;
            },

            init : function() {
                //初始化

                this.getMembersData();
                this.getAlarmsData();
                this.getSitesData();
                this.getPolygon();
                this.getChildPoliceDept();
            },
            showAlarmDetailBox(data) {
                let that = this;
                that.is_zddetail = false;
                that.is_contact = false;
                that.jqfb_list_detail = data;
                that.isShow_bjxq = true;
            },
            addListener: function() {
                const that = this;
                const Bus = global.eventHub;
                Bus.$on('showAlarmDetailBox',that.showAlarmDetailBox);
            },
            removeListener: function() {
                const that = this;
                const Bus = global.eventHub;
                Bus.$off('showAlarmDetailBox',that.showAlarmDetailBox);
            }

        },
        watch:{
            list_type:function () {
                let that = this;
                if(that.list_type == 1){
                    that.getMembersData();
                }else if(that.list_type == 2){
                    that.getAlarmsData();
                }else if(that.list_type == 3){
                    that.getSitesData();
                }
            }
        },
        computed: {

            marker_member_arr(){ //警力
                return this.markers.is_show_members ? this.markers.marker_members : [];
            },

            marker_alarm_arr(){ //警情
                // console.log(this.markers.marker_alarms);
                return this.markers.is_show_alarms ? this.markers.marker_alarms : [];
            },

            marker_site_arr(){ //站点
                return this.markers.is_show_sites ? this.markers.marker_sites : [];
            },

            membertop(){
                return {
                    top:0,
                    height:this.$store.getters.getPageInfos.content_height+'px'
                }
            },
            isShowGroundImg() {
                let _boolean = this.groundImage && this.groundImage != "" && this.bounds_position.length == 2;
                return _boolean;

            }

        },

        beforeCreate() {
            //this._loadPromise = lazyAMapApiLoaderInstance.load();
        },

        mounted() {
            var that = this;
            that.dep = (global.data.getUserInfo() && global.data.getUserInfo().dept) ? global.data.getUserInfo().dept.name: "";

//            this._loadPromise.then(() => {
//                that.init();
//            });

            that.init();

        },
        created: function() {
            var that = this;
            that.addListener();
        },
        beforeDestroy: function() {
            this.removeListener();
        }
    }
</script>

<style lang="less">
    .my-group-component {
        position: absolute;
        z-index: 4;
        top: 0;
        width: 100%;
    }
    .is_show_jingqing{
        background: url("../../../../../static/images/gaojingOn.png") no-repeat;
        color: #0676E6;
    }
    .no_show_jingqing{
        background: url("../../../../../static/images/gaojingDown.png") no-repeat;
        color: #797979;
    }
    .is_show_jingli{
        background: url("../../../../../static/images/jingchaOn.png") no-repeat;
        color: #0676E6;
    }
    .no_show_jingli{
        background: url("../../../../../static/images/jingchaDown.png") no-repeat;
        color: #797979;
    }
    .is_show_zhandian{
        background: url("../../../../../static/images/zhandianOn.png") no-repeat;
        color: #0676E6;
    }
    .no_show_zhandian{
        background: url("../../../../../static/images/zhandainDown.png") no-repeat;
        color: #797979;
    }
    .icon-commom{
        background-position: -1px 10px;
        width: 100%;
        background-size: 20px 20px;
    }
    .cs-map-view {
        border: 1px solid #275e8b;
        padding: 20px;
        background: rgba(39, 94, 139, 0.3);
        overflow: hidden;
        position: relative;
        .icon_group{
            -moz-box-shadow: 3px 3px 10px 0px #ccc;  /* 老的 Firefox*/
            box-shadow:3px 3px 10px 0px #ccc;
            width: 242px;
            height: 40px;
            background-color: #fff;
            position: absolute;
            z-index: 199;
            right: 40px;
            top: 44px;
            overflow: hidden;
            .item{
                vertical-align: middle;
                display: inline-block;
                width: 70px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 12px;
                cursor: pointer;
            }
            .item:first-child{
                margin-left: 15px;
            }
            .item:not(:last-child){
                background: url("../../../../../static/images/line.png") no-repeat;
                background-position: 60px 12px;
            }
            div{
                display: inline-block;
            }
        }

    }
    .mybaidumap{
        width: 100%;
        height: 100%;
        overflow:hidden;
    }
    #mybaidumap{width: 100%;height: 120%;}

    .cs-main-btn-group {
        .mpa_back{width: auto;padding:10px;margin-bottom: 5px;margin-right: 30px;}
        display: flex;
        align-items: flex-end;
        .cs-btn-showList {
            cursor: pointer;
            font-size: 14px;
            color: #fff;
            padding: 7px;
            width: 120px;
            height: 40px;
            text-align: center;
            border-radius: 2px;
            background: #275e8b;
            border: none;
            margin-bottom: 7px;
        }
        button{
            cursor: pointer;
            font-size: 12px;
            width: 100px;
            height: 30px;
            color: #fff;
            margin-right: 30px;
            margin-bottom: 10px;
            outline: none;
            background: rgba(39, 94, 139, 0.3);
            border: 1px solid #275e8b;
        }
        .btn_type_highlight{
            color: #fff;
            background: #007AB9;
        }
        .cs-dep{
            display: inline-block;
            width: 117px;
            height: 42px;
            border: 1px solid #0076B3;
            background-color: #0076B3;
            position: relative;
            padding-right: 8px;
            .cs-triangle{
                width: 0;
                height: 0;
                border-bottom: 20px solid #000;
                border-left: 20px solid transparent;
                position: absolute;
                right: -1px;
                bottom: -1px;
            }
            .cs-dept{
                font-size: 16px;
            }
        }
    }

    .f_contact {
        position: absolute;
        z-index: 1000;
        right: 1px;
    }

    .cs-btn-showList i {
        margin-right: 10px;
    }

    .f_sblb {
        position: absolute;
        z-index: 2001;
        right: 50%;
        top: 85px;
    }

    .f_zddetail {
        position: absolute;
        z-index: 2001;
        right: 1px;
        top: 108px;
    }

    #page-content {
        position: relative;
        .member-sport{
            position: absolute;
            margin-left:-20px;
            z-index: 160;
            .list_component{
                display:flex;
                align-items: center;
                .tanchu{
                    cursor: pointer;
                    display: block;
                    height: 92px;
                    width: 22px;
                    background:#126a91;
                    text-align: center;
                    line-height: 90px;
                    border: 1px solid #5a9dbb;
                }
            }
        }
    }

    .cs-backInitMap {
        position: absolute;
        bottom: 90px;
        left: 40px;
        z-index: 2;
        text-indent: -9999px;
        background: url('/static/img/position.png') no-repeat 0 0;
        width: 34px;
        height: 34px;
    }

    .amap-marker-label{
        position: absolute;
        z-index: 2;
        border: 1px solid #fff;
        border-radius: 0.2rem;
        background-color: #fff;
        color:#003690;
        white-space: nowrap;
        cursor: default;
        padding: 3px;
        font-size: 12px;
        line-height: 14px;
        top:-25px;
        left: 0;
    }
</style>
