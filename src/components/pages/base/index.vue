<template>
    <div class="index-page">
        <div class="logo" @click="goto_welcome_page"><img src="/static/images/logo.png" alt=""></div>
        <!--<div class="alarm" v-if="alarm" @click="readAlarm()">
            <div><img src="/static/images/alarm.png"/></div><div>有新的警情待处理</div>
        </div>-->
        <div class="top-date">
            <div @click="clickupcom">
                <router-link to="/wgz/upcom" class="peoplenum upcom">待办(</i><span>{{upcom}}</span>)</router-link>
            </div>
            <div class="peoplenum"><i class="peopleimg"></i><span>{{realname}}</span></div>
            <div class="peoplenum"><i class="icon-ha-date"></i><span>{{datetime|moment('YYYY-MM-DD')}}</span></div>
        </div>
        <div id="tp-weather-widget" class="top-weather"></div>
        <div class="top-weather" @click="getweather()" v-if="weather.weather_icon"><img class="icon-ha-weather" :src="weather.weather_icon"><div class="weather"><span class="temper">{{weather.temperature_curr}}&#8451;</span><span class="weatherStatus">{{weather.weather_curr}}</span></div></div>
        <div class="off-page" @click="exitSystem"></div>

        <div class="redive" @click="isoleft" :style="redivetop" v-if="isicon"><i :class="[oleft?'el-icon-arrow-left':'el-icon-arrow-right']" ></i></div> <!--按钮 -->

        <div :class="[oleft?'':'rediveleft','sidernav']"  :style="sidebarstyle" >
            <!--<div class="sidernav"  :style="sidebarstyle" >-->
            <sidebar ref="sidebar"></sidebar>
        </div><!-- 菜单 -->

        <!--<div  class="index-content" :style="mainPaddingLeft" >
            <transition name="fadeInRight" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>-->

        <div  :class="['index-content', isicon?'index-wxx':'index-other']"  :style="mainPaddingLeft" >
            <transition name="fadeInRight" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>



        <audio ref="alarm_audios" controls="false" style="display:none">
            <source src="/static/vedio/sound_alert.mp3">
        </audio>

        <div class="common-group-component">
            <!-- 组件组 -->
            <transition name="fadeRightBig">
                <bjxqcomponent v-if="isShow_bjxq" :jqfb_list_detail="jqfb_list_detail" @hide_bjxq="hide_bjxq" @doto_refresh_list="doto_refresh_list"></bjxqcomponent>

            </transition>

        </div>

    </div>
</template>

