<template>
    <div class="list_component">
        <div class="member" :style="membertop">
            <div class="cs-rylb-dailog">
                <div class="el-rylb-dialog__header">
                    <span class="el-dialog__title">人员列表</span>
                    <div class="cs-member-search">
                        <ha-search icon v-model="m_name" placeholder="搜索姓名" @keydownEnter="f_search" @keyup="f_search"  @icon-click="f_search"></ha-search>
                    </div>
                </div>
            </div>
            <div class="cs-rylb-dailog__body" v-loading="member_loading" :style="maxHeight">
                <el-collapse class="ha-collapse" v-model="activeName">

                    <el-collapse-item class="ha-collapse-item" v-for="(item,index) in userListGroupByDept" :key="item"  :title="item.name" :name="index" >
                        <div v-for="obj in item.data" class="member-box"  :key="obj.id" @click="showcontact(obj)">
                            <div class="fm_img_box"><img v-if="obj.img" :src="obj.img" :class="[obj.isOnline === 0 ? 'offline':'']"/><img v-if="!obj.img" src="/static/images/member_logo.png" :class="[obj.isOnline === 0 ? 'offline':'']" /></div>
                            <div :class=" ['fm_img_content',obj.isOnline === 0 ? 'offline_text':'online_text','fm_img_content']"  >
                                <div class="fm_name" >{{obj.realname}}</div>
                                <div class="fm_cellphone" >{{obj.cellphone}}</div>
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
        userlist: {},
        isplace:[String,Boolean],
        member_loading:[String,Boolean]
    },
    data: function() {
        return {
            m_name: "",
            activeName:['0','1'],

            namelist: [],
            userListGroupByDept:{}
        }
    },
    methods: {
        hideListComponent(){
            this.$emit('hide');
        },
        showcontact(obj) {
            this.$emit('show_contact', obj);
            
        },
        f_search() {
            var that = this;
            var res = [];
            this.namelist = this.userlist.data;

            if (that.m_name) {
                this.namelist.forEach(function(item, index) {

                    if (item.realname.indexOf(that.m_name) != -1 || item.cellphone.indexOf(that.m_name) != -1) {
                        res.push(item);
                    }
                });
            } else {
                res = this.userlist.data;
            }
            this.namelist = res;
        }
    },
    watch:{
        userlist:{

            handler: function () {
                this.f_search();
            },
            deep: true
        },
        namelist:function(){
            let _data = {};
            this.namelist.forEach((item,index)=>{
                let _deptInfo = item.deptInfo;

                item.img = global.tools.imgpathformat(item.img);

                if(typeof (_data[_deptInfo.id]) == undefined || !_data[_deptInfo.id]  ) {
                    _data[_deptInfo.id] = {
                        name:_deptInfo.name,
                        data:[]
                    };
                }
                _data[_deptInfo.id].data.push(item);
            });

            this.userListGroupByDept = _data;
        }
    },
    computed:{
    	maxHeight(){
    		return {
    			height:this.$store.getters.getPageInfos.content_height*1-50+'px'
    		}
    	},
        membertop(){
            return {
                top:this.$store.getters.getPageInfos.top_bar_height+'px'
            }
        }
    },
    created: function() {
        var that = this;
        that.namelist = that.userlist.data;

    },
    mounted: function() {

    }
}
</script>
<style lang="less">
.member {
    overflow: hidden;
    width: 320px;
    border-right: none;
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
    width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

}

.member .el-dialog__title {
    color: #fffefe;
    font-weight: normal;
}

.member .listname {
    background: #f2f2f2;
    height: 45px;
    padding-left: 14px;
    line-height: 45px;
    font-size: 16px;
    font-weight: 600;
}

.member .listname input {
    width: 70px;
    height: 26px;
    border-radius: 13px!important;
    padding: 0 8px;
    outline: none;
}

.member .listname .el-icon-search {
    padding-left: 8px;
    margin-right: 20px;
}

.member .details {
    border-top: 1px solid #275e8b;
    height: 45px;
    padding: 0 20px;
    line-height: 45px;
    font-size: 14px;
    display: block;
    cursor: pointer;
}

.member .details .fm_name {
    color: #fff;
    width: 80px;
    height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.member .live_status {
    text-align: center;
    color: #6bbc53;
}

.member .leave_status {
    text-align: center;
    color: #999;
}

.member ._tel {
    text-align: right;
    color: #0099FF;
    cursor: pointer;
    padding-right: 20px;
}

.cs-member-search {
	height: 30px;
    width:150px;
    margin-right: 30px;
    position: relative;
    input{
		border:1px solid #448ecb;
		border-radius: 4px;
		height: 28px;
		background: #1d3d58;
    }
}

.cs-member-search .el-input__inner {
    border-radius: 12px;
    height: 24px;
    padding-right: 0;
    font-size: 14px;
}

.cs-member-search .f_search-btn {
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
            font-size: 14px;
            .el-collapse-item__header__arrow{
                float: right;
                margin-top: 15px;
            }

        }
        .el-collapse-item__wrap{background: transparent;border-bottom:0 none;}


        .ha-collapse-item  {

            .el-collapse-item__content{padding: 0}

            .member-box{
                display:flex;
                border-bottom:1px solid #204D70;
                cursor:pointer;
                padding:10px;
                height: 86px;
                .fm_img_box{
                    width: 60px;
                    height: 60px;
                    border-radius: 60px;
                    display: inline-block;
                    img{
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        border-radius: 60px;
                    }
                }
                .offline{
                        -webkit-filter: grayscale(100%);
                        -moz-filter: grayscale(100%);
                        -ms-filter: grayscale(100%);
                        -o-filter: grayscale(100%);
                        filter: grayscale(100%);
                        filter: gray;
                }
                .offline_text{
                    color: #ccc;
                }
                .online_text{
                    color:#fff;
                    .fm_cellphone{
                        color: #208FE7;
                    }
                }
                .fm_img_content{
                    margin-left:20px;
                    .fm_name{
                        height: 30px;
                        line-height: 30px;
                        overflow: hidden;
                        font-size: 14px;
                    }
                    .fm_cellphone{
                        height: 30px;
                        line-height: 30px;
                        overflow: hidden;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}

</style>
