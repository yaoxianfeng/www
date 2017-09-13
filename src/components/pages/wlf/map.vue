<template>
    <div id="page-content" :style="main_style">
        <div class="cs-main-btn-group" :style="topbar_style">
        <div>
            <button :class="[is_jlfb?'is-plain':'']" v-on:click="fuc_jlfb">警力分布</button>
            <button :class="[is_jqfb?'is-plain':'']" v-on:click="fuc_jqfb">警情分布</button>
            <button :class="[is_zdfb?'is-plain':'']" v-on:click="fuc_zdfb">站点分布</button>
        </div>
        <div class="cs-btn-showList" v-on:click="gotoList">
            <i class="ha-icon-list"></i>列表展示
        </div>
        </div>
        <div class="cs-map-view" :style="content_sytle">
            <i class="cs-backInitMap" v-on:click="backinitposition"></i>
            <div class="mybaidumap">
                <div id="mybaidumap"></div>
            </div>
            <div :class="['member-sport',is_member==1?'member-enter-active':'',is_member==2?'member-leave-active':'']" :style="membertop">
                <membercomponent :isplace="is_jlfb" :member_loading="member_loading" :userlist="userlist" @show_contact="show_contact"></membercomponent>
                <span v-on:click="hidemember" :class="['tanchu',is_member==1?'el-icon-arrow-left':'el-icon-arrow-right']"></span>
            </div>
        </div>
        <transition name="zddetail" mode="out-in">
            <zddetailcomponent v-if="is_zddetail" :zd_detail="zd_detail" @hidezddetail="hidezddetail"></zddetailcomponent>
            <contactcomponent v-if="is_contact" :userdetails="userdetails" @hidden_contact="hidden_contact"></contactcomponent>
        </transition>

        <transition name="bjxq" mode="out-in">
            <bjxqcomponent style="z-index: 20;" v-if="isShow_bjxq" :jqfb_list_detail="jqfb_list_detail" @hide_bjxq="hide_bjxq" @doto_refresh_list="doto_refresh_list"></bjxqcomponent>
        </transition>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle],

    data: function() {
        return {
            member_loading:true,
            is_jlfb: true,
            is_jqfb: true,
            is_zdfb: true,
            data_jlfb: {
                points: []
            },
            data_jqfb: {
                points: []
            },
            data_zdfb: {
                points: []
            },
            marker_jlfb: [],
            marker_jqfb: [],
            marker_zdfb: [],
            is_member: 0, //人员详情
            is_contact: false,
            is_zddetail: false, //站点分布
            isShow_bjxq: false, //报警详情
            userlist: {
                data: []
            },
            userdetails: {},
            zd_detail: {},
            jqfb_list_detail: {},
            is_jqfb_loading: false,
            point_arr: []
        }
    },
    components: {

        membercomponent: function(resolve, reject) {
            require(['./member.vue'], resolve)
        },
        contactcomponent: function(resolve, reject) {
            require(['./contact.vue'], resolve)
        },
        zddetailcomponent: function(resolve, reject) {
            require(['./zddetail.vue'], resolve)
        },
        bjxqcomponent: function(resolve, reject) {
            require(['./bjxq.vue'], resolve)
        }
    },
    methods: {
        hidemember(){
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
        gotoList: function() {
            this.$router.push("/wlf/list");
        },
        hidden_contact: function() {
            this.is_contact = false;
        },
        show_contact: function(obj) {
            if (obj && obj.img && obj.img.indexOf("http") != 0) {
                obj.img = global.config.imgbaseurl + obj.img;
            }
            this.userdetails = obj;
            this.isShow_bjxq = false;
            this.is_zddetail = false;
            this.is_contact = true;
        },
        hidezddetail: function() {
            //隐藏站点详情
            this.is_zddetail = false;
        },
        hide_bjxq: function() {
            this.isShow_bjxq = false;
        },
        doto_refresh_list: function() {
            this.isShow_bjxq = false;
            this.unShowMarker("jqfb");
            this.doto_jqfb();
        },
        fuc_jlfb: function() {
            //警力分布
            if (this.is_jlfb) {
                //添加警力分布显示
                this.is_jlfb = false;
            } else {
                //去掉警力分布显示
                this.is_jlfb = true;
                this.is_contact = false;
            }
            this.doto_jlfb();

        },
        fuc_jqfb: function() {
            //警情情布
            if (this.is_jqfb) {
                //添加警情分布显示
                this.is_jqfb = false;
            } else {
                //去掉警情分布显示
                this.is_jqfb = true;
            }
            this.doto_jqfb();

        },
        fuc_zdfb: function() {

            //站点分布
            if (this.is_zdfb) {
                this.is_zdfb = false
            } else {
                this.is_zdfb = true;
                this.is_zddetail = false;
            }
            this.doto_zdfb();
        },
        doto_jlfb() {
            let BMap = this.$BMap;

            let that = this;
            if (!that.is_jlfb) {
                //显示警力分布
                that.$http.post(
                    global.config.weburl + 'api/user/queryUserList.do', {
                        token: global.data.getToken(),
                        type: "backUser",
                        auth: "authed",
                        sortby: "is_online desc, realname asc"
                    }).
                then(function(res) {
                    //console.log(res);
                    if (res.data.code != 0) {
                        global.tools.handleError(res.data);
                        return;
                    }
                    var arr = res.data.data;
                    that.userlist = {
                        data: arr
                    };
                    that.member_loading=false;
                    var local = [];
                    if (arr) {
                        that.marker_jlfb = [];
                        arr.forEach(function(value, index, array) {

                            if (value.position) {
                                local = value.position.split(",");

                                if (value.type == "1") {
                                    that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/ba.png", "jlfb", value);
                                } else  {
                                    that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/mj.png", "jlfb", value);
                                }

                            }


                        });
                    }
                }, function(error) {
                    setTimeout(() => {
                        that.member_loading=false;
                    }, 1000);
                });



                // console.log("创建警力分布");
                // that.addMarker(new BMap.Point(116.389226,39.917988), "./src/img/icon2.png","jlfb" , 2 );

            } else {
                //隐藏警力分布
                that.unShowMarker("jlfb");
            }
        },
        doto_jqfb() {

            let that = this;
            let BMap = that.$BMap;
            that.is_jqfb_loading = true;
            if (!that.is_jqfb) {
                //             //显示警情分布
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
                        that.is_jqfb_loading = false;
                        global.tools.handleError(res.data);
                        return;
                    }
                    var arr = res.body.data;
                    var local = [];

                    if (arr) {
                        that.jqfb_list_detail = {};
                        arr.forEach(function(value, index, array) {
                            // console.log("创建警情分布");
                            if (!value.location) {
                                return;
                            }
                            local = value.location.split(",");
                            if (value.type == 1) {
                                that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/yjbj.png", "jqfb", value);
                            } else if (value.type == 2) {
                                that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/ssj.png", "jqfb", value);
                            } else if (value.type == 3) {
                                that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/ssp.png", "jqfb", value);
                            } else if (value.type == 4) {
                                that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/jqbl.png", "jqfb", value);
                            }


                        });
                    }
                    that.is_jqfb_loading = false;

                }, function(error) {

                });

                // console.log("创建警情分布");
                // that.addMarker(new BMap.Point(116.394226,39.917988), "/static/img/icon/jingqing1.png","jqfb" , 0 );
            } else {
                //隐藏警情分布
                that.unShowMarker("jqfb");
                that.is_jqfb_loading = false;
            }
        },
        doto_zdfb() {
            let that = this;
            let BMap = this.$BMap;

            if (!that.is_zdfb) {
                //显示站点分布
                that.$http.get(
                    global.config.weburl + 'api/entity/list.do', {
                        params: {
                            token: global.data.getToken()
                        }
                    }).
                then(function(res) {
                    if (res.data.code != 0) {
                        global.tools.handleError(res.data);
                        return;
                    }

                    var arr = res.body.data;
                    var local = [];

                    if (arr) {
                        that.marker_zdfb = [];
                        arr.forEach(function(value, index, array) {
                            if (value.location) {
                                local = value.location.split(",");
                                //console.log("创建站点分布");
                                if (value.type == 1) {
                                    that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/jt.png", "zdfb", value);
                                } else if(value.type == 2) {
                                    that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/jws.png", "zdfb", value);
                                }else{
                                    that.addMarker(new BMap.Point(local[0], local[1]), "/static/img/icon/jj.png", "zdfb", value);
                                }
                            }


                        });
                    }
                }, function(error) {

                });

            } else {
                //隐藏站点分布
                that.unShowMarker("zdfb");
            }
        },
        show_JQ_detaitl(data) {
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
            that.$http.post(
                global.config.weburl + 'api/alert/queryAlert.do', {
                    token: global.data.getToken(),
                    status: 0,
                    alertIds: data.alertId
                        //                            page:1,
                        //                            pageSize:10000
                }).
            then(function(res) {
                // console.log(res);
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
        bindMarkerEvent(marker, type, value) {
            let that = this;
            const Bus = global.eventHub;

            if (type == "jlfb") {
                //警力分布点击事件
                marker.addEventListener("click", function(event) {
                    that.show_contact(event.data);
                });
                that.marker_jlfb.push(marker);
                //console.log("555555");
                that.marker_jlfb.remDub();
                //console.log("6666666");
            } else if (type == "jqfb") {
                //警情分布点击事件
                marker.addEventListener("click", function(event) {
                    that.show_JQ_detaitl(event.data);
                });
                that.marker_jqfb.push(marker);
                that.marker_jqfb.remDub();
            } else if (type == "zdfb") {
                //站点分布点击事件
                marker.addEventListener("click", function(event) {
                    // console.log(value);

                    that.is_contact = false;
                    that.isShow_bjxq = false;

                    that.zd_detail = event.data;
                    that.is_zddetail = true;
                });
                that.marker_zdfb.push(marker);
                that.marker_zdfb.remDub();
            }
        },
        unShowMarker(type) {
            let that = this;
            if (type == "jlfb") {
                for (let marker of that.marker_jlfb) {
                    that.map.removeOverlay(marker);
                    //marker.hide();
                }
            } else if (type == "jqfb") {
                for (let marker of that.marker_jqfb) {
                    that.map.removeOverlay(marker);
                    //marker.hide();
                }
            } else if (type == "zdfb") {
                for (let marker of that.marker_zdfb) {
                    that.map.removeOverlay(marker);
                    //marker.hide();
                }
            }


        },
        addMarker(point, src, type, value) {
            //创建地图上的标识物
            var that = this;
            let BMap = this.$BMap;
            value.optiontype = value;
            if (type == "zdfb") {
                let marker = new BMapLib.TextIconOverlay(point, 0, {
                    "styles": [{
                        url: src,
                        size: new BMap.Size(24, 36)
                    }]
                }, value);

                //let marker = new BMap.Marker(point, {icon: new BMap.Icon(src, new BMap.Size(21,24))});
                that.map.addOverlay(marker);
                that.bindMarkerEvent(marker, type, value);
                return;
            }


            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(point);
            convertor.translate(pointArr, 3, 5, translateCallback);

            let _bsize = new BMap.Size(31, 34);
            if (type == "jlfb") {
                _bsize = new BMap.Size(27, 35);
            }

            function translateCallback(data) {
                if (data.status === 0) {
                    //let marker = new BMap.Marker(data.points[0], {icon: new BMap.Icon(src, new BMap.Size(21,24))});

                    let marker = new BMapLib.TextIconOverlay(data.points[0], 0, {
                        "styles": [{
                            url: src,
                            size: _bsize
                        }]
                    }, value);

                    that.map.addOverlay(marker);
                    that.bindMarkerEvent(marker, type, value);
                }
            }

        },
        backinitposition() {

            this.mybdmap.setViewport(this.point_arr);
        },
        createMap() {

            let userinfo = global.data.getUserInfo();
            let user_dept = userinfo.dept;

            let xyz = user_dept.location;
            let xyz_arr = xyz.split(",");
            let _point_x;
            let _point_y;
            if (xyz_arr && xyz_arr.length > 0) {
                _point_x = xyz_arr[0];
                _point_y = xyz_arr[1];
            }

            //创建栅栏
            let BMap = this.$BMap;


            let map = new BMap.Map("mybaidumap", {
                enableMapClick: false,
                mapType: BMAP_NORMAL_MAP
            });
            this.mybdmap = map;
            this._point_x = _point_x;
            this._point_y = _point_y;
            //console.log("_point_x"+_point_x);
            //console.log("_point_x"+_point_y);
            map.centerAndZoom(new BMap.Point(_point_x, _point_y), 18);
            var mapType = new BMap.MapTypeControl({
                mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
            });
            map.addControl(mapType);
            map.enableScrollWheelZoom();




//            var stCtrl = new BMap.PanoramaControl();
//            stCtrl.setOffset(new BMap.Size(20, 20));
//            map.addControl(stCtrl);

            map.addControl(new BMap.NavigationControl());
            let _location = user_dept.xyz;
            let arr_loaction = _location ? _location.split("|") : new Array();

            this.point_arr = [];
            for (let laction = 0; laction < arr_loaction.length; laction++) {
                let locat_str = arr_loaction[laction] + "";
                let _arr = locat_str.split(",");
                this.point_arr.push(new BMap.Point(_arr[0], _arr[1]));
            }
            let polygon = new BMap.Polygon(this.point_arr, {
                strokeColor: "#675fd7",
                strokeWeight: 3,
                strokeOpacity: 1,
                fillOpacity: 0.1
            }); //创建多边形
            map.addOverlay(polygon); //增加多边形
            map.setViewport(this.point_arr);
            this.map = map;
        },

        initMap(BMap) {
            let that = this;
            this.$BMap = BMap;
            //console.log(this.$BMap);
            this.createMap();
            this.fuc_jlfb();
            this.fuc_jqfb();
            this.fuc_zdfb();


        },
        getMapScript() {
            //const ak = this._BMap().ak
            if (!global.BMap) {
                return new Promise((resolve, reject) => {
                    global._initBaiduMap = function() {
                        resolve(global.BMap)
                        global.document.body.removeChild($script)
                        global._initBaiduMap = null
                    }
                    const $script = document.createElement('script')
                    global.document.body.appendChild($script)
                    $script.src = '//api.map.baidu.com/api?v=2.0&ak=pYyi0ezfhpE9Exceq26QAcge&callback=_initBaiduMap';
                })
            }
            return Promise.resolve(global.BMap)
        },
        memberplace(x, y) {
            var that = this;
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(new BMap.Point(x, y));
            convertor.translate(pointArr, 3, 5, translateCallback);

            function translateCallback(data) {
                if (data.status === 0) {

                    that.mybdmap.centerAndZoom(data.points[0], 17);
                }
            }
        }

    },

    computed: {
        membertop(){
            return {
                top:0,
                height:this.$store.getters.getPageInfos.content_height+'px'
            }
        }
    },
    created() {
        let that = this;
//        var Bus = global.eventHub;
//        Bus.$on("member_place", function(msg) {
//            if (msg) {
//                var arr = msg.split(",");
//                that.memberplace(arr[0], arr[1]);
//            }
//        })
    },
    mounted: function() {
        const {
            getMapScript,
            initMap
        } = this
        getMapScript().then(initMap);
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

.cs-map-view {
    border: 1px solid #275e8b;
    padding: 20px;
    background: rgba(39, 94, 139, 0.3);
    overflow: hidden;
    position: relative;
}
.mybaidumap{
    width: 100%;
    height: 100%;
    overflow:hidden;
}
#mybaidumap{width: 100%;height: 120%;}

.cs-main-btn-group {
    display: flex;
    padding-left: 7.8%;
    align-items: flex-end;
    justify-content: space-between;
    button{
        width: 145px;
        height: 45px;
        border: none;
        color: #fff;
        padding-left: 30px;
        margin-right: 40px;
        margin-bottom: 15px;
        outline: none;
        background: url(/static/images/tab-active.png) no-repeat;
        background-size: 100% 100%;
    } 

    .is-plain{
        background: url(/static/images/tab.png) no-repeat;
    }
}

.f_contact {
    position: absolute;
    z-index: 1000;
    right: 1px;
}

.cs-btn-showList {
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    padding: 7px;
    width: 120px;
    border-radius: 3px;
    text-align: center;
    border-radius: 2px;
    background: #275e8b;
    border: none;
    margin-bottom: 7px;
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
        z-index: 200;
        display: flex;
        align-items: center;
        transform:translate(-340px,0);
        .tanchu{
            display: block;
            height: 90px;
            width: 20px;
            background:#126a90;
            text-align: center;
            line-height: 90px;
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

</style>
