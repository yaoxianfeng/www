<template>
    <div class="main-content">
        <div class="breadcrumbs" id="breadcrumbs">
            <ul class="breadcrumb">
                <li><i class="cs-home-icon"></i>首页</li>
                <li class="active"><i class="el-icon-arrow-right cs-jg-icon-arrow-right"></i>
                    <router-link to="/wlf">微联防</router-link>
                </li>
            </ul>
        </div>

        <div id="page-content" class="page-content" :style="myheight"  >
            <div class="cs-main-btn-group">
                <el-button :plain="is_jlfb" type="primary" v-on:click="fuc_jlfb">警力分布</el-button>
                <el-button :plain="is_jqfb" type="primary" v-on:click="fuc_jqfb">警情分布</el-button>
                <el-button :plain="is_zdfb" type="primary" v-on:click="fuc_zdfb">站点分布</el-button>
            </div>
            <div class="my-group-component">
                <!-- 组件组 -->
                <!-- <jcjbcomponent v-if="isShow_jcjb" ref="jcjbcomponent" :jcjb_alertIds=jcjb_alertIds :jcjb_alertCategory=jcjb_alertCategory :jcjb_remark=jcjb_remark :mapHeight="mapHeight"></jcjbcomponent><!--解除警报 -->
                <bjxqcomponent ref="bjxqcomponent" :mapHeight="mapHeight" :isShow_bjxq="isShow_bjxq" @doto_showsblb="f_doto_showsblb" @doto_showwplb="f_doto_showwplb"></bjxqcomponent>
                <!--报警详情 -->
                <membercomponent style="margin-left: 10px;" v-if="is_member" @show_contact="show_contact"></membercomponent>
            </div>
            <!-- <div class="f_contact"><contactcomponent v-show="is_contact" @hidden_contact="hidden_contact"></contactcomponent></div> -->
            <div class="f_sblb">
                <sblbcomponent v-if="is_sblb"></sblbcomponent>
            </div>
            <div class="f_sblb">
                <wplbcomponent v-if="is_wplb"></wplbcomponent>
            </div>
            <div class="f_zddetail">
                <zddetailcomponent v-show="is_zddetail"></zddetailcomponent>
            </div>
            <el-button class="cs-backInitMap" v-on:click="btnClick">返回初始化状态</el-button>
            <baidumapcomponent ref="baidumapcomponent" :mapHeight="mapHeight" :is_jlfb="is_jlfb" :is_jqfb="is_jqfb" :is_zdfb="is_zdfb"></baidumapcomponent>
            <div v-if="is_jqfb === false">
                <div class="cs-btn-showList" @click="showList">列表</div>
            </div>
        </div>

        <jcjbcomponent v-if="isShow_jcjb" ref="jcjbcomponent" :jcjb_alertIds=jcjb_alertIds :jcjb_alertCategory=jcjb_alertCategory :jcjb_remark=jcjb_remark :mapHeight="mapHeight">
            
        </jcjbcomponent>
        <jqfblistcomponent v-if="is_jqfb_show_list" @hideList="hideList" :mapHeight="mapHeight" @doto_showsblb="f_doto_showsblb" @doto_showwplb="f_doto_showwplb"></jqfblistcomponent>
        <shipingcomponent></shipingcomponent>
        <contactcomponent v-show="is_contact" @hidden_contact="hidden_contact"></contactcomponent>
    </div>
