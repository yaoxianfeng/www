<template>
<div>
    <ha-dialog title="警情补录" class="alarm-add-page" size="small" @close="closeDialog" :style="bjsqtop">
        <div class="" :style="bjsqheight">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <ha-formcard title="报警人信息">
                    <el-row class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><span class="ha-form-item-star">*</span><label class="ha-form-item__label">报警人</label></el-col>
                        <el-col :span="18"><el-form-item prop="name"><el-input v-model="ruleForm.name" placeholder="请输入报警人姓名" :maxlength="20"></el-input></el-form-item></el-col>
                    </el-row>
                    <el-row  class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><span class="ha-form-item-star">*</span><label class="ha-form-item__label">电话</label></el-col>
                        <el-col :span="18"><el-form-item prop="phone"><el-input v-model="ruleForm.phone" placeholder="请输入电话" ></el-input></el-form-item></el-col>
                    </el-row>
                </ha-formcard>


                <ha-formcard title="警情信息">
                    <el-row class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><span class="ha-form-item-star">*</span><label class="ha-form-item__label">报警时间</label></el-col>
                        <el-col :span="18"><el-form-item prop="altime"><el-date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.altime" :editable="false" ></el-date-picker></el-form-item></el-col>
                    </el-row>
                    <el-row class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><span class="ha-form-item-star">*</span><label class="ha-form-item__label">报警地点</label></el-col>
                        <el-col :span="18"><el-form-item prop="address" class="address-input" ><div class="width100" @click="showPosition"><div class="cs-bjxq-item-text" v-model="ruleForm.address">{{ruleForm.address}}</div><i class="icon-ha-position" ></i></div></el-form-item></el-col>
                    </el-row>
                    <el-row class="ha-formcard-item textarea">
                        <el-col :span="5" class="cs-bjxq-item-lable"><span class="ha-form-item-star">*</span><label class="ha-form-item__label">报警内容</label></el-col>
                        <el-col :span="18">
                            <el-form-item prop="description">
                                <!--<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="200"  placeholder="请输入内容" v-model="ruleForm.description"></el-input>-->
                                <div class="el-textarea">
                                    <textarea v-model="ruleForm.description" @keyup="inlimit()"  placeholder="请输入内容" rows="2" maxlength="200" class="el-textarea__inner" style="height: 76px; margin-top: 0px; margin-bottom: 0px;"></textarea>
                                </div>
                                <span class="inlimit">{{curr}}/{{limit}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </ha-formcard>

                <ha-formcard title="图像信息">
                    <el-row class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><label class="ha-form-item__label">图片</label></el-col>
                        <el-col :span="18">
                            <el-upload
                                    :action="uploadurl"
                                    :file-list="imgsArr2"
                                    :multiple="true"
                                    ref="imagesupload"
                                    list-type="picture-card"
                                    :before-upload="beforeAvatarUploadImg"
                                    :on-remove="handleImgRemove"
                                    :on-success="handleAvatarImgScucess">
                                <i class="icon-ha-add" v-if="showReloadImg" ></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny">
                                <img width="60%" height="60%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-col>
                    </el-row>


                    <el-row class="ha-formcard-item">
                        <el-col :span="5" class="cs-bjxq-item-lable"><label class="ha-form-item__label">视频</label></el-col>
                        <el-col :span="18">
                            <el-upload
                                    :action="uploadurl"
                                    :file-list="videosArr2"
                                    :multiple="true"
                                    ref="videoupload"
                                    list-type="picture-card"
                                    :on-remove="handleVideoRemove"
                                    :before-upload="beforeAvatarUploadVideo"
                                    :on-success="handleAvatarVideoScucess">
                                <i class="icon-ha-add" v-if="showReloadVideo" ></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-col>
                    </el-row>

                </ha-formcard>
            </el-form>
        </div>
        <div slot="footer">
            <div class="ha-dialog__footer__btngroup">
                <el-button v-if="saving" type="ha_btn" @click="saveData">保存</el-button>
                <el-button v-else type="ha_btn" class="disabled" disabled="disabled">保存中...</el-button>
            </div>
        </div>


    </ha-dialog>

    <div class="bjxq-group-component">
        <!-- 组件组 -->
        <addpositioncomponent v-if="isShow_geo" @getCurrentPoint="getCurrentPoint" @close="closegeo" :mypoint="current_point"></addpositioncomponent>
    </div>
</div>


</template>
<script>
//import mystyle from '../../../util/vue/style';


export default{
    //mixins: [mystyle],
    components: {
        addpositioncomponent: function (resolve, reject) {
            require(['../../../components/common/map/src/geo_amap_position.vue'], resolve)
        }
    },
    data(){
        return {
            imgsArr: [],
            videosArr: [],
            imgsArr2: [],
            videosArr2: [],
            ruleForm: {
                name: '',
                phone: '',
                address: '',
                altime: new Date(),
                description:""
            },
            current_point:{},
            dialogImageUrl: '',
            dialogVisible: false,
            imgNum:0,
            videoNum:0,
            isShow_geo:false,
            showReloadImg:true,
            showReloadVideo:true,
            rules: {
                name: [
                    {
                        validator: (rule, value, callback) => {
                            if (global.tools.isNullString(value)) {
                                callback(new Error('请输入报警人姓名'));
                            } else if (value.length > 20) {
                                callback(new Error('报警人姓名限20字以内'));
                            }  else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                altime: [
                    { type: 'date', required: true, message: '请选择报警时间', trigger: 'change' }
                ],
                phone: [
                    {
                        validator: (rule, value, callback) =>
                        {
                            if (!value) {
                                callback(new Error('电话不能为空'));
                            }

                            var isMob=/^1[3|4|5|7|8][0-9]\d{8}$/;
                            if(!(isMob.test(value))){
                                callback(new Error('手机号格式不正确'));
                            }
                            else{
                                callback()
                            }
                        }, trigger:'blur'
                    }
                ],
                address: [
                    {required: true, message: '请选择地点', trigger: 'blur'}
                ],
                description: [
                    {
                        validator: (rule, value, callback) => {
                            console.log("__________________");
                            if (global.tools.isNullString(value)) {
                                callback(new Error('请输入报警内容'));
                            } else if (value.length > 200) {
                                callback(new Error('报警内容限200字以内'));
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur,change'
                    }
                ]
            },
            limit: '200',
            curr: '0',
            saving: true
        }
    },
    computed:{
        uploadurl: function() {
            return global.config.weburl + "file/upload/file.do";
        },
//        alarm_add_page_style :function () {
//            getDialogSmallStyle
//        },
        bjsqheight(){
            return {
                maxHeight:this.$store.getters.getPageInfos.content_height*1-52-78+'px',
                overflowY:'auto'
            }
        },
        bjsqtop(){
            return {
                top:this.$store.getters.getPageInfos.top_bar_height+'px',
                width:"50%"
            }
        },
        handleVideoChange(file, fileList) {
//            console.log("handleVideoChange: ");
//            console.log(fileList);
            //this.videosArr = fileList;
        }
        /*showReloadImg() {

            if(this.$refs.imagesupload && this.$refs.imagesupload.uploadFiles && this.$refs.imagesupload.uploadFiles.length > 3) {
                return false;
            } else {
                return true;
            }
        },
        showReloadVideo() {
            if(this.$refs.videoupload && this.$refs.videoupload.uploadFiles && this.$refs.videoupload.uploadFiles.length > 3) {
                return false;
            } else {
                return true;
            }
        }*/

    },
    methods:{

        handlePictureCardPreview(file)
        {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        showPosition()
        {
            this.isShow_geo = true;

            //const Bus = global.eventHub;
            //Bus.$emit('doto_show_geo_position', this.current_point );
        },
        initpoint() {
            let userinfo = global.data.getUserInfo();
            let user_dept = userinfo.dept;


            //获取中心点的位置
            let _point = user_dept.location;

            if (_point) {

                this.current_point = {
                    position: _point.split(","),
                    address :""
                };

//                this.convertFrom (_point.split(","), (meg, result) => {
//                    if (result.info = "ok") {
////                        console.log(result.locations[0]);
//                        this.current_point = {
//                            position: result.locations[0],
//                            address :""
//                        };
//                    }
//                });
            }
        },
        convertFrom :function (points, callback) {
            //添加坐标转换 [ 如果后台换成高德就不要了，放开最下面的注释，注释掉第一句]
//            AMap.convertFrom(points, 'baidu', callback);
                callback('success', {
                    "info": 'ok',
                    "locations": points
                })

        },
        closegeo() {
            this.isShow_geo = false;
        },
        getCurrentPoint(current_point) {
            this.isShow_geo = false;
            this.current_point = current_point;
            this.ruleForm.address = current_point.address;
            let _position =  current_point.position;
            this.ruleForm.location = _position[0] +"," + _position[1];
        },
        closeDialog()
        {
            this.$emit('hide_jqbl');
        },
        beforeAvatarUploadImg(file)
        {

            var that = this;
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt1M = file.size / 1024 / 1024 < 1;
            const isFour = that.$refs.imagesupload.uploadFiles.length < 5;
            if (!isJPG && !isPNG) {
                that.$message.error('上传图片只能是 JPG 格式或者 PNG 格式!');
                return false;
            }
            if (!isLt1M) {
                that.$message.error('上传图片大小不能超过 1MB!');
                return false;
            }
            if (!isFour) {
                that.$message.error('至多只能上传4张图片！');
                return false;
            }
            return isJPG || isPNG && isLt1M && isFour;
        },
        beforeAvatarUploadVideo(file)
        {
            var that = this;
            const isMP4 = file.type === 'video/mp4';
            const isLt1M = file.size / 1024 / 1024 < 10;
            const isFour = that.$refs.videoupload.uploadFiles.length < 5;
            if (!isMP4) {
                that.$message.error('上传视频只能是 MP4 格式!');
                return false;
            }
            if (!isLt1M) {
                that.$message.error('上传视频大小不能超过 10MB!');
                return false;
            }
            if (!isFour) {
                that.$message.error('至多只能上传4个视频！');
                return false;
            }
            return isMP4 && isLt1M && isFour;
        },
        handleAvatarImgScucess(res, file) {

            if (res.code == 0) {
                file.webUrl = res.data;
                //this.$refs.imagesupload.fileList = [];
                //this.$refs.imagesupload.clearAll();
                //this.imgsArr.push(file);
            } else {
                global.tools.handleError(res.data)
            }
            if(this.$refs.imagesupload && this.$refs.imagesupload.uploadFiles && this.$refs.imagesupload.uploadFiles.length > 3) {
                this.showReloadImg = false;
            } else {
                this.showReloadImg = true;
            }
            console.log();
            this.$refs.imagesupload.$el.lastChild.lastChild.value = "";
        },
        handleAvatarVideoScucess(res, file) {

            if (res.code == 0) {
//                console.log(file)
                file.webUrl = res.data;
                file.url="/static/img/xhdpi.png";

            } else {
                global.tools.handleError(res.data)
            }
            if(this.$refs.videoupload && this.$refs.videoupload.uploadFiles && this.$refs.videoupload.uploadFiles.length > 3) {
                this.showReloadVideo = false;
            } else {
                this.showReloadVideo = true;
            }
            this.$refs.videoupload.$el.lastChild.lastChild.value = "";
        },
        handleImgRemove() {
            if(this.$refs.imagesupload && this.$refs.imagesupload.uploadFiles && this.$refs.imagesupload.uploadFiles.length > 3) {
                this.showReloadImg = false;
            } else {
                this.showReloadImg = true;
            }
            this.$refs.imagesupload.$el.lastChild.lastChild.value = "";
        },
        handleVideoRemove(){
            if(this.$refs.videoupload && this.$refs.videoupload.uploadFiles && this.$refs.videoupload.uploadFiles.length > 3) {
                this.showReloadVideo = false;
            } else {
                this.showReloadVideo = true;
            }
            this.$refs.videoupload.$el.lastChild.lastChild.value = "";
        },
        doSaveData() {
            let that = this;
            that.saving = false;
            if(that.saving){
                return false;
            }
            let token = global.data.getToken();
            if (!token) {
                return false;
            }

            var formData = that.ruleForm;
            formData.token = token;
            let _img_arr = [];



            let _imgsArr = this.$refs.imagesupload.uploadFiles;

            _imgsArr.forEach(function(value, index, array) {
                if (value) {
                    _img_arr.push(value.webUrl);
                }
            });


            let _videosArr = this.$refs.videoupload.uploadFiles;

            let _videos_arr = [];
            _videosArr.forEach(function(value, index, array) {
                if (value) {
                    _videos_arr.push(value.webUrl);
                }
            });

            formData.imgs  = _img_arr.join(",");
            formData.videos  = _videos_arr.join(",");

            formData.alertTime = global.tools.formartDate(that.ruleForm.altime, "YYYY-MM-DD HH:mm:00");

            that.$http.post(global.config.weburl2 + "api/alert/policeInput.do", formData).then(function(res) {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "添加成功",
                    });
                    this.$emit('doto_refresh_undo_list');
                } else {
                    global.tools.handleError(res.data);
                }
                setTimeout(function(){
                    that.saving = true;
                }, 1000)
            }, function(error) {
                this.$message({
                    type: 'error',
                    message: "添加数据失败",
                });

            })
        },
        saveData() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.doSaveData();
                } else {
                    return false;
                }
            });


        },
        inlimit() {
            let con = this.ruleForm.description;
            if(con){
                this.curr = con.length;
                if(con.length >= this.limit){
                    this.curr = this.limit;
                }
            }
        }
//        dispatch() {
//            console.log(this.$refs.ruleForm.fields[4].$parent);
//            this.$refs.ruleForm.fields[4].dispatch('ElFormItem', 'el.form.blur', [ this.ruleForm.description]);
//            //this.ruleForm.description.validator(this, this.ruleForm.description);
//
//        },
//        handleDesBlur(event) {
//            console.log(event);
//            this.dispatch();
//        }
    },
    mounted: function() {
        this.initpoint();
    }

}

