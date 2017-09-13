<template>
    <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper">
        <div class="fmainDiv">
            <div class="cs-head">
                <span class="el-dialog__title ha-right-dialog__title">选择移交对象</span>
            </div>
            <div class="cs_list">
                <el-menu theme="light" :default-active="activeIndex" :style="mapStyle2">
                    <el-radio-group v-model="deptId" >
                        <el-submenu class="cs_el_submenu" :index="''+index" v-for="(item,index) in data" :key="item.id">
                            <template slot="title">{{item.addname}}</template>
                            <el-radio :label="lable.deptId" v-for="(lable,num) in item.children" :key="lable.id">{{lable.username}}</el-radio>
                        </el-submenu>
                    </el-radio-group>
                </el-menu>
            </div>
            <div class="el-dialog__footer">
                <div class="dialog-footer">
                    <el-button type="primary" @click="close_jqyj"><span>取消</span></el-button>
                    <el-button type="primary"  @click="todo_wpjq"><span>确认移交</span></el-button>
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
        },
        alertDeptId:{
            type: String,
            default: ""
        }
    },
    data() {
        return {
            is_wplb: false,
            data: null,
            deptId: "",
            activeIndex: "1",
            keyword: "",
            value: ""

        }
    },
    components: {

    },
    methods: {
        todo_wpjq() {
            if (this.deptId) {
                this.handlejqwp();
            } else {
                this.$message({
                    type: 'error',
                    message: "请选择移交对象"
                });
            }

        },
        handlejqwp() {
            this.$http({
                method: "POST",
                url: global.config.weburl + "api/alert/handoverAlert.do",
                params: {
                    token: global.data.getToken(),
                    deptId: this.deptId,
                    alertId: this.alertId
                }
            }).then(function(res) {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "移交成功"
                    });
                    this.$emit("yj_succ");
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
        close_jqyj() {
            this.$emit("close_jqyj");
            this.$parent.is_jqyj=false;
        },
        handlesearch() {
            this.keyword = this.value;
            this.getwplist();
        },
        getwplist() {
            var that = this;
            this.$http({
                method: "POST",
                url: global.config.weburl + "api/dept/findPublicSecurityBureau.do",
                params: {
                    token: global.data.getToken(),
                    keyword: this.keyword
                }
            }).then(function(res) {
                // console.log(res.data)
                if (res.data.data[0]) {
                    var arrtest = [];
                    res.data.data.forEach(function(value, index, array) {
                        arrtest.push({
                            addname: value.name,
                            children: []
                        });
                        value.subDepts.forEach(function(info, num, array) {
                            if(info.id!=that.alertDeptId){
                                arrtest[index].children.push({
                                    username: info.name,
                                    deptId: info.id
                                })
                            }
                            
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
