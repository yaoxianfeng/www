import mystyle from '../../../../../util/vue/style';
export default {
    name: 'wrd-content-detail',
    mixins: [mystyle],
    props: {
        selectRowData: {},
        status: null,
        infoT:null,
        is_publish:null
    },
    data: function() {
        return {
            editing: false,
            isobject:false,
            yulan_type:true,
            wrdTag: '',
            objsnama:'',
            title: '',
            summaryImg: "",
            is_object: false,
            keyword: '',
            is_show_readUsers: false,
            Editcontent: "",
            is_rowdata_null: true,
            is_tkshow: false,
            para: {},
            Edit_id: "wenben",
            updialog: false,
            commname: "",
            is_yulan: false,
            iso_publish:null,
            yl_value: {},
            confrom: 1,
            Auth: 1, //1已发布, 2未发布
            updatenum: 0,
            lyform: 1,
            communityId: '',
            ruleForm: {
                title: '',
                content: '',
                object: ''
            }
        }
    },
    components: {
        yulancomponent: function(resolve, reject) {
            require(['../../../../common/yulan/yulan.vue'], resolve)
        },
        editcomponent: function(resolve, reject) {
            require(['../../../../common/Edit/Edit.vue'], resolve)
        },
        jectcomponent: function(resolve, reject) {
            require(['../object/addobject.vue'], resolve)
        },
        objectcomponent: function(resolve, reject) {
            require(['../object/object.vue'], resolve)
        }
    },
    methods: {
        gofilterStatus(status){
            this.$emit('filterTag',status);
        },
        zsobject(){//显示所有发送对象
            this.isobject=true;
        },
        zhiding(type) { //置顶
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _params = {
                token: token,
                infoType: this.selectRowData.infoType,
                id: this.selectRowData.id,
                isTop: type,
                uptopDays: this.updatenum
            }
            this.$http.post(global.config.weburl + 'api/jwContent/modifyJWContent.do',
             _params).then(function(res) {
                if (res.data.code == 0) {
                    if (type == 1) {
                        this.$message('置顶成功');
                    } else {
                        this.$message('取消置顶成功');
                    }
                    this.$emit('filterTag', 3);
                    this.updateEdit(false);
                } else {
                    global.tools.handleError(res.data);
                }
            })

        },
        editdata(msg) {
            this.Editcontent = msg;
            this.yl_value = {
                title: this.title,
                name: global.data.getUserInfo().dept.name,
                massage: this.Editcontent
            }
        },
        titledata() {
            this.yl_value = {
                title: this.title,
                name: global.data.getUserInfo().dept.name,
                massage: this.Editcontent
            }
        },
        updateAuth: function(type) { // 预览 撤下 编辑 删除 置顶 发布
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            this.is_yulan = false;
            this.is_object=false;

            if (type == 0) { //预览
                this.is_yulan = true;
                this.is_object=false;
                this.yl_value = {
                    title: this.title,
                    name: global.data.getUserInfo().dept.name,
                    massage: this.Editcontent
                }
            } else if (type == 1) { //撤下
                if (!this.selectRowData || !this.selectRowData.id) {
                    this.$message("请选择要撤下的信息")
                    return false;
                }
                var that=this;
                let _para = {
                    button: "撤下",
                    tips: '是否确认撤下《' + this.title + '》？',
                    message: '撤下成功后该操作将立即生效，请确认是否撤下《' + this.title + '》？',
                    _param : {
                        token: token,
                        infoType: this.selectRowData.infoType,
                        id: this.selectRowData.id,
                        status: 4,
                        isTop: 0,
                        oid:6
                    },
                    url: "api/jwContent/modifyJWContent.do"
                }
                that.makeSure(_para);
            } else if (type == 2) { //编辑
                this.Auth = 3;
                this.editing=true;
                this.updateEdit(true);
            } else if (type == 3) { //删除
                if (!this.selectRowData.id) {
                    this.$message("请选择要删除的信息")
                    return false;
                }
                var that=this;
                let _para = {
                    button: "删除",
                    tips: '是否确认删除《' + this.title + '》？',
                    message: '删除成功后该操作将立即生效，请确认是否删除《' + this.title + '》？',
                    _param : {
                        token: token,
                        infoType: this.selectRowData.infoType,
                        id: this.selectRowData.id
                    },
                    url: "api/jwContent/deleteJWContent.do"
                }
                that.makeSure(_para);
            } else if (type == 4) { //置顶&取消置顶
                if(this.selectRowData.uptopTime){
                    this.docanceltop();
                }else {
                    this.dotop();
                }
            } else if (type == 5) { //保存
                if (global.tools.isNullString(this.title)|| global.tools.isNullString(this.Editcontent)) {
                    this.$message({
                        type: 'warning',
                        message: '标题和内容不能为空'
                    });
                    return false;
                }
                if (this.is_need_upload && !this.summaryImg) {
                    this.$message({
                        type: 'warning',
                        message: '请上传列表缩略图'
                    });
                    return false;
                }
                if (this.is_need_object && !this.communityId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择发布对象'
                    });
                    return false;
                }
                var that=this;
                let _para = {
                    button: "保存",
                    tips: '是否确认保存《' + this.title + '》？',
                    message: '保存成功后该操作将立即生效，请确认是否保存《' + this.title + '》？',
                    _param : {
                        token: token,
                        infoType: this.selectRowData.infoType,
                        status: 1,
                        id: this.selectRowData.id,
                        title : this.title,
                        content : this.Editcontent,
                        summaryImg : this.summaryImg,
                        communityIds : this.communityId,
                        oid:6
                    },
                    url: "api/jwContent/modifyJWContent.do"
                }
                that.makeSure(_para);
            } else if (type == 6) { //发布
                let that = this;
                var Bus = global.eventHub;
                Bus.$emit('changePublish',true);
                that.iso_publish=true;
                this.is_object=false;
                if (global.tools.isNullString(this.title)|| global.tools.isNullString(this.Editcontent)) {
                    this.$message({
                        type: 'warning',
                        message: '标题和内容不能为空!'
                    });
                    return false;
                }
                if (this.is_need_upload && !this.summaryImg) {
                    this.$message({
                        type: 'warning',
                        message: '请上传列表缩略图!'
                    });
                    return false;
                }
                if (this.is_need_object && !this.communityId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择发布对象'
                    });
                    return false;
                }

                var that=this;
                let _para = {
                    button: "发布",
                    tips: "是否确认发布《" + this.title + "》？",
                    message: "发布成功后该操作将立即生效，请确认是否发布《" + this.title + "》？",
                    _param : {
                        token: token,
                        id: this.selectRowData.id,
                        infoType: this.selectRowData.infoType,
                        status: 3,
                        directPublish: 1,
                        title : this.title,
                        content : this.Editcontent,
                        summaryImg : this.summaryImg,
                        communityIds : this.communityId,
                        oid:3
                    },
                    url: "api/jwContent/modifyJWContent.do"
                }
                that.makeSure(_para);
            } else if (type == 7) { //重新发送
                var that=this;
                let _para = {
                    button: "重新发送",
                    tips: "是否确认重新发送《" + this.title + "》？",
                    message: "重新发送成功后该操作将立即生效，请确认是否重新发送《" + this.title + "》？",
                    _param : {
                        token: token,
                        id: this.selectRowData.id,
                        infoType: this.selectRowData.infoType,
                        status: 3,
                        directPublish: 10,
                        title : this.title,
                        content : this.Editcontent,
                        summaryImg : this.summaryImg,
                        communityIds : this.communityId
                    },
                    url: "api/jwContent/resentPushMsg.do"
                }
                that.makeSure(_para);
            } else if (type == 8) { //消息编辑
                this.Auth = 7;
                this.editing=true;
                this.updateEdit(true);
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

                        console.log("_content._param.oid:" + _content._param.oid);

                        that.$emit("filterTag", _content._param.oid);
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
        dotop:function (){  //置顶
            if(this.selectRowData.infoType != 9) {
                this.$prompt('请输入置顶天数', '设为置顶', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: '7',
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
                }).then(
                    ({value}) => {
                        value = Math.floor(value);

                        if (!(value % 1 === 0)) {
                            this.$message("请输入一个0到30之间的一个整数");
                            return false;
                        }
                        if (value > 30 || value < 1) {
                            this.$message({
                                type: 'warning',
                                message: '置顶时间为1到30天'
                            })
                            return false;
                        }

                        this.updatenum = value;
                        this.zhiding(1)
                    }
                ).catch(function(error){

                });
            }else{
                this.$confirm('是否确认置顶《' + this.title + '》？', '置顶', {
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
                }).then(action  => {

                    this.zhiding(1)
                }).catch(function(error){

                });
            }
        },
        docanceltop:function (){  //取消置顶
            if(this.selectRowData.infoType != 9) {
                this.$confirm('剩余置顶天数为' + this.selectRowData.uptopDays + ', 是否确定取消置顶？', '取消置顶', {
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
                }).then((ref) => {
                    this.zhiding(0)
                }).catch(function(error){

                });
            }else {
                this.$confirm( '是否确定取消置顶《' + this.title + '》？','取消置顶', {
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
                }).then((ref) => {
                    this.zhiding(0)
                }).catch(function(error){

                });
            }
        },
        handleAvatarScucess(res, file) {
            if (res.code == 0) {
                //this.imageUrl = global.config.imgbaseurl+res.data
                this.summaryImg = res.data;
            } else {
                global.tools.handleError(res.data)
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.warning('上传的列表缩略图只能是 JPG 格式!');
                return false;
            }
            if (!isLt2M) {
                this.$message.warning('上传的列表缩略图大小不能超过 1MB!');
                return false;
            }
            return isJPG && isLt2M;
        },
        chooseObject() {
            if (this.selectRowData.id) {
                this.is_object = true;
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择要发送的对象'
                })
            }
        },
        cancelChoose() {
            this.is_object = false;
        },
        addChooseObject(data) {
            let _obj = data.data;
            this.addobject(_obj);
        },
        addobject(obj) {
            this.objsnama=obj;
            let tyid = [];
            let tyname = [];
            for (let i = 0; i < obj.length; i++) {
                tyid.push(obj[i].id);
                tyname.push(obj[i].name);
            }
            this.communityId = tyid.join(",");
            this.commname = tyname.join(" ");
            this.is_object = false;
        },
        viewAllReadUsers() { //查看所有已读人员
            this.is_show_readUsers = true;
        },
        initRowData() {
            if (this.selectRowData) {
                this.is_yulan=false;
                this.is_rowdata_null = false;
                this.title = this.selectRowData.title;
                this.summaryImg = this.selectRowData.summaryImg;
                let _odept = this.selectRowData.dept;
                this.addobject(_odept);
                this.updateEdit(false);

                //消息通知
                if (this.selectRowData.infoType == 6 && this.selectRowData.msgStatus == 0) {
                    //0失败
                    this.Auth = 4;
                } else if (this.selectRowData.infoType == 6 && this.selectRowData.msgStatus == 1) {
                    // 1成功
                    this.Auth = 5;
                } else if (this.selectRowData.infoType == 6) {
                    //暂存
                    this.Auth = 6;
                } else {
                    if ((this.selectRowData.status == 2 || this.selectRowData.status == 3) && this.selectRowData.infoType != 9) { //已发布
                        this.Auth = 1;
                    } else if((this.selectRowData.status == 2 || this.selectRowData.status == 3) && this.selectRowData.infoType == 9){
                        this.Auth = 9;
                    } else if (this.selectRowData.status == 1 || this.selectRowData.status == 4) { //未发布
                        this.Auth = 2;
                    }

                }
            } else {
                this.is_rowdata_null = true;
            }
        },
        updateEdit(editing) {
            let that = this;
            that.editing = editing;
            if (!editing) {
                if (that.status == 3) { //已发布
                    that.Auth = 1;
                } else if (that.status == 6) { //未发布
                    that.Auth = 2;
                }
            }
        },
    },
    watch: {
        selectRowData: function() {
            this.initRowData();
        },
        is_publish:function(){
                this.iso_publish=this.is_publish
        },

    },
    computed: {
        rightheigth() {
            let _rheight = this.$store.getters.getPageInfos.right_height;
            return {'max-height': _rheight + "px"}
        },
        imgStyle: function() {
            if (this.selectRowData && this.selectRowData.infoType == 3) {
                return {
                    width: "90%"
                }
            }
            return {};
        },
        is_need_upload: function() {
            if (this.selectRowData && this.selectRowData.infoType == 3) {
                return true;
            }
            return false;
        },

        is_need_object: function() {
            if (this.selectRowData && (this.selectRowData.infoType == 6 || this.selectRowData.infoType == 3 || this.selectRowData.infoType == 8)) {
                return true;
            }
            return false;
        },
        is_need_readnum: function() {
            if (this.selectRowData && (this.selectRowData.infoType == 8) && this.status == 3) {
                return true;
            }
            return false;
        },
        is_need_up: function() {
            if (this.selectRowData && (this.selectRowData.infoType == 3 || this.selectRowData.infoType == 2 || this.selectRowData.infoType == 1 || this.selectRowData.infoType == 9)) {
                return true;
            }
            return false;
        },
        uploadurl: function() {
            return global.config.weburl + "file/upload/file.do";
        },
        view_summaryImg: function() {
            if (this.summaryImg && this.summaryImg.indexOf("http") != 0) {
                return global.config.imgbaseurl + this.summaryImg;
            } else {
                return this.summaryImg;
            }
        },
        readUserTitle: function() {
            return "已读人员(" + this.selectRowData.alreadyRead + "/" + this.selectRowData.total + ")";
        },
        editor_style () {
            let _height = this.$store.getters.getPageInfos.right_height - 250;
            return {
                height :_height + "px"
            }
        },

    },
    created: function() {
        var Bus = global.eventHub;
        var that = this;
        Bus.$on("close_yl", function() {
            that.is_yulan = false;
        });
    },
    mounted: function() {
        this.initRowData();
    }

}