<script>


    import Sidebar from './nav.vue';
    import { Notification } from 'element-ui';

    export default {
        name: 'index',
        data:function() {
            return {
                upcom:0,
                timer:"",
                is_show_per_menu: false,
                realname: "",
                leftnavstyle:{},
                datetime:'',
                oleft:true,   //左侧导航是否显示
                iswxx:true,
                weather:{
                    temperature_curr:"",
                    weather_curr:"",
                    weather_icon:"",
                    code:0
                },
                alarm: false,
                jqfb_list_detail:{},    //警情详情
                alert_id: "",
                isShow_bjxq:false ,//是否显示报警详情
                data_length:0,

            }
        },

        methods:{
            goto_welcome_page() {
                this.$router.push("/welcome");
            },
            clickupcom(){
                sessionStorage.setItem("navshow", 6);
                this.oleft=true;
            },
            doto_refresh_list() {
                this.isShow_bjxq = false;
            },
            getweather:function(){
                let that = this;
                that.$http.post(global.config.weburl + "api/weather/queryByCity.do", {
                    token: global.data.getToken(),
                    cityName:"wuhan"
                }).then(function(res) {
                    if (res.data.code == 0) {
                        that.weather.code=res.data.data.results[0].now.code;
                        that.weather.temperature_curr=res.data.data.results[0].now.temperature;
                        that.weather.weather_curr=res.data.data.results[0].now.text;
                        that.weather.weather_icon="../../../../static/images/weather/weather/"+that.weather.code+".png";

                    } else {
                        global.tools.handleError(res.data);
                    }

                }, function(error) {
                    this.$message({
                        type: 'error',
                        message: "获取数据失败",
                    });

                })
            },
            hide_bjxq:function() {
                this.isShow_bjxq = false;
            },
            showPerMenu:function() {
                this.is_show_per_menu = true;
            },
            exitweb :function () {
                this.is_show_per_menu = false;
            },
            exitSystem : function() {
                sessionStorage.clear();
                global.tools.initData();
                this.$socket.emit("logout", this.token);
                this.$router.push("/");
            },
            resetPage : function () {
                let that = this;
                let body_height = document.documentElement.offsetHeight;
                let body_width = document.documentElement.offsetWidth;
                let left_width = 240;  //默认侧边栏宽度240px
                let _leftnavheight = document.documentElement.offsetHeight  - 68;
                that.leftnavstyle = {
                    height: _leftnavheight +"px"
                };

                this.$store.dispatch('update_page_info', {body_height, body_width, left_width});
            },
            launchFullscreen : function () {
                let marioVideo = document.documentElement;
                if (marioVideo.requestFullscreen) {
                    marioVideo.requestFullscreen();
                }
                else if (marioVideo.msRequestFullscreen) {
                    marioVideo.msRequestFullscreen();
                }
                else if (marioVideo.mozRequestFullScreen) {
                    marioVideo.mozRequestFullScreen();
                }
                else if (marioVideo.webkitRequestFullScreen) {
                    marioVideo.webkitRequestFullScreen();
                }
            },
            isoleft(){
                this.oleft=!this.oleft;
            },
            hideLeft() {
                this.oleft= false;
            },
            addEventHub() {
                var Bus=global.eventHub;
                Bus.$on("hideleft", this.hideLeft);
            },
            removeEventHub() {
                var Bus=global.eventHub;
                Bus.$off("hideleft", this.hideLeft);
            },
            getNewAlarm:function () {
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _formdata = {
                    token : token
                };
                that.$http.post(global.config.weburl + 'api/alert/getNewAlert.do', _formdata).then(function(res) {
                    if (res.data.code == 0) {
                        var _data = res.data.data;

                        if(_data!=null || _data.length > 0){
                            //播放声音
                            var media = this.$refs.alarm_audios;
                            if (typeof (media) !=undefined && media) {
                                media.play();
                            }
                            that.data_length = _data.length
                            that.jqfb_list_detail = _data[0];
                            that.alarm = true;
                        }
                    }
                })
            },
            reportNewAlarm: function(id){
                let that = this;
                var media = this.$refs.alarm_audios;
                if (typeof (media) !=undefined && media) {
                    media.play();
                }
                that.data_length = 1;
                that.alert_id = id;
                that.alarm = true;
            },
            readAlarm:function () {
                let that = this;
                const Bus = global.eventHub;
                that.notifyBox.close();

                let _path = this.$router.apps[0]._route.fullPath;
                var media = this.$refs.alarm_audios;
                if (typeof (media) !=undefined && media) {
                    media.pause();
                }

                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _formdata = {
                    token : token
                };
                that.$http.post(global.config.weburl + 'api/alert/readNewAlert.do', _formdata).then(function(res) {
                    if (res.data.code == 0) {
                        that.alarm = false;
                    }

                });

                that.$http.post(global.config.weburl + 'api/alert/queryAlert.do', {"token": token, "alertIds": that.alert_id}).then(function(res) {
                    if( res.data.code == 0){
                        this.jqfb_list_detail = res.data.data[0];
                        if (_path == "/wlf/list" || _path == "/wlf/map") {
                            Bus.$emit('showAlarmDetailBox', this.jqfb_list_detail);
                        } else {
                            that.isShow_bjxq = true;
                        }
                    }
                });



                //console.log(this.$router.apps[0]._route.fullPath);

            },
            intervalFuc:function(){

                this.timer=setInterval(()=>{
                            this.getweather();
            }, 1*60*60*1000);

                //每30秒获取一次警情
//            setInterval(()=>{
//                this.getNewAlarm();
//            }, 30*1000);

            },
            getupnum(){  //待办
                let that = this;
                this.$http({
                    method: 'POST',
                    url: global.config.weburl + "api/todolist/queryToDoListNum.do",
                    params: {
                        token:global.data.getToken(),
                    },
                }).then(function(res) {
                    that.is_loading = false;
                    if (res.data.code == 0) {
                        this.upcom=res.data.data.sumToDo;
                    }
                })
            }
        },

        components: {
            sidebar:Sidebar,
            bjxqcomponent: function(resolve, reject) {
                require(['../wlf/bjxq.vue'], resolve)
            }
        },

        computed:{

            fullPath(){
                return this.$router.apps[0]._route.fullPath;//路径
            },

            isicon(){

                if (this.fullPath.indexOf('/wxx') == 0) {
                    this.oleft=false;
                    return true;
                } else {
                    return false;
                }

            },
            sidebarstyle(){
                let left_width = this.$store.state.global.page_info.left_width;
                if (left_width < 140) {
                    left_width = 140
                }
                let _obj = {width:left_width+'px'};
                if (this.isicon) {
                    _obj['z-index'] = 10;
                } else {
                    _obj['z-index'] = 1;
                }
                return _obj;
            },
            mainPaddingLeft(){

                if (this.isicon) {
                    //微信息

                    return{
                        width:this.$store.getters.getPageInfos.body_width + "px",
                        paddingLeft:this.$store.getters.getPageInfos.body_width*0.015+'px',
                        paddingTop:this.$store.state.global.page_info.padding_top+'px',
                        paddingBottom:this.$store.state.global.page_info.padding_bottom+'px',

                    }

                } else {

                    let left_width = this.$store.state.global.page_info.left_width;
                    if (left_width < 140) {
                        left_width = 140
                    }
                    let _pad_left = this.$store.state.global.page_info.padding_left;
                    if (_pad_left <left_width + 40 ) {
                        _pad_left = left_width + 40;
                    }

                    return {
                        paddingLeft:_pad_left+'px',
                        paddingTop:this.$store.state.global.page_info.padding_top+'px',
                        paddingBottom:this.$store.state.global.page_info.padding_bottom+'px'
                    }
                }


            },
            redivetop(){
                return {
                    top:this.$store.getters.getPageInfos.body_height*0.37 + "px",
                }
            },
            fullwidth(){
                return{
                    width:this.$store.getters.getPageInfos.body_width + "px",
                    paddingLeft:this.$store.getters.getPageInfos.body_width*0.015+'px',
                    paddingTop:this.$store.state.global.page_info.padding_top+'px',
                    paddingBottom:this.$store.state.global.page_info.padding_bottom+'px'
                }
            },

        },
        watch:{

//        '$store.state.global.home_wxx':function(){  //监听全局变量
//            if(this.$store.state.global.home_wxx){
//                this.isicon=true;
//                this.oleft=true;
//                sessionStorage.setItem("_isicon", this.isicon);
//            }else{
//                this.isicon=false;
//                sessionStorage.setItem("_isicon", this.isicon);
//            }
//        },
            alarm:function () {
                let that = this;

                if (this.notifyBox) {
                    this.notifyBox.close();
                }

                 if(that.alarm){
                     const h = this.$createElement;

                     this.notifyBox = this.$notify({
                         title: '提示',
                         type:'warning',
                         message: h('i', {on: {click: that.readAlarm},style: 'color: blue;cursor: pointer;'},'有新的警情待处理'),
                         duration: 0

                     });
                 }
            },
            fullPath:function() {
                if (this.fullPath.indexOf('/wxx') != 0) {
                    this.oleft=true;
                }
            }

        },
        created(){
            let that = this;
            that.getupnum();
//            var _index = sessionStorage.getItem("navshow");
//            if (_index) {
//                this.onum = _index;
//            } else {
//                this.onum = 1;
//            }
//            if(this.onum==1){
//                this.oleft=false;
//            }

            if (this.fullPath.indexOf('/wxx') == 0){
                this.oleft=false;
            } else {
                this.oleft=true;
            }

            this.getweather();
            this.realname = global.data.getUserInfo() ? global.data.getUserInfo().realname: "";
            // 启动全屏!

            this.token = global.data.getToken();
            //sometimes socket connect listener register later than socket established.

            if(this.$socket && this.$socket.connected){
                this.$socket.emit("token", this.token);
            }

            this.datetime=new Date();




            //this.intervalFuc();
        },
        mounted() {
            let that = this;
            that.addEventHub();
            that.resetPage();
            window.onresize = function() {
                that.resetPage();
            }
        },
        socket: {
            // Prefix for event names
            // prefix: "/counter/",

            // If you set `namespace`, it will create a new socket connection to the namespace instead of `/`
            // namespace: "/counter",

            events: {

                // Similar as this.$socket.on("changed", (msg) => { ... });
                // If you set `prefix` to `/counter/`, the event name will be `/counter/changed`
                //
                new_alert(msg) {
                    console.log("Websocket receive event new_alert "+ msg);
                    //msg = "e5980150c28d4912b8d438be55fe704f";
                    if(msg && msg != ""){
                        this.reportNewAlarm(msg);
                    }
                },
                new_todo(msg) {
                    console.log("Websocket receive event new_todo "+ msg);
                    if(msg && msg != ""){
                        this.upcom = msg;
                    }
                },
                test_msg(msg){
                    console.log("Websocket receive event test_msg "+ msg);
                },

                /* common socket.io events */
                connect() {
                    console.log("Websocket connected to " + this.$socket.nsp);
                    if(this.token){
                        this.$socket.emit("token", this.token);
                    }
                },

                disconnect() {
                    console.log("Websocket disconnected from " + this.$socket.nsp);
                },

                error(err) {
                    console.error("Websocket error!", err);
                }

            }

        },
        beforeDestroy() {
            if (this.notifyBox) {
                this.notifyBox.close();
            }
            window.clearInterval(this.timer);
            this.removeEventHub();
        }
    }
