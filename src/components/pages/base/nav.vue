<template>
    <el-menu>
        <el-menu-item v-for="(obj,index) in navstatus"
                      :index="''+(index+1)"
                      :key="obj.id" >
            <router-link :to='obj.url'><i :class="[obj.icon, 'navicon']" ></i>{{obj.name}}</router-link>
        </el-menu-item>
        <!--<div class="background" :style="topStyle"></div>-->
    </el-menu>
</template>
<script>
const WXX_PAHT = '/wxx/nav';
export default {
    name: 'nav',
    data: function() {
        return {
            navstatus: [],
            onum:'2'
        }
    },
    methods: {
        navchange(e,url) {
//            this.$router.push(url);
//            this.onum=e.index;
//            sessionStorage.setItem("navshow", e.index);

//            if(url ==  WXX_PAHT ){
//                this.$store.dispatch('tr_home_wxx', true);
//            }else{
//                this.$store.dispatch('fl_home_wxx', false);
//            }
        },
        getNavList() {
            var that=this;
            global.tools.getNavList().then(function(ResultJson) {
                that.navstatus = ResultJson;
            });
        }
//        getOnumByCurPath() {
//            console.log("getOnumByCurPath == ");
//            console.log("this.fullPath: " + this.fullPath);
//            this.navstatus.forEach((item, index)=>{
//                let _url = item.url;
//                if (_url.split("/").length > 1) {
//                    _url = _url.split("/")[1];
//                }
//
//            console.log("item.url: " + _url);
//                if (item && item.url &&  this.fullPath.indexOf(_url) == 1) {
//                    console.log(item);
//                    this.onum = (index+1) + "";
//                    return false;
//                }
//            });
//            console.log("this.onum :" + this.onum);
//        }
    },
    created() {
//        var _index = sessionStorage.getItem("navshow");
//        if (_index && _index!=1) {
//            this.onum = _index;
//        }
//        else {
//            this.onum = 2;
//        }

        this.getNavList();
    },
    computed:{
        fullPath(){
            return this.$router.apps[0]._route.fullPath;//路径
        }
//        topStyle() {
//            let _height =  this.$store.getters.getPageInfos.body_height*0.09*0.824;
//            let _oheight=(this.onum-1)*_height+_height/4;
//            return {
//                top:_oheight + "px",
//                height:_height/2+'px',
//            }
//        }
    },
    watch:{
//        fullPath:function() {   //监听路径变化
//            this.getOnumByCurPath();
//        }

    },
    mounted() {



    }
}
</script>
