<template>
    <div class="el-dialog__wrapper cds_wsj">
        <div class="cs-wsj-dailog el-dialog">
            <div class="el-dialog__header">
                <div class="cs-wsj-dialog__header">
                    <span class="el-dialog__title">
                        <img src="../../../../static/images/import.png" alt="">
                        {{type==1 ? "用水" : "用电"}}数据导入{{flag==1 ? "中. . ." : ""}}
                    </span>
                    <div class="cs-wsj-dialog__headerbtn" @click="close_xz"><i class="el-dialog__close el-icon-close"></i></div>
                </div>
            </div>
            <div class="tishi " v-if="is_tishishow">
                <div class="el-dialog__body cs-jcjb-dailog__body">
                    <div class="cs-jcjb-box__message">
                        注意！请先下载数据导入模板，按照模板格式整理录入各项数据。
                    </div>
                </div>
                <div class="dialog-footer">
                    <el-button @click="quxiaoclick" type="primary">
                        <span>
                            取消
                        </span>
                    </el-button>
                    <el-button @click="todoclick" type="primary">
                        <span>
                            下载模板
                        </span>
                    </el-button>
                </div>
                <div class="tiaoguo" @click="tiaoguoclick">
                    <div style="text-align: center;">
                        <el-button type="primary" class="pass-btn">
                            跳过
                        </el-button>
                        <br/> 已整理好数据
                    </div>
                </div>
            </div>
            <div class="daoru" v-if="is_daorushow" v-loading="loadings">
                <div class="el-dialog__body cs-jcjb-dailog__body">
                    <div class="cs_xuanze">
                        <div class="cs_xiaoqu">
                            <span class="cs_xq">小区：</span>
                            <el-select filterable placeholder="请选择" style="width: 165px; margin:0 10px 0 10px;" v-model="select01">
                                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in options01">
                                </el-option>
                            </el-select>
                            <span v-if="warning_xq" style="display: block;line-height:1; padding-left: 55px; color: #FF4949">请选择小区</span>
                        </div>
                        <div class="cs_shijian">
                            <span class="cs_sj">时间：</span>
                            <el-date-picker placeholder="选择月" :editable="false" @change="getdata" type="month" v-model="timedata" style="margin-bottom: 10px;margin-left: 5px;width: 165px;">
                            </el-date-picker>
                            <span v-if="warning_sj" style="line-height:1;display: block; padding-left: 50px; color: #FF4949">请选择时间</span>
                            <span v-if="warning_sj2" style="line-height:1;display: block; padding-left: 50px; color: #FF4949">时间不能大于当前时间</span>
                        </div>
                    </div>
                    <div class="cs_daoru">
                        <span>
                            请选择要导入的文件:
                        </span>
                        <div class="cs-jcjb-box__message">
                            <el-upload ref="upload" :action="webuploadurl" :on-preview="onPreview" :on-success="handlePreview" :file-list="fileList" :data="parmas" :before-upload="beforeUpload" :accept="accept" :auto-upload="false">
                                <el-button slot="trigger" size="small">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small"  @click="submitUpload">导入数据</el-button>
                            </el-upload>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: Number,
            default: 1
        }
    },
    data: function() {
        return {
            webuploadurl: global.config.weburl + "file/upload/file.do",
            is_daoruzhongshow: false,
            is_tishishow: true,
            is_daorushow: false,
            is_sjtk: false,
            timedata: "",
            fileList: [],
            flag: 0,
            parmas: {
                name: "fff"
            },
            month: "",
            loadings: false,
            filepath: "",
            warning_sj: false,
            warning_xq: false,
            warning_sj2:false,
            accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv, ",
            options01: {},
            select01: "",
            deptId: global.data.getDeptid()
        }
    },
    methods: {
        onPreview(file) {
            var that = this;
            var arr = [];
            this.$refs.upload.uploadFiles.forEach(function(value, index, array) {
                if (value.uid != file.uid) {
                    arr.push(value);
                }
            });
            this.$refs.upload.uploadFiles = arr;
        },
        beforeUpload(file) {


            this.loadings = true;
            this.flag = 1;
        },
        submitUpload() {
            var that = this;
            if (!that.select01) {
                that.warning_xq = true;
                that.warning_sj = false;
                that.warning_sj2 = false;
            } else if (!that.month) {
                that.warning_sj = true;
                that.warning_xq = false;
                that.warning_sj2 = false;
            } else if (this.timedata > new Date()) {
                that.warning_sj = false;
                that.warning_sj2 = true;

            } else  {
                that.$refs.upload.submit();
                that.warning_xq = false;
                that.warning_sj = false;
                that.warning_sj2 = false;
            }
        },
        tiaoguoclick() {
            this.is_daorushow = true;
            this.is_tishishow = false;
        },
        close_xz() {
            var Bus = global.eventHub;
            Bus.$emit("jstankuang");
        },
        handlePreview(res,file) {
            if (res.code == 0) {
                this.filepath = res.data;
                this.postlistdata();
            } else {
                this.$message({
                    type: 'error',
                    message: "文件上传失败"
                });
            }
        },
        postlistdata() {
            let that = this;
            var _param = {
                token: global.data.getToken(),
                type: that.type,
                deptId: that.select01,
                month: that.month,
                filepath: that.filepath
            };
            this.$http({
                method: 'POST',
                url: global.config.weburl + "api/lifeData/importLifeData.do",
                params: _param
            }).then(function(res) {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "数据导入成功"
                    });
                    var Bus = global.eventHub;
                    Bus.$emit("jstankuang");
                    Bus.$emit("getListData");
                    Bus.$emit("changeCurPage",1);
                } else {

                    global.tools.handleError(res.data);
                    var Bus = global.eventHub;
                    Bus.$emit("jstankuang");
                }
                that.loadings = false;
            }, function() {
                this.$message({
                    type: 'success',
                    message: "数据导入失败"
                });
                that.loadings = false;
            });
        },
        getdata(e) {
            this.month = e;
        },
        todoclick() {
            var Bus = global.eventHub;
            Bus.$emit("jstankuang");
            location.href = global.config.weburl + "/upload/files/lifedata_template.xlsx";
        },
        quxiaoclick() {
            var Bus = global.eventHub;
            Bus.$emit("jstankuang");
        },
        getdeptId() {
            let that = this;
            var _param = {
                token: global.data.getToken()
            };
            this.$http({
                method: 'POST',
                url: global.config.weburl + "api/dept/findByUserPoliceStation.do",
                params: _param
            }).then(function(res) {
                //console.log(res.body.data)
                if (res.body.code == 0) {
                    this.options01 = res.data.data;
                    this.select01 = this.options01[0].id;
                } else {
                    global.tools.handleError(res.data);
                }
            });
        }
    },
    created: function() {
        this.getdeptId();
    },
    mounted: function() {

    },
    watch: {

    }
}
</script>
<style scoped="" lang="less">
.cds_wsj{
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    .cs-jcjb-box__message {
        text-align: center;
        font-size: 16px;
        padding: 10px;
        color: #fff;
        button{
            border-radius: 2px;
            background: #275e8b;
            border: none;
            color: #fff;
            width: 95px;
            height: 40px;
        }
    }
    .cs-wsj-dialog__headerbtn{
        cursor: pointer;
    }
    .el-dialog__header{
    padding:15px 14px ;
}
    .cs-wsj-dialog__header{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        img{
            margin-right: 5px;
        }
    }

    .cs-wsj-dailog {
        width: 560px;
        top: 50%;
        margin-top: -125px;
        /* margin:-280px 0 0 -125px; */ 
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-sizing: border-box;
        opacity: 0;
        animation: myopacity 0.2s both;
    }

    @keyframes myopacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .dialog-footer {
        width: 200px;
        margin: 0 auto;
        text-align: center;
        button {
            width: 88px;
            border-radius: 2px;
            background: #275e8b;
            border: none;
        }
    }

    .drsj-footer {
        width: 200px;
        margin: 0 auto 20px;
        text-align: center;
    }

    .tiaoguo {
        padding: 15px 0;
        font-size: 12px;
        display: flex;
        justify-content: flex-end;
        padding-right: 30px;
        color: #fff;
        button {
            border-radius: 2px;
            background: #1a3e5c;
            border: 1px solid #275e8b;
        }
    }
    .daoru{
        .el-dialog__body{
            padding: 15px 38px;
        }
    }
    .cs-jcjb-dailog__body {
        overflow-x: hidden;
        overflow-y: auto;
        color: #fff;
        .cs_xuanze {
            display: flex;
        }
        .cs_xiaoqu {
            margin-bottom: 20px;
            .cs_xq {
                float: left;
                line-height: 36px;
                color: #fff;
            }
            .el-select {
                float: left;
            }
        }
        .cs_shijian {
            .cs_sj {
                float: left;
                line-height: 36px;
                color: #fff;
            }
            .el-select {
                float: left;
            }
        }
    }
}

</style>
