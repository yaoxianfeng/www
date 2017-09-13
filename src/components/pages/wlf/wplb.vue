<template>
    <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper" :style="mapStyle">
        <div class="fmainDiv">
            <div class="cs-head">
                <span class="el-dialog__title ha-right-dialog__title">选择委派对象</span>
            </div>
            <div class="cs_sousuo">
                <input maxlength="10" @keyup.enter="handlesearch" type="text" v-model="value" placeholder="" autocomplete="off" class="el-input__inner cs-search_input">
                <span class="cs-search-btn" @click="handlesearch"><i class="el-icon-search"></i></span>
            </div>
            <div class="cs_list">
                <el-menu theme="light" :default-active="activeIndex" :style="mapStyle2">
                    <el-radio-group v-model="userId" >
                        <el-submenu class="cs_el_submenu" :index="''+index" v-for="(item,index) in data" :key="item.id">
                            <template slot="title">{{item.addname}}</template>
                            <el-radio :label="lable.userId" v-for="(lable,num) in item.children" :key="lable.id">{{lable.username}}</el-radio>
                        </el-submenu>
                    </el-radio-group>
                </el-menu>
            </div>
            <div class="el-dialog__footer">
                <div class="dialog-footer">
                    <el-button type="primary" @click="close_wplb"><span>取消</span></el-button>
                    <el-button type="primary"  @click="todo_wpjq"><span>确认</span></el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            alertId: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                is_wplb: false,
                data: null,
                userId: "",
                activeIndex: "1",
                keyword: "",
                value: ""

            }
        },
        components: {

        },
        methods: {
            todo_wpjq() {
                if (this.userId) {
                    this.handlejqwp();
                } else {
                    this.$message({
                        type: 'error',
                        message: "请选择委派人员"
                    });
                }

            },
            handlejqwp() {
                this.$http({
                    method: "POST",
                    url: global.config.weburl + "api/alert/alertDelegate.do",
                    params: {
                        token: global.data.getToken(),
                        userId: this.userId,
                        alertId: this.alertId
                    }
                }).then(function(res) {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: "委派成功"
                        });
                        this.$emit("wp_succ");
                    } else {
                        global.tools.handleError(res.data);
                    }
                }, function(res) {
                    this.$message({
                        type: 'error',
                        message: "网络错误"
                    });
                });
            },
            close_wplb() {
                this.$emit("close_wplb");
            },
            handlesearch() {
                this.keyword = this.value;
                this.getwplist();
            },
            getwplist() {
                var that = this;
                this.$http({
                    method: "POST",
                    url: global.config.weburl + "api/alert/queryDelegateUser.do",
                    params: {
                        token: global.data.getToken(),
                        keyword: this.keyword
                    }
                }).then(function(res) {
                    if (res.data.data[0]) {
                        var arrtest = [];
                        res.data.data.forEach(function(value, index, array) {
                            arrtest.push({
                                addname: value.name,
                                children: []
                            });
                            value.users.forEach(function(info, num, array) {
                                arrtest[index].children.push({
                                    username: info.realname,
                                    userId: info.id
                                })
                            });
                        });
                        this.data = arrtest;
                    }
                }, function(res) {

                });
            }
        },
        created() {

        },
        computed:{
            mapStyle2() {
                let _height = this.$store.getters.getPageInfos.main_height/3;
                return {
                    "maxHeight": _height + "px",
                }
            },
            mapStyle() {
                let _height = this.$store.getters.getPageInfos.main_height;
                return {
                    "Height": _height + "px",
                }
            }
        },
        mounted() {
            this.getwplist();
        }
    }
</script>
<style lang="less">
    .cs-jcjb-dialog__wrapper {
        background: rgba(0, 0, 0, 0.9);
    .fmainDiv {
        width: 500px;
        background: rgba(39,94,139,0.3);
        position: absolute;
        left: 50%;
        top: 25%;
        margin-left: -250px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #275c89;
    .cs-head {
        height: 50px;
        background: rgba(39,94,139,0.3);
        padding-left: 20px;
        line-height: 50px;
        border-bottom: 1px solid #275c89;
    }
    .ha-right-dialog__title{
        color: #fff;
        font-weight: 700;
    }
    .cs_sousuo {
        position: relative;
        height: 40px;
        display: block;
        margin: 20px auto;
        width: 448px;
        background: rgba(39,94,139,0.5);
        border: 1px solid #275c89;
        border-radius: 4px;
    input {
        background: transparent;
        line-height: 38px;
        height: 38px;
        font-size: 14px;
        border: none;
        width: 390px;
        color: #fff;
    }
    .cs-search-btn {
        height: 40px;
        line-height: 40px;
        padding-right: 20px;
    i{
        font-size: 22px;
    }
    }
    }
    .cs_list {
    .el-menu {
        width: 448px;
        margin: 20px auto;
        background: none;
        border-top:  1px solid #448ecb;
        border-right:  1px solid #448ecb;
        overflow-y: auto;
        overflow-x:hidden;
    .el-radio-group {
        display: block;
        border-left:  1px solid #448ecb;
    .cs_el_submenu {
        border-bottom: 1px solid #448ecb;
    .el-submenu__title {
        padding: 0 72px!important;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #275e8b;
        color: #fff;

    &:after{
         content:"";
         display: block;
         position: absolute;
         height: 100%;
         top: 0;
         border-right: 1px solid #448ecb;
     }
    i{
        width: 71px;
        height:40px;
        left: 0;
        top: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    }
    .el-menu {
        margin: 0 auto;
    .el-radio {
        width: 448px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #448ecb;
        display: block;
        padding-left: 171px;
        margin: 0;
        position: relative;
    .el-radio__input{
        position: absolute;
        width: 73px;
        height: 40px;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #448ecb;
    }
    }
    }
    }
    }
    }
    }
    .dialog-footer {
        margin: 0 auto;
        width: 200px;
        text-align: center;
    button{
        background: #275e8b;
        border:none;
        border-radius: 2px;
    }
    }
    }
    }
</style>
