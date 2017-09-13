<template>
    <div class="cds-main-content" v-loading="is_loading">
        <div class="ha_page_content" :style="main_style">

            <div class="ha-topbar-box" :style="topbar_style">
                <div class="ha-navbar-radiogroup">
                    <router-link to="/wgz" class="ha-navbar-goback right_mr"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                    <el-radio-group v-model="flag">
                        <el-radio :label="0">未读</el-radio>
                        <el-radio :label="1">已读</el-radio>
                    </el-radio-group>
                </div>
                <div class="ha-navbar-searchbox">
                    <ha-search icon v-model="searchdata" placeholder="提出人" @keyupEnter="handleIconClick" @icon-click="handleIconClick"></ha-search>
                </div>
            </div>

            <div class="cs-list-table" :style="content_sytle">
                <!-- 列表 -->
                <el-table highlight-current-row :data="tableData" border="" :height="tableheigth" @row-click="rowClick" @filter-change="filters" ref="question-table">
                    <el-table-column label="序号" width="100">
                        <template scope="scope">{{ 1+scope.$index+(currentPage-1)*page_size}}</template>
                    </el-table-column>
                    <el-table-column label="提出人" prop="realName" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="联系电话" prop="phone"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="提出时间" prop="time" :formatter="Time" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="咨询问题" prop="content">
                    </el-table-column>
                    <el-table-column v-if="flag==1"  :filters="arr" prop="classify" label="咨询类型" column-key="type" column-id="alarm-auth"  width="120" ref="classifyRef">
                        <template scope="scope">
                            <span v-for="item in arr" v-if="scope.row.classify ==item.value">{{item.text}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="flag==1" label="回复状态" prop="status" :formatter="formatter">
                    </el-table-column>
                    <el-table-column v-if="flag==1" label="回复内容" prop="replyContent">
                    </el-table-column>
                    <el-table-column v-if="flag==1"  :filters="[{ text: '已公开', value: '1' }, { text: '未公开', value: '0' }]"  prop="open" label="是否公开" column-key="auth" width="120">
                        <template scope="scope">
                            <el-tag :type="scope.row.open ==1 ? 'primary' : 'success'"  close-transition>
                                {{scope.row.open==1?'已公开':'未公开'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="评价" v-if="is_Read">
                        <template scope="scope">
                            {{scope.row.appraise ? scope.row.appraise.appraiseResult : ""}}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="180">
                        <template scope="scope">
                            <el-button type="text" @click.stop="scope.row.open==1?cancelOpen(scope.row):doOpen(scope.row)" v-if=" scope.row.status == 1 || scope.row.status == 3">{{scope.row.open==1?'取消公开':'公开'}}</el-button>
                            <el-button @click.stop="rowClick(scope.row)"  size="small" type="text" v-if="scope.row.status == 1 || scope.row.status == 3" >
                            查看
                            </el-button>
                            <el-button @click.stop="handleClick(scope.$index,scope.row)" v-if="scope.row.status == 2" size="small" type="text">
                                回复
                            </el-button>
                            <el-button @click.stop="deletClick(scope.$index,scope.row)" size="small" type="text" >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="padding-bottom: 40px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
                </el-pagination>
            </div>

            <zxfwcomponent v-if="is_hfshow" :isreply="isreply" :content="hfdata" :zt_flag="zt_flag" :defaultClassify = "defaultClassify" @refreshList="refreshList" @hideDetail="hideDetail">
            </zxfwcomponent>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import mystyle from '../../../util/vue/style';
    export default {
        name: 'wrd_main',
        mixins: [mystyle],
        data() {
            return {
                is_loading:false,
                tableData: [{
                }],
                flag: true,
                is_Read:false,
                is_hfshow: false,
                currentPage: 1,
                page_size: 20,
                keyword: "",
                flag: 0,
                hfdata: {},
                searchdata: "",
                totalpage: 0,
                listheigth: "",
                open:'',
                para:{},
                oisRead: 0,
                numID: '',
                isreply:false,
                defaultClassify:'',
                filterKey:'',
                arr:[],
                classify:'',
                zt_flag:0
            }
        },
        methods: {
            rowClick(row) { //点击某行
                this.zt_flag=0;
                this.is_hfshow = true;
                this.hfdata = row;
                this.numID = row.id;
                if (row.replyContent) {
                    this.isreply = true;
                } else {
                    this.isreply = false;
                    this.zt_flag=1;
                }
                if(row.classify){
                    this.defaultClassify = row.classify
                }
                if(this.flag==0){
                    let that = this;
                    let token = global.data.getToken();
                    if (!token) {
                        return false;
                    }
                    that.$http({
                        method: 'POST',
                        url: global.config.weburl + "api/msg/read.do",
                        params: {
                            token: token,
                            id: this.numID
                        }
                    }).then(function(res) {
                            that.getlistdata();
                    });
                }
            },
            cancelOpen(row){//取消公开
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                this.numID = row.id;
//                this.is_tkshow = true;
                let _para = {
                    button: "取消公开",
                    message: "取消公开成功后该操作将立即生效，请确认是否取消公开" + row.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: token,
                        id: this.numID,
                        open:0
                    },
                    url: "api/msg/open.do"
                };
                this.makeSure(_para);
            },
            doOpen(row){//公开
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                this.numID = row.id;
//                this.is_tkshow = true;
                let _para = {
                    button: "公开",
                    message: "公开成功后该操作将立即生效，请确认是否公开" + row.realName + "的咨询？",
                    tips: "是否确认公开" + row.realName + "的咨询？",
                    _param: {
                        token: token,
                        id: this.numID,
                        open:1
                    },
                    url: "api/msg/open.do"
                }
                this.makeSure(_para);
            },
            filters(value){
                if(value["auth"]){
                    this.filterKey = value["auth"].join(",");
                    if(this.filterKey.length>1){
                        this.open='';
                    }
                    else{
                        this.open=this.filterKey
                    }
                }else if(value["type"]){
                    this.filterKey = value["type"].join(",");
                    this.classify=this.filterKey
                }
                this.currentPage = 1;
                this.getlistdata();
            },
            handleSizeChange(val) {
                this.page_size = val;
                this.getlistdata();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getlistdata();
            },
            Time(row, column) {
                if (!row.time) {
                    return "";
                }
                return moment(Number(row.time)).format('YYYY-MM-DD HH:mm');
            },
            replyTime(row, column) {
                if (!row.replyTime) {
                    return "";
                }
                return moment(Number(row.replyTime)).format('YYYY-MM-DD HH:mm');
            },
            formatter(row, column) {
                if (row.status == 1||row.status == 3 ) {
                    return "已回复";
                }else if (row.status == 2) {
                    return "未回复";
                }
            },

            handleClick(index, row) {  //编辑
                this.zt_flag = 1;
                this.is_hfshow = true;
                this.hfdata = row;
                this.numID = row.id;
                if(row.classify){
                    this.defaultClassify = row.classify
                }
                if(this.flag==0){
                    let that = this;
                    let token = global.data.getToken();
                    if (!token) {
                        return false;
                    }
                    that.$http({
                        method: 'POST',
                        url: global.config.weburl + "api/msg/read.do",
                        params: {
                            token: token,
                            id: this.numID
                        }
                    }).then(
                        function(res) {
                            that.getlistdata();
                        }
                    );
                }
            },

            deletClick(index, row) { //删除
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                this.is_tkshow = true;
                let _para = {
                    button: "删除",
                    message: "删除成功后该记录将无法恢复,请确认是否确认删除" + row.realName + "的咨询？",
                    tips: "",
                    _param: {
                        token: token,
                        id: row.id
                    },
                    url: "api/msg/delete.do"
                }
                this.makeSure(_para);
            },
            getlistdata() { //获取数据
                let that = this;
                var _params = {
                    token: global.data.getToken(),
                    type: 1,
                    page: that.currentPage,
                    pageSize: that.page_size,
                    sortby:"time desc"
                };
                _params.isRead = this.oisRead;
                if (that.open) {
                    _params.open = that.open;
                }
                if (this.keyword) {
                    _params.keyword = this.keyword;
                }
                if (this.classify) {
                    _params.classify = this.classify;
                }
                that.is_loading=true;
                this.$http({
                    method: 'GET',
                    url: global.config.weburl + "api/msg/list.do",
                    params: _params
                }).then(
                    function(res) {
                        that.is_loading=false;
                        if (res.data.code == 0) {
                            that.tableData = res.data.data;
                            that.totalpage = res.data.pageInfo.records;
                        } else {
                            global.tools.handleError(res.data);
                        }
                    },function(error){
                        that.$message({
                            type: 'error',
                            message: "获取数据失败"
                        });
                        setTimeout(() => {
                            that.is_loading=false;
                        }, 1000);
                    });
            },
            clearFilterColumns(tableName, index) {
                //清除表格某列的筛选, index表示第几列
                let _columns = this.$refs[tableName].columns[index];
                _columns.filteredValue = [];
                this.$refs[tableName].store.commit('filterChange', {
                    column:_columns,
                    values: []
                });
            },
            handleIconClick() {
                this.keyword = this.searchdata;
                this.currentPage = 1;
                this.getlistdata();
            },
            getData() {
                let that = this;
                that._loadPromise.then((data) => {
                    data.forEach(function (e) {
                        that.arr.push({text:e.name,value:e.code});
                    })
                })
            },
            makeSure: function(_content) {
                let that = this;

                this.$confirm(_content.message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }
                }).then(() => {
                    that.$http.post(global.config.weburl + _content.url, _content._param).then(function(res) {
                        if (res.data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: _content.button + "数据成功",
                            });
                            that.getlistdata();
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }, function(error) {
                        this.$message({
                            type: 'error',
                            message: _content.button + "数据失败",
                        });

                    });
                }).catch(function(error){

                });
            },
            hideDetail() {
                this.is_hfshow = false;
            },
            refreshList() {
                this.is_hfshow = false;
                this.getlistdata();
            }
        },
        components: {
            zxfwcomponent: function(resolve, reject) {
                require(['./zxfw_hf.vue'], resolve)
            }
        },
        watch: {
            flag: function() {
                if(this.flag){
                    this.is_Read=true;
                }else{
                    this.is_Read=false;
                }
                this.oisRead = this.flag;
                this.page_size=20;
                this.currentPage = 1;
                this.clearFilterColumns("question-table", 5);
               //this.getlistdata();
            }
        },
        computed: {
            myheight () {
                let _height = this.$store.getters.getPageInfos.main_height;
                return  {height:_height + "px"}
            },
            tableheigth() {
                let _oheight = this.$store.getters.getPageInfos.table_height;
                return _oheight
            }
        },
        beforeCreate() {
            this._loadPromise = global.tools.getDict("counselingClassifyDict");

        },
        mounted: function() {
            this.getData();
        },
        created() {
            var that = this;
            this.getlistdata();
        }
    }
</script>
<style lang="less">
    .cds-main-content{
        .right_mr{margin-right:38px;}
        .cs-list-table{
            border: 1px solid #275e8b;
            background: rgba(39, 94, 139, 0.3);
            padding: 10px;
            .el-button{
                font-size: 12px;
            }
        }

    }

</style>
