<template>
<div class="alert-add-pc">
<div class="el-dialog__wrapper">
        <div class="cs-bjxq-dailog">
            <div class="el-dialog__header"  title="警情补录"><span class="el-dialog__title">警情补录</span>
                <div class="el-dialog__headerbtn" @click="closeDialog"><i class="el-dialog__close el-icon el-icon-close"></i></div>
            </div>

            <div class="el-dialog__body cs-box cs-bjxq-dailog__body">
            <el-form :model="addForm" :rules="rules" ref="addForm">
                <div class="cs-bjxq-box-left">
                    <div class="cs-bjxq-item-card">
                        <div class="cs-bjxq-item-tl"><i class="ha-icon-blue-arrow"></i>报警人信息 *</div>
                        <div class="cs-bjxq-item-box">
                            <el-row>
                                <el-col :span="5" class="cs-bjxq-item-lable">报警人</el-col>
                                <el-col :span="18"><el-form-item prop="name"><el-input v-model="addForm.name" placeholder="请输入姓名" @focus="hideError"></el-input></el-form-item></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5" class="cs-bjxq-item-lable">电话</el-col>
                                <el-col :span="18"><el-form-item prop="tel"><el-input v-model="addForm.tel" placeholder="请输入电话" ></el-input></el-form-item></el-col>
                            </el-row>
                        </div>
                    </div>

                    <div class="cs-bjxq-item-card">
                        <div class="cs-bjxq-item-tl"><i class="ha-icon-blue-arrow"></i>警情信息 *</div>
                        <div class="cs-bjxq-item-box">
                           <el-row>
                               <el-col :span="5" class="cs-bjxq-item-lable">报警时间</el-col>
                               <el-col :span="18"><el-form-item><el-date-picker class="icon-ha-time" type="datetime"  v-model="time" format="yyyy-MM-dd hh:mm"></el-date-picker></el-form-item></el-col>
                           </el-row>
                            <el-row>
                                <el-col :span="5" class="cs-bjxq-item-lable">报警地点</el-col>
                                <el-col :span="18"><el-form-item prop="address" class="address-input"><div class="cs-bjxq-item-text" v-model="addForm.address">{{this.addForm.address}}</div><i class="icon-ha-position" @click="showPosition"></i></el-form-item></el-col>
                            </el-row>
                            <el-row class="textarea">
                                <el-col :span="5" class="cs-bjxq-item-lable">报警内容</el-col>
                                <el-col :span="18"><el-form-item prop="content"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"  placeholder="请输入内容" v-model="addForm.content"></el-input></el-form-item></el-col>
                            </el-row>
                        </div>
                    </div>

                    <div class="cs-bjxq-item-card">
                        <div class="cs-bjxq-item-tl"><i class="ha-icon-blue-arrow"></i>图像信息</div>
                        <div class="cs-bjxq-item-box">
                            <ul>
                                <li class="fixed-height"><div class="cs-bjxq-item-lable">图片</div><div class="cs-bjxq-item-text">
                                    <el-row ref="fcsbjxqimg">
                                        <!-- <h5>图片</h5> -->
                                        <el-form-item>
                                        <el-upload
                                          action="https://jsonplaceholder.typicode.com/posts/"
                                          list-type="picture-card"
                                          :on-preview="handlePictureCardPreview"
                                          :on-remove="handleRemoveImg"
                                          :before-upload="beforeAvatarUploadImg"
                                          v-model="addForm.images">
                                          <i class="icon-ha-add" v-if="showReloadImg" ></i>
                                        </el-upload>
                                        <el-dialog v-model="dialogVisible" size="tiny">
                                          <img width="60%" height="60%" :src="dialogImageUrl" alt="">
                                        </el-dialog>
                                        </el-form-item>
                                    </el-row>
                                </div></li>

                                <li class="fixed-height">
                                    <div class="cs-bjxq-item-lable">视频</div><div class="cs-bjxq-item-text">
                                        <el-row :gutter="10">
                                            <!-- <h5>视频</h5> -->
                                            <el-upload
                                              action="https://jsonplaceholder.typicode.com/posts/"
                                              list-type="picture-card"
                                              :on-preview="handlePictureCardPreview"
                                              :on-remove="handleRemoveVideo"
                                              :before-upload="beforeAvatarUploadVideo"
                                              v-model="addForm.videos">
                                                <i class="icon-ha-add" v-if="showReloadVideo" ></i>
                                            </el-upload>
                                            <el-dialog v-model="dialogVisible" size="tiny">
                                              <img width="100%" :src="dialogImageUrl" alt="">
                                            </el-dialog>
                                        </el-row>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <el-form-item>
                       <el-button type="primary" @click="submitForm">提交</el-button>
                    </el-form-item>
                </div>

                </el-form>
        </div>
    </div>
    <div class="bjxq-group-component">
        <addpositioncomponent></addpositioncomponent>
    </div>

