import mystyle from '../../../../../util/vue/style';
export default{
    name: 'wrd-content-list',
    mixins: [mystyle],
    data() {
        return {
            is_loading: false,
            is_yulan:false,
            selvalue: "警情通报",
            infoType: 1, //信息类别编号
            status: 3, //发布状态
            keyword: '', //查询关键字，按标题模糊查询
            listHeight: '',
            is_publish:false,
            mianStyle: {},
            arr: [
                {
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
            path: this.$router.apps[0]._route.fullPath
        }
    },
    components: {
        xzfzpcomponent: function (resolve, reject) {
            require(['../add/add.vue'], resolve)
        },
        tbcomponent: function (resolve, reject) {
            require(['../detail/detail.vue'], resolve)
        },
        jectcomponent: function (resolve, reject) {
            require(['../object/object.vue'], resolve)
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
            if (this.status == 3 ) {
                this.filterStatus(3);
            } else {
                //状态改变有监听没有必要执行两次
                this.status = 3;
            }
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
            if (status) {
                that.status = status;
            }
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
        add: function () { //新增
            this.is_xzshow = true;
        },
        close_add: function () {
            this.is_xzshow = false;
        },
        is_yulanTag(){
            this.is_yulan=!this.is_yulan;
        },
        onEnter: function () { //搜索
            this.getListData();
        },
        rowclick: function (row) { //点击某一行
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
            that.is_loading = true;
            this.$http({
                method: 'GET',
                url: global.config.weburl + "api/jwContent/getJWContentList.do",
                params: _params
            }).then(
                function (res) {
                    that.is_loading = false;
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
                    }
                }, function (error) {
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
    },
    created: function () {
        let that = this;
        if (this.path == '/wgz/e_wgz') {
            that.infoType = 9;       //知识库管理
            that.wrdTag = '常见问题',
            that.filterStatus(3);
        } else {
            that.filterStatus(3);
        }
        var Bus = global.eventHub;
        Bus.$on('changePublish', function(isPublish) {
            that.is_publish=isPublish;
        });
    },
    watch: {
        status: function () {
            this.filterStatus(this.status);
        },
        is_xzshow:function(){
            this.is_yulan=false;
        }
    }
}