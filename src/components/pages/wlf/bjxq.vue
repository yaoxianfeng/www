<template>
        <div class="cs-bjxq-dailog" :style="bjsqtop">
            <div class="el-dialog__header"><span class="el-dialog__title">报警信息详情</span>
                <div class="el-dialog__headerbtn" @click="closeDialog"><i class="el-dialog__close el-icon el-icon-close"></i></div>
            </div>
            <div class="el-dialog__body cs-box cs-bjxq-dailog__body" :style="bjsqheight">
                <div class="cs-bjxqBox">
                    <fieldset class="cs-bjxq-item-box1 cs-bjxq-item-box">
                        <div class="legend">报警人信息</div>
                        <div class="cs-bjxq-people">
                            <div class="bjxq-row-name">
                                <span>报警人：</span>
                                <span class="bjxq-row-desc">{{jqfb_list_detail.alertUserRealname}}</span></div>
                            <div class="bjxq-row-name">
                                <span>报警时间：</span>
                                <span class="bjxq-row-desc">{{jqfb_list_detail.alertTime}}</span>
                            </div>
                            <div class="bjxq-row-name">
                                <span>电话：</span>
                                <span class="bjxq-row-desc">{{jqfb_list_detail.cellphone}}</span>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset class="cs-bjxq-item-box2 cs-bjxq-item-box">
                        <div class="legend">警情信息</div>
                        <div class="cs-bjxq-jingqing">
                            <div>
                                <span class="bjxq-row-name">报警地点：</span>
                                <span class="bjxq-row-desc"><i class="ha-icon-position" @click="showPosition"></i>{{jqfb_list_detail.address}}</span>
                            </div>
                            <div style="padding: 15px 0;">
                                <span class="bjxq-row-name">报警内容：</span>
                                <span class="bjxq-row-desc">{{jqfb_list_detail.description}}</span>
                            </div>
                        </div>
                        
                    </fieldset>
                    <fieldset class="cs-bjxq-item-box3 cs-bjxq-item-box">
                        <div class="legend">图像信息</div>
                        <ul>
                            <li class="tuxiang">
                                <div class="cs-bjxq-item-lable">图片</div>
                                <div class="cs-bjxq-item-text" ref="fcsbjxqimg">
                                    <!-- <h5>图片</h5> -->
                                    <div v-for="(n, index) in imageList" :key="n.id" :data-index="index">
                                        <img class="image" :src="n.url">
                                    </div>
                                </div>
                            </li>
                            <li  class="tuxiang">
                                <div class="cs-bjxq-item-lable">语音</div>
                                <div class="cs-bjxq-item-voice cs-bjxq-item-text">
                                        <div class="cs_sy_icon" :span="8" v-for="(song, index) in songList" :key="song.id" v-if="song?true:false">
                                            <span class="voice_sj" @click="startStop(index)">{{songsj[index]+"s"}}</span>
                                            <img ref="imgs" src="/static/img/songPic.png" @click="startStop(index)" />
                                            <audio ref="audios" controls="false" style="display:none">
                                                <source :src="song">
                                            </audio>
                                        </div>
                                </div>
                            </li>
                            <li  class="tuxiang">
                                <div class="cs-bjxq-item-lable">视频</div>
                                <div class="cs-bjxq-item-text">
                                    <!-- <h5>视频</h5> -->
                                    <div v-for="(video,index) in videoList" :key="video.id" v-if="video?true:false">
                                        <img v-if="video?true:false" src="/static/img/xhdpi.png" class="video_image" @click="playvideo(video)">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </fieldset>
                    <fieldset  class="cs-bjxq-item-box4 cs-bjxq-item-box">
                        <div class="legend">处理流程</div>
                        <div class="el-steps" v-for="(log, index) in jqfb_list_detail.logs">
                            <span style="width: 30px;display: inline-block;">{{index*1+1}}、</span>
                            <span>{{log.createTime}}，</span>
                            <span>{{log.realname}}</span>
                            <span v-if="log.title!='评价反馈'">{{log.title}}</span>
                            <div class="rate" v-if="log.rate">
                                <span class="rate_title">评价：</span>
                                <ha-rate-group  :rate_data="rate_data" class="rate_data"></ha-rate-group>
                            </div>
                            <div class="log_description" v-if="log.description" >{{log.description}}</div>
                        </div>

                    </fieldset>
                    <div class="bjxq-dialog-footer" v-if="is_weipai || is_jcjb || is_jqyc">
                        <el-button type="primary" v-if="is_weipai" @click="showwplb"><span>警情委派</span></el-button>
                        <el-button type="primary" v-if="is_jcjb" @click="showjcjb"><span>解除警报</span></el-button>
                        <el-button type="primary" v-if="is_jqyc" @click="showjqyj"><span>警情移交</span></el-button>
                        <el-button type="primary" v-if="false"><span>视频通话</span></el-button>
                    </div>
                </div>
            </div>
            <div class="bjxq-group-component">
                <jcjbcomponent v-if="isShow_jcjb" ref="jcjbcomponent" :jcjb_alertIds="jcjb_alertIds" :jcjb_caseType="jcjb_caseType" @hide_jcjb="hide_jcjb" @doto_save_jcjb_suc="doto_save_jcjb_suc"></jcjbcomponent>
                <shipingcomponent v-if="is_shiping" :videodata="videodata"></shipingcomponent>
                <wplbcomponent v-if="is_wplb" :alertId="jcjb_alertIds" @close_wplb="close_wplb" @wp_succ="doto_save_jcjb_suc"></wplbcomponent>
                <jqyjcomponent v-if="is_jqyj" :alertId="jcjb_alertIds" :alertDeptId="jqyj_alertDeptId" @close_jqyj="close_jqyj" @yj_succ="doto_save_jcjb_suc"></jqyjcomponent>
                <positioncomponent v-if="is_show_position" :position_data="position_data" @closePositionDialog="closePositionDialog"></positioncomponent>
            </div>
        </div>
