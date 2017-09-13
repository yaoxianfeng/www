<template>
    <div class="main-content" :style="content_sytle">
        <div class="cs-navsbox">
            <div class="tableft" :style="tableft"></div>
            <div class="taba" v-for="item in navarr">
                <router-link  :key="item.id" :to="item.url"><img v-on:click="open(item.url)" :src="'/static/img/'+item.icon" :alt="item.name" /></router-link>
            </div>
            
        </div>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle],
    data() {
        return {
            navarr: [],
            tableft:{}
        }
    },
    methods: {
        undomodel() {
            this.$notify.info({
                title: '',
                message: "正在开发中…敬请期待"
            });
        },
        open(url) {
            if (!url) {
                const h = this.$createElement;
                if (global.tools.startEjingwu()) {
                    this.$notify({
                        title: '标题名称',
                        message: h('p', {
                            style: 'color: red'
                        }, '视频正在加载中。。。。')
                    });
                }
            }

        }
    },
    computed: {
        tabwidth(){
            let _width = this.$store.getters.getPageInfos.main_width;
            return _width
        }
    },
    created: function() {
        var that=this;
        var routerurl = this.$route.path;

        //解决部分URL带了子路由nav
        if (routerurl.split("/").length > 1) {
            routerurl = "/" + routerurl.split("/")[1];
        }

        global.tools.getNavList().then(function(ResultJson) {

            that.navarr = global.data.getNavsurl(routerurl);
            if(that.navarr){
                if(that.navarr.length < 3){
                    let _width=(that.tabwidth*(1-that.navarr.length*0.333))/2;
                    that.tableft = {
                        width:_width+"px"
                    };
                } else {
                    that.tableft = {};
                }
            } else {
                console.log("后台配置数据有误");
                //this.$message("数据请求错误！")
            }

        });

    }
}
</script>
<style scoped="scoped" lang="less">
.main-content{
display:table;
    .cs-navsbox {
        display:table-cell;
        width: 1600px;
        vertical-align: middle;
        text-align: center;
        .tableft{
            height: 1px;
            float: left;
        }
        .taba{
            vertical-align: middle;
            width: 33.3%;
            display: block;
            float: left;
            padding: 1% 0;
           a {
                img {
                    background: url('/static/img/erjibj.png') no-repeat;
                    background-size: 100% 96%;
                }
            } 
        }
        
    }
}
</style>