</script>
<style src="../../../../static/css/common.css"></style>
<style src="../../../../static/libs/animate/animate.css"></style>
<style src="../../../../static/css/index.less" lang="less"></style>
<style lang="less">
    .index-page{
    .upcom{color: #fff;}
    .off-page{cursor: pointer;}
    .index-wxx{min-height: 700px;min-width: 1280px}
    .redive{width: 30px;background: rgba(39, 94, 139, 0.3);float: left; position: relative;left:0px; cursor: pointer; border: 1px solid #275e8b;}
    .rediveleft{left:-18%;
        transition:left 0.3s;
        -moz-transition:left 0.3s; /* Firefox 4 */
        -webkit-transition:left 0.3s; /* Safari and Chrome */
        -o-transition:left 0.3s; /* Opera */}
    .redive i{width: 100%;overflow: hidden;margin: 60% 0;margin-left: -20%; font-size: 40px;color:#255178; }
    .alarm{height: 6%;position: absolute;top: 0;left: 50%;margin-left: -83px;display: flex;align-items: center;}
    .alarm img{position: relative;top: 11px;width: 24px;}
    .alarm a{color:#fff;}
    .tpwthwidt .text_1vUR5ag, .tpwthwidt .title_2I35arv{color: #fff}
    .copyright_2JjcV5R{display: none !important}//[class^="copyright_"]
    }

</style>







