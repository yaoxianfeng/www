<template>
	<div class="upcoming" :style="main_style">
		<div :style="topbar_style"></div>
		<div class="up-shipin" :style="content_sytle">
            <!-- 警情 -->
            <div class="bigbox" v-loading="is_loading" >
                <div class="butbox" :style="bigbox_style">
                    <el-table
                     @header-click="more"
                     @row-click="rowclick"
                    :data="jqData.data">
                    <el-table-column
                      :label="'警情('+jqrecord+')'"
                      prop="description">
                      <template scope="scope">
                            <span v-if="scope.row.description">{{scope.row.description}}</span>
                            <span v-if="!scope.row.description">内容缺省</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                      prop="alertTime"
                      label="更多"
                      width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">
                                {{scope.row.alertTime|moment}}
                            </span>
                        </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
		 	<!-- 网上办事 -->
			<div class="bigbox" v-loading="is_loading" >
				<div class="butbox" :style="bigbox_style">
					<el-table
					 @header-click="more"
					 @row-click="rowclick"
				    :data="wsbsData.data">
				    <el-table-column
				      :label="'网上办事('+ wsbsrecord +')'"
				      prop="name">
				      <template scope="scope">
                        	<span style="margin-left: 10px">
                                {{scope.row.name}} 的 无犯罪记录证明 办理
                            </span>
                    	</template>
				    </el-table-column>
				    <el-table-column
				      prop="createTime"
				      label="更多"
				      width="180">
				      	<template scope="scope">
                        	<span style="margin-left: 10px">
                                {{scope.row.createTime|moment}}
                            </span>
                    	</template>
				    </el-table-column>
				  </el-table>
				</div>
			</div>
            <!-- 咨询服务 -->
            <div class="bigbox" v-loading="is_loading" >
                <div class="butbox" :style="bigbox_style">
                    <el-table
                     @header-click="more"
                     @row-click="rowclick"
                    :data="zxfwData.data">
                    <el-table-column
                      :label="'咨询服务('+zxfwrecord+')'"
                      prop="content">
                    </el-table-column>
                    <el-table-column
                      prop="time"
                      label="更多"
                      width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">
                                {{scope.row.time|moment}}
                            </span>
                        </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
			<!-- 实名认证 -->
			<div class="bigbox" v-loading="is_loading" >
				<div class="butbox" :style="bigbox_style">
					<el-table
					 @header-click="more"
					 @row-click="rowclick"
				    :data="smrzData.data">
				    <el-table-column
				      :label="'实名认证('+smrzrecord+')'"
				      prop="name">
				      <template scope="scope">
                        	<span style="margin-left: 10px">
                                {{scope.row.realname}} 的 实名认证申请
                            </span>
                    	</template>
				    </el-table-column>
				    <el-table-column
				      prop="authingTime"
				      label="更多"
				      width="180">
				      	<template scope="scope">
                        	<span style="margin-left: 10px">
                                {{scope.row.authingTime|moment}}
                            </span>
                    	</template>
				    </el-table-column>
				  </el-table>
				</div>
			</div>
			<!-- 所长信箱 -->
			<div class="bigbox" v-loading="is_loading" >
				<div class="butbox" :style="bigbox_style">
					<el-table
					 @header-click="more"
					 @row-click="rowclick"
				    :data="szxxData.data">
				    <el-table-column
				      :label="'所长信箱('+szxxrecord+')'"
				      prop="title">
				    </el-table-column>
				    <el-table-column
				      prop="timeStr"
				      label="更多"
				      width="180">
				      	<template scope="scope">
                        	<span style="margin-left: 10px">
                                {{scope.row.timeStr|moment}}
                            </span>
                    	</template>
				    </el-table-column>
				  </el-table>
				</div>
			</div>
		</div>

		<div class="upc-common-group-component" >

	        <!-- 组件组 <transition name="fadeRightBig"> -->
	           <!-- 咨询服务 -->
	            <zxfwcomponent v-if="zxfwdialog && selectRowData.category=='consultation'" :selectRowData="selectRowData" :content="selectRowData" :zt_flag="zt_flag" @refreshList="refreshZXFWList" @hideDetail="hideZXFWDetail"></zxfwcomponent>

	            <!-- 警情 -->
                <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper" :style="mapStyle" v-show="this.bjxqdialog">
                    <div class="guanbi"  @click="refreshjq"></div>
				    <bjxqcomponent  v-if="selectRowData.category=='alarm'" :jqfb_list_detail="selectRowData"  @hide_bjxq="refreshjq" @doto_refresh_list="refreshjq"></bjxqcomponent>
                </div>
                
                <!-- 网上办事 -->
                <div class="el-dialog__wrapper cs-jcjb-dialog__wrapper" :style="mapStyle" v-show="this.wsbsdialog">
                    <div class="guanbi"  @click="refreshwsbs"></div>
                    <div class="cs-bjxq-dailog cs-wsbs-dailog" >
                        <div class="el-dialog__header"><span class="el-dialog__title">网上办事</span>
                            <div class="el-dialog__headerbtn" @click="refreshwsbs"><i class="el-dialog__close el-icon el-icon-close"></i></div>
                        </div>
                        <wsbsxqcomponent v-if="selectRowData.category=='onlineService'" :selectRowData="selectRowData" :radio="radio" @refreshListData ="refreshwsbs"></wsbsxqcomponent>
                    </div>
                </div>
	    </div>
		
		<el-dialog :title="this.tishi" v-model="dialogVisible">
			<!-- 实名认证 -->
			<smrzxqcomponent v-if="selectRowData.category=='authentication'" :selectRowData="selectRowData" :records="smrzrecord" @reloadList="refreshsmrz"></smrzxqcomponent>
			<!-- 所长信箱 -->
			<szxxxqcomponent v-if="selectRowData.category=='mailbox'" :selectRowData="selectRowData" @refreshList="refreshSZXXList"></szxxxqcomponent>
		</el-dialog>
	</div>
