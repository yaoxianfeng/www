<template>
    <div class="el-dialog el-dialog--100 cs_motai">
        <div class="_title"><span>{{userdetails.realname}} 详情</span><i class="el-icon-close" @click="hidden_contact"></i></div>
        <div class="el-dialog__body">
            <div class="cs_contact">
                <div class="imgdiv"><img :src="userdetails.img" alt=""></div>
                <div class="info">
                <el-row :gutter="10">
                    <el-col :span="24" class="_name"><img src="/static/img/icon/xmicon.png" height="14" width="14"><span>{{userdetails.realname}}</span></el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24" class="_name"><img src="/static/img//icon/lxicon.png" height="14" width="14"><span>{{userdetails.jobsName}}</span></el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24" class="_name"><img src="/static/img/icon/dhicon.png" height="14" width="14"><span>{{userdetails.cellphone}}</span></el-col>
                </el-row>
                </div>
                <button v-if="false">视频通话</button>
                <div class="cs_vedioo" v-if="is_vedioo">
                    <vediocomponent></vediocomponent>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        userdetails: {}
    },
    data: function() {
        return {
            is_vedioo: false
        }
    },
    created: function() {
        var that = this;
        const Bus = global.eventHub;

    },
    methods: {
        hidden_contact: function() {
            this.$emit('hidden_contact');
        },
        f_vedioo: function() {
            //var that=this;
            //this.is_vedioo=true;
            //setTimeout(function(){
            //	that.is_vedioo=false;
            //},2000)
        }
    }
}
</script>
<style lang="less">
.cs_motai {
    width: 400px;
    height: 520px;
    right: 0;
    left: auto;
    top: 9%;
    background:url(/static/images/bg-icea.png);
    transform: translateX(0);
    border-radius: 0;
    z-index: 200;
    &:after{
        background: rgba(12,28,42,0.9);
        position: absolute;
        width: 100%;
        height: 100%;
        content: "";
        z-index: -1;
        top: 0;
        left: 0;
    }
    .el-dialog__body .cs_contact {
        width: 350px;
        height: 310px;
        .info{
            margin-left: 60px;
            margin-top: 70px;
        }
    }

    .cs_contact ._name {

        height: 30px;
        line-height: 30px;
        overflow: hidden;
    }

    .cs_contact ._name span {
        font-size: 14px;
        padding-left: 20px;
    }

    .cs_contact img {
        display: inline-block;
        vertical-align: middle;
    }

    .imgdiv {
        height: 166px;
        margin: 15px 0 30px;
    }

    .cs_contact .imgdiv img {
        display: block;
        width: 180px;
        height: 220px;
        margin: 0 auto;
        border: none;
    }

    ._info {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 13px;
    }

    .cs_contact button {
        background: #999999;
        width: 98px;
        height: 30px;
        outline: none;
        border-radius: 8px;
        border: none;
        color: #fff;
        font-size: 12px;
        line-height: 30px;
        display: block;
        margin: 0 auto;
    }

    .cs_vedioo {
        position: absolute;
        top: 50%;
        left: -100%;
        transform: translate(-10px, -50%);
    }
    ._title {
        height: 50px;
        background: #275e8b;
        display: flex;
        padding: 0 20px;
        -ms-align-items: center;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #448ecb;
        .el-icon-close {
            cursor: pointer;
            &:hover{
                color:#20a0ff;
            }
        }
    }
}

</style>
