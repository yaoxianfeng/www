<template>
    <div class="cs-wrd-container" v-loading="is_loading" :style="main_style">
        <div class="ha-topbar-box" :style="topbar_style">
            <div class="ha-navbar-tools cs-f1">
                <button class="ha-navbar-goback" @click="goback"><i class="el-icon-arrow-left"></i><span>返回</span></button>
                <el-select v-if = "infoType != 9" v-model="selvalue" class="f2" popper-class="wreselect" @change="selectchange" placeholder="请选择">
                    <el-option v-for="item in arr" :key="item.id" :label="item.infoType" :value="item">
                    </el-option>
                </el-select>
                
            </div>
            <div class="ha-navbar-radiogroup">
                <el-radio-group v-model="status" class="cs-button-group" v-if="infoType != 6">
                    <el-radio :label="5">已发布</el-radio>
                    <el-radio :label="6">未发布</el-radio>
                </el-radio-group>
            </div>
            
            <div class="ha-navbar-searchbox ">
                <el-button type="primary" class="cs-button cs-btn-wrd-add" v-on:click="add()"><img src="/static/img/audio/xinzeng.png" alt="">新增</el-button>
                <ha-search icon v-model="keyword" :placeholder="infoType == 9?'问题名称':'标题名称'" @keyupEnter="onEnter" @icon-click="onEnter"></ha-search>
            </div>
        </div>

        <div class="page-content wrd-page-content main-content" :style="content_sytle">
           <div class="el-row contBox clear">
            <el-row class="cs-list-table" :gutter="10">
                <el-col :span="13">
                    <div >
                        <el-table :data="listData" :height="tableheight" border highlight-current-row @row-click="rowclick">
                            <el-table-column type="index" label="序号" width="70">
                                <template scope="scope">
                                    <img class="cs-zdimg" src="/static/img/icon/zhiding.png" alt="置顶" v-if="scope.row.uptopDays || scope.row.uptopTime">
                                    <span style="margin-left: 10px">{{1+scope.$index+(pageInfo.page-1)*pageInfo.pageSize}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" show-overflow-tooltip :label=" infoType ==9 ? '常见问题名称':'标题名称'">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="createName" label="发布人">
                            </el-table-column>
                            <el-table-column prop="status" show-overflow-tooltip :formatter="formatter" label="发布状态" v-if="infoType != 6">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="最后一次更新时间">
                                <template scope="scope">
                                    <span>{{scope.row.updateTime|moment}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msgStatus" show-overflow-tooltip label="发送状态" v-if="infoType == 6" :formatter="formattermsgStatus">
                            </el-table-column>
                            <el-table-column prop="updaterName" show-overflow-tooltip label="更改人">
                            </el-table-column>
                        </el-table>
                        <div class="cs-footer-page">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[10, 20 ,30 ,50]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.records">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>
                <el-col :span="11">
                    <tbcomponent ref="tbcomponent" :selectRowData="rowData" :status="status"  @filterTag="filterStatus" :is_publish="is_publish"></tbcomponent>
                </el-col>
            </el-row>
           </div>
        </div>
        
        <xzfzpcomponent v-show="is_xzshow"  :is_xzshow="is_xzshow" :numflag="infoType" :wrdTag="wrdTag" @filterTag="filterStatus" @close_add="close_add"></xzfzpcomponent>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle],
        data() {
            return {
                is_loading:false,
                selvalue: "警情通报",
                infoType: 1, //信息类别编号
                status: 5, //发布状态
                keyword: '', //查询关键字，按标题模糊查询
                listHeight: '',
                mianStyle: {},
                arr: [{
                    infoType: "警情通报",
                    flag: 1
                },
                {
                    infoType: "社区动态",
                    flag: 3
                }, {
                    infoType: "防范小贴士",
                    flag: 5
                }, {
                    infoType: "消息通知",
                    flag: 6
                }, {
                    infoType: "热点新闻",
                    flag: 7
                }, {
                    infoType: "i学习",
                    flag: 8
                }],
                wrdTag: '警情通报',
                listData: [],
                rowData: null,
                pageInfo: {
                    pageSize: 20,
                    page: 1,
                    records: 0
                },
                is_xzshow: false,
                path:this.$router.apps[0]._route.fullPath,
                is_publish:false
            }
        },
        components: {
            xzfzpcomponent: function(resolve, reject) {
                require(['./fzp_xinzeng.vue'], resolve)
            },
            tbcomponent: function(resolve, reject) {
                require(['./jqxc_xq.vue'], resolve)
            },
            jectcomponent: function(resolve, reject) {
                require(['./object.vue'], resolve)
            }
        },
        methods: {
            goback(){
                this.$router.go(-1);
            },
            selectchange(num) {
                let that = this;
                this.infoType = num.flag;
                this.wrdTag = num.infoType;
                this.status = 5;
                this.filterStatus(5);
            },
            filterStatus(status) {
                let that = this;
                that.listData = [];
                that.rowData = null;
                that.pageInfo = {
                    pageSize: 20,
                    page: 1,
                    records: 0
                };
                that.status = status;
                that.is_xzshow = false;
                that.getListData();
            },
            waitopen() {
                this.$notify.info({
                    title: '',
                    message: "正在开发中…敬请期待"
                });
            },
            formatter(row, column) {
                if (row.status == 1) {
                    return "待发布 "
                } else if (row.status == 2) {
                    return "未审批"
                } else if (row.status == 3) {
                    return "已发布"
                } else if (row.status == 4) {
                    return "已撤销 "
                }
            },
            formattermsgStatus(row, column) {
                if (row.msgStatus == 0) {
                    return "失败"
                } else if (row.msgStatus == 1) {
                    return "成功"
                } else if (row.msgStatus == 2) {
                    return "暂存"
                }
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

                this.rowData = row;

            },
            getListData() { //请求数据
                let that = this;
                let token = global.data.getToken();
                if (!token) {
                    return false;
                }
                let _params = {
                    token: token,
                    infoType: this.infoType,
                    page: this.pageInfo.page,
                    pageSize: this.pageInfo.pageSize,
                    sortby: "uptopTime desc,updateTime desc"
                };
                if (this.keyword) {
                    _params.keyword = this.keyword;
                }
                if (this.infoType != 6) {
                    //消息通知需要查所有 6为消息通知
                    _params.status = this.status;
                }
                that.is_loading=true;
                this.$http({
                    method: 'GET',
                    url: global.config.weburl + "api/jwContent/getJWContentList.do",
                    params: _params
                }).then(
                    function(res) {
                        that.is_loading=false;
                        if (res.data.code != 0) {
                            global.tools.handleError(res.data);
                            return;
                        }
                        this.listData = res.data.data;
                        this.pageInfo = res.data.pageInfo;
                        if (res.data.data!=null || res.data.data.length > 0) {
                            that.rowclick(this.listData[0]);
                        } else {
                            that.listData = [];
                            that.rowData = null;
                            console.log("无数据");
                        }
                    },function(error){
                        that.$message({
                            type: 'error',
                            message: "获取数据失败"
                        });
                        setTimeout(() => {
                            that.is_loading=false;
                        }, 1000);
                    }
                );
            },
        },
        created: function() {
            let that = this;
            if (this.path=='/e_wgz') {
                that.infoType= 9;       //知识库管理
                that.wrdTag = '常见问题',
                that.filterStatus(5);
            } else {
                that.filterStatus(5);
            }
        },
        watch: {
            status: function() {
                this.filterStatus(this.status);
            }
        }
}
</script>
<style scoped>
.wrd-page-content{padding-top:10px;}

