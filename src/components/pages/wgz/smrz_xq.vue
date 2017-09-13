<template>
    <div class="cs-right-page" :style="tableheigth" >
        <div class="cs-right-hd">
            <!-- 表头 -->
            <span class="el-dialog__title">实名认证
                <span v-if="selectRowData">
                    <span v-if="selectRowData.deptInfo && selectRowData.deptInfo.type === '公安'">(公安)</span>
                    <span v-else-if="selectRowData.deptInfo && selectRowData.deptInfo.type === '小区'">(居民)</span>
                    <span v-else>(其他人员)</span>
                </span>
            </span>
        </div>
        <div class="cs-right-body" v-if="this.records" :style="bodyheigth">
            <!-- 表内容 -->
            <div class="cs-box2 cs-form-item cs-body-item cs-box-aaa">
                <div class="cs-box2 cs-box-flex1 cs-box-aaa">
                    <div class="labeltext">姓名</div>：
                    <div class="cs-box-flex-auto cs-form-item-content cs-form-sm-content cs-box-div"> {{selectRowData.realname}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-body-item cs-box-aaa">
                <div class="cs-box2  cs-box-aaa cs-box-flex3">
                    <div class="labeltext">联系电话</div>：
                    <div class="cs-box-flex-auto cs-form-item-content cs-box-div"> {{selectRowData.phone}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-body-item cs-box-aaa" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type != '公安'">
                <div class="cs-box2  cs-box-aaa cs-box-flex3">
                    <div class="labeltext">身份证号码</div>：
                    <div class="cs-box-flex-auto cs-form-item-content cs-box-div"> {{selectRowData.idCard}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item  cs-body-item" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type != '小区'">
                <div class="cs-box2 cs-box-aaa cs-box-flex1">
                    <div class="labeltext">职务</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content cs-form-sm-content"> {{selectRowData.jobsName}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item  cs-body-item" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type != '小区'">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">工作单位</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content"> {{selectRowData.deptInfo.name}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-box-aaa cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex1">
                    <div class="labeltext">地址</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content cs-form-sm-content"> {{selectRowData.address}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-box-aaa cs-body-item" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type === '小区'">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">人员类型</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content"> {{selectRowData.jobsName}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-box-aaa cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">单位类型</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content"> {{selectRowData.deptInfo.type}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item  cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex1" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type === '公安'">
                    <div class="labeltext">警号</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content cs-form-sm-content"> {{selectRowData.policemanCode}}</div>
                </div>
                <div class="cs-box2 cs-box-aaa  cs-box-flex1" v-if="selectRowData.deptInfo && selectRowData.deptInfo.type === '小区'">
                    <div class="labeltext">小区</div>：
                    <div class="cs-box-flex-auto cs-form-item-content cs-form-sm-content"> {{selectRowData.deptInfo.name}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item  cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">申请时间</div>：
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content"> {{selectRowData.authingTime|moment}}</div>
                </div>
            </div>
            <div class="cs-form-item cs-form-sfz">
                <div class="cs-label-title">证件照片：</div>
                <div class="cs-box" ref="fcsimg" >
                    <div class="cs-item-left cs-item">
                        <div class="cs-sfz-img"><img  :src="selectRowData.idcardImage1|imgpathformat" alt="" /></div>
                    </div>
                    <div class="cs-item-right cs-item">
                        <div class="cs-sfz-img"><img  :src="selectRowData.idcardImage2|imgpathformat" alt="" /></div>
                    </div>
                </div>
            </div>
            <div class="cs-form-item cs-form-trial cs-tr" v-if="selectRowData.auth === 'authed'">
                <div class="cs-label-title cs-spyi">审批意见：<b>[通过]</b></div>
                <div class="cs-smrz-xq-authmsg"> {{selectRowData.authmsg}}</div>
            </div>
            <div class="cs-form-item cs-form-trial cs-tr" v-if="selectRowData.auth === 'authFail'">
                <div class="cs-label-title cs-spyi">审批意见：<b>[驳回]</b></div>
                <div class="cs-smrz-xq-authmsg"> {{selectRowData.authmsg}}</div>
            </div>
            <div class="cs-form-item cs-form-trial" v-if="selectRowData.auth === 'authing'">
                <div class="cs-label-title">审批意见：</div>
                <div class="el-textarea">
                    <textarea  placeholder="在这里输入审批意见" rows="3" maxlength="50" class="el-textarea__inner" v-model="authMsg"></textarea>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-body-item cs-box-aaa cs-form-trial " v-if="selectRowData.auth == 'authed' || selectRowData.auth == 'authFail'">
                <div class="cs-box2 cs-box-flex1 cs-box-aaa">
                    <div class="labeltext">审批人：</div>
                    <div class="cs-box-flex-auto cs-form-item-content cs-form-sm-content cs-box-div">{{selectRowData.authInfo ?selectRowData.authInfo.realname : ''}}</div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-body-item cs-box-aaa cs-form-trial " v-if="selectRowData.auth == 'authed' || selectRowData.auth == 'authFail'">
                <div class="cs-box2  cs-box-aaa cs-box-flex3">
                    <div class="labeltext">审批时间：</div>
                    <div class="cs-box-flex-auto cs-form-item-content cs-box-div">{{selectRowData.auditedTime|moment}}</div>
                </div>
            </div>
            <div class="cs-right-footer cs-sfz-footer" v-if="selectRowData.auth == 'authing'" >
                <el-button  v-on:click="updateAuth(1)">通过</el-button>
                <el-button  v-on:click="updateAuth(2)">驳回</el-button>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        isShow_rightbox: {
            type: Boolean,
            default: false
        },
        selectRowData: {},
        records: '',
        horizontal:'',
    },
    data() {
        return {
            authMsg: "",
            viewer: null,
            imageList: [],
            hori: false,
        }
    },
    methods: {
        ratedatas(){
            if(this.selectRowData){
                let obj1 = this.selectRowData.idcardImage1;
                let obj2 = this.selectRowData.idcardImage2;
                this.imageList[0] = obj1;
                this.imageList[1] = obj2;
            }
        },
        updateAuth(type) {
            //审核认证
            let that = this;
            var _param = {
                token: global.data.getToken(),
                id: that.selectRowData.id,
            };

            if (type == 1) {
                _param.auth = "authed";
                _param.authMsg = !!that.authMsg ? that.authMsg : "审核通过";
            } else {
                _param.auth = "authFail";
                _param.authMsg = !!that.authMsg ? that.authMsg : "审核驳回";
            }
            if (_param.authMsg.length > 200) {
                this.$message({
                    type: 'warning',
                    message: "审批意见限200字"
                });
                return false;
            }
            that.$http.post(global.config.weburl + 'api/user/updateAuthStatus.do', _param).then(function(res) {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "审核成功"
                    });
                    that.$emit('reloadList');
                } else {
                    global.tools.handleError(res.data);
                }
            }, function(error) {
                this.$message({
                    type: 'error',
                    message: "审核失败"
                });
            });
        },
        //   fcsimg
        initImgViewer(){
            var that=this;
            if (this.viewer) {
                this.viewer.update(); //竖向
            } else {
                if (that.imageList && that.imageList.length > 0) {
                    if(this.$refs.fcsimg){
                        this.viewer = new Viewer(this.$refs.fcsimg, {
                            movable: false,
                            viewed: function() {
                                that.viewer.image.parentNode.onclick = function() {
                                    that.viewer.hide();
                                },
                                that.viewer.image.onclick = function(e) {
                                    if (e && e.stopPropagation) {//非IE浏览器 
                                    　　e.stopPropagation(); 
                                    } 
                                    else {//IE浏览器 
                                        window.event.cancelBubble = true; 
                                    } 
                                }
                            }
                        });
                    } 
                }
            }
        }

    },
    computed:{
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return {
                'max-height': _oheight + "px"
            }
        },
        bodyheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height-40;
            return {
                'max-height': _oheight + "px"
            }
        }
    },
    watch: {
        selectRowData: function() {
            if (this.selectRowData) {
                this.ratedatas();
            }
        },
        horizontal: function() {
            this.hori = true;
        }
    },
    created: function() {
        var that = this;
        that.ratedatas();
    },
    mounted: function() {
        this.initImgViewer();
    },
    updated() {
        var that = this;
        that.initImgViewer();
    }
}
</script>
<style scoped>
    .cs-right-page {
        height: 100%;
        border: 1px solid #285e8c;
        color: #fff;
    }

    .cs-right-body {
        width: 100%;
         height: 100%;
        overflow: auto;
        box-sizing: border-box;

    }

    .cs-filter-box2 .el-radio-group {
        line-height: 36px;
    }
    .el-dialog__title{
        color: #fff;
        font-size: 14px;
        line-height: 40px;
    }
    .cs-body-item .cs-box-aaa {
        width: 50%;
        line-height: 39px;
    }

    .cs-form-item .labeltext {
        white-space: nowrap;
        vertical-align: baseline;
        padding: 0;
        margin: 0;
        font-size: 14px;
        text-align: justify;
        text-align-last: justify;
    }

    .cs-box-div {
        width: 65%;
    }

    .cs-form-item .cs-form-item-content {
        word-break: break-all;
        font-size: 14px;
        width: 80%;
        float: left;
        display:block;
        white-space:nowrap;
        overflow:hidden; 
        text-overflow:ellipsis;
    }

    .cs-right-footer {
        padding: 20px 0;
    }

    .cs-form-item {
        width: 100%;
        border-top: 1px solid #285e8c;
        padding:0 16px;
    }

    .cs-form-sfz {
        min-height: 80%;
        font-size: 14px;
        padding-top: 20px;
        padding-bottom: 20px;
        height: 240px;
    }

    .cs-item {
        width: 48%;
        height: 100%;
        padding: 20px;
    }

    .cs-item img {
        width: 100%;
        height: 150px;
        padding: 5px;
    }

    .cs-sfz {
        width: 100%;
        height: 28px;
        line-height: 28px;
        text-align: center;
        display: block;
        background: #eef1f6;
    }

    .cs-right-hd {
        width: 100%;
        color: #fff;
        background: #285e8c;
        text-align: center;
        height: 40px;

    }

    .cs-sfz-footer {
        width: 100%;
        padding: 10px 0;
        text-align: center;
        font-size: 14px;
    }
    .cs-sfz-footer button{
        width: 80px;
        height: 30px;
        border-radius: 2px;
    }
    .cs-sptime {
        margin-right: 40%;
    }

    .cs-smrz-xq-authmsg {
        width: 100%;
        text-indent: 30px;
        padding-bottom: 5px;
    }

    .el-dialog__title {
        font-weight: normal;
    }

    .cs-sfz-img {
        border: 1px solid #285e8c;
        padding: 3px;
        border-radius: 5px;
    }

    .cs-tr {
        min-height: 80px;
    }

    .cs-form-trial .cs-label-title {
        line-height: 32px;
    }

     .el-textarea__inner {
        background: #3987bb !important;
        border: 1px solid #27518b;
        color: #FFF;
        margin-right: 15px;
         opacity: 0.34;
         border-radius: 2px;
    }

    .el-button{
        background: #285e8c;
        color: #fff;
        border: 0;
    }

</style>
