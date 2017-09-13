<template>
        <div class="cs-bszn-update-page" v-show="is_show_update">
            <div class="csf_left" :style="ids_yulan?{left:'-30%'}:{}">
                <div class="cs-bszn-update-hd">
                    <span class="el-dialog__title" v-if="isClickrow">
                        查看
                    </span>
                    <span class="el-dialog__title" v-else="">
                        {{!selectRowData.title ?'新增' :'编辑'}}
                    </span>
                    <div @click="hideUpdateModel()" class="el-dialog__headerbtn">
                        <i class="el-dialog__close el-icon el-icon-close">
                        </i>
                    </div>
                </div>
                <!--  -->
                <div class="f_content">
                    <el-input style="margin-bottom: 20px;" @change="titledata" :autosize="{ minRows: 1, maxRows: 1}" :disabled="isClickrow" :maxlength="30" placeholder="在这里输入标题" v-model="title">
                    </el-input>
                    <editcomponent :article_data="selectRowData.content" :Edit_id="Edit_id" :isBianjin="isbin" :EditDiv="EditDiv" @change="editdata"></editcomponent>
                </div>
                <div class="cs-bszn-update-dialog-footer" v-if="!isClickrow">
                    <el-button :disabled="isClickrow" type="primary" class="cs-button"@click="yulanContent">
                        预览
                    </el-button>
                    <el-button :disabled="isClickrow" class="cs-button"  @click="saveContent" type="primary">
                        保存
                    </el-button>
                    <el-button :disabled="isClickrow" class="cs-button"  @click="pushContent" type="primary">
                        发布
                    </el-button>
                </div>
            </div>
            
            <div class="csf_yulan" :style="ids_yulan?{left:'98%'}:{}" v-if="ids_yulan">
                <yulancomponent  :content="yl_value"></yulancomponent>
            </div>
        </div>
    <!-- </div> -->
</template>

