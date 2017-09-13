
<template>
    <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper" :style="mapStyle">
        <div class="guanbi"  @click="close_hf"></div>
        <div class="zxfw_fwb" :style="rate_data.length > 1?yesStyle:noStyle">
            <div class="cs-head">
                <span class="el-dialog__title ha-right-dialog__title">咨询服务</span>
                <div class="el-dialog__headerbtn" @click="close_hf"><i class="el-dialog__close el-icon-close"></i></div>
            </div>

            <div class="el-dialog__body  ha-dialog-right__body" :style="contentHeight">
                <div class="cs_huifu" style="margin-bottom: 20px;">
                    <span class="cs_tips" >咨询问题:</span>
                    <el-input class="textarea" type="textarea" :rows="6" placeholder="请输入内容" v-model="content.content" :disabled="true" >
                    </el-input>
                </div>
                <el-form :rules="rules" ref="ruleForm" :model="myformData">
                    <el-form-item prop="typeValue" v-if="!is_can_edit" label="咨询类型：" class="cs_type">
                        <el-select  v-model="myformData.typeValue"  @change="selectchange">
                            <el-option v-for="item in arr" :key="item.id" :label="item.typeValue" :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="reback" class="cs_huifu">
                        <span class="cs_tips">回复内容:</span>
                        <div class="textarea el-textarea">
                            <textarea v-model="myformData.reback" :disabled="is_can_edit" placeholder="在这里输入回复" rows="6" :maxlength="limit" class="el-textarea__inner" @keyup="inlimit()"></textarea>
                        </div>
                        <span v-if="zt_flag==1" class="inlimit">{{curr}}/{{limit}}</span>
                    </el-form-item>
                </el-form>
                <div class="rate"  v-if="rate_data.length > 1">
                    <span class="rate_title">评价：</span>
                    <ha-rate-group :rate_data="rate_data"></ha-rate-group>
                </div>
            </div>
            <div class="goback cs-back">
                <el-button type="primary" @click="scclick()">删除</el-button>
                <el-button type="primary" @click="doSure" v-if="!content.replyContent">确认回复</el-button>
                <el-button type="primary" @click="cancelOpen()" v-if="content.open==1 && content.replyContent">取消公开</el-button>
                <el-button type="primary" @click="doOpen()" v-if="content.open==0 && content.replyContent">公开</el-button>
                <div class="gkfb" v-if="!content.replyContent">
                    <el-checkbox v-model="checked">公开发布</el-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            content: {
                type: Object,
                default: {}
            },
            zt_flag:''
        },
        components: {
        },
        data: function () {
            var validateType = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请选择类型'));
                }
                callback();
            };
            return {
                para: {},
                checked: false,
                open: 1,
                is_tishi: false,
                typeValue: '',
                arr: [],
                select_type: '',
                myformData: {
                    reback: '',
                    typeValue: ''
                },
                rules:{
                        typeValue: [
                            {validator: validateType, trigger: 'blur,change'}
                        ],
                        reback: [{
                            required: true,
                            message: '请给出回复',
                            trigger: 'blur,change'
                        }]
                },
                limit: '200',
                curr: '0'
            }
        },
        methods: {
            selectchange(item){
                let that = this;
                this.select_type = item.flag;
            },
            cancelOpen(){//取消公开
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _para = {
                    button: "取消公开",
                    message: "取消公开成功后该操作将立即生效,请确认是否取消公开" + this.content.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: token,
                        id: this.content.id,
                        open: 0
                    },
                    url: "api/msg/open.do"
                }
                this.makeSure(_para);
            },
            doOpen(){ //公开
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _para = {
                    button: "公开",
                    message: "公开成功后该操作将立即生效，请确认是否公开" + this.content.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: token,
                        id: this.content.id,
                        open: 1
                    },
                    url: "api/msg/open.do"
                }
                this.makeSure(_para);
            },
            qrclick() { //回复
                if (this.checked == true) {
                    this.open = 1;
                } else {
                    this.open = 0;
                }
                if(!this.select_type){
                    this.select_type=this.content.classify;
                }
                let _para = {
                    button: "回复",
                    message: "回复成功后该操作将立即生效,请确认是否回复" + this.content.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: global.data.getToken(),
                        id: this.content.id,
                        replyUserId: global.data.getUserInfo().id,
                        replyContent: this.myformData.reback,
                        open: this.open,
                        classify: this.select_type,
                    },
                    url: "api/msg/reply.do"
                }
                this.makeSure(_para);
            },
            doSure() {
                const Bus = global.eventHub;
                let that = this;
                if(that.myformData.reback){
                    that.myformData.reback=that.myformData.reback.replace(/(^\s*)|(\s*$)/g,"");
                }
                that.$refs["ruleForm"].validate((valid) => {
                    if (valid) {
                        that.qrclick();
                    } else {
                        return false;
                    }
                })
            },
            getData() {
                let that = this;
                that._loadPromise.then((data) => {
                    data.forEach(function (e) {
                        that.arr.push({typeValue:e.name,flag:e.code});
                        if(that.content.classify==e.code) {
                            that.myformData.typeValue = e.name;
                        }
                    })
                })
            },
            scclick() {  //删除
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }

                let _para = {
                    button: "删除",
                    message: "删除成功后该记录将无法恢复，请确认是否删除" + this.content.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: token,
                        id: this.content.id
                    },
                    url: "api/msg/delete.do"
                }
                this.makeSure(_para);
            },
            close_hf() {
                this.$emit("hideDetail");
            },
             inlimit() {
                 let con = this.myformData.reback;
                 if(con){
                     this.curr = con.length;
                     if(con.length >= this.limit){
                         this.curr = this.limit;
                     }
                 }
             },
            makeSure: function(_content) {
                let that = this;

                this.$confirm(_content.message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }
                }).then(() => {
                        that.$http.post(global.config.weburl + _content.url, _content._param).then(function(res) {
                        if (res.data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: _content.button + "数据成功",
                            });
                            that.$emit("refreshList");
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }, function(error) {
                        this.$message({
                            type: 'error',
                            message: _content.button + "数据失败",
                        });

                    });
                }).catch(function(error){

                });
            }
        },
        created() {
            var that = this;
            that.myformData.reback = that.content.replyContent;
        },
        watch: {
        },
        computed: {
            noStyle(){
                return{
                    "marginTop":-307+"px"
                }
            },
            yesStyle(){
                return{
                    "marginTop":-348+"px"
                }
            },
            mapStyle() {
                let _height = this.$store.getters.getPageInfos.main_height;
                return {
                    "Height": _height + "px",
                }
            },
            zxfwHeight() {
                return {
                    width: this.$store.getters.getDialogSmallStyle.width
                }
            },
            contentHeight() {
                return {
                    maxHeight: this.$store.getters.getDialogSmallStyle.max_height + 'px',
                    overflowY: 'auto'
                }
            },
            rate_data() {
                let _arr = [];
                let _appraise = this.content.appraise;
                if (_appraise) {
                    _arr.push({name: "处理速度", value: Number(_appraise.turningSpeed   ) });
                    _arr.push({name: "处理效率", value:Number(_appraise.processingEfficiency)});
                    _arr.push({name: "反馈结果", value:Number(_appraise.feedbackResult)});
                }
                return _arr;
            },
            is_can_edit () {
                return !!this.content.replyContent;
            }
        },
        beforeCreate() {
            this._loadPromise = global.tools.getDict("counselingClassifyDict");
        },
        mounted: function() {
            this.getData();
        },

    }