.cs-wfx-router-groups {
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-flow: row nowrap;
    -webkit-flex-flow: row nowrap;
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
    cursor: pointer;
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

.cs-wrd-link {
    background-image: -webkit-linear-gradient(to left, #505D66, #646E77, #505D66);
    background-image: linear-gradient(to left, #505D66, #646E77, #505D66);
}

.cs-wfx-link-dv .router-link-active {
    background-image: -webkit-linear-gradient(to left, #505D66, #646E77, #505D66);
    background-image: linear-gradient(to left, #505D66, #646E77, #505D66);
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

.cs-wfx-link.item1:before {
    background: #7ccaa2;
}

.cs-wfx-link.item2:before {
    background: #f5705f;
}

.cs-wfx-link.item3:before {
    background: #5eb6ca;
}

.cs-wfx-link.item4:before {
    background: #efbd5e;
}

.cs-wfx-link.item5:before {
    background: #93b1e3;
}

.cs-filter-input {
    width: 200px;
}

.cs-f1{float: left;}

.f2 {
    float: left;
}

.cs-export-box {
    position: relative;
    height: 40px;
    margin-right: 0;
}

.cs-export-radio-box {
    position: relative;
    height: 40px;
    display: table-cell;vertical-align: bottom;
}

.cs-export-box .el-select {
    width: 240px;
    height: 38px;
    line-height: 38px;
}

.cs-button-group {
    float: right;
    color: #275e8b;
}
.f3{float: right;white-space:nowrap; }

.cs-btn-wrd-add {
    margin-bottom: 6px;
    position: relative;
    left: -80px;
    top: 43px;
}

.odivs{
    width: 300px;
    height: 300px;
    margin: 0 auto;
    background: red;
    position: fixed;
    z-index: 2000;

}

</style>
