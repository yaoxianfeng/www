<template>
    <div class="list_component">
        <div class="undo_alarm" :style="undo_alarmtop">
            <div class="cs-rylb-dailog">
                <div class="el-rylb-dialog__header">
                    <span class="el-dialog__title">警情列表</span>
                    <div class="cs-undo_alarm-search">
                        <ha-search icon v-model="m_name" placeholder="搜索电话" @keydownEnter="f_search" @keyup="f_search"  @icon-click="f_search"></ha-search>
                    </div>
                </div>
            </div>
            <div class="cs-rylb-dailog__body" v-loading="undo_alarm_loading" :style="maxHeight">
                <el-collapse class="ha-collapse" v-model="activeName">

                    <el-collapse-item class="ha-collapse-item" v-for="(item,index) in undo_alarmlistGroupByDept" :key="item"  :name="index" >
                        <div slot="title"><span>{{item.name}}</span> <span class="date_alerm-count">({{item.data.length}})</span></div>
                        <div class="undo_alarm-box" v-for="obj in item.data" :key="obj.id" @click="showcontact(obj)">
                            <div class="fm_img_box"><img v-if="obj.img" :src="obj.img"/></div>
                            <div class="fm_img_content">
                                <div class="fm_name" ><span>{{obj.date_hm}}</span><span class="fm_cellphone">{{obj.cellphone}}</span></div>
                                <div class="fm_desc" >{{obj.description ? obj.description :'内容缺省'}}</div>
                            </div>

                        </div>
                    </el-collapse-item>

                </el-collapse>

            </div>
        </div>
        <div @click="hideListComponent"  class="tanchu el-icon-arrow-left"></div>
    </div>
</template>
<script>
    export default {
        props: {
            undo_alarmlist: {
                type: Array,
                default: []
            },
//            isplace:[String,Boolean],
            undo_alarm_loading:[String,Boolean]
        },
        data: function() {
            return {
                m_name: "",
                namelist: [],
                activeName:['0'],
                undo_alarmlistGroupByDept:{}
            }
        },
        methods: {
            hideListComponent(){
                this.$emit('hide');
            },
            showcontact(obj) {
                // console.log(obj)
//            var Bus = global.eventHub;
//            if(!this.isplace){
//                Bus.$emit("undo_alarm_place", obj.position)
//            }
                this.$emit('show_contact', obj);

            },
            getImgPathByType(type) {
                switch (type){
                    case 1:
                        return "/static/img/icon/yjbj.png"
                    case 2:
                        return "/static/img/icon/ssj.png"
                    case 3:
                        return "/static/img/icon/ssp.png"
                    case 4:
                        return "/static/img/icon/jqbl.png"
                }
            },
            getDate(alermTime){
                return global.tools.formartDate(new Date(alermTime), "YYYY-MM-DD");
            },
            getDateHM(time){
                return global.tools.formartDate(new Date(time), "HH:mm");
            },
            f_search() {
                var that = this;
                var res = [];
                this.namelist = this.undo_alarmlist;

                if (that.m_name) {
                    this.namelist.forEach(function(item, index) {
                        if (item.cellphone.indexOf(that.m_name) != -1) {
                            res.push(item);
                        }
                    });
                } else {
                    res = this.undo_alarmlist;
                }
                this.namelist = res;
            }
        },

        watch:{
            undo_alarmlist: function () {
                this.f_search();
            },
            namelist:function(){
                let _data = {};
                this.namelist.forEach((item,index)=>{
                    let _date = this.getDate(item.alertTime);
                    if(typeof (_data[_date]) == undefined || !_data[_date]  ) {
                        _data[_date] = {
                            name:_date,
                            data:[]
                        };
                    }
                    item.date_hm = this.getDateHM(item.alertTime);
                    item.img = this.getImgPathByType(item.type);
                    _data[_date].data.push(item);
                });

                this.undo_alarmlistGroupByDept = _data;
                //return _data;
            }
        },
        computed:{
            maxHeight(){
                return {
                    height:this.$store.getters.getPageInfos.content_height*1-50+'px'
                }
            },
            undo_alarmtop(){
                return {
                    top:this.$store.getters.getPageInfos.top_bar_height+'px'
                }
            }
        },
        created: function() {
            var that = this;
            that.namelist = that.undo_alarmlist;

        },
        mounted: function() {

        }
    }
</script>
<style lang="less">
    .undo_alarm {
        overflow: hidden;
        width: 320px;
        border-right: none;


    .el-dialog__title {
        color: #fff;
        font-weight: normal;
    }

    .listname {
        background: #f2f2f2;
        height: 45px;
        padding-left: 14px;
        line-height: 45px;
        font-size: 16px;
        font-weight: 600;
    }

    .listname input {
        width: 70px;
        height: 26px;
        border-radius: 13px!important;
        padding: 0 8px;
        outline: none;
    }

    .listname .el-icon-search {
        padding-left: 8px;
        margin-right: 20px;
    }

    .details {
        border-top: 1px solid #275e8b;
        height: 45px;
        padding: 0 20px;
        line-height: 45px;
        font-size: 14px;
        display: block;
        cursor: pointer;
    }

    .details .fm_name {
        color: #fff;
        width: 80px;
        height: 45px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .live_status {
        text-align: center;
        color: #6bbc53;
    }

    .leave_status {
        text-align: center;
        color: #999;
    }

    ._tel {
        text-align: right;
        color: #0099FF;
        cursor: pointer;
        padding-right: 20px;
    }

    }

    .cs-rylb-dailog__body {
        overflow-y: auto;
        overflow-x: hidden;
        border-top: none;
        background:url(/static/images/bg-icea.png) #0c1c2b;
    }

    .el-rylb-dialog__header {
        background: #275e8b;
        padding-left: 20px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .cs-undo_alarm-search {
        height: 30px;
        width:150px;
        margin-right: 20px;
        position: relative;
        input{
            border:1px solid #448ecb;
            border-radius: 4px;
            height: 28px;
            background: #1d3d58;
        }
    }

    .cs-undo_alarm-search .el-input__inner {
        border-radius: 12px;
        height: 24px;
        padding-right: 0;
        font-size: 14px;
    }

    .cs-undo_alarm-search .f_search-btn {
        position: absolute;
        right: 10px;
        top: 1px;
        color: #fff;
        font-size: 20px;
    }

    .cs-rylb-dailog__body {
        .ha-collapse  {
            color:#fff;
            border:0 none;

        .el-collapse-item__header{
            background: #1D405E;
            border-bottom:0 none;
            color:#fff;
            margin-bottom: 1px;

        .el-collapse-item__header__arrow{
            float: right;
            margin-top: 15px;
        }

    }
    .el-collapse-item__wrap{background: transparent;border-bottom:0 none;}

    .date_alerm-count{float: right;margin-right: 10px;}


    .ha-collapse-item  {

    .el-collapse-item__content{padding: 0;border-bottom:0 none;position: relative;}

    .undo_alarm-box{
        display:flex;
        border-bottom:1px solid #204D70;
        cursor:pointer;
        padding:10px;


    .fm_img_box{
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-radius: 60px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;

        img{
            display: inline-block;

        }
    }
    .fm_img_content{
        color:#fff;
        padding-left:60px;
        width: 100%;
        .fm_name{
            height: 30px;
            line-height: 30px;
            overflow: hidden;
        }
        .fm_cellphone{
            margin-left: 30px;
            color: #fff;
        }
        .fm_desc{
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            word-break: break-all;
            white-space:nowrap;
            text-overflow:ellipsis;
            color: #208FE7;
        }
    }
    }
    }
    }
    }

</style>
