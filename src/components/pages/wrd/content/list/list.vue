<template>
    <div class="cs-wrd-container" v-loading="is_loading" :style="main_style">
        <div class="ha-topbar-box" :style="topbar_style">
            <div class="ha_left">
                <div class="ha-navbar-radiogroup">
                    <button class="ha-navbar-goback" @click="goback"><i class="el-icon-arrow-left"></i><span>返回</span></button>
                </div>
                <div  :class="[infoType==6 ? 'infosix':'','ha-navbar-tools' ,'cs-f1']" >
                    <div class="select-top" v-if = "infoType != 9">
                        <div class="select_topbj"></div>
                        <el-select  v-model="selvalue" class="f2" popper-class="wreselect" @change="selectchange">
                            <el-option v-for="item in arr" :key="item.id" :label="item.infoType" :value="item"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-radio-group v-model="status" class="cs-button-group" v-if="infoType != 6">
                        <el-radio :label="3">已发布</el-radio>
                        <el-radio :label="6">未发布</el-radio>
                    </el-radio-group>
            </div>
            <div class="ha_right">
                <div class="ha-navbar-searchbox list_f3">
                    <ha-search icon v-model="keyword" :placeholder="infoType == 9?'问题名称':'标题名称'" @keyupEnter="onEnter" @icon-click="onEnter"></ha-search>
                    
                </div>
                <el-button type="primary" class="f2 cs-button cs-btn-wrd-add" v-on:click="add()"><img src="/static/img/audio/xinzeng.png" alt="">新增</el-button>
            </div>
        </div>

        <div class="page-content main-content" :style="content_sytle">
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
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[10, 20 ,30 ,50]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.records"></el-pagination>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <tbcomponent ref="tbcomponent" :selectRowData="rowData" :status="status"  @filterTag="filterStatus" :is_publish="is_publish"></tbcomponent>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- <el-dialog  v-model="is_xzshow" class="xzeng"> -->
            <xzfzpcomponent  v-if="is_xzshow" :numflag="infoType" :wrdTag="wrdTag" @filterTag="filterStatus" @close_add="close_add" @is_yulanTag="is_yulanTag" :is_yulan="is_yulan"></xzfzpcomponent>
        <!-- </el-dialog> -->
    </div>
</template>
<script>
    import list_js from './list.js';
    export default list_js;
</script>

<style scope>
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
    
    .list_f3{
        float: right;
        margin-right: 10px;
        margin-bottom: 5px;
    }

    .cs-filter-input {
        width: 200px;
    }

    .cs-f1 {
        float: left;
    }
    .infosix{
        margin-left: -1%!important;
    }

    .cs-export-box {
        position: relative;
        height: 40px;
        margin-right: 0;
    }

    .cs-export-radio-box {
        position: relative;
        height: 40px;
        display: table-cell;
        vertical-align: bottom;
    }

    .cs-export-box .el-select {
        width: 240px;
        height: 38px;
        line-height: 38px;
    }
    .el-select{margin-right: 20px;}
    .cs-button-group {
        float: right;
        margin-bottom: 5px;
    }
    .cs-btn-wrd-add {
        border-radius: 2px;
        width: 83px;
        height: 38px;
        margin-bottom: 5px;
    }
    /* .ha-search{width: 40px;} */
    .cs-btn-wrd-add span img{
        margin-right: 13px;
    }
    .odivs {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        background: red;
        position: fixed;
        z-index: 2000;
    }
</style>
