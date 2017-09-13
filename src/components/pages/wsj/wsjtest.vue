<template>
    <div class="wsjDiv" v-loading="is_loading">
        <div class="wsjtop"  :style="topbar_style">
            <div class="wsjbtn">
            <router-link to="/wsj" class="ha-navbar-goback"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                <el-button type="primary" :plain="index!=plain" v-for="(item,index) in navs" :key="item.id" @click="shuidata(index)" class="wsj-button">
                    <img :src="item.url" alt=""><span>{{item.type}}</span></el-button>
            </div>
            <div class="wsjchoose">
                    <span class="cs_time">
                            时间
                    </span>
                    <el-date-picker ref="startdata" :editable="false" @change="getstarttime" placeholder="" style="width: 100px;margin-right: 10px;" type="month" v-model="start">
                    </el-date-picker>
                    <span class="wsjline">-</span>
                    <el-date-picker ref="enddata" :editable="false" @change="getendtime" placeholder="" style="width: 100px;margin-left: 10px;" type="month" v-model="end">
                    </el-date-picker>
                    <el-select @change="handleselect01" filterable placeholder="请选择" style="width: 165px; margin-left: 5px;margin-right: 5px;" v-model="select01" popper-class="wsjelselect">
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in options01">
                        </el-option>
                    </el-select>
                    <div style="margin-right: 5px;width: 125px;">
                        <div class="el-input" style="display: block;">
                            <input type="text" v-model="searchdata" placeholder="户号/户名" autocomplete="off" class="el-input__inner" @keyup.enter="handleIconClick">
                        </div>
                    </div>
                    <el-button @click="handleIconClick" class="cs_chaxun" type="primary">
                        搜索
                    </el-button>
                    <el-button @click="sjdrclick" type="primary">
                        数据导入
                    </el-button>
            </div>
        </div>
        <div class="wsjbottom" :style="content_sytle">
            <div class="cs-list-table">
                <!-- 列表 -->
                <div class="_table">
                    <el-table highlight-current-row :data="tableData" border="" :height="tableheigth">
                        <el-table-column label="序号" width="100">
                            <template scope="scope">{{ 1+scope.$index+(currentPage-1)*page_size}}</template>
                        </el-table-column>
                        <el-table-column label="年份" prop="year">
                        </el-table-column>
                        <el-table-column label="月份" prop="month">
                        </el-table-column>
                        <el-table-column label="户号" prop="userNo">
                        </el-table-column>
                        <el-table-column label="户名" prop="userName">
                        </el-table-column>
                        <el-table-column label="联系电话" prop="telphone">
                        </el-table-column>
                        <el-table-column label="地址" prop="address" show-overflow-tooltip="">
                        </el-table-column>
                        <el-table-column :label="type==1?'用水量（立方米）':'用电量（千瓦时）'" prop="consumption">
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination style="padding-bottom: 40px;" :current-page="currentPage" :page-size="page_size" :page-sizes="[10, 20, 30, 50]" :total="totalpages" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
            <xzmbtkcomponent :type="type" v-if="is_xzmb">
            </xzmbtkcomponent>
        </div>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle],
    methods: {
        handleselect01() {

        },
        getstarttime(e) {
            this.starttime = e;
        },
        handleSizeChange(val) {
            this.page_size = val;
            this.getlistdata();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getlistdata();
        },
        getendtime(e) {
            this.endtime = e;
        },
        handleIconClick() {
            this.keyword = this.searchdata;
            this.currentPage = 1;
            this.getlistdata();
        },
        shuidata(e) {
            this.plain = e;
            this.type = 1 + e;
            if(this.type==1){
                this.navs[this.type-1].url="../../../../static/images/water.png"
                this.navs[this.type].url="../../../../static/images/electric-active.png"
            }else  if(this.type==2){
                this.navs[this.type-1].url="../../../../static/images/electric.png"
                this.navs[this.type-2].url="../../../../static/images/water-active.png"
            }
            this.currentPage = 1;
            this.getlistdata();
        },
        sjdrclick() {
            this.is_xzmb = true;
        },
        getlistdata() {
            var that = this;
            if (this.starttime && this.endtime) {
                this.start01 = this.starttime.replace(/-/, '');
                this.end01 = this.endtime.replace(/-/, '');
            }
            if (!this.end || !this.start) {
                this.$message({
                    message: '请选择时间',
                    type: 'error'
                });
                return false;
            } else if (this.end > new Date()) {
                this.$message({
                    message: '截止时间不能大于当前时间',
                    type: 'error'
                });
                return false;
            } else if (this.start01 > this.end01) {
                this.$message({
                    message: '请选择正确的时间区间',
                    type: 'error'
                });
                return false;
            } else if (!this.select01) {
                this.$message({
                    message: '请选择查询地点',
                    type: 'error'
                });
                return false;
            }
            this.is_loading=true;
            var _param = {
                token: global.data.getToken(),
                type: that.type,
                deptId: that.select01,
                startMonth: that.starttime,
                endMonth: that.endtime,
                page: that.currentPage,
                pageSize: that.page_size,
                keyword: that.keyword,

            };
            if(that.type==1){
                _param.sortby="year desc, month desc, wate_no asc";
            }else if(that.type==2){
                _param.sortby="year desc, month desc, electricity_no asc";
            }
            this.$http({
                method: 'GET',
                url: global.config.weburl + "api/lifeData/getLifeData.do",
                params: _param
            }).then(function(res) {
                that.is_loading=false;
                if (res.data.code == 0) {
                    that.tableData = res.data.data;
                    that.totalpages = res.data.pageInfo.records;
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
            })
        },
        getdeptId() {
            let that = this;
            var _param = {
                token: global.data.getToken()
            };
            this.$http({
                method: 'POST',
                url: global.config.weburl + "api/dept/findByUserPoliceStation.do",
                params: _param
            }).then(function(res) {
                //console.log(res.body.data)
                if (res.body.code == 0) {
                    that.options01 = res.data.data;
                    that.select01 = this.options01[0].id;
                    that.getlistdata();
                } else {
                    global.tools.handleError(res.data);
                }
            });
        },
        getMonth() {
            var Times = new Date()
            this.start = Times;
            this.end = Times;
            var Month = Times.getMonth() + 1;
            if (Month < 10) {
                Month = "0" + Month;
            }
            var dateTimes = Times.getFullYear() + "-" + Month;
            this.starttime = dateTimes;
            this.endtime = dateTimes;
        }
    },
    components: {
        xzmbtkcomponent: function(resolve, reject) {
            require(['./xzmbtk.vue'], resolve)
        }
    },
    data() {
        return {
            is_loading:false,
            start01: "",
            end01: "",
            plain: 0,
            options01: null,
            value: "",
            type: 1,
            starttime: "",
            searchdata: "",
            endtime: "",
            tableData: [],
            is_xzmb: false,
            currentPage: 1,
            page_size: 20,
            timedata: "",
            select01: "",
            deptId: global.data.getDeptid(),
            start: "",
            end: "",
            keyword: "",
            totalpages: 0,
            mapHeight: 0,
            dataText: "你好",
            startpickerOptions: {},
            endpickerOptions: {},
            navs: [{type:"用水数据",url:"../../../../static/images/water.png"}, {type:"用电数据",url:"../../../../static/images/electric-active.png"}],
            imgUrl:''
        }
    },
    computed: {
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight;
        }
    },
    created() {
        // this.getlistdata();
        this.getdeptId();
        var that = this;
        var Bus = global.eventHub;
        Bus.$on("jstankuang", function() {
            that.is_xzmb = false;
        });
        Bus.$on("getListData", function() {
            that.getlistdata();
        });
        Bus.$on("changeCurPage", function(value) {
            that.currentPage = value;
        });
        this.getMonth();
    }
}
</script>
<style lang="less" scoped="">
    .wsjDiv{
.cs-wfx-router-groups {
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-flow: row nowrap;
    -webkit-flex-flow: row nowrap;
}
        .el-select{
            width: 220px;
        }
        .wsjbtn .wsj-button{
            background-color: transparent!important;
        }
        .wsj-button img{
            vertical-align: middle;
            margin-right: 5px;
        }
.cs-wfx-link-dv {
    border-right: 1px solid #fff;
    box-sizing: border-box;
    flex-shrink: 1;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    justify-content: center;
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

.page-wfx-content {
    padding-top: 16px;
    overflow-y: visible
}

.cs-wfx-link:before {
    position: relative;
    left: -10px;
    top: -3px;
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #000;
}

.cs-wfx-link.item0:before {
    background: #7ccaa2
}

.cs-wfx-link.item1:before {
    background: #f5705f
}


/* .cs-wfx-link.item2:before{background: #5eb6ca}
.cs-wfx-link.item3:before{background: #efbd5e}
.cs-wfx-link.item4:before{background: #93b1e3}
 */

.cs-box .disabled {
    background-image: none;
    pointer-events: none;
    background: #e4e4e4;
    color: #777;
}

.cs-box .disabled:before {
    background: #fff;
}

.cs_chooses {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    .cs_time {
        font-size: 14px;
        padding-right: 10px;
        color: #555555;
    }
}

.cs_search {
    display: flex;
    justify-content: flex-end;
}
.wsjbottom{
    background: rgba(39,94,139,0.3);
    padding: 10px;
    border: 1px solid #275e8b;
}
.wsjtop {
    padding-left: 0!important;
    .wsjbtn{
        a{
            margin-right: 50px;
            margin-bottom: -7%;
        }
    }
}
    }
</style>