</div>
</div>
</template>
<script>
export default{
    props: {
        isShow_add: {
            type: Boolean,
            default: false
        },
        getListData:{
            type:Object,
            default:null
        }
    },
    components: {
        addpositioncomponent: function (resolve, reject) {
            require(['./add_position.vue'], resolve)
        }
    },
    data(){
    var checkTel = (rule, value, callback) =>
    {
        if (!value) {
            return callback(new Error('电话不能为空'));
        }
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
            return callback(new Error('手机号格式不正确'));
        }
    };
    return {
        addForm: {
            address: '',
            time:{},
            name: '',
            tel: '',
            images: [],
            videos: [],
            type:4,
            status:0
        },
        rules: {
            name: [
                {required: true, message: '请输入姓名', trigger: 'blur'}
            ],
            tel: [
                {validator: checkTel, trigger: 'blur'}
            ],
            address: [
                {required: true, message: '请选择地点', trigger: 'blur'}
            ],
            content: [
                {required: true, message: '请输入报警内容', trigger: 'blur'}
            ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        showReloadImg: true,
        showReloadVideo: true,
        isEmpty:true,
        imgNum:0,
        videoNum:0
    }
},
computed:{
    time:function(){
        var myDate=new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth();
        var day = myDate.getDate();
        var hour = myDate.getHours();
        var min = myDate.getMinutes();
        this.addForm.time = new Date(year,month,day,hour,min);
        return this.addForm.time;
    }
},

methods:{
    handleRemoveImg(file, fileList)
    {
        this.showReloadImg=true;
    }
,
    handleRemoveVideo(file, fileList)
    {
        this.showReloadVideo=true;
    },
    handlePictureCardPreview(file)
    {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    }
,
    closeDialog()
    {
        this.$emit('hide_jqbl');
    },
    beforeAvatarUploadImg(file)
    {
        var that = this;
        that.imgNum++;
        if(that.imgNum == 4) {
            that.showReloadImg = false;
        }
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isPNG) {
            that.$message.error('上传头像图片只能是 JPG 格式或者 PNG 格式!');
            return false;
        }
        if (!isLt1M) {
            that.$message.error('上传头像图片大小不能超过 1MB!');
            return false;
        }
        return isJPG || isPNG && isLt1M;
    },
    beforeAvatarUploadVideo(file)
    {
        var that = this;
        that.videoNum++;
        if(that.videoNum == 4) {
            that.showReloadVideo = false;
        }
        const isMP4 = file.type === 'video/mp4';
        if (!isMP4) {
            that.$message.error('上传视频只能是 MP4 格式!');
            return false;
        }
        return isMP4;
    },

    showPosition()
    {
        const Bus = global.eventHub;
        Bus.$emit('doto_show_addposition');
    },
    submitForm()
    {
        let that = this;
        let token = global.data.getToken();
        if (!token) {
            return false;
        }
        var formData = JSON.stringify(that.addForm);

        that.$http.post(global.config.weburl + "api/sysSubject/addSysSubject.do", {
            token: token
        }, formData)
                .then(
                function (res) {
                    if (res.data.code == 0) {
                        const Bus = global.eventHub;
                        Bus.$emit('getListData');

                    } else {
                        global.tools.handleError(res.data);
                    }
                });
    }
}

}