</template>

<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    data(){
    	return{
    		is_loading:false,
    		dialogVisible: false,
    		bjxqdialog:false,
    		zxfwdialog:false,
            wsbsdialog:false,
    		currentPage: 1, //第多少页
    		page_size: '', //每页显示多少数据
    		tishi:'提示',
    		wsbsrecord:0,//网上办事未处理总数
    		smrzrecord:0,//实名认证未处理总数
    		szxxrecord:0,//所长信箱未处理总数
    		zxfwrecord:0,//咨询服务未处理总数
    		jqrecord:0,//警情未处理总数
    		wsbsData:[],//网上办事数据
    		smrzData:[],//实名认证数据
    		szxxData:[],//所长信箱数据
    		zxfwData:[],//咨询服务数据
    		jqData:[],//警情数据
    		selectRowData:{},//点击某一行的数据
    		radio:0,
    		zt_flag:1
    	}
    },
    components: {
	    wsbsxqcomponent: function(resolve, reject) {
	        require(['../wfw/wsbs_xq.vue'], resolve)
	    },
	    smrzxqcomponent: function(resolve, reject) {
            require(['../wgz/smrz_xq.vue'], resolve)
        },
        zxfwcomponent: function(resolve, reject) {
            require(['../wgz/zxfw_hf.vue'], resolve)
        },
        szxxxqcomponent: function(resolve, reject) {
            require(['../wgz/szxx_xq.vue'], resolve)
        },
        bjxqcomponent: function(resolve, reject) {
            require(['../wlf/bjxq.vue'], resolve)
        },
    },
    methods:{
        refreshwsbs(){  //关闭网上办事弹框
            this.wsbsdialog=false;
            this.getwsbslist();
        },
        refreshjq(){  //关闭警情弹框
            this.bjxqdialog=false;
            this.getjqlist();
        },
        refreshsmrz(){  //关闭实名认证弹框
            this.dialogVisible=false;
            this.getsmrzlist();
        },  
    	more(event){  //更多
    		if(event.property=="createTime"){
    			this.$router.push("/wfw/wsbs");
    		}else if(event.property=="authingTime"){
    			this.$router.push("/wgz/smrz");
    		}else if(event.property=="timeStr"){
    			this.$router.push("/wgz/szxx");
    		}else if(event.property=="time"){
    			this.$router.push("/wgz/zxfw");
    		}else if(event.property=="alertTime"){
    			this.$router.push("/wlf/list");
    		}
    	},
    	rowclick(row){  //点击某一行
    		this.selectRowData=row;
    		if(row. category=='consultation'){//咨询服务
                var that=this;
    			this.zxfwdialog=true;
                that.$http({
                    method: 'POST',
                    url: global.config.weburl + "api/msg/read.do",
                    params: {
                        token:  global.data.getToken(),
                        id:row.id
                    }
                }).then(function(res) {
                        that.getzxfwlist();
                });
    		}else if(row. category=='onlineService'){
    			this.tishi="网上办事";
                this.wsbsdialog=true;
    		}else if(row. category=='authentication'){
    			this.tishi="实名认证";
                this.dialogVisible=true;
    		}else if(row. category=='mailbox'){
                var that=this;
    			this.tishi="所长信箱";
                this.dialogVisible=true;
                that.$http({
                    method: 'POST',
                    url: global.config.weburl + "api/msg/read.do",
                    params: {
                        token:  global.data.getToken(),
                        id:row.id
                    }
                }).then(function(res) {
                    this.getszxxlist();
                });
    		}else if(row.category="alarm"){//报警详情
    			this.bjxqdialog=true;
    		}
    	},
    	getwsbslist(){  //获取网上办事未处理数据
    		let that = this;
            var num=0;
    		var url=global.config.weburl +"api/criminal/queryCriminal.do";
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage,
                pageSize: that.page_size,
                authStatus: "0",
                sortby: "update_time desc,create_time asc"
            };
            this.getlist(url,_param,num);
    	},
    	getsmrzlist(){  //获取实名认证未处理数据
    		let that = this;
            var num=1;
    		var url=global.config.weburl + "api/user/queryUserAuitList.do";
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage,
                pageSize: that.page_size,
                auth : "noAuth",
                sortby : "authingTime desc",
            };
            this.getlist(url,_param,num);
    	},
    	getszxxlist(){  //获取所长信箱未处理数据
    		let that = this;
            var num=2;
    		var url= global.config.weburl + "api/msg/list.do";
    		var _param = {
                token: global.data.getToken(), 
                type:2,
                page:1,
                pageSize:this.page_size,
                sortby:"time desc",
                isRead:0
            };
            this.getlist(url,_param,num);
    	},
    	getzxfwlist(){  //获取咨询服务未处理数据
    		let that = this;
            var num=3;
    		var url= global.config.weburl + "api/msg/list.do"
            var _param = {
                token: global.data.getToken(),
                type: 1,
                page: 1,
                status:2,
                pageSize: that.page_size,
                sortby:"time desc",
                isRead:0
            };
            this.getlist(url,_param,num);
    	},
    	getjqlist(){	//获取警情未处理数据
    		let that = this;
            var num=4;
    		var url= global.config.weburl + "api/alert/queryAlert.do"
            var _param = {
                token: global.data.getToken(),
                page: that.currentPage4,
                pageSize: that.page_size,
                page:1,
                status:0,
                flag:1,
                sortby :"alert_time desc"
            };
            this.getlist(url,_param,num);
    	},
    	getlist(url,_param,num){  //数据请求
    		let that = this;
    		this.$http({
                method: 'POST',
                url: url,
                params: _param,
            }).then(function(res) {
                that.is_loading = false;
                if (res.data.code == 0) {
                    that.tableData = res.data;
                    	if(num==0){
                    		that.wsbsData=that.tableData;
                    		that.wsbsrecord=that.wsbsData.pageInfo.records;
                    	}else if(num==1){
                    		that.smrzData=that.tableData;
                    		that.smrzrecord=that.smrzData.pageInfo.records;
                    	}else if(num==2){
                            that.szxxData="";
                    		that.szxxData=that.tableData;
                    		that.szxxrecord=that.szxxData.pageInfo.records;
                    	}else if(num==3){
                    		that.zxfwData=that.tableData;
                    		that.zxfwrecord=that.zxfwData.pageInfo.records;
                    	}else if(num==4){
                    		that.jqData=that.tableData;
                    		that.jqrecord=that.jqData.pageInfo.records;
		           		}
                        that.tableData="";
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
    	},
    	firstgetlist(){ //第一次获取数据
            this.getwsbslist();
            this.getsmrzlist();
            this.getszxxlist();
            this.getzxfwlist();
            this.getjqlist();
    	},
        refreshZXFWList() {
           this.zxfwdialog=false;
           this.getzxfwlist();     
        },
        hideZXFWDetail() {
           this.zxfwdialog=false;     
        },
        refreshSZXXList () {
            this.dialogVisible=false;
            this.getszxxlist();
        }
    },
    created:function(){
    	var that = this;
    },
    watch:{
        page_size:function(){
             this.firstgetlist();
        }
    },
    computed: {
            mapStyle() {
                let _height = this.$store.getters.getPageInfos.main_height;
                return {
                    "Height": _height + "px",
                }
            },
            bigbox_style () {
                let _height = global.app.$store.getters.getPageInfos.content_height;
                let _oheight=_height*0.28;
                this.page_size=parseInt(_oheight/40)-1;
                return  {height:_oheight + "px"}
        },
    }
}
</script>

<style type="text/css" lang="less">
	.upcoming{
        z-index: 1000;
		.up-shipin{ 
			border: 1px solid #275e8b;
			background: rgba(39, 94, 139, 0.3); 
			.bigbox{
				width: 47%;  margin:2% 0 0 2%;float: left;border: 1px solid #275e8b;
				.topbox{
					width: 100%;height: 20%;padding: 1.5% 3%;background: rgba(39, 94, 139, 0.3);
					.top_left{
						float: left;
					}
					.top_right{
						float: right;
						cursor: pointer;
					}
				}
			}
			.butbox{
				width: 100%;
				height: 100%;
				float: left;
				.el-table{
					height: 100%;
					border: none;
				}
				thead tr th:nth-child(1){border-right: none;}
				thead tr th:nth-child(2){cursor: pointer;}
				thead tr th:nth-child(1) div{text-align: left;}
				thead tr th:nth-child(2) div{text-align: center;}
				.el-table .el-table__body-wrapper table tr td{
					border: none;
				}
				.el-table .el-table__body-wrapper table tr td div{
					text-align: left;
				}
			}
		}
		.el-dialog__wrapper{
            height: 100%;
			overflow: hidden;

		}
		.bjxadialog{
			.el-dialog>.el-dialog__header{
				display: none;
			}
			.el-dialog>.el-dialog__body{
				padding: 0;
			}

		}
        .cs-bjxq-dailog{
            border: 1px solid #4092bb;
            position: absolute;
            top:50%; 
            right: 50%;
            margin-right:-390px ; 
        }
        .cs-wsbs-dailog{
            margin-left: 30%;
            margin-top: 5%;
            z-index: 1000;
            border: 1px solid #4092bb;
            position: absolute;
            top: 5%;
            background: rgba(39, 94, 139, 0.3);
            .cs-right-page{padding: 10px; overflow: hidden;}
            .el-dialog__title{color: #fff;}
            .cs-right-hd{border: 0;}
            .el-dialog__header{
                padding: 15px 20px;
                width: 100%;
                height: 52px;
                background: #275e8b;
            }
        }
        .guanbi{
            width: 100%;height: 100%;z-index: 5;
        }
        .el-dialog{border: 0!important;}
        .el-table::before{background: transparent!important;}
        .cs-jcjb-dialog__wrapper{z-index: 600;height: 100%;background: rgba(0, 0, 0, 0.9);}
	}
    .cs-jcjb-dialog__wrapper{border: 0!important;}
</style>