<script>
export default {
    props: {
        isShow_bjxq: {
            type: Boolean,
            default: false
        },
        is_show_update: false,
        selectRowData: {},
        isClickrow: false,
        isbin:'',
    },
    data: function() {
        return {
            title: '',
            yl_value: null,
            ids_yulan: false,
            Editcontent: "",
            isBianjin:'',
            EditDiv: {
                height: "350px"
            },
            Edit_id: "bsznid",
        }
    },
    components: {
        yulancomponent: function(resolve, reject) {
            require(['../../common/yulan/yulan.vue'], resolve)
        },
        editcomponent: function(resolve, reject) {
            require(['../../common/Edit/Edit.vue'], resolve)
        }
    },
    methods: {
        titledata() {
            this.yl_value = {
                title: this.title,
                name: global.data.getUserInfo().dept.name,
                massage: this.Editcontent
            }
        },
        yulanContent() {
            this.ids_yulan =!this.ids_yulan;
        },
        editdata(msg) {
            this.Editcontent = msg;
            this.yl_value = {
                title: this.title,
                name: global.data.getUserInfo().dept.name,
                massage: this.Editcontent
            }
        },
        resetData(flag) {
            this.$emit('clearSelectRowData', flag);
        },
        doPublish() {  //发布办事指南
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if(!that.title){
                this.$message("请输入标题");
                return false
            }else if(!that.Editcontent){
                this.$message("请输入内容");
                return false
            }
            this.$http.post(global.config.weburl + "api/jwContent/addJWContent.do", {
                    token: token,
                    title: that.title,
                    subjectId: that.selectRowData.subjectId,
                    content: that.Editcontent,
                    directPublish: 1
                })
                .then(
                    function(res) {
                        var _data = res.data;
                        if (_data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '发布办事指南成功!'
                            });
                            that.resetData(3);
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }
                );
        },
        doPublishEdit() {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if(!that.title){
                this.$message("请输入标题");
                return false
            }else if(!that.Editcontent){
                this.$message("请输入内容");
                return false
            }
            this.$http.post(global.config.weburl + "api/jwContent/updateJWContent.do", {
                    token: token,
                    id: that.selectRowData.id,
                    title: that.title,
                    subjectId: that.selectRowData.subjectId,
                    content: that.Editcontent,
                    directPublish: 1
                })
                .then(
                    function(res) {
                        var _data = res.data;
                        if (_data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '发布办事指南成功!'
                            });
                            that.resetData(3);
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }
                );
        },
        doAddData() { //添加发布
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if(!that.title){
                this.$message("请输入标题");
                return false
            }else if(!that.Editcontent){
                this.$message("请输入内容");
                return false
            }
            this.$http.post(global.config.weburl + "api/jwContent/addJWContent.do", {
                    token: token,
                    title: that.title,
                    subjectId: that.selectRowData.subjectId,
                    content: that.Editcontent
                })
                .then(
                    function(res) {
                        var _data = res.data;
                        if (_data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '保存办事指南成功!'
                            });
                            that.resetData(6);
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }
                );
        },
        doUpdateData() {//更新
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if(!that.title){
                this.$message("请输入标题");
                return false
            }else if(!that.Editcontent){
                this.$message("请输入内容");
                return false
            }
            this.$http.post(global.config.weburl + "api/jwContent/updateJWContent.do", {
                    token: token,
                    id: that.selectRowData.id,
                    title: that.title,
                    subjectId: that.selectRowData.subjectId,
                    content: that.Editcontent
                })
                .then(
                    function(res) {
                        var _data = res.data;
                        if (_data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '更新办事指南成功!'
                            });
                            that.resetData(6);
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }
                );
        },
        saveContent() { //保存成功
            if(this.title){
                this.title=this.title.replace(/(^\s*)|(\s*$)/g, ""); //正则去除两端空格
            }
            if(this.Editcontent){
                this.Editcontent=this.Editcontent.replace(/(^\s*)|(\s*$)/g, "");
            }
            var _selectRowData = this.selectRowData;
            if (!_selectRowData.id) {
                this.doAddData();
            } else {
                this.doUpdateData();
            }
        },
        pushContent() { //发布成功
            if(this.title){
                this.title=this.title.replace(/(^\s*)|(\s*$)/g, ""); //正则去除两端空格
            }
            if(this.Editcontent){
                this.Editcontent=this.Editcontent.replace(/(^\s*)|(\s*$)/g, "");
            }
            var _selectRowData = this.selectRowData;
            if (!_selectRowData.id) {
                this.doPublish();
            } else {
                this.doPublishEdit();
            }

        },
        hideUpdateModel() {
            const that = this;
            const Bus = global.eventHub;
            that.$emit('hideUpdateModel');
        }
    },
    watch: {
        is_show_update: function() {
            if(!this.is_show_update){
                this.ids_yulan=false;
                this.$emit("change_records");
            }
        },
        selectRowData: {
            deep: true,
            handler: function() {
                if(this.selectRowData.title){
                    this.title = this.selectRowData.title;
                }else{
                    this.title="";
                }
                
            }
        }
    },
    created: function() {
        this.title = this.selectRowData.title;
        var Bus = global.eventHub;
        var that = this;
        Bus.$on("close_yl", function() {
            that.ids_yulan = false;
        });
    }
}
</script>
<style lang="less">
.csf_bszn_el-dialog__wrapper {
    .el-dialog--small{
        width: 35%;
        position: absolute;
        .el-dialog__header{
            display: none;
        }
        .el-dialog__body{
            height: 580px;
        }
    }
    background: rgba(0, 0, 0, 0.4);
    .cs-bszn-update-page {
        display: flex; 
        justify-content: center;
        color: #fff;
        .csf_left{
            position: absolute;margin-top: -290px;top: 50%;
            background: url(/static/images/bg-icea.png);
            border: 1px solid #275e8b;
            background: rgba(39, 94, 139, 0.3);
            width: 100%;
            height: 580px;
            .cs-bszn-update-hd {
                height: 50px;
                background: #1a3e5c;
                padding-left: 15px;
                line-height: 50px;
                .el-dialog__title{
                    color: #fff;
                }
                 .el-dialog__headerbtn{
                    margin-right: 25px;
                }
            }
        }
        .csf_yulan{
            width:360px;
            margin-left: -180px;
            height: 580px;
            position: absolute;margin-top: -290px;top: 50%;
            .el-dialog__headerbtn{
                width: 45px;
            }
        }
        .f_content {
            padding:0 20px;
            margin-top: 20px;

        }
        .cs-bszn-update-dialog-footer {
            display: flex;
            flex-flow: row wrap;
            padding: 20px 0 0;
            justify-content: center;
        }
    }
}
</style>
