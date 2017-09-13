<template>
    <div class="znbm-div">
        <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper">
            <div class="cds-znbm-xinzen">
                <div class="cs-head">
                    <ul class="ul-style">
                        <li class="active">
                            职能部门
                        </li>
                    </ul>
                    <div @click="close_xz" class="el-dialog__headerbtn">
                        <i class="el-dialog__close el-icon-close">
                        </i>
                    </div>
                </div>
                <div class="el-dialog__body  ha-dialog-right__body">
                    <el-form class="demo-ruleForm" :rules="rules" ref="dataForm" :model="dataForm">
                        <el-form-item prop="name">
                            <el-input v-model="dataForm.name" size="large"  placeholder="在这里输入职能部门名称" max="30" :maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item prop="phone">
                            <el-input v-model="dataForm.phone" size="large"  placeholder="在这里输入电话" max="30" :maxlength="30"><a
                                    href="#"></a></el-input>
                        </el-form-item >
                        <el-form-item label="备注:">
                            <el-input  v-model="dataForm.remark" type="textarea" :rows="6"  resize="none" placeholder="在这里输入备注信息" :maxlength="1000"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer">
                        <el-button type="primary" class="cs-button" v-on:click="save">保存</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            listData:{
                type:Object,
                default:null
            }
        },
        components: {

        },
        data() {
            var checkDepart = (rule, value, callback) =>{
                var value = this.dataForm.name.replace(/\s+/g, "");
                if (!value) {
                    return callback(new Error('职能名称不能为空！'));
                }
                if(value.length > 20){
                    return callback(new Error('职能名称不能超过20！'));
                }
                    callback();
            };
            var checkTel = (rule, value, callback) =>
            {
                    var value = this.dataForm.phone.replace(/\s+/g, "");
                    if (!value) {
                        return callback(new Error('联系电话不能为空！'));
                    }
                    if (!(/^(\d{3,11})$/.test(value)) && !(/^(^0\d{2,3}-?)?\d{7,8}$/.test(value))) {
                        return callback(new Error('联系方式格式不正确'));
                    }
                    callback()
            };
            return {
                dataForm: {
                    name: '',
                    phone: '',
                    remark: ''
                },
                rules: {
                    name: [
                        {validator: checkDepart, trigger: 'blur,change'}
                    ],
                    phone: [
                        {validator: checkTel, trigger: 'blur,change'}
                    ]
                },
//                is_tkshow: false,
                depart: "",
                content: null,
                flag: true,
            }

        },
        methods: {
            close_xz()
                {
                    this.$emit("close_add");
                },

            doSaveData(){
                let that = this;
                    let token = global.data.getToken();
                    let _params = {
                        token: token,
                        sortby: "updateTimeStr desc"
                    }
                    if (that.dataForm.name) {
                        _params.name = that.dataForm.name;
                    }
                    if (that.dataForm.phone) {
                        _params.phone = that.dataForm.phone;
                    }
                    if (that.dataForm.remark) {
                        _params.remark = that.dataForm.remark;
                    }
                    that.$http.post(global.config.weburl + 'api/functionaldept/create.do', _params).then(function(res) {
                        console.log(res.data)
                        if (res.data.code == 0) {
                            that.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            that.$emit("filterTag");
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }, function(error) {
                        this.$message({
                            type: 'error',
                            message: "保存数据失败",
                        });

                    })
                    //that.close_xz();
                },
            save() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        this.doSaveData();
                    } else {
                        return false;
                    }
                });
            }
            },


    created: function () {
        var that = this;
    }
}
</script>
<style lang="less">

.znbm-div{
    .cs-jcjb-dialog__wrapper{
        z-index: 200;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
    }
    .cds-znbm-xinzen{
        width: 700px;
        height: 560px;
        border-radius: 4px;
        position: absolute;top: 50%;left: 50%;margin-top: -280px;margin-left: -350px;
        z-index: 3000;
        background: rgba(39, 94, 139, 0.5);
        box-sizing: border-box;
        border: 1px solid #285E8D;
    }
        .el-button{
            width: 80px;
            height: 35px;
        }
        .ha-dialog-right__body{
            padding: 30px;
        }
    .cs-head{
        height: 52px;
        padding-left: 15px;
        line-height: 52px;
        background: rgba(39, 94, 139, 0.7);
        color: #fff;
    }

    .el-dialog__headerbtn {
        margin-right: 25px;
    }
    .el-form-item__label{
            color: #fff;
        }
    .znbm-div .el-dialog__headerbtn{
        position: relative;
        top: 0px;
        right: 0px;
    }
    .warning{
        color: #FF4949;
        display: block;
        margin-top: -20px;
    }
    .ul-style{
        line-height:24px;
        background-color: transparent;
        display: inline-block;
        line-height: 24px;
        margin: 10px 22px 0 12px;
        padding: 0;
        font-size: 13px;
        color: #fff;
        border-radius: 0;
        overflow: hidden;
    }
    .cs-head>li, .cs-head>li.active {color: #555}
    .ul-style>li{float: left}
    .el-icon-arrow-right {
        padding-left: 10px;
    }
    .dialog-footer{
        text-align: center;
        line-height: 100px;
    }
    .el-input .el-input__inner{
        font-size: 14px;
        background-color: rgba(39, 94, 139, 0.5);
        height: 50px;
    }
    .el-textarea__inner{
        background-color: rgba(39, 94, 139, 0.5);
        font-size: 14px;
        color: #fff;
        border: 1px solid #285E8D;
        border-radius: 2px;
    }
}
    @media (min-width: 1280px) and (max-width: 1600px) {
        .cs-xinzen{
            position: absolute;
            left: 30%;
            top: 18%;
        }
    }
</style>