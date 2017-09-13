<template>
    <div class="cs-right-page" :style="right_style">
        <div class="cs-right-hd" >
            <!-- 表头 -->
            <span class="el-dialog__title">
                无犯罪证明
                <span v-show="this.radio!=15" v-if="selectRowData?(selectRowData.type==0):''">
                    (自办)
                </span>
            <span v-show="this.radio!=15" v-if="selectRowData?(selectRowData.type==1):''">
                    (代办)
                </span>
            <span v-if="this.radio==15" v-show="selectRowData?(selectRowData.authStatus==1):''">
                    (已受理)
                </span>
            <span v-if="this.radio==15" v-show="selectRowData?(selectRowData.authStatus!=1):''">
                    (已驳回)
                </span>
            </span>
            <el-button v-if="selectRowData?(selectRowData.authStatus==4):''" @click="print" class="cs-button" type="primary" style="border: 1px solid #20a0ff">打 印</el-button>
        </div>
        <div class="cs-right-body" v-if="selectRowData.name" :style="bodyheigth">
            <!-- 表内容 -->
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        姓名：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.name}}
                    </div>
                </div>
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        身份证号码：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.idcardNo}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        联系电话：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.userPhone}}
                    </div>
                </div>
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        申请时间：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.createTimeStr|moment}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-box-aaa cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex1">
                    <div class="labeltext">
                        户籍地址：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content cs-form-sm-content ">
                        {{selectRowData.resAddress}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        现居地址：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content ">
                        {{selectRowData.address}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        要求出具证明单位：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content ">
                        {{selectRowData.unitName}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        申请用途：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content ">
                        {{selectRowData.target}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        申请承诺：本人保证所提供的资料是真实有效的，否则一切后果自己承担
                    </div>
                </div>
            </div>
            <div ref="sfz">
                <div class="cs-form-item cs-form-sfz">
                    <div class="cs-label-title">
                        证件照片：
                    </div>
                    <div class="cs-box">
                        <div class="cs-item-left cs-item">
                            <div class="cs-sfz-img">
                                <img :src="selectRowData.idcardImg1|imgpathformat" alt="证件照片" />
                            </div>
                        </div>
                        <div class="cs-item-right cs-item">
                            <div class="cs-sfz-img">
                                <img :src="selectRowData.idcardImg2|imgpathformat" alt="证件照片" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cs-form-item cs-form-sfz">
                    <div class="cs-label-title">
                        要求出具证明单位申请函：
                    </div>
                    <div class="cs-box">
                        <div class="cs-item-right cs-item">
                            <div class="cs-sfz-img">
                                <img :src="selectRowData.attachment|imgpathformat" alt="证明单位申请函" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        审批意见：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content ">
                        {{selectRowData.authDesc}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak" v-if="selectRowData.hasRecord!=0">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        有无犯罪记录：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content " v-show="selectRowData.hasRecord==1">
                        无犯罪记录
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content " v-show="selectRowData.hasRecord==2">
                        有犯罪记录
                    </div>
                </div>
            </div>
            <div class="cs-form-item cs-form-trial" v-if="this.radio==0">
                <div class="cs-label-title">
                    审批意见：
                </div>
                <textarea placeholder="在这里输入审批意见" rows="3" maxlength="200" class="el-textarea__inner" v-model="authDesc"></textarea>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="this.radio!=0">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        审批人：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.policeName}}
                    </div>
                </div>
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        审批时间：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.auditTime|moment}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="this.radio!=15&&selectRowData.type==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        代办人姓名：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.user.realname}}
                    </div>
                </div>
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        代办人身份证号：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.user.idCard}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="this.radio!=15&&selectRowData.type==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        代办人联系电话：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.user.phone}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-form-item cs-box-aaa cs-body-item cs-jiak" v-if="this.radio==15&&selectRowData.authStatus=='1'">
                <div class="cs-box2 cs-box-aaa cs-box-flex1">
                    <div class="labeltext">
                        录入查询结果：
                    </div>
                    <div class="cs-box-flex-auto cs-radio cs-box-div cs-form-item-content cs-form-sm-content">
                        <template>
                            <el-radio class="radio" label="1" style="color:green" v-model="radioxq">
                                无犯罪记录
                            </el-radio>
                            <el-radio class="radio" label="2" style="color:red" v-model="radioxq">
                                有犯罪记录
                            </el-radio>
                        </template>
                    </div>
                </div>
            </div>
            <div class="cs-wsbs-bottons cs-form-item cs-box-aaa cs-body-item" v-if="this.radio==0||selectRowData.authStatus=='1'">
                <el-button @click="acceptance(1)" class="cs-button" type="primary" v-show="this.radio==0">
                    通过
                </el-button>
                <el-button @click="acceptance(2)" class="cs-button" type="primary" v-show="this.radio==0">
                    驳回
                </el-button>
                <el-button @click="Send" type="primary" class="cs-button" v-show="selectRowData.authStatus=='1'">
                    发送
                </el-button>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak" v-if="this.radio==2349" v-show="selectRowData.recieveType==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext cs-lqzt-wlq">
                        领取状态：未领取（有效期剩余
                        <span>
                            {{selectRowData.invalidSurplusDays}}
                        </span> 天）
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak" v-if="this.radio==2349" v-show="selectRowData.authStatus==2">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext cs-lqzt-wlq">
                        等待办理人确认领取方式（有效期剩余
                        <span>
                            {{selectRowData.invalidSurplusDays}}
                        </span> 天）
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak"  v-if="selectRowData.authStatus==6" v-show="selectRowData.authStatus==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext cs-lqzt-ylq">
                        快递已签收(
                        <span>
                            {{selectRowData.emsRecieveTime|moment}}
                        </span> )
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="selectRowData.authStatus==6||selectRowData.authStatus==4" v-show="selectRowData.authStatus==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div @click="express" class="labeltext" style="cursor:pointer;color: #0aa6f7;">
                        查看快递信息：
                    </div>
                    <div class="cs-box-flex-auto cs-form-item-content cs-box-div" v-show="this.isems">
                        <div v-if="this.isemsdd">
                            <p v-for="num in emsInfo.data">
                                {{num.createTime|moment}}
                                <span class="cs-emsnum">
                                    {{num.description}}
                                </span>
                            </p>
                        </div>
                        <div v-else>
                            <p>暂无EMS运单信息</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak"  v-if="selectRowData.authStatus==7" v-show="selectRowData.authStatus==1">
                <div class="labeltext cs-lqzt-ylq">
                    领取状态：已领取（
                    <span>
                        {{selectRowData.printTime|moment}}
                    </span> ）
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item cs-jiak" v-if="this.radio==67810" v-show="selectRowData.authStatus==8">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext cs-lqzt-ylq">
                        已失效
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="selectRowData.authStatus==7" v-show="selectRowData.authStatus==1">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        领取人姓名：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.name}}
                    </div>
                </div>
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext">
                        领取人身份证号码：
                    </div>
                    <div class="cs-box-flex-auto cs-box-div cs-form-item-content">
                        {{selectRowData.idcardNo}}
                    </div>
                </div>
            </div>
            <div class="cs-box2 cs-box-aaa cs-form-item cs-body-item" v-if="selectRowData.authStatus==10">
                <div class="cs-box2 cs-box-aaa cs-box-flex3">
                    <div class="labeltext" style="margin-right: 30px;">
                        评价：
                    </div>
                    <div class="cs-box-flex-auto cs-form-item-content cs-box-div ha-rate">
                        <ha-rate-group :rate_data="rate_data"></ha-rate-group>
                    </div>
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
        radio: '',
        selectRowData: {},
        horizontal: ''
    },
    data() {
        return {
            records: '',
            authMsg: '',
            radioxq: '',
            isems: false,
            imgurl: '',
            authDesc: '',
            ydhinput: '',
            mailNum: '',
            recordId: '',
            viewer: null,
            hori: false,
            isemsdd: false,
            emsInfo: [],
            imageList: [],
            rate_data: [{
                'name': "处理速度：",
                value: 0
            }, {
                'name': "处理效率：",
                value: 0
            }, {
                'name': "反馈结果：",
                value: 0
            }],
        }
    },
    methods: {
        print() { //打印
            let arr = JSON.stringify(this.selectRowData);
            sessionStorage.setItem("printData", arr);
            window.open("index.html#/print"); //上线
        },
        acceptance(num) { //受理 驳回
            let that = this;
            if (!this.authDesc) {
                if (num == 1) {
                    this.authDesc = "已受理"
                } else if (num != 1) {
                    this.authDesc = "已驳回"
                }
            }
            var _param = {
                token: global.data.getToken(),
                criminalIds: this.selectRowData.id,
                authStatus: num,
                authDesc: this.authDesc
            };
            that.$http.post(global.config.weburl + 'api/criminal/acceptCriminal.do', _param).then(function(res) {
                if (res.data.code == 0) {
                    const Bus = global.eventHub;
                    Bus.$emit("refreshListData", this.radio);
                    this.$emit("refreshListData");
                    if (res.data.msg) {
                        this.$message(res.data.msg)
                    }
                    this.$message("操作成功");
                } else {
                    global.tools.handleError(res.data);
                }
            });
            this.authDesc = "";
        },
        Send() { //发送
            let that = this;
            if (!this.radioxq) {
                this.$message("请选择有无犯罪记录");
                return false;
            }
            var _param = {
                token: global.data.getToken(),
                criminalIds: this.selectRowData.id,
                hasRecord: this.radioxq,
            };
            that.$http.post(global.config.weburl + 'api/criminal/hasRecord.do', _param).then(function(res) {
                if (res.data.code == 0) {
                    this.$emit("refreshListData");
                    this.$message("操作成功");
                } else {
                    global.tools.handleError(res.data);
                }
            });
            this.radioxq = "";
        },
        express() { //快递信息
            var that = this;
            var _param = {
                token: global.data.getToken(),
                mailNum: this.selectRowData.ems.mailNum,
                recordId: this.selectRowData.applyRecords[0].recordId
            }
            that.$http.post(global.config.weburl + 'api/ems/queryEmsStatus.do', _param).then(function(res) {
                if (res.data.code == 0) {
                    that.emsInfo = res.data;
                    if (that.emsInfo.data!=null && that.emsInfo.data.length > 0) {
                        that.isemsdd = true;
                    } else {
                        that.isemsdd = false;
                    }
                    that.isems = true;
                } else {
                    global.tools.handleError(res.data);
                }
            });
        },
        ratedatas() {
            if (this.selectRowData) {
                let _applyRecords = this.selectRowData.applyRecords;
                let obj1 = this.selectRowData.idcardImg1;
                let obj2 = this.selectRowData.idcardImg2;
                let obj3 = global.config.webupload + this.selectRowData.attachment;
                this.imageList[0] = obj1;
                this.imageList[1] = obj2;
                this.imageList[2] = obj3;
                if (_applyRecords!=null && _applyRecords.length > 0) {
                    this.rate_data[0].value = this.selectRowData.applyRecords[0].turningSpeed;
                    this.rate_data[1].value = this.selectRowData.applyRecords[0].processingEfficiency;
                    this.rate_data[2].value = this.selectRowData.applyRecords[0].feedbackResult;
                    this.emsStatusInfo = this.selectRowData.emsInfo;
                    this.radioxq = this.selectRowData.hasRecord;
                }
            }
        },
        initImgViewer() {
            let that = this;
            if (this.hori) {
                if (this.viewer) {
                    this.viewer = null; //横向
                } else {
                    if (this.imageList && this.imageList.length > 0) {
                        if(this.$refs.sfz){
                            this.viewer = new Viewer(this.$refs.sfz, {
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
                        this.hori = false;
                        }
                    }
                }
            } else {
                if (this.viewer) {
                    this.viewer.update(); //竖向
                } else {
                    if (this.imageList && this.imageList.length > 0) {
                        if(this.$refs.sfz){
                            this.viewer = new Viewer(this.$refs.sfz, {
                                movable: false,
                                viewed: function() {
                                    that.viewer.image.onclick = function() {
                                        that.viewer.hide();
                                    }
                                }
                            });
                        }
                    }
                }
            }
        },
    },
    watch: {
        selectRowData: function() {

            this.isems = false;
            if (this.selectRowData) {
                this.ratedatas();
            }
        },
        horizontal: function() {
            this.hori = true;
        }
    },
    computed: {
        contentheigth() {
            let _oheight = this.$store.getters.getPageInfos.content_height - 50;
            return {
                'max-height': _oheight + "px"
            }
        },
        bodyheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height - 40;
            return {
                'max-height': _oheight + "px"
            }
        }
    },
    created() {
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
<style scoped="" lang="less">
    .cs-right-page {
        padding-left: 10px;
        overflow: auto;
        position: relative;
    }

    .cs-right-body {
        width: 100%;
        box-sizing: border-box;
        overflow: auto;
        border: 1px solid #4092bb;
        border-top: 0;
    }

    .cs-filter-box2 .el-radio-group {
        line-height: 36px;
    }

    .cs-body-item .cs-box-aaa {
        min-height: 39px;
        overflow: hidden;
        width: 50%;
        color: #fff;
        line-height: 40px;
    }

    .cs-jiak {
        width: 100%!important;
        word-break: normal;
    }

    .ha-rate {
        margin-top: 25px;
    }

    .cs-jiak .cs-box-aaa {
        width: 100%;
    }

    .cs-form-item .labeltext {
        white-space: nowrap;
        vertical-align: baseline;
        padding: 0;
        margin: 0;
        font-size: 14px;
        text-align: justify;
        text-align-last: justify;
        color: #fff;
    }

    .cs-box-div {
        color: #fff;
        width: 90%;
    }

    .cs-form-item .cs-form-item-content {
        word-break: break-all;
        font-size: 14px;
        color: #fff;
    }

    .cs-form-item {
        width: 100%;
        border-top: 1px solid #4092bb;
        padding-left: 30px;
    }

    .cs-form-sfz {
        height: 240px;
        min-height: 80%;
        font-size: 14px;
        color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .cs-item {
        width: 48%;
        height: 100%;
        padding: 20px;
        color: #fff;
    }

    .cs-item img {
        width: 100%;
        height: 150px;
        border-radius: 5px;
        padding: 5px;
    }

    .cs-items {
        width: 100%;
        height: 100%;
        padding: 20px;
        color: #fff;
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
        height: 40px;
        line-height: 40px;
        background: #275e8b;
        border: 1px solid #4092bb;
        border-bottom: 0;
        text-align: center;
        button {
            float: right;
            height: 30px;
            margin: 5px;
            line-height: 10px;
        }
    }

    .cs-sfz-footer {
        width: 100%;
        padding: 10px 0;
        text-align: center;
        color: #fff;
        background: #eef1f6;
        font-size: 14px;
    }

    .cs-sptime {
        margin-right: 40%;
    }

    .cs-smrz-xq-authmsg {
        text-indent: 30px;
        padding-bottom: 5px;
    }

    .el-dialog__title {
        color: #fff;
        font-weight: normal;
    }

    .cs-sfz-img {
        border: 1px solid #4092bb;
        padding: 3px;
        border-radius: 5px;
    }

    .cs-form-trial {
        padding: 20px 30px;
    }

    .cs-form-trial .cs-label-title {
        color: #fff;
        line-height: 32px;
    }

    .cs-wsbs-bottons {
        width: 100%;
        text-align: center;
        padding: 10px 0;
    }

    .cs-radio {
        margin-left: 15%;
    }

    .diaimg {
        width: 100%;
        height: 100%;
    }

    .diaimg img {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .cs-lqzt-wlq {
        width: 100%;
        text-align-last: center!important;
        color: rgb(255, 153, 0)!important;
        font-size: 20px!important;
    }

    .cs-lqzt-ylq {
        width: 100%;
        text-align-last: center!important;
        color: rgb(51, 204, 51)!important;
        font-size: 20px!important;
        margin: 0 20px;
    }

    .cs-lqzt-dd {
        width: 100%;
        text-align-last: center!important;
        font-size: 20px!important;
    }

    .cs-emsnum {
        margin-left: 20px;
    }

    .cs-spyi-p {
        font-size: 14px;
        color: #fff;
    }

    .el-textarea__inner {
        background: rgba(39, 94, 139, 0.3)!important;
        overflow-y: auto;
        border: 1px solid #285e8c;
        color: #fff;
    }
</style>