</script>
<style lang="less">
.alarm-add-page{

    position: absolute;
    right: 0;
    border-radius: 2px;
    z-index: 10;

    .bjxq-group-component{position: absolute;z-index: 2000;top: 0;width: 100%}

    .ha-dialog__body{
        padding-top:0;
        .ha-formcard-item{
            padding: 10px 10px 0;border-bottom: 1px solid #275e8b;
            .ha-form-item__label{
                text-align: right;
                vertical-align: middle;
                float: left;
                font-size: 14px;
                line-height: 1;
                padding: 11px 12px 11px 0;
                box-sizing: border-box;
            }
            .ha-form-item-star{
                float: left;
                padding-right: 7px;
                margin-top: 8px;
                display: inline-block;
                color: #ff4949;
            }
            .el-date-editor--datetime{width: 100%}

            .el-input__inner{
                border:0 none;
                padding: 0;
                margin-top: 0;
                color: #fff;
            }
            .el-textarea {
                .el-textarea__inner{
                    margin-top: 0;
                    border: none;
                    margin-left: 0px;
                    padding: 0;
                    background:transparent;
                    color: #fff;
                }
            }
            .el-input__icon{
                display:none;
            }
            .el-upload--picture-card{
                width: 30px;
                height: 30px;
                border: none;
                margin-top: 20px;
                background:transparent;
                line-height: 1;
                i {
                    position: absolute;
                    top: 20px;
                    height: 30px;
                }
            }

            .el-upload-list--picture-card {
                .el-upload-list__item {
                    display: inline-block;
                    height: 60px;
                    width: 60px;
                    padding: 0;
                }
            }

        }
        .ha-formcard-item:last-child{border-bottom:0 none;}

    }


}

.inlimit{position: absolute;right: 15px;bottom: -10px;color: #20a0ff;opacity: 0.8}
.ha-dialog .ha-dialog__footer .ha-dialog__footer__btngroup .el-button--ha_btn.disabled{border-color: #797f88;background-color:#797f88;}
</style>