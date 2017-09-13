<template>
	<div class="cs-layer szxx_xq" :style="max_Height">
        <div class="cs-szxx-dailog__body">
            <ul class="cs-xin-from cs-szxx-title">
                <li><span>来信人姓名：</span>{{selectRowData.realName}}</li>
                <li><span>联系电话：</span>{{selectRowData.phone}}</li>
                <li><span>来信时间：</span>{{selectRowData.time|moment}}</li>
                <li><span>来信标题：</span> {{selectRowData.title}} </li>
                <li><span>来信内容：</span> {{selectRowData.content}}</li>
            </ul>
            <div class="cs-xin-content cs-szxx-content">
                
                <div class="textarea el-textarea">
                    <label class="label blue">回复内容：</label>
                    <textarea v-model="textarea3" :disabled="selectRowData.status!=2" placeholder="在这里输入回复内容" rows="6" :maxlength="limit" class="el-textarea__inner" @keyup="inlimit()" :style="textHeight"></textarea>
                </div>
                <span class="inlimit" v-if="selectRowData.status==2">{{curr}}/{{limit}}</span>
            </div>
            <div class="goback cs-back">
                <el-button type="primary" @click="backClick()" :disabled="is_button" v-if="selectRowData.status==2 && !this.isreply">回复</el-button>
                <el-button type="primary" @click="cancelOpen()" v-if="selectRowData.open==1 && this.isreply">取消公开</el-button>
                <el-button type="primary" @click="doOpen()" v-if="selectRowData.open==0 && this.isreply">公开</el-button>
                <el-button type="primary" @click="deleteClick()">删除</el-button>
                <div class="gkfb" v-if="selectRowData.status==2" >
                    <el-checkbox v-model="checked">公开发布</el-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default{
	props: {
        selectRowData: {},
    },
    data(){
    	return{
    		textHeight: {
                type: Number,
                default: ''
            },
            limit: '200',
            curr: '0',
            isreply: false,
            checked:false,
            is_button:false,
            textarea3:'',
            para:{},
            is_tkshow: false,
            zIndex : 20141223
    	}
    },
    methods: {
    	backClick() { //留言回复
	        let userinfo = global.data.getUserInfo();
	        let userID = userinfo.id;
	        let that = this;
	        let token = global.data.getToken();
	        if (that.checked == true) {
	            that.open = 1;
	        } else {
	            that.open = 0;
	        }
	        if (!token) {
	            return false;
	        }
	        if (global.tools.isNullString(this.textarea3)) {
	            this.$message({
	                type: 'warning',
	                message: '回复内容不能为空'
	            })
	            return false;
	        }
            this.is_button=true;
            this.$http({
                method: 'POST',
                url: global.config.weburl + "api/msg/reply.do",
                params: {
                    token: token,
                    id: this.selectRowData.id,
                    replyUserId: userID,
                    replyContent: this.textarea3,
                    open:that.open
                }
            }).then(
                function(res) {
                    if (res.data.code == 0) {
                        this.$message('回复成功！');
                        that.$emit("refreshList");
                        this.is_button=false;
                        this.textarea3="";
                    } else {
                        global.tools.handleError(res.data);
                        this.is_button=false;
                    }
                }
            );
        },
	    cancelOpen(){  //取消公开
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _para = {
                button: "取消公开",
                message: "取消公开成功后该操作将立即生效，请确认是否取消公开" + this.selectRowData.realName + "的信件？",
                tips: "",
                _param: {
                    token: token,
                    id: this.selectRowData.id,
                    open:0
                },
                url: "api/msg/open.do"
            };
            this.makeSure(_para);
        },
        doOpen(){ //公开
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _para = {
                button: "公开",
                message: "公开成功后该操作将立即生效，请确认是否公开" + this.selectRowData.realName + "的信件？",
                tips: "",
                _param: {
                    token: token,
                    id: this.selectRowData.id,
                    open:1
                },
                url: "api/msg/open.do"
            };
            this.makeSure(_para);
        },
        deleteClick() { //删除
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _para = {
                button: "删除",
                message: "删除成功后该操作将立即生效，请确认是否删除" + this.selectRowData.realName + "的信件？",
                    tips: "",
                    _param: {
                        token: token,
                        id: this.selectRowData.id
                },
                url: "api/msg/delete.do"
            };
            this.makeSure(_para);
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
                            that.$emit("refreshList");
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
            }
    },
    watch: {
        selectRowData: function(){
            if(this.selectRowData.replyContent){
                this.textarea3 = this.selectRowData.replyContent;
                this.isreply = true;
            }else{
                this.textarea3 = "";
                this.isreply = false;
                this.curr=0;
            }
            this.checked = false;
        }
    },
    created:function(){
    	var that = this;
            //this.getTableData();
        if(this.selectRowData.replyContent){
            this.textarea3 = this.selectRowData.replyContent;
            this.isreply = true;
        }
        /*var Bus = global.eventHub;
        Bus.$on("tankuang", function() {
            that.is_tkshow = false;
        });*/
    },
   components: {
        tankuangcomponent: function(resolve, reject) {
            require(['./tankuang.vue'], resolve)
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
    }
}
</script>
<style lang="less">
    .cs-layer{
        border: 1px solid #275e8b;
        .el-checkbox__label{
            font-size: 12px;
        }
        .el-button{
            width: 80px;
            height: 35px;
        }

    .cs-szxx-dailog__body {
        font-size: 16px;
        overflow: auto;
        padding: 15px 33px;
    }
    .cs-xin-from {
        font-size: 14px;
    }
    .cs-szxx-title {
        padding-bottom: 10px;
    }
    .cs-szxx-content {
        margin-top: 10px;
        position: relative;
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
    }
    .goback {
        width: 100%;
        text-align: center;
        margin-top: 10px;
        position: relative;
        .el-button--primary{
            background: #275e8b;
            border: none;
            border-radius: 2px;
        }

        .is-disabled{
            background: #fff;
        }
    }
    .goback .gkfb {
        position: absolute;
        right: 40px;
        top: 10px;
        .el-checkbox{
            color: #fff;
        }
    }
    .inlimit{position: absolute;right: 15px;bottom: 10px;color: #20a0ff;opacity: 0.8}
    }
</style>