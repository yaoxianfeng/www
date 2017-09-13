<template>
    <div class="cs-main-content smrz_class" v-loading="is_loading">
        <div class="cds-page-content " :style="main_style">
            <div class="el-row contBox clear">
                <div class="ha-topbar-box" :style="topbar_style">
                    <div class="ha-navbar-tools ha-flexend ha-navbar-tools_back">
                        <router-link to="/wgz" class="ha-navbar-goback wsbx_back"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                        <div class="select-top">
                            <div class="select_topbj"> </div>
                            <el-select v-model="categoryText" class="cate-select" popper-class="wreselect" @change="selectchange">
                                <el-option v-for="item in arr" :key="item.id" :label="item.value" :value="item"></el-option>
                            </el-select>
                        </div>
                        <div class="ha-navbar-radiogroup" v-if="category.flag == 0">
                            <el-radio-group v-model="flag" @change="filterTag(flag)">
                                <el-radio :label="'authing'">未审核</el-radio>
                                <el-radio :label="'authed,authFail'">已审核</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    
                    <div class="ha-navbar-searchbox" v-if="category.flag == 0">
                        <ha-search icon v-model="keyword" placeholder="姓名/联系电话" @keyupEnter="search" @icon-click="search"></ha-search>
                    </div>
                    <div class="cs-export-box fr" v-if="false">
                        <el-button :plain="true" type="primary">导出</el-button>
                    </div>
                </div>
                <div v-if="category.flag != 0" class="contenttable ha-model-wait_doing" :style="content_sytle">
                        <img src="/static/images/doing.png" />
                </div>
                <div class="cds-content" :style="content_sytle">
                    <div v-if="category.flag == 0">
                        <div :class="[onlyOneClass, is_show_rightbox ? twoClass : '']">
                            <div class="cds-list-table">
                                <!-- 列表 -->
                                <el-table :data="tableData" highlight-current-row border style="width: 100%" @row-click="handleRowHandle" :height="tableheigth">
                                    <el-table-column label="序号" width="65">
                                        <template scope="scope">{{ 1+scope.$index+(currentPage-1)*page_size}}</template>
                                    </el-table-column>
                                    <el-table-column prop="realname" label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="phone" label="联系电话">
                                    </el-table-column>
                                    <el-table-column label="申请时间">
                                        <template scope="scope">
                                            <span style="margin-left: 10px">{{scope.row.authingTime|moment}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="flag != 'authing'" label="审核时间" >
                                        <template scope="scope">
                                            <span style="margin-left: 10px">{{scope.row.auditedTime|moment}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页 -->
                                <div class="cs-footer-page">
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20 ,30 ,50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="records">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                        <div class="el-col el-col-24 el-col-xs-24 el-col-md-12 cs-col-right-box" v-if="is_show_rightbox" :max-height="tableheigth">
                            <smrzxqcomponent ref="smrzxqcomponent" :selectRowData="selectRowData" :tableheigth="tableheigth" @reloadList="reloadList" :records="records" :flag="flag" :horizontal="horizontal"></smrzxqcomponent>
                            <!--更新 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <imgcomponent></imgcomponent>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    data() {
        return {
            is_loading: false,
            records: 0,
            page_size: 20,
            currentPage: 1,
            twoClass: 'el-col-md-12',
            onlyOneClass: 'el-col el-col-24 el-col-xs-24',
            is_show_rightbox: true,
            mianStyle: {},
            mapHeight: {
                type: Number,
                default: 600
            },
            flag: "authing",
            tableData: [],
            keyword: "",
            listUrl: "",
            horizontal:"",
            selectRowData: {
                deptInfo: {},
                authInfo: {}
            },
            categoryText: "实名认证登记",
            category: {
                value: "实名认证登记",
                flag: 0
            },
            arr: [{
                value: "实名认证登记",
                flag: 0
            }, {
                value: "流动人口登记",
                flag: 1
            }, {
                value: "临宿人员登记",
                flag: 2
            }, {
                value: "行业场所登记",
                flag: 3
            }, {
                value: "单位信息报备",
                flag: 4
            }, {
                value: "从业人员报备",
                flag: 5
            }, {
                value: "境外人员临时住宿登记",
                flag: 6
            }, {
                value: "社会单位户籍化管理",
                flag: 7
            }],
        }
    },
    components: {
        smrzxqcomponent: function(resolve, reject) {
            require(['./smrz_xq.vue'], resolve)
        },
        imgcomponent: function(resolve, reject) {
            require(['./images.vue'], resolve)
        }
    },
    methods: {
        handleRow(index, row) {
            let _rowdata = row;

            _rowdata && (_rowdata.idcardImage1 = global.tools.imgpathformat(_rowdata.idcardImage1));
            _rowdata && (_rowdata.idcardImage2 = global.tools.imgpathformat(_rowdata.idcardImage2));

            this.selectRowData = _rowdata;
            //this.is_show_rightbox = true;
        },
        reloadList() {
            this.selectRowData = {
                deptInfo: {},
                authInfo: {}
            };
            this.getListData();
        },
        hidden_bjxq() {


        },
        selectchange(cate) {
            let that = this;
            this.category = cate;
            if (this.category.flag == 1) {
                this.getListData(this.radio);
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.page_size = val;
            var that = this;
            that.getListData();
        },
        handleCurrentChange(val) {
            var that = this;
            this.currentPage = val;
            that.getListData();
        },
        handleRowHandle(row) {
            this.handleRow("", row);
        },
        filterTag(type) {
            let that = this;
            this.page_size = 20;
            that.flag = type;
            that.horizontal=type;
            that.keyword = "";
            that.currentPage = 1;
            that.getListData();

        },
        search: function() {
            var that = this;
            var res = [];
            that.currentPage = 1;
            that.getListData();
        },

        addListener: function() {
            const that = this;
            const Bus = global.eventHub;
        },
        removeListener: function() {
            const that = this;
            const Bus = global.eventHub;

        },
        getListData: function() {
            let that = this;
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage,
                pageSize: that.page_size,
            };
            if (that.keyword) {
                _param.keyword = that.keyword;
            }
            if (that.flag == 'authing') {
                _param.sortby = "authingTime desc";
                _param.auth = "noAuth"
                this.listUrl = global.config.weburl + "api/user/queryUserAuitList.do";
            } else {
                _param.sortby = "auditedTime desc";
                _param.auth = "authed,authFail"
                this.listUrl = global.config.weburl + "api/user/queryUserList.do";
            }
            this.is_loading = true;
            this.$http({
                method: 'POST',
                url: this.listUrl,
                params: _param,
            }).then(function(res) {
                that.is_loading = false;
                if (res.data.code == 0) {
                    var _data = res.data;
                    that.tableData = _data.data;
                    that.records = _data.pageInfo.records;
                    if (that.tableData!=null || that.tableData.length > 0) {
                        that.handleRow(0, that.tableData[0])
                    } else {
                        that.selectRowData = {
                            deptInfo: {},
                            authInfo: {}
                        };
                    }
                } else {

                    global.tools.handleError(res.data);
                }
            }, function(error) {
                this.$message({
                    type: 'error',
                    message: "获取数据失败"
                });
                setTimeout(() => {
                    that.is_loading = false;
                }, 1000);
            });

        }
    },
    computed: {
        myheight() {
            let _height = this.$store.getters.getPageInfos.main_height;
            return {
                height: _height + "px"
            }
        },
        rightheigth() {
            let _rheight = this.$store.getters.getPageInfos.right_height;
            return {
                'max-height': _rheight + "px"
            }
        },
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight
        }
    },
    created: function() {
        var that = this;
        that.getListData();
        that.addListener();
    },
    beforeDestroy: function() {
        this.removeListener();
    }
}
</script>
<style lang="less">
.smrz_class {
    .cs-filter-box2 {
        width: 100%;
    }
    .wsbx_back{margin-right: 38px;}
    .cds-page-content {
        .cds-content {
            border: 1px solid #275e8b;
            background: rgba(39, 94, 139, 0.3);
            padding: 10px;
            .cs-col-right-box {
                overflow: hidden;
            }
        }
    }
}
</style>