</template>
<script>
import {
    videoPlayer
} from 'vue-video-player';
export default {
    props: {
        jqfb_list_detail: {
            type: Object,
            default: null
        }
    },
    components: {
        jcjbcomponent: function(resolve, reject) {
            require(['./jcjb.vue'], resolve)
        },
        shipingcomponent: function(resolve, reject) {
            require(['./shiping.vue'], resolve)
        },
        positioncomponent: function(resolve, reject) {
            require(['./position.vue'], resolve)
        },
        wplbcomponent: function(resolve, reject) {
            require(['./wplb.vue'], resolve)
        },
        jqyjcomponent: function(resolve, reject) {
            require(['./jqyjlb.vue'], resolve)
        },
        videoPlayer
    },

    data: function() {
        return {
            rate_data : [],
            dialogMainHeight: 500,
            mapStyle: {
                width: '100%',
                height: this.mapHeight - 80 + 'px'
            },
            videodata: null,
            viewers:null,
            is_shiping: false,
            is_wplb: false,
            is_jqyj:false,
            imageList: [],
            songList: [],
            songsj: [],
            videoList: [],
            isShow_jcjb: false,
            jcjb_alertIds: null,
            jcjb_caseType:null,
            jqyj_alertDeptId:null,
            song_play_index: null,
            position_data:{
                location:"",
                type:null
            },
            is_show_position:false
        }
    },
    methods: {
        startStop(index) {
            var media = this.$refs.audios;
            var imgs = this.$refs.imgs;
            if (this.song_play_index != null) {
                imgs[this.song_play_index].src = "static/img/songPic.png";
                media[this.song_play_index].pause();
            }

            if (this.song_play_index == index) {
                imgs[index].src = "static/img/songPic.png";
                this.song_play_index = null;
                return;
            }

            media[index].play();
            imgs[index].src = "static/img/start.gif";
            this.song_play_index = index;
            media[index].addEventListener('ended', function(e) {
                imgs[index].src = "static/img/songPic.png";
            })
        },
        close_wplb(){
            this.is_wplb = false;
        },
        close_jqyj(){
            this.is_jqyj=false;
        },
        showjqyj() {
            this.is_jqyj = true;
            this.jcjb_alertIds = this.jqfb_list_detail.alertId;
            this.jqyj_alertDeptId=this.jqfb_list_detail.alertDeptId;
        },
        showwplb: function() {
            this.is_wplb = true;
            this.jcjb_alertIds = this.jqfb_list_detail.alertId;
        },
        showjcjb: function() {
            this.jcjb_caseType = this.jqfb_list_detail.classify;
            this.jcjb_alertIds = this.jqfb_list_detail.alertId;
            this.isShow_jcjb = true;
        },
        playvideo: function(video) {
            var media = this.$refs.audios;
            var imgs = this.$refs.imgs;
            for (var i in media) {
                if (i != 'remDub') {
                    imgs[i].src = "static/img/songPic.png";
                    media[i].pause();
                }
            }
            if (video) {
                this.is_shiping = true;
                this.videodata = video;
            }
        },
        hide_jcjb: function() {
            this.jcjb_alertIds = null;
            this.jqyj_alertDeptId=null;
            this.isShow_jcjb = false;
        },
        closeDialog: function() {
            this.$emit('hide_bjxq');
        },
        doto_save_jcjb_suc: function() {
            this.hide_jcjb();
            this.close_wplb();
            this.close_jqyj();
            this.$emit('doto_refresh_list');
        },
        showPosition() {

            this.is_show_position = true;
            this.position_data = {
                location: this.jqfb_list_detail.location,
                type: this.jqfb_list_detail.type
            }
        },
        closePositionDialog(){
            this.is_show_position = false;
        },
        loadDetail() {
            let imgarr = [];
            let that = this;
            that.imageList= [];
            that.videoList = [];
            that.songList = [];


            that.jqfb_list_detail.logs && that.jqfb_list_detail.logs.forEach(function (e){
                if(e.rate){
                    that.rate_data = [
                        {'name' : "接警速度 :", value: e.turningSpeed},
                        {'name' : "处理效率 :", value: e.processingEfficiency},
                        {'name' : "反馈结果 :", value: e.feedbackResult}
                    ]
                }
            })
            let msg = this.jqfb_list_detail;
            let obj = {
                width: 900,
                height: 675
            };
            if (msg.imgs) {
                var arr = msg.imgs.split(",");
                var pattent = /^http/;
                arr.forEach(function(value, index, array) {
                    if (pattent.test(value)) {
                        imgarr.push({
                            width: 900,
                            height: 675,
                            url: value
                        });
                    } else {
                        if (value) {
                            imgarr.push({
                                width: 900,
                                height: 675,
                                url: global.config.webupload + value
                            });
                        }

                    }

                });
            }
            that.imageList = imgarr;
            if (msg.videos) {
                var pattent = /^http/;
                msg.videos.split(",").forEach(function(value, index, array) {
                    if (pattent.test(value)) {
                        that.videoList.push(value);
                    } else {
                        if (value) {
                            that.videoList.push(global.config.webupload + value);
                        }
                    }

                })

            } else {
                that.videoList = [];
            }
            if (msg.voices) {
                this.songsj = msg.voicesTime.split(",");
                var pattent = /^http/;
                msg.voices.split(",").forEach(function(value, index, array) {
                    if (pattent.test(value)) {
                        that.songList.push(value);
                    } else {
                        if (value) {
                            that.songList.push(global.config.webupload + value);
                        }
                    }
                })
            } else {
                that.songList = [];
                that.songsj = [];
            }
        },
        initImgViewer() {
            let that=this;
            if (this.viewer) {
                this.viewer.update();
            } else {
                if (this.imageList[0]) {
                    this.viewer = new Viewer(this.$refs.fcsbjxqimg, {
                        movable: false,
                        viewed:function(){
                            that.viewer.image.parentNode.onclick = function() {
                                that.viewer.hide();
                            },
                            that.viewer.image.onclick = function(e) {
                                if (e && e.stopPropagation) {//非IE浏览器 
                                　　e.stopPropagation(); 
                                } 
                                else {//IE浏览器 
                                    window.event.cancelBubble = true; 
                                } 
                            }
                        }

                    });
                }
            }
        }
    },
    watch:{
        jqfb_list_detail:function(){
            this.loadDetail();
        }
    },

    computed:{
        bjsqheight(){
            return {
                maxHeight:this.$store.getters.getPageInfos.content_height*1-52 +'px',
                overflowY:'auto'
            }
        },
        bjsqtop(){
            return {
                top:this.$store.getters.getPageInfos.top_bar_height+'px'
            }
        },
        is_weipai() {
            // 处理状态,0-未处理,1-已完成,2-已委派(选配),3-已协作(选配),4-已上报(选配),5-已删除,6-待评价（已解除）,7-已移交
            let _status = this.jqfb_list_detail.status;
            if (_status == 0 ) {
                //未处理可以委派
                return true
            } else {
                return false;
            }

        },
        is_jqyc() {
            let _status = this.jqfb_list_detail.status;
            let _curPolice = this.jqfb_list_detail.curPolice;
            let userId = global.data.getUserInfo().id;
            // || (_status == 2 && userId == _curPolice.id)
            if (_status == 0) {
                //未处理可以移交， 当前操作人可以再次移交
                return true
            } else {
                return false;
            }

        },
        is_jcjb() {
            let _status = this.jqfb_list_detail.status;
            let _curPolice = this.jqfb_list_detail.curPolice;
            let userId = global.data.getUserInfo().id;
            if (_status == 0 || (( _status == 2 || _status == 7) && userId == _curPolice.id)) {
                //未处理可以移交
                return true
            } else {
                return false;
            }
        }
    },
    mounted: function() {
        let that = this;
        this.loadDetail();
    },

    updated() {
        this.initImgViewer();
    }
}
</script>
<style lang="less">
.cs-bjxq-dailog {
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    background: rgba(0, 0, 0, 0.9);
    width: 830px;
    position: absolute;
    right: 0;
    border-radius: 2px;
    z-index: 1000;
    .cs_sy_icon {
        position: relative;
        margin-right: 20px;
        cursor: pointer;
    }
    .cs_sy_icon .voice_sj {
        color: #fff;
        position: absolute;
        top: 5px;
        left: 40px;
        font-size: 14px;
    }
    .check {
        margin-top: 34px;
        width: 30px;
        height: 30px;
    }
    .line {
        width: 2px;
        height: 90%;
        background-color: lightgray;
        position: absolute;
        top: 60%;
        left: 3%;
        z-index: -1;
    }
    .realname {
        font-size: 16px;
        color: #fff;
        margin-top: 5%;
    }
    .el-step__title {
        float: right;
        margin-top: -7%;
        padding-right: 10px;
        color: #fff;
        font-weight: normal;
    }
    .el-step__description {
        line-height: 23px;
        color: #fff;
    }
    .el-steps img{
        width: 18px;
    }
    .el-dialog__header {
        background: #275e8b;
        height: 50px;
        padding: 15px 20px;
        border-bottom: 1px solid #275e8b;
        position: relative;
        .el-dialog__headerbtn{
            position: absolute;right: 20px;top: 15px;
        }
    }
    .cs-bjxq-dailog__body {
        padding: 5px 0 10px;
    }
    .cs-bjxqBox {
        width: 100%;
        background:url(/static/images/bg-icea.png);
    }
    .cs-bjxq-box-right {
        width: 50%;
        padding: 0 10px;
    }
    .cs-bjxq-item-tl {
        //font-weight: 600;
        padding: 15px 10px 5px;
        color: #fff;
    }
    .cs-bjxq-item-box{
        position: relative;
        border: 1px solid #245278;
        border-radius: 0.2rem;
        background: none;
        box-sizing: border-box;
        padding: 0 5px;
        background: rgba(39, 94, 139, 0.5);
        margin: 44px 20px 0;
        .legend {
            position: absolute;
            top: -30px;
            left: 34px;
            color: #fffefe;
            font-size: 14px;
        }
        .cs-bjxq-people{
            display: flex;
            width: 782px;
            padding: 12px 0;
            .bjxq-row-name{
                padding: 0 50px 0 30px;
                color: #fff;
            }
        }
        .cs-bjxq-jingqing{
            padding: 15px 0 15px 30px;
            color: #fff;
        }
        ul{
            padding-left: 30px;
            .tuxiang{
                border-bottom: 1px solid #245278;
                padding: 10px 0 10px 0;
                display: flex;
                &:last-child {
                    border-bottom: 0 none;
                }
                .cs-bjxq-item-lable {
                    //font-weight: 600;
                    white-space: nowrap;
                    padding-right: 30px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                }
                .cs-bjxq-item-text {
                    height: 60px;
                    color: #353535;
                    width: 100%;
                    display: flex;
                    div{
                        height: 100%;
                            .image{
                                width: 60px;
                                max-width:60px;
                                height: 100%;
                                display: inline-block;
                                margin-right: 30px;
                            }
                            .video_image{
                                width: auto;
                                max-width: 70px;
                                height: 100%;
                                display: inline-block;
                                margin-right: 30px;
                            }
                    }
                }
                .cs-bjxq-item-voice{
                    height: 30px;
                }
            }
        }
    }
    .cs-bjxq-item-box4{
        padding-bottom: 30px;
        .line{
            height: 1px;
            width: 50px;
            background-color: #245278;
        }
    }
    .cs-bjxq-item-box2 .el-row {
        /*border-bottom: 1px solid #245278;*/
        padding: 8px;
    }
    .cs-bjxq-item-box2 .el-row:first-child {
        border-top-right-radius: 0.2rem;
        border-top-left-radius: 0.2rem;
    }
    .cs-bjxq-item-box2 .el-row:last-child {
        border-bottom-right-radius: 0.2rem;
        border-bottom-left-radius: 0.2rem;
        border: 0 none;
    }
    .cs-bjxq-item-box2 .bjxq-row-name {
       // font-weight: 600;
    }
    .cs-bjxq-item-box2 .bjxq-row-desc {
        color: #fff;
        word-break: break-all;
    }
    .cs-bjxq-all-steps {
        border-bottom: 1px solid #245278;
        overflow-y: auto;
        height: 430px;
    }
    .bjxq-dialog-footer {
        text-align: center;
        margin-top: 23px;
        padding-bottom: 20px;
    }
    .bjxq-dialog-footer button {
        background: #275e8b;
        border-radius: 2px;
        width: 95px;
        height: 40px;
        border: 1px solid #275e8b;
    }
    .el-step__main {
        white-space: normal;
        padding-right: 10px;
        text-align: left;
        background: rgba(39, 94, 139, 0.5);
        width: 100%;
        margin-left: 10px;
        border: 1px solid #245278;
        border-radius: 0.3rem;
    }

    .cs-bjxq-item-text .video_image {
        width: 40px;
        height: 28.8px;
        display: inline-block;
        margin-right: 10px;
    }
    .bjxq-group-component {
        position: absolute;
        z-index: 2000;
        top: 0;
        width: 100%
    }
    .el-steps {
        padding-top: 15px;
        color: #fff;
        padding-left: 30px;
        span {
            font-size: 14px;
            padding-right: 10px;
        }
        .log_description{
            padding-left:30px;
            font-size: 14px;
        }
        .rate{
            padding: 10px 0 0 50px;
        }
        .rate_data{
            padding-left:40px;
        }
        .rate_title{
            margin-left: -20px;
        }
    }
    .el-dialog__title {
        color: #fff;
    }
}

.cs-bjxq-dailog:before {
    background: rgba(39, 94, 139, 0.3);
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
}

</style>
