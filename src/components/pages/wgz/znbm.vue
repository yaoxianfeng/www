<template>
    <div class="cs-container" :style="main_style">
        <div class="cs-nav-filter-box" :style="topbar_style">
            <div class="ha-navbar-radiogroup">
                <router-link to="/wgz" class="ha-navbar-goback"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
            </div>
            <div class="ha-navbar-tools cs-f1">
                
            </div>
            <div class="ha-navbar-searchbox f3 cs-znbm-right">
                <ha-search icon v-model="keyword" placeholder="职能部门/联系电话" @keyupEnter="onEnter" @icon-click="onEnter"></ha-search>
                <el-button type="primary" class="f2 cs-button cs-btn-wrd-add" v-on:click="add()"><img src="/static/img/audio/xinzeng.png" alt="">新增</el-button>
            </div>
            <!--<div class="cs-znbm-right">
                &lt;!&ndash;<el-button type="primary" class="cs-button cs-btn-wrd-add" @click="add()"><img src="/static/img/audio/xinzeng.png" alt="">新增</el-button>&ndash;&gt;
                &lt;!&ndash;<ha-search icon v-model="keyword" placeholder="职能部门/联系电话" @keyupEnter="onEnter" @icon-click="onEnter"></ha-search>&ndash;&gt;
            </div>-->
        </div>


        <div class="page-content main-content" :style="content_sytle">
            <div class="el-row contBox clear">
                <div class="el-row contBox clear">
                    <el-row class="cs-list-table" :gutter="10">
                        <el-col :span="13">
                                <el-table :data="listData" :height="tableheigth" border highlight-current-row @row-click="rowclick">
                                    <el-table-column type="index" label="序号" width="70">
                                        <template scope="scope">
                                            <span style="margin-left: 10px">{{1+scope.$index+(pageInfo.page-1)*pageInfo.pageSize}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" show-overflow-tooltip label="职能部门">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="phone" label="联系电话">
                                    </el-table-column>

                                    <el-table-column show-overflow-tooltip prop="creator.realname" label="发布人">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip label="最后一次更新时间">
                                        <template scope="scope">
                                            <span>{{scope.row.updateTime|moment}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="updater.realname" show-overflow-tooltip label="更改人">
                                    </el-table-column>
                                </el-table>
                                <div class="cs-footer-page">
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[10, 20 ,30 ,50]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.records">
                                    </el-pagination>
                                </div>
                        </el-col>
                        <el-col :span="11">
                            <rightcomponent ref="rightcomponent" :selectRowData="rowData"  :Auth="Auths" @filterTag="filterStatus" @changeAu="changeAuth"></rightcomponent>
                        </el-col>
                    </el-row>
                </div>
            </div>
        
            <el-dialog  v-model="is_xzshow" class="xzeng">
                <znbmaddcomponent v-if="is_xzshow" @close_add="close_add" @filterTag="filterStatus"></znbmaddcomponent>
            </el-dialog>
        
    </div>
    </div>
</template>
<script>
    import mystyle from '../../../util/vue/style';
    export default {
        mixins: [mystyle],
        data() {

        return {
            listData: [],
            rowData: null,
            pageInfo: {
                pageSize: 20,
                page: 1,
                records: 0
            },
            is_xzshow: false,
            keyword:'',
            Auths: null
        }
    },
    components: {
        rightcomponent: function(resolve, reject) {
            require(['./znbm_right.vue'], resolve)
        },
        znbmaddcomponent: function(resolve, reject) {
            require(['./znbm_add.vue'], resolve)
        }
    },
    methods: {
        add: function() { //新增
            this.is_xzshow = true;
        },
        changeAuth(value) {
            if(value) {
                this.Auths = value;
            }
        },
        filterStatus() {
            let that = this;
            that.listData = [];
            that.rowData = null;
            that.pageInfo = {
                pageSize: 20,
                page: 1,
                records: 0
            };
            that.getListData();
            that.is_xzshow = false;
        },
        getListData() { //请求数据
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _params = {
                token: token,
                page: this.pageInfo.page,
                pageSize: this.pageInfo.pageSize,
                sortby: "updateTime desc"
            };
            if (that.keyword) {
                _params.keyword = that.keyword;
            }
            that.$http({
                method: 'GET',
                url: global.config.weburl + "api/functionaldept/query.do",
                params: _params
            }).then(
                    function(res) {
                        if (res.data.code != 0) {
                            global.tools.handleError(res.data);
                            return;
                        }
                        that.listData = res.data.data;
                        that.pageInfo = res.data.pageInfo;
                        if (res.data.data!=null || res.data.data.length > 0) {
                            that.rowclick(that.listData[0]);
                        } else {
                            that.listData = [];
                            that.rowData = null;
                        }
                    }
            );
        },
        waitopen() {
            this.$notify.info({
                title: '',
                message: "正在开发中…敬请期待"
            });
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val;
            this.getListData();
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val;
            this.getListData()
        },
        add: function() { //新增
            this.is_xzshow = true;
        },
        close_add: function() {
            this.is_xzshow = false;
        },
        onEnter: function() { //搜索
            this.getListData();
        },
        rowclick: function(row) { //点击某一行
            let that = this;
            that.Auths = 1;
            that.rowData = row;
            var Bus=global.eventHub;
            Bus.$emit("oresetForm");
        },

    },
    computed: {
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight;
        },
        myheight() {
            let _height = this.$store.getters.getPageInfos.main_height;
            return {
                height: _height + "px"
            }
        }
    },
    created: function() {
            let that = this;
            that.Auths = 1;
            that.getListData();
    }
    }
</script>
<style lang="less">
    .cs-container{
        .page-content {
            overflow-y: auto;
            .xzeng{
                .cs-jcjb-dialog__wrapper{
                     height: 580px;
                }
                .el-dialog--small{
                    width: 710px;
                    border: 0;
                }
            }
        }
            .cs-btn-wrd-add {
                margin-left: 10px;
                border-radius: 2px;
                width: 83px;
                height: 38px;
                margin-bottom: 5px;
            }
        .f2 {
            float: left;
        }
        .f3{float: right;}
        .cs-export-radio-box {
            position: relative;
            height: 40px;
            display: table-cell;vertical-align: bottom;
        }


        .cs-wfx-link-dv:last-child {
            border-right: 0 none;
        }

        .cs-wfx-link-dv .cs-wfx-link {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #fff;
            display: inline-block;
            background-image: -webkit-linear-gradient(to left, #5389A3, #7093A5, #5389A3);
            background-image: linear-gradient(to left, #5389A3, #7093A5, #5389A3);
        }
        .cs-wfx-link-dv .router-link-active {
            background-image: -webkit-linear-gradient(to left, #505D66, #646E77, #505D66);
            background-image: linear-gradient(to left, #505D66, #646E77, #505D66);
        }

        .cs-export-box {
            position: relative;
            height: 40px;
            color:#fff;
        }

        .cs-export-box .el-select {
            width: 240px;
            height: 38px;
            line-height: 38px;
        }
            .cs-f1 {
                float: left;
                margin-left: 20%;
            }
        .cs-nav-filter-box{
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
        }
        .cs-znbm-right{
            display: flex;
        }
        .cs-znbm-right .cs-button{
            background: #275e8b;
            border: none;
            border-radius: 2px;
        }
    }
</style>