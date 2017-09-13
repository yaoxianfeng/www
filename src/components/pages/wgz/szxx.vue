<template>
    <div class="cs-main-content szxx-container" v-loading="is_loading">
        <div class="cds-page-content" :style="main_style">
            <div class="ha-topbar-box" :style="topbar_style">
                <!-- 筛选 -->
                <div class="ha-navbar-radiogroup">
                    <router-link to="/wgz" class="ha-navbar-goback right_mr"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                    <el-radio-group v-model="flag">
                        <el-radio :label="0">未读</el-radio>
                        <el-radio :label="1">已读</el-radio>
                    </el-radio-group>
                </div>
                <div class="ha-navbar-tools fl1">
                    <ha-search icon v-model="keyword" placeholder="来信人姓名" @keyupEnter="onEnter" @icon-click="onEnter"></ha-search>
                </div>
            </div>
            <div class="cs-list-table" :style="content_sytle">
                <!-- 列表 -->
                <div class="col-sm-6 no-padding-left" id="bszn_left">
                    <el-table :data="tableData" highlight-current-row border :height="tableheigth" @row-click="rowclick" @filter-change="filters">
                        <el-table-column label="序号" width="65">
                            <template scope="scope">{{ 1+scope.$index+(currentPage-1)*page_size}}</template>
                        </el-table-column>
                        <el-table-column prop="realName" label="来信人姓名" width="120">
                        </el-table-column>
                        <el-table-column prop="phone" label="联系电话" width="130">
                        </el-table-column>
                        <el-table-column label="来信时间" width="160">
                            <template scope="scope">
                                <span>{{scope.row.time|moment}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="flag==1" label="回复状态" prop="status" :formatter="formatter" width="100">
                        </el-table-column>
                        <el-table-column prop="title" show-overflow-tooltip label="信件标题" width="200">
                        </el-table-column>
                        <el-table-column :filters="[{ text: '已公开', value: '1' }, { text: '未公开', value: '0' }]"  prop="open" label="是否公开" column-key="auth" v-if="flag==1" width="120">
                            <template scope="scope">
                                <el-tag :type="scope.row.open ==1 ? 'primary' : 'success'"  close-transition>
                                    {{scope.row.open==1?'已公开':'未公开'}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="content" label="信件内容" class="cs-conter" >
                        </el-table-column>
                        <el-table-column v-if="flag==1" prop="replyContent" label="回复内容" class="cs-conter">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template scope="scope">
                                <el-button type="text" @click.stop="scope.row.open==1?ocancelOpen((scope.row)):odoOpen((scope.row))" v-if="flag==1 && scope.row.status == 1">{{scope.row.open==1?'取消公开':'公开'}}</el-button>
                                <el-button @click.stop="rowclick(scope.row)" type="text" size="small" v-if="scope.row.status == 1"><i class="el-icon-viewer"></i>查看</el-button>
                                <el-button @click="replyClick(scope.$index, scope.row)" v-if="scope.row.status == 2" type="text" size="small"><i class="el-icon-reply"></i>回复</el-button>
                                <el-button @click.stop="deleteClick(scope.row)" type="text" size="small"><i class="el-icon-delete3"></i>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="cs-footer-page">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="records">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="所长信箱" v-model="isShowView" class="cds-szxx-layer">
            <szxxxqcomponent :selectRowData="selectRowData" @refreshList="refreshList"></szxxxqcomponent>
        </el-dialog>
    </div>
</template>
<script>
    import mystyle from '../../../util/vue/style';
    export default {
        name: 'wrd_main',
        mixins: [mystyle],
        data() {
            return {
                is_loading:false,
                textHeight: {
                    type: Number,
                    default: ''
                },
                checked: false,
                twoClass: 'el-col-md-12',
                onlyOneClass: 'el-col el-col-24 el-col-xs-24',
                isShowView: false,
                tableData: [],
                selectRowData: {},
                textarea3: '',
                otoken: '',
                numID: '',
                userID: '',
                flag: 0,
                oisRead: 0,
                currentPage: 1,
                page_size: 20,
                records: 0, //数据总数
                keyword: "",
                isreply: false,
                open:'',
                status:'',
                zIndex : 20141223,
                para:{},
                filterKey:'',
                limit: '200',
                curr: '0'
            }
        },
        components: {
            szxxxqcomponent: function(resolve, reject) {
                require(['./szxx_xq.vue'], resolve)
            }
        },
        methods: {
            rowclick(row) { //点击某一行
                this.isShowView = true;
                this.checked=false;
                this.numID = row.id;
                this.selectRowData = row;
                this.textarea3 = row.replyContent;
                if (row.replyContent) {
                    this.isreply = true;
                } else {
                    this.isreply = false;
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
                                that.getTableData();
                            }
                    );
                }
            },
            formatter(row, column) {
                if (row.status == 1 ) {
                    return "已回复";
                }else if (row.status == 2) {
                    return "未回复";
                }
            },
            ocancelOpen(row){
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                
                let _para = {
                    button: "取消公开",
                    message: "取消公开成功后该操作将立即生效，请确认是否取消公开" + row.realName + "的信件？",
                    tips: "",
                    _param: {
                        token: token,
                        id: row.id,
                        open:0
                    },
                    url: "api/msg/open.do"
                };
                this.makeSure(_para);
            },
            odoOpen(row){
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _para = {
                    button: "公开",
                    message: "公开成功后该操作将立即生效，请确认是否取消公开" + row.realName + "的信件？",
                    tips: "",
                    _param: {
                        token: token,
                        id: row.id,
                        open:1
                    },
                    url: "api/msg/open.do"
                };
                this.makeSure(_para);
            },

            lookClick(index, row) { //查看
                this.selectRowData = row;
                this.numID = row.id;
                this.textarea3 = row.replyContent;
                if (row.replyContent) {
                    this.isreply = true;
                } else {
                    this.isreply = false;
                }
            },
            replyClick(index, row) { //进入回复
                this.numID = row.id;
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
                                this.oisRead=0;
                                that.getTableData();
                            }
                    );
                }
                this.checked=false;
                this.textarea3='';
                this.isShowView = true;
                this.selectRowData = row;
            },
            deleteClick(row) { //删除
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _para = {
                    button: "删除",
                    message: "删除成功后该操作将立即生效，请确认是否删除" + row.realName + "的信件？",
                    tips: "",
                    _param: {
                        token: token,
                        id:row.id
                    },
                    url: "api/msg/delete.do"
                };
                this.makeSure(_para);
            },

            quxiao() {
                this.isShowView = false;
            },
            
            handleSizeChange(val) {
                this.page_size = val;
                this.getTableData();
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getTableData();
                //console.log(`当前页: ${val}`);
            },

            onEnter() { //筛选框/回车/点击搜索开始筛选
                this.keyword = this.keyword;
                this.currentPage = 1;
                this.getTableData();
            },
            filters(value){
                this.filterKey = value["auth"].join(",");
                if(this.filterKey.length>1){
                    this.open='';
                }
                else{
                    this.open=this.filterKey
                }
                this.currentPage = 1;
                this.getTableData();
            },
            getTableData() {
                let that = this;
                //that.quxiao();
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _params = {
                    token: token,
                    type: 2,
                    page: that.currentPage,
                    pageSize: that.page_size
                };
                if(that.flag==0){
                    _params.sortby="time desc" ;
                }
                else if(that.flag==1){
                    _params.sortby="replyTime desc" ;
                }
                _params.isRead = this.oisRead;
                if (that.open) {
                    _params.open = that.open;
                }
                if (that.status) {
                    _params.status = that.status;
                }
                if (this.keyword) {
                    _params.keyword = this.keyword;
                }
                that.is_loading=true;
                this.$http({
                    method: 'GET',
                    url: global.config.weburl + "api/msg/list.do",
                    params: _params
                }).then(
                        function(res) {
                            this.tableData = res.data.data;
                            that.is_loading=false;
                            if (res.data.code == 0) {
                                var _data = res.data;
                                if( _data.data!=null ||  _data.data.length>0){
                                    that.tableData = _data.data;
                                }
                                that.records = _data.pageInfo.records;
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
            inlimit() {
                let con = this.textarea3;
                if(con){
                    this.curr = con.length;
                    if(con.length >= this.limit){
                        this.curr = this.limit;
                    }
                }
            },
            makeSure: function(_content) {
                let Bus = global.eventHub;
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
                            that.getTableData();
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
            refreshList() {
                this.isShowView = false;
                this.getTableData();
            }
        },
        computed: {
            myheight() {
                let _height = this.$store.getters.getPageInfos.main_height;
                this.textHeight = {
                    height: (_height) * 0.2 + "px"
                }
                return {
                    height: _height + "px"
                }
            },

            tableheigth() {
                let _oheight = this.$store.getters.getPageInfos.table_height;
                return _oheight
            },
            max_Height() {
                return {
                    maxHeight: this.$store.getters.getDialogSmallStyle.max_height + 'px',
                    overflowY: 'auto'
                }
            }
        },
        created: function() {
            var that = this;
            this.getTableData();
        },
        watch: {
            flag: function() {
                this.oisRead = this.flag;
                this.page_size = 20;
                this.currentPage = 1;
                this.open='';
                this.selectRowData="";
                this.getTableData();
            }
        }
    }

</script>
<style lang="less">

    .szxx-container{
        .cs-layer-box{
            .el-dialog--small{width: 40%;border: 0;}
        }
        .el-icon-viewer, .el-icon-reply, .el-icon-delete3 {
            right: 2px;
        }
        .cs-list-table{
            border: 1px solid #275e8b;
            background: rgba(39, 94, 139, 0.3);
            padding: 10px;
            .el-button{
                font-size: 12px;
            }
        }
        .cs-szxx-dailog__body {
            font-size: 16px;
            overflow: auto;
        }
        .cs-xin-from {
            font-size: 16px;
        }
        .cs-szxx-title {
            padding-bottom: 10px;
        }
        .cs-szxx-content {
            margin-top: 10px;
            .label{
                position: absolute;
                top: 10px;
                left: 20px;
            }
            .el-textarea{
                background: rgba(39,94,139,0.5);
                border: 1px solid #275e8b;
                border-radius: 4px;
                .el-textarea__inner{
                    background: none;
                    border: none;
                    padding: 0 20px;
                    margin-top: 40px;
                    color: #fff;
                }
            }
            .inlimit{position: absolute;right: 15px;bottom: 10px;color: #20a0ff;opacity: 0.8}
        }
         .right_mr{margin-right:38px;}
    }
</style>
