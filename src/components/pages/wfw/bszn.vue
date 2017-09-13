<template>
    <div class="cs-main-content" v-loading="is_loading">
        <div id="page-content" class="page-content" :style="main_style">
            <div class="ha-topbar-box bszn_topbar" :style="topbar_style">
                <div class="ha-navbar-tools ha-flexend ha-navbar-tools_back">
                    <div class="goback ha-navbar-tools ha-flexend ha-navbar-tools_back">
                        <router-link to="/wfw" class="ha-navbar-goback wsbx_back"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
                    </div>
                    <div class="select-top"><!-- 下拉 -->
                        <div class="select_topbj"> </div>
                        <el-select v-model="default_name" popper-class="wreselect"  @change="selectchange">
                            <el-option
                              v-for="item in subject_items"
                              :key="item.id"
                              :value="item.name">
                            </el-option>
                          </el-select>
                    </div>
                    <!-- 新建类别 -->
                    <el-button class="button-new-tag fl"  @click="showCatelist"><i class="el-icon-edit"></i></el-button>
                    <div class="ha-navbar-radiogroup"> <!-- 发布/未发布 -->
                        <el-radio-group v-model="flag">
                            <el-radio :label="3">已发布</el-radio>
                            <el-radio :label="6">未发布</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="list-right">
                    <div class="cs-searchBox"><!-- 搜索 -->
                        <ha-search icon v-model="keyword" placeholder="事项名称" @keyupEnter="sousuo" @icon-click="sousuo"></ha-search>
                    </div>
                   <!--  新增 -->
                    <el-button :disabled="isadd||alldatas" @click="addContent">
                        <i class="el-icon-edit"></i> 新增
                    </el-button>
                </div>
            </div>
            <div class="el-row cs-contBox" :style="content_sytle">
                <div class="onlyOneClass">
                    <div class="cs-list-table">
                        <!-- 列表 -->
                        <el-table highlight-current-row :data="multipleSelection" :height="tableheigth" border style="width: 100%" @row-click="rowClick">
                            <el-table-column label="序号" width="65">
                                <template scope="scope">{{ 1+scope.$index+(currentPage-1)*page_size}}</template>
                            </el-table-column>
                            <el-table-column prop="title" label="事项名称" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="statusName" width="100" label="发布状态">
                            </el-table-column>
                            <el-table-column prop="createName" width="100"  label="发布人">
                            </el-table-column>
                            <el-table-column label="最后一次更新时间" width="160">
                                <template scope="scope">
                                    {{scope.row.updateTime|moment}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="updaterName" width="100" label="更改人">
                            </el-table-column>
                            <el-table-column label="操作" width="200">
                                <template scope="scope">
                                    <el-button v-if="scope.row.status !=3 " @click.stop="releaseClick(scope.$index, scope.row)" type="text" size="small">发布</el-button>
                                    <el-button v-if="scope.row.status !=1&&scope.row.status !=4 " v-on:click.stop="downClick(scope.$index, scope.row)" type="text" size="small">撤下</el-button>
                                    <el-button v-on:click.stop="updateClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                                    <el-button @click.stop="deleteClick(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <div class="cs-footer-page">
                            <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 50]"
                            :page-size="page_size" :total="records" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" >
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <!--  <div class="el-dialog__wrapper csf_bszn_el-dialog__wrapper" v-if="is_show_update"> -->
                <el-dialog  v-model="is_show_update" class=" csf_bszn_el-dialog__wrapper">
                    <bsznupdatecomponent style="z-index: 3;"  :isbin="isbin" ref="bsznupdatecomponent" :isClickrow="isClickrow" :mapHeight="mapHeight" :is_show_update="is_show_update" :selectRowData="selectRowData" @clearSelectRowData="clearSelectRowData" @hideUpdateModel="hideUpdateModel"
                    @change_records="change_records"
                    @getContentList="getContentList" ></bsznupdatecomponent>
                </el-dialog>
              <!--   </div> -->
            </div>
        </div>
        <div >
            <catecomponent ref="catecomponent" v-if="is_show_catelist" :subject_items="subject_items" :is_show_catelist="is_show_catelist" @hideCatedialog="hideCatedialog" @changeCateList="changeCateList"></catecomponent>
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
            default_name:'全部',
            caterecords:'',
            isadd:true,
            alldatas:false,
            is_loading: false,
            mapHeight: {
                type: Number,
                default: 600
            },
            isClickrow: false,
            twoClass: 'el-col-md-12',
            onlyOneClass: 'el-col el-col-24 el-col-xs-24',
            keyword: "",
            isbin: false,
            cur_subject_id: null,
            cur_subject_name: "",
            flag:3,
            is_show_update: false,
            is_mems: false,
            is_show_catelist: false, //展示列表弹出
            selectRowData: {},
            tableData: [],
            currentPage: 1,
            page_size: 20,
            records: 0, //数据总数
            multipleSelection: [], //办事指南列表
            subject_items: [], //办事指南类别列表
            subject_itemstz: [], //办事指南类别列表
            catename: '',
            cateid: null,
            input: '',
            edit_cate: "",
            isTag_selected: false,
            cur_tag:{},
            statisticsall:{
                name:'全部',
                id:'',
                total:''
            },
        }
    },  
    components: {
        bsznupdatecomponent: function(resolve, reject) {
            require(['./update.vue'], resolve)
        },
        catecomponent: function(resolve, reject) {
            require(['./catelist.vue'], resolve)
        }
    },
    methods: {
        selectchange(cate){
            for(let i=0;i<this.subject_items.length;i++){
                if(cate==this.subject_items[i].name){
                    if(this.subject_items[i]){
                        this.filterSubject(this.subject_items[i])
                    }else{
                      this.alldata();  
                    }
                }
            }
        },
        closeAddTag() {
            this.catename = "";
        },
        showInput() {
            this.$nextTick(_ => {
                this.$refs.saveTagInput.focus();
            });
        },
        doUpdateDate(token) { //更新办事指南
            let that = this;
            this.$http.post(global.config.weburl + "api/sysSubject/updateSysSubject.do", {
                    token: token,
                    name: that.catename,
                    id: that.cateid
                })
                .then(
                    function(res) {
                        if (res.data.code == 0) {
                            that.cateid = null;
                            that.catename = "";
                            that.getCateList();
                            //that.tatalcount+=1;
                        } else {
                            global.tools.handleError(res.data);
                            that.catename = "";
                        }
                    });
        },
        doSaveDate(token) {
            let that = this;
            this.$http.post(global.config.weburl + "api/sysSubject/addSysSubject.do", {
                    token: token,
                    name: that.catename,
                    isUseable: 1,
                    isComment: 1
                })
                .then(
                    function(res) {
                        if (res.data.code == 0) {
                            that.cateid = null;
                            that.getCateList();

                            that.subject_items.push(this.catename);
                            //that.tatalcount+=1;
                        } else {
                            global.tools.handleError(res.data);
                        }
                        that.catename = "";
                    });
        },
        saveData() { //保存
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if (!this.catename) {
                this.$message({
                    type: 'error',
                    message: "请输入类别名称"
                });
                return false;
            }
            if (this.catename && this.catename.length > 30) {
                this.$message({
                    type: 'error',
                    message: "请输入类别名称不超过30个字"
                });
                return false
            }
            if (this.cateid) {
                that.doUpdateDate(token);
            } else {
                that.doSaveDate(token);
            }
        },
        deleteCate(index, tag) { //删除某个分类
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            that.$confirm('是否确认删除《' + tag.name + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((ref) => {
                if (ref) {
                    this.$http.post(global.config.weburl + "api/sysSubject/deleteSysSubject.do", {
                            token: token,
                            id: index
                        })
                        .then(
                            function(res) {
                                if (res.data.code == 0) {
                                    that.getCateList();
                                    that.cateid = null;
                                    that.catename = "";
                                    that.isShowEditBox = false;
                                    that.$message({
                                        type: 'success',
                                        message: "删除办事指南类别成功"
                                    });
                                    //that.subject_items.splice(this.subject_items.indexOf(tag), 1);

                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                        );
                }
            })
        },
        alldata() { //请求全部数据
            console.log("alldata")
            this.cur_subject_id = "";
            this.getContentList();
            this.alldatas=true;
            this.isTag_selected='';
        },
        handleInputConfirm() { //新建类别
            let that = this;
            //that.catename = that.catename.trim();
            
            if (that.catename == "") {
                this.$message({
                    type: 'error',
                    message: "请正确输入类别名称"
                });
                return false
            } else if (that.catename.length > 7) {
                this.$message({
                    type: 'error',
                    message: "请输入类别名称不超过7个字"
                });
                that.catename = "";
                return false
            } else {
                that.saveData();
            }
        },
        handleInputTag(item, index) { //修改类别名称
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            that.edit_cate=that.edit_cate.replace(/\s+/g,"");
            that.edit_cate = that.edit_cate.trim();
            if (that.edit_cate == "") {
                this.$message({
                    type: 'error',
                    message: "请正确输入类别名称"
                });
                return false
            } else if (that.edit_cate.length > 7) {
                this.$message({
                    type: 'error',
                    message: "请输入类别名称不超过7个字"
                });
                that.edit_cate = "";
                return false
            } else {
                that.cateid = index;
                that.catename = that.edit_cate;
                this.doUpdateDate(token);
                let _item = item;
                _item.is_edit = false;
            }
        },
        tuozhan() { //展开类别框
            var that = this;
            this.is_mems = !this.is_mems;
        },
        rearrange(item) { //关闭展开
            console.log(item)
            let _delobj = item;
            for (let i = 0; i < this.subject_items.length; i++) {
                if (this.subject_items[i].id === item.id) {
                    _delobj = this.subject_items.splice(i, 1)[0];
                    break;
                }
            }
            this.subject_items.splice(1,0,_delobj);
        },
        clearSelectRowData(flag) {
            this.is_show_update = false;
            this.selectRowData = {};
            this.getCateList(true);
            this.filterTag(flag);
        },
        showCatelist() {
            this.is_show_catelist = true;
        },
        hideCatedialog() {
            this.is_show_catelist = false;
        },
        changeCateList() {
            this.getCateList();
            //this.subject_items = items;
        },
        refreshCateList(item) {
            if (this.alldatas) {
                this.getContentList();
            } else {
                this.filterSubject(item)
            }
        },
        filterSubject(item) { //点击某个分类
            // this.rearrange(item);
            this.cur_tag = item;        //当前选中的类别
            this.alldatas=false;
            this.cur_subject_id = item.id;
            this.cur_subject_name = item.name;
            this.keyword = "";
            this.isTag_selected = item.id;
            this.getContentList();
        },
        filterTag(type) { //选择某类别
            this.flag = type;
            this.getContentList();
        },
        sousuo() { //搜索
            this.currentPage = 1;
            this.getContentList();
        },
        handleSizeChange(val) {
            this.page_size = val;
            this.getContentList();
            //console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getContentList();
            //console.log(`当前页: ${val}`);
        },
        jsleng(type) {
            var that = this;
            let olength = 0;
            for (var numi = 0; numi < type.length; numi++) {
                olength += type[numi].name.length + 40;
                if (olength > (that.tabwidth)) {
                    numi = numi - 1;
                    return false;
                }
            }
        },
        getCateList(isRefreshTagSelectd) { //查询办事指南分类
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            this.$http.post(global.config.weburl + "api/sysSubject/querySysSubjectList.do", {
                    token: token,
                    page: that.currentPage,
                    pageSize: 100
                })
                .then(
                    function(res) {
                        if (res.data.code == 0) {
                            var _data = res.data;
                            that.subject_items = _data.data;
                            that.subject_items.unshift(that.statisticsall)
                            this.tatalcounts();
                            if (isRefreshTagSelectd) {
                                that.refreshCateList(that.cur_tag);
                                that.isadd=false;
                            } else {
                                that.cur_tag = {};
                                if (that.subject_items[0]) {
                                    that.refreshCateList(that.subject_items[0])
                                    that.isadd=false;
                                }else{
                                    that.isadd=true;
                                }
                            }
                        } else {
                            global.tools.handleError(res.data);
                        }
                    }
                );
        },
        getContentList() { //请求列表数据
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            this.is_loading = true;
            this.$http.post(global.config.weburl + "api/jwContent/queryJWContentList.do", {
                token: token,
                sysSubjectId: that.cur_subject_id,
                status: that.flag,
                page: that.currentPage,
                pageSize: that.page_size,
                keyword: that.keyword,
                sortby: "update_time desc"
            }).then(
                function(res) {
                    that.is_loading = false;
                    if (res.data.code == 0) {
                        var _data = res.data;
                        that.multipleSelection = _data.data;
                        if (that.multipleSelection.length) {
                            that.selectRowData = that.multipleSelection[0];
                        }
                        that.records = _data.pageInfo.records;
                    } else {
                        global.tools.handleError(res.data);
                    }
                },
                function(error) {
                    that.$message({
                        type: 'error',
                        message: "获取数据失败"
                    });
                    setTimeout(() => {
                        that.is_loading = false;
                    }, 1000);
                }
            );
        },
        addContent() {  //新增
            this.isClickrow = false;
            this.isbin = true;
            this.is_show_update = true;
            this.selectRowData = {
                subjectId: this.cur_subject_id
            };
        },
        releaseClick(index, row) { //发布办事指南
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let that = this;
            that.$confirm('是否确认发布《' + row.title + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((ref) => {
                if (ref) {
                    this.$http.post(global.config.weburl + "api/jwContent/publishJWContent.do", {
                            token: token,
                            id: row.id
                        })
                        .then(
                            function(res) {
                                if (res.data.code == 0) {
                                    that.$message({
                                        type: 'success',
                                        message: '发布成功!'
                                    });
                                    this.filterTag(3);
                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                        );
                }
            })
        },
        downClick(index, row) { //撤下办事指南
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let that = this;
            this.$confirm('是否确认撤下《' + row.title + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((ref) => {
                if (ref) {
                    //this.tableData.splice(index,1);
                    this.$http.post(global.config.weburl + "api/jwContent/removeJWContent.do", {
                            token: token,
                            id: row.id
                        })
                        .then(
                            function(res) {
                                if (res.data.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '撤下成功!'
                                    })
                                    this.filterTag(6);
                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                        );
                }
            })
        },
        updateClick(index, row) { //更新
            this.isClickrow = false;
            this.isbin = true;
            this.selectRowData = row;
            this.is_show_update = true;
        },
        rowClick(row) { //点击某行
            this.isClickrow = true;
            this.isbin = false;
            this.is_show_update = true;
            this.selectRowData = row;
        },
        deleteClick(index, row) { //删除分类下某条数据
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            this.$confirm('是否确认删除《' + row.title + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((ref) => {
                if (ref) {
                    this.$http.post(global.config.weburl + "api/jwContent/deleteJWContent.do", {
                            token: token,
                            id: row.id
                        })
                        .then(
                            function(res) {
                                if (res.data.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除办事指南成功!'
                                    })
                                    that.getCateList(true);
                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                        );

                }
            })
        },
        addListener() {
            const that = this;
            const Bus = global.eventHub;
        },
        hideUpdateModel() {
            this.is_show_update = false;
            this.isClickrow = false;
        },
        change_records(){
            this.selectRowData={};
        },
        removeListener() {
            const that = this;
            const Bus = global.eventHub;
        },
        tatalcounts() {  //统计总数
            let that = this;
            let tatalcount=0;  //single
            let untatalcount=0;  //all
            let publishedCount=0;  //single
            let unPublishedCount=0;  //single
            for(let i=0;i<that.subject_items.length;i++){
                if(that.subject_items[i].id){
                    unPublishedCount=(that.subject_items[i].unPublishedCount)*1;
                    publishedCount=(that.subject_items[i].publishedCount)*1
                    tatalcount=unPublishedCount+publishedCount;
                    untatalcount+=tatalcount*1;
                    that.subject_items[i].name=that.subject_items[i].name+"  ("+tatalcount+")";
                }
            }
            that.subject_items[0].name="全部";
            that.subject_items[0].name=that.subject_items[0].name+"  ("+untatalcount+")";
        }
    },
    computed: {
        tableheigth() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight
        },
        tabwidth() {
            let _width = this.$store.getters.getPageInfos.main_width - 140;
            return _width
        },
        tatalcount() {
            let that = this;
            let tatalunPublishedCount=0;
            let tatalpublishedCount=0;
            let tatalcount;
            let untatalcount;
            let publishedCount;
            let unPublishedCount;
            for(var i=0;i<that.subject_items.length;i++){
                tatalunPublishedCount+=(that.subject_items[i].unPublishedCount)*1;
                unPublishedCount=(that.subject_items[i].unPublishedCount)*1;
                tatalpublishedCount+=(that.subject_items[i].publishedCount)*1;
                publishedCount=(that.subject_items[i].publishedCount)*1
                tatalcount=unPublishedCount+publishedCount;

                // that.subject_items[i].push(tatalcount)
            }
            untatalcount=tatalunPublishedCount+tatalpublishedCount;
            console.log(that.subject_items)
        }
    },
    created: function() {
        let that = this;
        this.getCateList();
    },
    watch: {
        flag: function() {
            this.currentPage = 1;
            this.page_size = 20;
            this.getContentList();
        }
    }
}
</script>
<style lang="less">
    .cs-main-content {
        .bszn_topbar{
           button {
                background: #3c6588;
                border: 0;
                color: #fff;
            } 
            .list-right{
                margin-bottom: 6px;
                display: flex;
            }

        }
        
        .page-content {
            padding: 0;
            .goback{padding-top: 3%;}
        }
        .wsbx_back{margin-right: 38px;}
        .button-new-tag{margin-right: 18px;margin-bottom: 5px;}
    }

    .cs-main-content {
        .cs-contBox {
            border: 1px solid #275e8b;
            background: rgba(39, 94, 139, 0.3);
            padding: 10px;
            position: relative;
            .cs-bszn-topcate {
                z-index: 2;
                width: 100%;
                min-height: 70px;
                padding: 10px 15px;
                background: rgba(40, 87, 129, 0.9);
                .el-tag {
                    .active {
                        background: #5d94c3!important;
                    }
                }
                .cs-tags-box {
                    position: relative;
                    span {
                        color: #fff;
                    }
                    .clear {
                        button {
                            background: #3c6588;
                            border: 0;
                            color: #fff;
                            span {
                                font-weight: 600;
                            }
                        }
                        .active {
                            background: #5d94c3;
                            span {
                                background: #5d94c3;
                                margin: 0;
                            }
                        }
                        span {
                            background: #3c6588;
                            margin-bottom: 12px;
                            color: #fff;
                            span {
                                margin: 0;
                            }
                            input {
                                background: #3c6588;
                            }
                        }
                    }
                    .els-icon {
                        cursor: pointer;
                        position: absolute;
                        right: 0px;
                        top: 5px;
                        font-size: 10px;
                        .el-icon-d-arrow-left {
                            transform: rotate(90deg);
                            -ms-transform: rotate(90deg);
                            /* IE 9 */
                            -moz-transform: rotate(90deg);
                            /* Firefox */
                            -webkit-transform: rotate(90deg);
                            /* Safari 和 Chrome */
                            -o-transform: rotate(90deg);
                            /* Opera */
                        }
                        .el-icon-d-arrow-right {
                            transform: rotate(90deg);
                            -ms-transform: rotate(90deg);
                            /* IE 9 */
                            -moz-transform: rotate(90deg);
                            /* Firefox */
                            -webkit-transform: rotate(90deg);
                            /* Safari 和 Chrome */
                            -o-transform: rotate(90deg);
                            /* Opera */
                        }
                    }
                }
            }
            .onlyOneClass {
                z-index: 1;
                .cs-filter-box {
                    nowrap: nowrap;
                    button {
                        float: right;
                    }
                    .el-radio-group {
                        .el-radio {
                            .el-radio__label {
                                color: #fff;
                            }
                        }
                    }
                    .cs-searchBox {
                        background: rgba(39, 94, 139, 0.3);
                        i {
                            margin-top: 18px;
                        }
                        input {
                            float: right;
                            background: rgba(39, 94, 139, 0.3);
                            border: 1px solid #4092bb;
                        }
                    }
                    .el-button--default {
                        background: #275e8b;
                        border: 1px solid #275e8b;
                        color: #fff;
                    }
                }
            }
            .csf_bszn_el-dialog__wrapper{
                .el-dialog--small{border: 0;}
                .el-dialog__body{
                    background: rgba(0, 0, 0, 0.8);
                }
            }
        }
    }

    .cs-btn-edit-subject {
        width: 36px;
        height: 36px;
        margin-left: 20px;
    }

    .css-bszn-rek {
        line-height: 36px;
        font-size: 14px;
        color: #8d8d8d;
        position: absolute;
        left: 0;
    }

    .cs-bszn-topcate .el-button {
        margin: 5px 8px 0 0;
    }

    .cs-bszn-topcate .el-tag {
        background: #e4e4e4;
        color: #777;
        margin-right: 8px;
        margin-top: 5px;
    }

    .cs-bszn-topcate .but ton-new-tag {
        font-size: 20px;
        padding: 0;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        border: none;
        background: #c9c9c9;
        color: #fff;
        margin-right: 8px;
    }

    .cs-bszn-topcate .el-icon-search {
        font-size: 20px;
    }

    .cs-tags-box {
        margin-top: 10px;
        position: relative;
        padding-left: 96px;
    }

    .cs-bszn-topcate .input-new-tag {
        width: 105px;
    }

    .el-tag {
        height: auto;
        padding: 2px 3px;
    }

    .el-tag .el-icon-edit {
        font-size: 10px;
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        -ms-transform: scale(.75, .75);
        transform: scale(.75, .75);
        height: 18px;
        width: 18px;
        line-height: 18px;
        vertical-align: middle;
        right: -2px;
    }

    .el-tag .el-icon-edit,
    .el-tag .el-icon-close {
        color: #b6b6b6;
        top: 3px;
    }

    .el-tag .el-icon-edit:hover,
    .el-tag .el-icon-close:hover {
        color: #666;
        background: none;
    }

    .el-tag .el-input__inner {
        border: none;
        display: inline-block;
        width: auto;
        height: 22px;
        max-width: 105px;
    }

    .el-tag .name {
        cursor: pointer;
    }

    .el-tag.active {
        background: #20a0ff;
    }

    .el-tag.active .name,
    .el-tag.active .el-icon-edit,
    .el-tag.active .el-icon-close {
        color: #fff
    }
    .actives{background: #5d94c3!important;}
    .actives span{background: #5d94c3!important;}
    .cs-all {
        float: left;
        border-radius: 4px;
        height: 28px
    }
    .mintopcate{position: absolute;margin-right: 10px;}
    .maxtopcate{max-height: 70px;overflow: hidden;}
</style>
