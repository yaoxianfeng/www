<template>
    <!-- v-show="isShow_jcjb" -->
    <div id="cs-jcjb-dialog__wrapper" class="el-dialog__wrapper cs-jcjb-dialog__wrapper">
        <div class="cs-jcjb-dailog" >
            <div class="el-dialog__header"><span class="el-dialog__title">确认解除警报</span>
            </div>
            <div class="el-dialog__body cs-jcjb-dailog__body" :style="type==1?dialogStyle:dialogStyle1">
                <div class="cs-jcjb-box__message">是否确认解除警报？</div>
                <div class="cs-jcjb-box__message__notice">注意：解除警报成功后该警情将归档至已处理警情。</div>
                <div class="cs-jcjb-form-item">
                    <el-radio-group v-model="type">
                        <el-radio :label="1">有效警情</el-radio>
                        <el-radio :label="2">无效警情</el-radio>
                        <el-radio :label="3">重复警情</el-radio>
                    </el-radio-group>
                </div>

                <el-form :rules="rules" ref="ruleForm" :model="myformData">

                    <el-form-item prop="caseValue" v-if="type==1" label="案件类型：">
                        <el-select  v-model="myformData.caseValue"  @change="selectchange">
                            <el-option v-for="item in arr" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="reback">
                        <el-input type="textarea" v-model="myformData.reback" :rows="4" placeholder="请填写处理结果"></el-input>
                    </el-form-item>
                </el-form>


                <div class="dialog-footer">
                    <button type="button" class="el-button el-button--default" @click="hideModel"><span>取消</span></button>
                    <button type="button" class="el-button el-button--default" @click="makeSure"><span>确认解除</span></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var validateCase = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请选择警情类型'));
    }
    callback();
};
export default {
    props: {
        mapHeight: {
            type: Number,
            default: 600
        },

        jcjb_alertIds: {
            type: String,
            default: ""
        },
        jcjb_caseType: {
            type: Number,
            default: 1
        }
    },
    close: function() {

    },
    data: function() {

        return {
            dialogStyle: {
                width: '400px'
//                height: "430px"
            },
            dialogStyle1: {
                width: '400px'
//                height: "370px"
            },
            change_caseType:'',
            type: 1,
            myformData: {
                reback: "",
                caseValue:""
            },

            arr: [],
        }
    },
    computed: {

        rules() {
            if (this.type == 1) {
                return {
                    caseValue:[
                        {validator: validateCase, trigger: 'blur,change'}
                    ],
                    reback: [{
                        required: true,
                        message: '请给出回复',
                        trigger: 'blur,change'
                    }, {
                        max: 200,
                        message: '回复长度限200字以内'
                    }]
                }
            } else {
                return {
                    reback: [{
                        max: 200,
                        message: '回复长度限200字以内',
                        trigger: 'blur,change'
                    }]
                }
            }
        }
    },

    methods: {
        getData() {
            let that = this;
            that._loadPromise.then((data) => {
                that.arr = data;
                that.arr.forEach(function (e) {
                    if(that.jcjb_caseType==e.code){
                        that.myformData.caseValue=e.name;
                    }
                })
            });
        },
        selectchange(item){
            let that = this;
            this.change_caseType = item.code;
        },
        hideModel() {
            this.$emit('hide_jcjb');
        },

        saveData() {
            const Bus = global.eventHub;
            let that = this;
            if(that.type==2 || that.type==3){
                that.change_caseType = "";
            }
            var _param={
                token: global.data.getToken(),
                alertIds: that.jcjb_alertIds,
                alertCategory: that.type,
                remark: that.myformData.reback
            };
            if(that.change_caseType && that.type==1){
                _param.classify=that.change_caseType;
            }
            that.$http.post(global.config.weburl + 'api/alert/releaseAlert.do', _param).then(function(res) {
                var code = res.data.code;
                if (code == 0) {
                    that.$emit('doto_save_jcjb_suc');
                } else {
                    global.tools.handleError(res.data);
                }
            });
        },
        makeSure() {
            const Bus = global.eventHub;
            let that = this;
            that.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    console.log("vilid")
                    this.saveData();
                } else {
                    return false;
                }
            })
        }
    },
    beforeCreate() {
        this._loadPromise = global.tools.getDict("alertClassifyDict");
    },
    created: function() {
        //this.dialogMainHeight = document.documentElement.offsetHeight - 200;
    },
    watch: {
        type: function() {

        }
    },
    mounted: function() {
        this.getData();
    }

}
</script>
<style lang="less">

.cs-jcjb-box__message {
    font-size: 16px;
    padding: 10px;
    color: #fff;
}
.cs-jcjb-box__message__notice {
    font-size: 12px;
    padding: 10px 10px 20px 10px;
    color: #fff;
}

.cs-jcjb-dialog__wrapper {
    z-index: 2222;
    background: rgba(0, 0, 0, 0.9);
    .el-dialog__header {
        padding: 0 0 0 20px;
        display: flex;
        align-items: center;
        height: 50px;
        background: rgba(39, 94, 139, 0.3);
        border-bottom: 1px solid #275e8b;
        .el-dialog__title {
            color: #fff;
        }
    }


    .cs-jcjb-dailog {
        border: 1px solid #275e8b;
        top: 40%;
        margin-top: -150px;
        left: 50%;
        margin-left: -200px;
        position: absolute;
        background: rgba(39, 94, 139, 0.3);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-sizing: border-box;
        .el-form-item__label{
        color: #fff;
        }
    }
    .cs-jcjb__select {
        margin-bottom: 20px;
    }
    .el-select{
        width:77%;
    }
    .cs-jcjb__select{
        .el-input__inner{
            color: #fff;
        }
    }

    .cs-jcjb-form-item {
        .el-radio-group{
            margin-left: 25px;
        }
    }

    .cs-jcjb__select label{
        color:#fff;
    }
    .dialog-footer {
        text-align: center;
    button {
        background: #275e8b;
        border-radius: 2px;
        border: none;
        color: #fff;
    &:hover{
         color: #fff;
     }
    }
    }

    .cs-jcjb-dailog__body {
        margin-bottom: 10px;
        overflow-x: hidden;
        overflow-y: auto

    }

    .cs-jcjb-form-item {
        margin-bottom: 10px;
    }

    .el-form-item {
    .el-textarea__inner {
        color: #fff;
        background: rgba(39, 94, 139, 0.3);
        border: 1px solid #275e8b;
    }
    }



}


</style>
