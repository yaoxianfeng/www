<template>
    <div class="znbm-right">
        <div class="cs-wrd-left-box" :style="right_style" v-if="!is_rowdata_null" >
            <div class="el-dialog__body  ha-dialog-right__body">
            <ul class="ul-style">
                <li class="active">
                    职能部门
                </li>
                <li class="active"><i class="el-icon-arrow-right cs-jg-icon-arrow-right"></i>
                    {{formdata.name}}
                </li>
            </ul>
            <!-- .breadcrumb -->
        </div>
        <div class="el-dialog__body  ha-dialog-right__body">
            <el-form ref="formdata" class="demo-ruleForm" :rules="rules" :model="formdata">
                <el-form-item prop="name">
                    <el-input v-model="formdata.name" size="large" :disabled="!editing" placeholder="在这里输入职能部门名称" max="30" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input v-model="formdata.phone" size="large" :disabled="!editing" placeholder="在这里输入电话" max="30" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input  v-model="formdata.remark" type="textarea" :rows="textros" :disabled="!editing" resize="none" placeholder="在这里输入备注信息" :maxlength="1000" :style="textHeight"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-dialog__footer">
            <div class="dialog-footer">
                <el-button type="primary" class="cs-button-left cs-button" v-on:click="updateAuth(0)" v-if="this.oAuth==1">编辑</el-button>
                <el-button type="primary" class="cs-button-right cs-button" v-on:click="updateAuth(1)" v-if="this.oAuth==1">删除</el-button>
                <el-button type="primary" class="cs-button-left cs-button" v-on:click="updateAuth(2)" v-if="this.oAuth==3">保存</el-button>
                <el-button type="primary" class="cs-button-right cancel cs-button" v-on:click="updateAuth(3)" v-if="this.oAuth==3">取消</el-button>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
    import mystyle from '../../../util/vue/style';
    export default {
        mixins: [mystyle],
        props: {
                selectRowData: {},
                Auth: null
            },
        data: function () {
            return {
                textros:10,
                formdata: {
                    name: '',
                    remark: '',
                    phone: ''
                },
                rules: {
                            name: [
                                {validator: (rule, value, callback) => {
                                    if (global.tools.isNullString(value)) {
                                        callback(new Error('职能名称不能为空！'));
                                    } else {
                                        callback();
                                    }
                                }, trigger: 'blur,change'}
                            ],
                            phone: [
                                {validator: (rule, value, callback) => {
                                    if (!value) {
                                        callback(new Error('联系电话不能为空！'));
                                    } else if (!(/^(\d{3,11})$/.test(value)) && !(/^(^0\d{2,3}-?)?\d{7,8}$/.test(value))) {
                                        callback(new Error('联系方式格式不正确'));
                                    } else {
                                        callback()
                                    }
                                }, trigger: 'blur,change'}
                            ]
                },
                oAuth: 1,
                is_rowdata_null: true,
                editing: false,
                is_tkshow: false
            }
        },
        methods: {
                gofilterStatus(){
                    this.$emit('filterTag');
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },
                initRowData() {
                    let that = this;
                    if (that.selectRowData) {
                        that.editing = false;
                        that.is_rowdata_null = false;
                        that.formdata.name = this.selectRowData.name;
                        that.formdata.phone = this.selectRowData.phone;
                        that.formdata.remark = this.selectRowData.remark;
                        //that.$refs.formdata.resetFields();
                    }
                    else {
                        this.is_rowdata_null = true;
                    }
                },

                updateAuth: function (type) {
                    let that = this;
                    let token = global.data.getToken();
                    if (!token) {
                        return false;
                    }
                    if (type == 0) {
                        that.editing = true;
                        this.$emit('changeAu', 3);
                    } else if (type == 1) {
                        let _para = {
                            button: "删除",
                            message: "删除成功后该记录将无法恢复，请确认是否删除《" + this.formdata.name + "》？",
                            tips: "是否确认删除《" + this.formdata.name + "》？",
                            _param: {
                                token: token,
                                id: this.selectRowData.id
                            },
                            url: "api/functionaldept/delete.do"
                        }
                        this.makeSure(_para);
                    }else if (type == 2) {
                        this.save();
                    } else if (type == 3) {
                        this.$emit('changeAu', 1);
                        that.initRowData();
                        that.editing = false;
                    }
                },
                saveData(){
                    let that = this;
                    let token = global.data.getToken();
                    if (!token) {
                        return false;
                    }
                    let _params = {
                        token: token,
                        id: this.selectRowData.id
                    }
                    if (this.formdata.name) {
                        _params.name = this.formdata.name;
                    }
                    if (this.formdata.phone) {
                        _params.phone = this.formdata.phone;
                    }
                    if (this.formdata.remark) {
                        _params.remark = this.formdata.remark;
                    }
                    this.$http.post(global.config.weburl + 'api/functionaldept/update.do', _params).then(function (res) {
                        if (res.data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.$emit('changeAu', 1);
                            this.editing = false;
                            this.$emit('filterTag');
                        } else {
                            global.tools.handleError(res.data);
                        }
                    })
                },
                save() {
                    this.$refs["formdata"].validate((valid) => {
                        if (valid) {
                            this.saveData();
                        } else {
                            return false;
                        }
                    });
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
                                that.$emit('filterTag');
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
        computed: {
            rightheigth(){
                let _rheight = this.$store.getters.getPageInfos.right_height;
                return {'max-height': _rheight + "px"}
            },
            textHeight(){
                let _textheight = this.$store.getters.getPageInfos.right_height-350;
                this.textros=Math.floor(_textheight/21);
                return{height:_textheight+"px"}
            }
    },
    created: function () {
//        var that = this;

        /*var Bus = global.eventHub;
        Bus.$on("tankuang", function() {
            that.is_tkshow = false;
        });*/
    },
    watch: {
        selectRowData: function() {
            this.initRowData();
        },
        Auth: function (value) {
            this.oAuth = value;
        }
    },
    mounted: function() {
            let that=this;
            that.initRowData();
    }
}
</script>
<style lang="less">
    .znbm-right {

    .cs-wrd-left-box {
        border: 1px solid #275e8b;
        overflow: auto;
    }

    .el-dialog__body {
        padding: 10px 20px 0 20px;
    }
    .el-form-item__label{
            color: #fff;
        }
    .warning {
        color: #FF4949;
        display: block;
        margin-top: -20px;
    }

    .ul-style {
        line-height: 24px;
        background-color: transparent;
        display: inline-block;
        margin: 0 22px 0 12px;
        padding: 0;
        font-size: 13px;
        color: #fff;
        border-radius: 0;
        overflow: hidden;
    }

    .breadcrumb > li, .breadcrumb > li.active {
        color: #555
    }

    .ul-style > li {
        float: left

    }

    .cs-znbm-right-box .right-top {
        height: 40px;
        line-height: 50px;
        box-sizing: border-box;
        background: #275e8b;
        border-right: 1px solid #448ecb;
        border-bottom: 1px solid #448ecb;
    }

    .el-form-item__content .el-input .el-input__inner {
        font-size: 14px;
        background-color: rgba(39, 94, 139, 0.5);
        border: 1px solid #0c5a83;
        color:#fff;
        border-radius: 2px;
    }

    .dialog-footer .cancel {
        background-color: rgb(188, 188, 188);
        border: 1px solid rgb(188, 188, 188);
    }

    .el-dialog__body .el-textarea__inner{
        background-color: rgba(39, 94, 139, 0.5);;
        border: 1px solid #0c5a83 ;
        color:#fff;
        border-radius: 2px;
    }
    .el-icon-arrow-right{
        margin-left: 14px;
        margin-right: 6px;
        font-size: 13px;
    }
        .cs-button{
            width: 80px;
            height: 35px;
        }
    .cs-znbm-right-box .el-dialog__footer{
        padding: 0 20px 0 ;
    }
    }
</style>
