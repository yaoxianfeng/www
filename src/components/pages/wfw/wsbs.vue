<template>
    <div class="cs-wsbs-content" v-loading="is_loading">
        <div class="cds-list-table" :style="myheight">
            <div class="ha-topbar-box" :style="topbar_style">
                <div class="ha-navbar-tools ha-flexend ha-navbar-tools_back">
                    <router-link to="/wfw" class="ha-navbar-goback wsbx_back"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                    <div class="select-top">
                        <div class="select_topbj"> </div>
                        <el-select v-model="categoryText" class="cate-select" popper-class="wreselect" @change="selectchange">
                        <el-option v-for="item in arr" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                    </div>
                        <div class="ha-navbar-radiogroup" v-if="category.code == 'criminal'">
                        <el-radio-group v-model="radio" @change="choiceTag(radio)">
                            <el-radio class="radio" label="0" v-model="radio">
                                未审核
                            </el-radio>
                            <el-radio class="radio" label="15" v-model="radio">
                                已审核
                            </el-radio>
                            <el-radio class="radio" label="2349" v-model="radio">
                                已确认
                            </el-radio>
                            <el-radio class="radio" label="67810" v-model="radio">
                                已完成
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
                
                <div class="cs-searchBox" v-if="category.code == 'criminal'">
                    <ha-search class="cs-input" icon v-model="keyword" placeholder="姓名/联系电话" @keyupEnter="search" @icon-click="search"></ha-search>
                </div>
                
            </div>

            <div v-if="category.code != 'criminal'" class="contenttable ha-model-wait_doing" :style="content_sytle">
                <img src="/static/images/doing.png" />
            </div>

            <div v-if="category.code == 'criminal'" class="contenttable" :style="content_sytle" >
                <el-col :span="13">
                    <div class=" ha_page_content">
                        <!-- 筛选 -->
                        <el-table :data="tableData" @row-click="rowclick" border="" :height="tableheigth" @filter-change="filters" highlight-current-row>
                            <el-table-column label="序号" width="70">
                                <template scope="scope">
                                    {{ 1+scope.$index+(currentPage-1)*page_size}}
                                </template>
                            </el-table-column>
                            <el-table-column label="姓名" prop="name" show-overflow-tooltip="" width="100"> </el-table-column>
                            <el-table-column label="联系电话" prop="userPhone" show-overflow-tooltip="">
                            </el-table-column>
                            <el-table-column label="身份证号" prop="idcardNo" show-overflow-tooltip>
                            </el-table-column>

                            <el-table-column v-if="radio==15" :filters="[{ text: '已受理', value: '1' }, { text: '已驳回', value: '5' }]" label="审批结果" prop="authDesc" column-key="auth"  width="120">
                                <template scope="scope">
                                    <el-tag :type="scope.row.authStatus ==1 ? 'primary' : 'success'" close-transition>
                                    {{scope.row.authStatus==1?'已受理':'已驳回'}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="radio==2349" :filters="[{ text: '自行领取', value: '3' }, { text: '邮政快递', value: '4' },{ text: '待确认', value: '2' },{ text: '待支付', value: '9' }]" label="领取方式" column-key="auth" prop="recieveType1"  width="120">
                                <template scope="scope">
                                    <el-tag :type="scope.row.authStatus === 9 ? 'primary' : 'success'" close-transition>
                                        <span v-if="scope.row.authStatus==3">自行领取</span>
                                        <span v-if="scope.row.authStatus==4">邮政快递</span>
                                        <span v-if="scope.row.authStatus==2">待确认</span>
                                        <span v-if="scope.row.authStatus==9">待支付</span>
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="radio==67810" :filters="[{ text: '待评价', value: '67' },{ text: '已失效', value: '8' },{ text: '已评价', value: '10' }]" label="领取方式" column-key="auth" prop="recieveType2"  width="120">
                                <template scope="scope">
                                    <el-tag :type="scope.row.authStatus === 10 ? 'primary' : 'success'" close-transition>
                                        <span v-if="scope.row.authStatus!=10&&scope.row.authStatus!=8">待评价</span>
                                        <span v-if="scope.row.authStatus==10">已评价</span>
                                        <span v-if="scope.row.authStatus==8">已失效</span>

                                    </el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column label="申请时间" prop="createTimeStr" show-overflow-tooltip v-if="this.radio==0">
                                <template scope="scope">
                                    <span style="margin-left: 10px">
                                            {{scope.row.createTimeStr|moment}}
                                        </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审核时间" prop="auditTime"  show-overflow-tooltip="" v-if="radio!=0">
                                <template scope="scope">
                                    <span style="margin-left: 10px">
                                            {{scope.row.auditTime|moment}}
                                        </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="评价" prop="applyRecords" show-overflow-tooltip v-if="radio==67810">
                                <template scope="scope">
                                    <span v-if="scope.row.applyRecords[0].rate==1">好评</span>
                                    <span v-else-if="scope.row.applyRecords[0].rate==2">中评</span>
                                    <span v-else-if="scope.row.applyRecords[0].rate==3">差评</span>
                                    <span v-else>暂未评价</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <div class="cs-footer-page">
                            <el-pagination :current-page="currentPage" :page-size="page_size" :page-sizes="[10, 20 ,30 ,50]" :total="records" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" style="padding-bottom: 40px;">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>

                <el-col :span="11">
                    <wsbsxqcomponent :radio="myradio" :selectRowData="selectRowData" :records="records" ref="wsbsxqcomponent" :horizontal="horizontal" @refreshListData ="refreshListData"></wsbsxqcomponent>
                </el-col>
            </div>
        </div>

    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    data() {
        return {
            categoryText: "无犯罪记录证明",
            category:{
                name: "无犯罪记录证明",
                code: 'criminal'
            },
            is_loading:false,
            currentPage: 1, //第多少页
            page_size: 20, //每页显示多少数据
            keyword: "",
            radio: '0',
            tableData: [],
            notableData:[],
            arr: [],
            records: 0,
            horizontal:'',
            selectRowData: {},
            daiqr: '待确认',
            weitg: '未通过',
            yisx: '已失效',
            _status: '',
            filters1:[],
            filters2:[],
            filters3:[],
        }
    },
    components: {
        wsbsxqcomponent: function(resolve, reject) {
            require(['./wsbs_xq.vue'], resolve)
        }
    },
    methods: {
        selectchange(cate) {
            let that = this;
            this.category = cate;
            if (this.category.code == "criminal") {
                this.getListData(this.radio);
            }
        },
        choiceTag(radio) { //切换tag
            this.keyword = "";
            this.currentPage = 1;
            this.page_size = 20;
            this.radio = radio;
            this._status = radio;
            this.horizontal=radio;
            this.selectRowData="";
            this.getListData(radio);
        },
        rowclick(row) { //点击某一行
            this.selectRowData = row;
        },
        search() { //搜索
            this.getListData(this.radio);
        },
        formatter(row, column) {
            return row.address;
        },
        filters(value) { //筛选操作

            this._status = value["auth"].join(",");
            this.currentPage = 1;
            if (!this._status) {
                this._status = this.radio
            }
            this.getListData(this._status);
        },
        handleSizeChange(val) {
            this.page_size = val;
            var that = this;
            if (this._status) {
                that.getListData(this._status);
            } else {
                that.getListData(this.radio);
            }
        },
        handleCurrentChange(val) {
            var that = this;
            this.currentPage = val;
            if (this._status) {
                that.getListData(this._status);
            } else {
                that.getListData(this.radio);
            }
        },
        refreshListData () {
            if (!this._status) {
                this._status = this.radio
            }
            this.getListData(this._status);
        },
        getListData(radio) {
            let that = this;
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage,
                pageSize: that.page_size,
                sortby: "update_time desc,create_time asc"
            };
            if (radio == 15) {
                _param.authStatus = "1,5"
            } else if (radio == 2349) {
                _param.hasRecord=1,
                _param.authStatus = "2,3,4,9"
            } else if (radio == 67810) {
                _param.authStatus = "6,7,8,10"
            } else if (radio == 0) {
                _param.authStatus = "0";
            } else if (radio== 67) {
                _param.authStatus = "6,7"
            } else if (this._status) {
                _param.authStatus = this._status
            }
            if (that.keyword) {
                _param.keyword = that.keyword;
            }
            this.is_loading = true;
            that.$http.post(global.config.weburl + 'api/criminal/queryCriminal.do', _param).then(function (res) {
                that.is_loading = false;
                if (res.data.code == 0) {
                    var _data = res.data;
                    that.tableData=_data.data;

                    that.records = _data.pageInfo.records;
                    if(that.tableData[0]){
                        for (var i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].num = that.tableData[i].turningSpeed + that.tableData[i].processingEfficiency + that.tableData[i].feedbackResult;
                        }
                        that.rowclick(that.tableData[0])
                    }else {
                        that.selectRowData = "";
                    }
                } else {
                    global.tools.handleError(res.data);
                }
            }, function (error) {
                that.$message({
                    type: 'error',
                    message: "获取数据失败"
                });
                setTimeout(() => {
                    that.is_loading = false;
                }, 1000);
            });
        },
        getData() {
            let that = this;
            that._loadPromise.then((data) => {
                data.forEach(function (e) {
                    that.arr = data;
                });
            })
        },
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
            return {'max-height': _rheight + "px"}
        },
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight
        },
        myradio () {
            return this.radio;
        }
    },
    beforeCreate() {
        this._loadPromise = global.tools.getDict("businessMatters");
    },
    created() {
        var that = this;
        that.getListData(this.radio);
    },
    mounted: function () {
        this.getData();
    }

}
</script>
<style lang="less">
.cs-wsbs-content{
    .cs-searchBox {
        margin-right: 0;
        float: right;
        margin-bottom: 5px;
        min-width: 100px;
        background: rgba(39, 94, 139, 0.3);
        i{
            margin-top: 18px;
        }
        input {
            float: right;
            background: rgba(39, 94, 139, 0.3);
            border: 1px solid #4092bb;
        }
    }
    /* .ha-flexend{
        .select-top{
            .select_topbj{height: 8px;width: 217px;background: url('/static/img/xlxks.png') no-repeat;}
            .el-select .el-input .el-input__inner{
                color: #fff;
                background: #275e8b;
               
            }
            .el-select .el-input .el-input__icon{
                color: #fff;
            }
        }
    } */
    .select-top{margin-right: 18px;}
    .cs-filter-box2 {
        padding-left: 20px;
        padding-top: 2.5%;
        .radio{
            color: #fff;
        }
    }

    .contenttable{
        border: 1px solid #275e8b;
        background: rgba(39, 94, 139, 0.3);
        padding: 10px;
    }

    .cs-dropdown {
        background: rgba(39, 94, 139, 0.3);
        float: left;
        border: 1px solid #4092bb;
        padding: 0 5px;
        width: 200px;
        border-radius: 2px;
        height: 35px;
        color: #fff;
        .el-dropdown-link {
            line-height: 35px;
            width: 100%;
            b {
            font-weight: 100;
            }
            i{
                float: right;
                padding-top: 10px;
                color:#288b9c;
            }
        }
    }

    .el-dropdown-menu{
        width: 200px;
        background: rgba(39, 94, 139, 0.9);
        border: 1px solid #4092bb;
        color: #fff;
    }

    .el-radio-group {
        display: flex;
        align-items: center;
        .el-radio radio{
            .el-radio__label{
                color: #fff!important;
            }
        }
    }
    .cs-radiogroup .ha-navbar-goback{
        margin-top:10px ;  
    }
    .wsbx_back{margin-right: 38px;}
}


</style>