</script>
<style lang="less">
    .cs-jcjb-dialog__wrapper {
        z-index: 600;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        .cs-head {
        height: 52px;
        background: rgba(39, 94, 139, 0.7);
        padding-left: 15px;
        line-height: 40px;
        .ha-right-dialog__title {
            color: #fff;
        }
        }
        .cs_choose_type{
            margin-top: 20px;
            color: #fff;
        }
        .guanbi{
            width: 100%;height: 100%;z-index: 5;
        }
        .zxfw_fwb {
            width: 40%;
            z-index: 10;
            background: rgba(39, 94, 139, 0.3);
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%, 0);
            z-index: 30;
            border: 1px solid #275e8b;
        }
        .el-dialog__body{
            padding: 30px 20px 0 20px;
        }
        .zxfw_fwb .el-dialog__body .el-input {
            margin-bottom: 20px;
        }
        .zxfw_fwb p{margin:0 0 30px 20px;}
        .zxfw_fwb .el-dialog__body p {
            padding-bottom: 20px;
        }

        .zxfw_fwb .el-dialog__headerbtn {
            padding-right: 20px;
        }
        .el-dialog__body .rate{
            color: #fff;
            padding: 10px;
        }
        .el-dialog__body .ha-rate_groups{
            margin-left: 50px;
        }
        .zxfw_fwb .goback {
            margin-bottom: 20px;
            position: relative;
            text-align: center;
            margin-top: 0;
            button{
                background: #275e8b;
                border-radius: 2px;
                border: none;
            }
        }

        .zxfw_fwb .gkfb {
            position: absolute;
            right: 40px;
            top: 10px;
            .el-checkbox{
                color: #fff;
            }
        }

        .zxfw_fwb .cs_huifu {
            position: relative;
            border: 1px solid #275e8b;
            border-radius: 4px;
            .textarea {
                background: #1a3d5b;
                .el-textarea__inner {
                    background: #1a3d5b;
                    border:none;
                    color: #fff;
                    padding: 10px;
                    margin-top: 30px;
                }
            }
        }
        .zxfw_fwb .el-form-item__label{
            color: #fff;
        }
        .zxfw_fwb .cs_tips {
             margin-bottom: 0;
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 14px;
            color: #20a0ff;
            font-family: monospace;
            font-weight: 600;
        }
        .inlimit{position: absolute;right: 15px;bottom: 0px;color: #20a0ff;opacity: 0.8}
    }
    
</style>
