<template>
    <div id="page-content" v-loading="is_loading" :style="main_style">


        <div class="bjxq-list"  :style="topbar_style">
            <div class="ha-navbar-radiogroup">
                <!-- <el-button class="add_btn" @click="showMap"><span class="map">联防地图</span></el-button> -->
                <router-link to="/wlf/map" class="ha-navbar-goback wsbx_back mpa_back"><i class="map"></i><span>联防地图</span></router-link>
                <el-radio-group v-model="flag" class="cs-mytab-radio-group">
                    <el-radio :label="0">未处理</el-radio>
                    <el-radio :label="1">已处理</el-radio>
                </el-radio-group>
            </div>

            <div class="list-right">

                <div class="cs-searchwlf">
                    <ha-search icon v-model="keyword" placeholder="报警人/联系电话" @keyupEnter="jq_search" @icon-click="jq_search"></ha-search>
                </div>
                <el-button class="add_btn add_end" @click="showAdd"><span class="add">警情补录</span></el-button>
            </div>
            
            <div class="cs-export-box fl" v-if="false">
                <el-button :plain="true" type="primary">导出</el-button>
            </div>

        </div>

        <div class="qi-list-table"  :style="content_sytle">
            <div class="alarm-table">
                <!-- 列表 -->
                <el-table highlight-current-row :height="tableheigth" :data="showlist"
                          @row-click="handleRowHandle" @selection-change="handleSelectionChange"
                          @filter-change="filter"
                          ref="alarm_list-table">
                    <el-table-column label="序号" width="65" type ="index">
                        <template scope="scope">{{ 1+scope.$index+(currentPage4-1)*page_size}}</template>
                    </el-table-column>
                    <el-table-column prop="alertUserRealname" show-overflow-tooltip label="报警人" >
                    </el-table-column>
                    <el-table-column prop="cellphone" show-overflow-tooltip label="联系电话" >
                    </el-table-column>
                    <el-table-column prop="alertTime" show-overflow-tooltip label="报警时间" >
                    </el-table-column>

                    <el-table-column prop="type" column-key="type" label="警情来源" width="120" :filters="filterAlarmType">
                        <template scope="scope2">
                            <span v-if="scope2.row.type ===1">一键报警</span>
                            <span v-if="scope2.row.type ===2">随手记</span>
                            <span v-if="scope2.row.type ===3">举报</span>
                            <span v-if="scope2.row.type ===4">警情补录</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="description" label="警情摘要" >
                        <template scope="scope">{{ scope.row.description|showNullStr}}</template>
                    </el-table-column>

                    <el-table-column :filters="filters"
                                     prop="classify"
                                     show-overflow-tooltip
                                     label="案件类型"
                                     column-key="auth"
                                     width="120"
                                     column-id="alarm-auth"

                                     ref="classifyRef">
                        <template scope="scope">
                            <span v-for="item in filters" v-if="scope.row.classify ==item.value">{{item.text}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="flag==0" prop="address" label="发案地址" >
                        <template scope="scope">{{ scope.row.address|showNullStr}}</template>
                    </el-table-column>

                    <el-table-column v-if="flag==1"
                                     prop="logs_description"
                                     show-overflow-tooltip
                                     fit="false"
                                     label="处理结果">
                        <template scope="scope">{{ scope.row.logs[scope.row.logs.length-1].description|showNullStr }}</template>
                    </el-table-column>

                    <el-table-column v-if="flag==1" prop="updateTime" show-overflow-tooltip label="处理时间">
                        <template scope="scope">{{ scope.row.updateTime }}</template>
                    </el-table-column>


                    <el-table-column v-if="flag==0" prop="status" label="处理状态" >
                        <template scope="scope3">
                            <span v-if="scope3.row.status ===0">未处理</span>
                            <span v-if="scope3.row.status ===1 || scope3.row.status ===6">已处理</span>
                            <span v-if="scope3.row.status ===2">已委派</span>
                        </template>
                    </el-table-column>


                    <el-table-column v-if="flag==1" prop="appraiseFlg" column-key="appraiseFlg"  width="100" show-overflow-tooltip label="评价" :filters="filterEvaluate">
                        <template scope="scope">
                            <div v-for="log in scope.row.logs">
                                <span v-if="log.rate ===1" class="positive">好评</span>
                                <span v-if="log.rate ===2" class="moderate">中评</span>
                                <span v-if="log.rate ===3" class="negative">差评</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-button v-if="scope.row.status ===0"
                                       v-on:click.native.prevent="handleRow(scope.$index, scope.row)"
                                       type="text"
                                       size="small">处理
                            </el-button>
                            <el-button v-if="scope.row.status !=0"
                                       v-on:click.native.prevent="handleRow(scope.$index, scope.row)"
                                       type="text"
                                       size="small">查看
                            </el-button>
                            <!-- <el-button type="text" size="small">视频通话</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage4"
                               :page-sizes="[10, 20 ,30 ,50]"
                               :page-size="page_size"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="records">
                </el-pagination>
            </div>

            <div class="week-alarm-summary"><span>近七日共</span> <span>接收警情{{alarm_all_count}}条</span><span>处理警情{{alarm_done_count}}条</span><a @click="viewSummary">查看简报</a></div>
        </div>
        <div class="bjxq-list-group-component">
            <!-- 组件组 -->
            <transition name="fadeRightBig">
                <bjxqcomponent v-if="isShow_bjxq" :jqfb_list_detail="jqfb_list_detail" @hide_bjxq="hide_bjxq" @doto_refresh_list="doto_refresh_list"></bjxqcomponent>
                <jqblcomponent v-if="isShow_add"  @hide_jqbl="hide_jqbl" @doto_refresh_undo_list="doto_refresh_undo_list"></jqblcomponent><!--警情补录 -->
            </transition>

            <!--报警详情 -->
        </div>
        <div class="alarm-list_components">
            <transition name="fadeInUp">
                <summarycomponent v-if="is_show_summary" @close="closeSummary"></summarycomponent><!-- 一周简报 -->
            </transition>
        </div>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle],
    data() {
        return {
            is_loading:false,
            page_size: 20,
            twoClass: 'el-col-md-12',
            onlyOneClass: 'el-col el-col-24 el-col-xs-24',
            isShow_bjxq: false,
            isShow_add:false,
            flag: 0,
            records: 0,
            listheigth: '',
            showlist: [],
            multipleSelection: [],
            currentPage4: 1,
            keyword: "",
            classify:'',
            jqfb_list_detail: {},
            alarm_all_count:0,
            alarm_done_count:0,
            is_show_summary:false,  //是否显示简报
            type:"",
            appraiseFlg:"",
            filters:[],
            filterAlarmType:[
                {"value":1,"text":"一键报警"},
                {"value":2,"text":"随手记"},
                {"value":3,"text":"举报"},
                {"value":4,"text":"警情补录"}
            ],
            filterEvaluate:[
                {"value":0,"text":"未评价"},
                {"value":1,"text":"好评"},
                {"value":2,"text":"中评"},
                {"value":3,"text":"差评"}
            ]


        }
    },
    components: {
        bjxqcomponent: function(resolve, reject) {
            require(['./bjxq.vue'], resolve)
        },
        jqblcomponent: function (resolve, reject) {
            require(['./add.vue'],  resolve)
        },
        summarycomponent: function (resolve, reject) {
            require(['./alarm/summary.vue'],  resolve)
        }

    },
    methods: {
        getData() {
            let that = this;
            let _arr = [];
            that._loadPromise.then((data) => {
                data.forEach(function (e) {
                    _arr.push({text:e.name,value:e.code});
                })
            })
            that.filters = _arr;
        },
        filter(value){
            if (value && value["auth"]) {
                this.classify= value["auth"].join(",");
            }

            if (value && value["type"]) {
                this.type= value["type"].join(",");
            }

            if (value && value["appraiseFlg"]) {
                this.appraiseFlg= value["appraiseFlg"].join(",");
            }


            this.currentPage4 = 1;
            this.getListData();
        },

        clearFilterColumns(tableName, index) {
            //清除表格某列的筛选, index表示第几列
//            console.log(">>")
//            console.log(this.$refs[tableName].columns);

            let _columns = this.$refs[tableName].columns[index];


            _columns.filteredValue = [];
            this.$refs[tableName].store.commit('filterChange', {
                column:_columns,
                values: []
            });
        },

        showAdd(){
            this.is_show_summary = false;
            this.isShow_add = true;
            this.isShow_bjxq = false;
        },
        showMap(){
            this.$router.push('/wlf/map');
        },

        showAlarmDetailBox(data) {
            this.is_show_summary = false;
            this.isShow_add=false;
            this.isShow_bjxq = true;
            this.jqfb_list_detail = data;
        },
        handleRow(index, rows) {
            this.showAlarmDetailBox(rows);
        },
        hide_bjxq() {
            this.isShow_bjxq = false;
        },
        hide_jqbl() {
            this.isShow_add = false;
        },
        doto_refresh_undo_list() {
            this.isShow_add = false;
            this.is_show_summary = false;
            this.handleCurrentChange(0);
        },
        doto_refresh_list() {
            this.isShow_bjxq = false;
            this.is_show_summary = false;
            this.handleCurrentChange(1);
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
            this.currentPage4 = val;
            that.getListData();
        },
        handleRowHandle(row) {
            this.handleRow("", row);
        },
        filterTag() {
            let that = this;
            this.classify="";
            this.type="";
            this.appraiseFlg="";
            this.currentPage4 = 1;
            that.getListData();
            this.isShow_bjxq = false;
            this.is_show_summary = false;
        },
        viewSummary() {
            //查看简报
            this.isShow_add = false;
            this.isShow_bjxq = false;

            this.is_show_summary = true;

        },
        closeSummary() {
            this.is_show_summary = false;
        },
        jq_search: function() {
            //this.showlist=this.tableData3;
            var that = this;
            this.isShow_bjxq = false;
            this.is_show_summary = false;
            var res = [];

            that.getListData();
        },
        getListData: function() {

            let that = this;
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage4,
                pageSize: that.page_size,
                keyword: that.keyword
            };
            this.is_loading=true;
            _param.status = that.flag;
            if (that.classify) {
                _param.classify = that.classify;
            }

            if (that.type) {
                _param.type =that.type;
            }

            if (that.appraiseFlg) {
                _param.appraiseFlg = that.appraiseFlg;
            }

            if (that.flag == 0) {
                _param.sortby = "alert_time desc";
            } else if (that.flag == 1) {
                _param.sortby = "update_time desc";
            }
            that.$http.post(global.config.weburl + 'api/alert/queryAlert.do', _param).then(function(res) {

                if (res.data.code == 0) {
                    var _data = res.data;
                    that.showlist = _data.data;
//                    console.log(that.showlist)
                    that.records = _data.pageInfo.records;
                } else {
                    global.tools.handleError(res.data);
                }
                that.is_loading=false;
            }, function(error) {
//                this.$message({
//                    type: 'error',
//                    message: "获取数据失败"
//                });
                //setTimeout(() => {
                    that.is_loading=false;
                //}, 200);
            });

        },
        addListener: function() {
            const that = this;
            const Bus = global.eventHub;
            Bus.$on('showAlarmDetailBox',that.showAlarmDetailBox);
        },
        removeListener: function() {
            const that = this;
            const Bus = global.eventHub;
            Bus.$off('showAlarmDetailBox',that.showAlarmDetailBox);
        },
        fomartAlarmCount(data) {
//            let bar_xAxis_total = data.category.all;
//            let bar_series_online = data.category.done;

        },
        getDeptAlarmCount:function() {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _formdata = {
                startTime: global.tools.formartDate(new Date(global.tools.getCurrentDate() - 6 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD') ,
                endTime: global.tools.formartDate(new Date(), 'YYYY-MM-DD'),
                token : token
            };

            that.$http.post(global.config.weburl + 'api/analysis/getAlertProcessChart.do', _formdata).then(function(res) {
                if (res.data.code == 0) {
                    var _data = res.data.data;
                    that.formartData(_data);
                } else {
                   global.tools.handleError(res.data);
                }
            }, function(error) {

                this.$message({
                    type: 'error',
                    message: "获取数据失败"
                });

            });
        },
        getAlarmCount:function(){

            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _formdata = {
                token : token,
                type:3
            };
            that.$http.post(global.config.weburl + '/api/analysis/alertDonePaiChart.do', _formdata).then(function(res) {
                if (res.data.code == 0) {
                    var _data = res.data.data;
                    that.alarm_all_count = _data.total;
                    that.alarm_done_count = _data.done;
                }
            })
        }
    },
    computed: {
        myheight() {
            let _height = this.$store.getters.getPageInfos.main_height;
            return {
                height: _height + "px"
            }
        },
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight
        }
    },
    beforeCreate() {
        this._loadPromise = global.tools.getDict("alertClassifyDict");

    },

    created: function() {
        var that = this;
        that.addListener();
    },

    mounted: function() {

        var that = this;
        this.getData();
        this.getListData();
        this.getAlarmCount();
    },
    watch: {
        flag: function() {

            console.log(this.$refs["alarm_list-table"]);
//            this.$refs["alarm-table"].store.table.layout.bodyWidth = 1100;

            if (this.flag == 0) {
                this.clearFilterColumns("alarm_list-table", 4);
                this.clearFilterColumns("alarm_list-table", 6);
            } else {
                this.clearFilterColumns("alarm_list-table", 4);
                this.clearFilterColumns("alarm_list-table", 6);
                this.clearFilterColumns("alarm_list-table", 9);
            }
//            this.clearFilterColumns("alarm_list-table", 6);


            this.filterTag();
        }
    },
    beforeDestroy: function() {
        this.removeListener();
    }
}
</script>
<style lang="less">
#page-content{
    position: relative;

    .bjxq-list-group-component {
        position: absolute;
        z-index: 4;
        top: 0;
        width: 100%
    }
    .mpa_back{width: auto;padding:10px;margin-right: 30px;}
    .alarm-list_components{
        position: absolute;
        z-index: 4;
        width: 100%
    }
    .qi-list-table{
        border: 1px solid #275e8b;
        background: rgba(39,94,139,0.3);
        padding: 20px;
        .positive{
        color: #589359
        }
        .moderate{
        color: #F28121
        }
        .negative{
            color: #D8749A
        }
    }


    .bjxq-list{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .cs-mytab-radio-group{
            height: 50%;
            display: flex;
            align-items: center;
            .el-radio{
                color: #fff;
            }
        }
        .add_end{margin-left: 10px;}
        .add_btn{
                border-radius: 2px;
                background: #275e8b;
                border: none;
                color: #fff;
                width: 130px;
                height: 40px;
                padding: 5px 10px;
                .add{
                    display: inline-block;
                    width: 80%;
                    background-position: 1px 0px;
                    height: 100%;
                    background: url("../../../../static/images/add.png") no-repeat;
                    line-height: 20px;
                    margin-top: 5px;
                    text-align: right;
                }
                .map{
                    display:block;
                    width: 20px;

                    border: 1px solid red;
                    background-position: 1px 0px;
                    height: 100%;
                    background: url("../../../../static/images/map.png") no-repeat;
                    line-height: 20px;
                    margin-top: 5px;
                    text-align: right;
                }
            }
            .map{
                    display:block;
                    width: 16px;
                    background-position: 1px 0px;
                    height: 14px;
                    background: url("../../../../static/images/map.png")  no-repeat;
                    background-size:16px 14px;
                    line-height: 20px;
                    text-align: right;
                }
        .list-right{
            margin-bottom: 6px;
            display: flex;
        }
    }
    .week-alarm-summary{
        position: absolute;
        font-size: 13px;
        bottom:15px;
        right: 20px;
        text-align: right;
        span,a{
            margin-left: 5px;
        }
        a{
            color: rgb(147,198,217);
            cursor: pointer;
        }
    }
}
</style>