</script>
<style lang="less">
.alert-add-pc{
    .cs-bjxq-dailog{box-shadow:0 1px 3px rgba(0,0,0,.3);background: #FAFAFA;width: 566px; height:600px;position: absolute;right:24%;top:60%;margin-top: -300px;border-radius: 0.5rem;z-index:10}
    .el-dialog__header{text-align: center;padding: 15px;border-bottom: 1px solid #d6d6d6;}

    .cs-bjxq-dailog__body{padding: 5px 0 10px;}
    .cs-bjxq-box-left{width: 100%;padding: 0 10px;height: 540px;overflow-y:auto;}
    .cs-bjxq-box-right{width: 50%;padding: 0 10px;}
    .cs-bjxq-item-card{color:#000000;}
    .cs-bjxq-item-tl{font-weight: 600;padding:15px 10px 5px;}
    .cs-bjxq-item-box{position:relative}
    .cs-bjxq-item-box {border: 1px solid #d6d6d6;border-radius: 0.2rem;background: #fff;}
    .cs-bjxq-item-box ul li{border-bottom: 1px solid #d6d6d6;box-sizing: border-box;padding: 24px;display: -moz-box; display: -webkit-box;  display: box;display: -moz-flex; display: -webkit-flex;display: flex;    height: 80px;}
    .cs-bjxq-item-lable{font-weight: 600;width: 80px;line-height: 30px; margin-top: 10px;}
    .cs-bjxq-item-text{color:#353535;margin-top: -10px;}
    .cs-bjxq-all-steps{overflow-y:auto;height: 430px;}
    .bjxq-dialog-footer{text-align: center;margin-top: 10px;}
    .el-step__main {
        white-space: normal;
        padding-right: 10px;
        text-align: left;
        background: #fff;
        width: 100%;
        margin-left: 10px;
        border: 1px solid #d6d6d6;
        border-radius: 0.3rem;
    }
    .cs-bjxq-item-text .image{width:auto;max-width: 40px;
        height: 40px;
        display: inline-block;
        margin-right: 10px;}
    .cs-bjxq-item-text .video_image{width: 40px;
        height: 28.8px;
        display: inline-block;
        margin-right: 10px;}
    .bjxq-group-component{position: absolute;z-index: 2000;top: 0;width: 100%}
    .el-steps{margin-bottom:10px;}

    .cs-bjxq-dailog .el-dialog__title {color: #353535;}
    .cs_sy_icon{
        position: relative;
        cursor: pointer;
    }
    .cs_sy_icon .voice_sj{
        color: #fff;
        position: absolute;
        top: 5px;
        left: 40px;
        font-size: 14px;
    }
    .check{
        margin-top: 8%;
        width: 30px;
        height: 30px;
    }
    .line{
        width: 2px;
        height: 90%;
        background-color: lightgray;
        position: absolute;
        top: 60%;
        left: 3%;
        z-index: -1;
    }
    .realname{
        font-size: 16px;
        color: #333;
        margin-top: 5%;
    }
    .el-step__title{
        float: right;
        margin-top: -7%;
        padding-right: 10px;
        color: #333;
        font-weight: normal;
    }
    .el-step__description{
        line-height: 23px;
    }
    .el-form-item{
        margin:0;
        width: 100%;
    }
    .address-input{
            width: auto;
    }
    .el-form{
        width:100%;
    }
    .el-button{
        margin-left: 50%;
        margin-top: 2px;
    }
    .fixed-height{
        height:120px !important;
        width: 528px;
    }
     .el-input__inner{
        border:0 none;
         padding: 0;
         margin-top: 6px;
    }
    .el-input__icon{
        display:none;
    }
    .el-upload--picture-card{
        width: 30px;
        height: 30px;
        border: none;
        margin-top: 45px;
        background-color: #fff;
    }
  .cs-bjxq-item-box ul .el-upload-list{border: none}
  .cs-bjxq-item-box ul li .el-upload-list__item{
      display: inline-block;
      height: 80px;
      width: 80px;
      padding: 0;
  }
  .el-upload--picture-card i {
    position: absolute;
    top: 45px;
}
  .el-textarea .el-textarea__inner{
      margin-top: 10px;
      border: none;
      margin-left: -8px;
      overflow-y:hidden
  }
  .cs-bjxq-item-box .el-row {
      box-sizing: border-box;
      padding: 8px;
      height: 65px;
      border-bottom: 1px solid #d6d6d6;
  }
  .cs-bjxq-item-box .textarea .el-row,.fixed-height .el-row{
    border-bottom: none;
}
  .el-form-item__error{
      position: relative;
      top: -13px;
 }
  .cs-bjxq-item-box .textarea{
     height: auto;
 }
}
</style>