</template>
<script>
import shiping from "./shiping.vue";
export default {
    data: function() {
        return {
            is_jlfb: true, //警力分布
            is_jqfb: true, //警情分布
            is_zdfb: true, //站点分布
            is_contact: false, //联系他
            is_sblb: false, //上报列表
            is_wplb: false, //委派列表
            is_zddetail: false, //站点详情
            is_member: false, //人员详情
            isShow_bjxq: false,
            isShow_jcjb: false,
            is_jqfb_show_list: false,
            jcjb_alertIds: "", //警报解除信息
            jcjb_alertCategory: "",
            jcjb_remark: ""
        }
    },
    components: {
        shipingcomponent: shiping,
        baidumapcomponent: function(resolve, reject) {
            require(['./baidumap.vue'], resolve)
        },
        bjxqcomponent: function(resolve, reject) {
            require(['./bjxq.vue'], resolve)
        },
        jcjbcomponent: function(resolve, reject) {
            require(['./jcjb.vue'], resolve)
        },
        contactcomponent: function(resolve, reject) {
            require(['./contact.vue'], resolve)
        },
        membercomponent: function(resolve, reject) {
            require(['./member.vue'], resolve)
        },
        sblbcomponent: function(resolve, reject) {
            require(['./sblb.vue'], resolve)
        },
        wplbcomponent: function(resolve, reject) {
            require(['./wplb.vue'], resolve)
        },
        zddetailcomponent: function(resolve, reject) {
            require(['./zddetail.vue'], resolve)
        },
        jqfblistcomponent: function(resolve, reject) {
            require(['./jqfb_list.vue'], resolve)
        }

    },
    methods: {
        btnClick() {
            const that = this;
            const Bus = global.eventHub;
            this.Bus.$emit('backinitposition');
        },

        fuc_jlfb: function() {
            //警力分布

            if (this.is_jlfb) {
                //添加警力分布显示
                this.is_jlfb = false;
                this.is_member = true;
            } else {
                //去掉警力分布显示
                this.is_jlfb = true;
                this.is_contact = false;
                this.is_member = false;
            }
            this.Bus.$emit('doto_jlfb');

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
            this.Bus.$emit('doto_jqfb');

        },
        fuc_zdfb: function() {

            //站点分布

            if (this.is_zdfb) {
                this.is_zdfb = false
            } else {
                this.is_zdfb = true;
                this.is_zddetail = false;
            }
            this.Bus.$emit('doto_zdfb');

        },
        addListener: function() {
            const that = this;
            const Bus = global.eventHub;




            Bus.$on('doto_show_bjxq', function(id) {
                //显示报警详情
                that.isShow_bjxq = true;

            });

            Bus.$on('doto_hide_bjxq', function(id) {
                //隐藏报警详情
                that.isShow_bjxq = false;

            });

            Bus.$on('doto_show_jcjb', function(alertIds, alertCategory, remark) {
                //显示解除警报
                that.isShow_jcjb = true;
                that.jcjb_alertIds = alertIds;
                that.jcjb_alertCategory = alertCategory;;
                that.jcjb_remark = remark;

            });



            Bus.$on('doto_hide_jcjb', function() {
                //隐藏解除警报
                console.log("隐藏解除警报");
                that.isShow_jcjb = false;

            });
            Bus.$on('doto_show_zdfb', function(id) {
                //隐藏解除警报
                that.is_zddetail = true;

            });
            Bus.$on('doto_show_contact', function(id) {
                //隐藏解除警报
                that.is_contact = true;
            });
            Bus.$on('doto_showzddetail', function(id) {
                //隐藏解除警报
                that.is_zddetail = false;
            });



        },
        removeListener: function() {
            const that = this;
            const Bus = global.eventHub;
            Bus.$off('doto_show_bjxq', function(id) {
                //去掉报警详情
                that.isShow_bjxq = true;
            });
            Bus.$off('doto_hide_bjxq', function(id) {
                //去掉报警详情
                that.isShow_bjxq = false;

            });

            Bus.$off('doto_show_jcjb', function(id) {
                //去掉解除警报
                that.isShow_jcjb = true;

            });

            Bus.$off('doto_hide_jcjb', function(id) {
                //隐藏解除警报
                that.isShow_jcjb = false;

            });
        },
        show_contact: function(obj) {
            this.is_contact = true;

        },
        showList: function() {
            this.is_jqfb_show_list = true;

            this.is_jlfb = true; //警力分布
            this.is_jqfb = true; //警情分布
            this.is_zdfb = true; //站点分布
            this.isShow_jcjb = false;
            this.is_contact = false;
            this.is_sblb = false;
            this.is_wplb = false;
            this.is_member = false;
            this.is_zddetail = false;
        },
        hideList: function() {
            this.is_jqfb_show_list = false;

            this.is_jlfb = true; //警力分布
            this.is_jqfb = true; //警情分布
            this.is_zdfb = true; //站点分布
            this.isShow_jcjb = false;
            this.is_contact = false;
            this.is_sblb = false;
            this.is_wplb = false;
            this.is_member = false;
            this.is_zddetail = false;
        },
        hidden_contact: function() {
            this.is_contact = false;
        },
        f_doto_showsblb: function() {

            this.is_sblb = this.is_sblb ? false : true;
        },
        f_doto_showwplb: function() {
            this.is_wplb = this.is_wplb ? false : true;
        }

    },
    created: function() {

        this.Bus = global.eventHub;
        this.mapHeight = document.documentElement.offsetHeight - 110;
        let that = this;

    },
    mounted: function() {
        const that = this;
        that.addListener();

    },
    beforeDestroy: function() {
        this.removeListener();
    }
}
</script>
<style>
.my-group-component {
    position: absolute;
    z-index: 2001;
    top: 75px;
}

.cs-main-btn-group {
    position: absolute;
    z-index: 1000;
    padding: 20px;
}

.f_contact {
    position: absolute;
    z-index: 1000;
    right: 1px;
}

.cs-btn-showList {
    color: #333;
    height: 38px;
    line-height: 38px;
    width: 120px;
    border-radius: 3px;
    text-align: center;
    border: 1px solid #3399cc;
    background: #fff;
    position: absolute;
    z-index: 1000;
    bottom: 20px;
    left: 50%;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    transform: translate(0, -50%);
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
}

.cs-backInitMap {
    position: absolute;
    bottom: 60px;
    left: 20px;
    z-index: 99999;
    text-indent: -9999px;
    background: url('/static/img/position.png') no-repeat 0 0;
}

.cs-main-btn-group .el-button {
    background-color: #2e86b4;
    border-color: #2e86b4;
}

.cs-main-btn-group .el-button:hover.cs-main-btn-group .el-button:focus {
    background-color: #407ea5;
    border-color: #407ea5;
}
</style>
