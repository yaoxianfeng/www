<template>
	<div v-loading="is_loading" class="wrd_add">
		<div class="guanbi" @click="cancel()"></div>
		<div class="el-dialog__wrapper cs-jcjb-dialog__wrapper">
			<div class="cs-xinzen" :style="is_yulan?{left:'39.5%'}:{}">
				<div class="cs-head">
					<span class="ha-dialog__title">
                        {{this.wrdTag}}
                    </span>
					<div @click="close_xz()" class="el-dialog__headerbtn">
						<i class="el-dialog__close el-icon-close">
                        </i>
					</div>
				</div>
				<div class="srimg">
					<el-input :maxlength="50" @change="titledata" v-model="ruleForm.title" :class="[numflag!=3?'isnum':'']" placeholder="在这里输入标题">
					</el-input>
					<el-upload :action="uploadurl" accept=”image/jpeg” :before-upload="beforeAvatarUpload" :on-success="handleAvatarScucess" :show-file-list="false" class="avatar-uploader" v-show="numflag==3">
						<img :src="summaryImg|imgpathformat" class="avatar" v-if="summaryImg">
						<i class="el-icon-plus cs-icon-img" v-if="!summaryImg"></i>
						</img>
					</el-upload>
				</div>
				<span class="tishiyu" v-show="vtitle">标题不能为空</span>
				<el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm">
					<el-form-item>
						<editcomponent :article_data="ruleForm.content" :isBianjin="isBianjin" :title="ruleForm.title" :EditDiv="EditDiv" @change="editdata"></editcomponent>
						<span class="tishiyu" v-show="vcontent">内容不能为空</span>
					</el-form-item>
					<el-form-item prop="object" v-if="numflag==3||numflag==6 || numflag  == 8">
						<div class="cs-sqdt-right" @click="zsobject()">
							{{ruleForm.object}}
						</div>
						<el-button @click="addob()" type="text">
							+添加对象
						</el-button>
					</el-form-item>
					<el-form-item class="cs-an-right" v-if="numflag != 6">
						<el-button v-if="this.numflag != 9" @click="yulan" class="cs-button" type="primary">
							<img src="/static/img/audio/yulan.png"> 预览
							</img>
						</el-button>
						<el-button @click="deletclick(2,'ruleForm')" class="cs-button" type="primary" v-if="numflag != 6">
							<img src="/static/img/audio/baochun.png"> 保存
							</img>
						</el-button>
						<el-button @click="deletclick(3,'ruleForm')" class="cs-button" type="primary">
							<img src="/static/img/audio/fabu.png"> 发布
							</img>
						</el-button>
					</el-form-item>
					<el-form-item class="cs-an-right" v-if="numflag == 6">
						<el-button @click="deletclick(2,'ruleForm')" class="cs-button" type="primary">
							<img src="/static/img/audio/baochun.png">暂存</img>
						</el-button>
						<el-button @click="deletclick(3,'ruleForm')" class="cs-button" type="primary">
							<img src="/static/img/audio/fabu.png">发送</img>
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<yulancomponent class="csyulan" :style="is_yulan?{left:'60%'}:{}" :content="yl_value" v-if="is_yulan">
			</yulancomponent>
			<objectcomponent :numflag="numflag" :commname="objsnama" v-if="is_object" @cancelChoose="cancelChoose" @addobject="addobject">
			</objectcomponent>
		</div>
		<el-dialog v-model="is_show_readUsers" :modal-append-to-body="false" size="small">
			<span slot="title" class="el-dialog__title">已添加对象</span>
			<div class="cs-all-learn-list">
				<span v-for="obj in objsnama.data" class="cs-learn-user" :key="obj.id">{{obj.name}}</span>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		props: {
			numflag: '',
			wrdTag: '',
			is_yulan: ''
		},
		components: {
			yulancomponent: function(resolve, reject) {
				require(['../../../../common/yulan/yulan.vue'], resolve)
			},
			objectcomponent: function(resolve, reject) {
				require(['../object/object.vue'], resolve)
			},
			editcomponent: function(resolve, reject) {
				require(['../../../../common/Edit/Edit.vue'], resolve)
			}
		},
		data: function() {
			return {
				Editcontent: "",
				uploadurl: global.config.weburl + "file/upload/file.do",
				isBianjin: true,
				is_tkshow: false,
				is_loading: false,
				title: "",
				objsnama: "",
				summaryImg: '',
				message: "",
				is_warning01: false,
				is_warning: false,
				is_object: false,
				vtitle: false,
				vcontent: false,
				is_show_readUsers: false,
				content: null,
				communityId: "",
				editorOption: {
					placeholder: "请输入内容",
					modules: {
						toolbar: [{
							'header': 2
						}, 'italic', 'bold', 'image', 'link', {
							'list': 'bullet'
						}]
					}
				},
				EditDiv: {
					height: "250px"
				},
				flag: true,
				para: {},
				// is_yulan: false,
				yl_value: {},
				ruleForm: {
					title: '',
					content: '',
					object: ''
				},
				rules: {
					title: [{
						required: true,
						message: '请输入标题'
					}, {
						min: 1,
						max: 50,
						message: '长度在 1 到 50 个字'
					}],
					content: [{
						required: true,
						message: '请输入内容'
					}, {
						min: 1,
						message: '不能为空'
					}],
					object: [{
						required: true,
						message: '请选择发布对象'
					}, {
						min: 1,
						message: '不能为空'
					}]
				}
			}
		},
		methods: {
			cancel() {
				console.log("cancel")
			},
			gofilterStatus(status) {
				this.$emit('filterTag', status);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 1;
				if(!isJPG) {
					this.$message.error('上传的列表缩略图只能是 JPG 格式!');
					return false;
				}
				if(!isLt2M) {
					this.$message.error('上传的列表缩略图大小不能超过 1MB!');
					return false;
				}
				return isJPG && isLt2M;
			},
			handleAvatarScucess(res, file) {
				if(res.code == 0) {
					//this.imageUrl = global.config.imgbaseurl+res.data
					this.summaryImg = res.data;
				} else {
					global.tools.handleError(res.data)
				}
			},
			titledata() {
				this.yl_value = {
					title: this.ruleForm.title,
					name: global.data.getUserInfo().dept.name,
					massage: this.Editcontent
				}
			},
			zsobject() { //显示所有发送对象
				if(this.objsnama && this.objsnama.data && this.objsnama.data.length) {
					this.is_show_readUsers = true;
				}
			},
			editdata(msg) {
				this.Editcontent = msg;
				this.yl_value = {
					title: this.ruleForm.title,
					name: global.data.getUserInfo().dept.name,
					massage: this.Editcontent
				}
			},
			close_xz() {
				this.ruleForm = {
					title: '',
					content: '',
					object: ''
				}
				this.$emit("close_add");
				this.$emit("is_yulanTag");
			},
			addobject(obj) {
				this.objsnama = obj;
				let tyid = '';
				let tyname = '';
				for(var i = 0; i < obj.data.length; i++) {
					tyid += obj.data[i].id + ",";
					tyname += obj.data[i].name + " ";
				}
				this.communityId = tyid;
				this.ruleForm.object = tyname;
				this.is_object = false;
			},
			addob() {
				this.is_object = true;
			},
			deletclick(e, formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(e == 2) {
							this.flag = true,
								this.baocun();
						}
						if(e == 3) {
							this.flag = true,
								this.fabu();
						}
					} else {
						return false;
					}
				})
			},
			makeSure: function(_content) {
				let Bus = global.eventHub;
				let that = this;
				this.$confirm(_content.message, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {

						if(action === 'confirm') {
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
						if(res.data.code == 0) {
							this.$message({
								type: 'success',
								message: _content.button + "数据成功",
							});
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
				}).catch(function(error) {

				});
			},
			fabu() { //发布
				if(!this.summaryImg && this.numflag == 3) {
					this.$message("请上传列表缩略图");
					return false;
				}
				var that = this;

				if(global.tools.isNullString(that.ruleForm.title)) {
					that.vtitle = true;
					return false;
				} else {
					that.vtitle = false;
				}
				if(global.tools.isNullString(that.Editcontent)) {
					that.vcontent = true;
					return false;
				} else {
					that.vcontent = false;
				}
				let _para = {
					button: "发布",
					tips: "是否确认发布《" + this.ruleForm.title + "》？",
					message: "注意：发布成功后该操作将立即生效",
					_param: {
						token: global.data.getToken(),
						status: 3,
						communityIds: this.communityId,
						summaryImg: this.summaryImg,
						infoType: this.numflag,
						title: that.ruleForm.title,
						content: this.Editcontent,
						directPublish: 1,
						oid: 3
					},
					url: "api/jwContent/modifyJWContent.do"
				}
				let Bus = global.eventHub;
				that.makeSure(_para);
			},
			baocun() { //保存
				if(!this.summaryImg && this.numflag == 3) {
					this.$message("请上传列表缩略图")
					return false;
				}
				var that = this;
				if(global.tools.isNullString(that.ruleForm.title)) {
					that.vtitle = true;
					return false;
				} else {
					that.vtitle = false;
				}
				if(global.tools.isNullString(that.Editcontent)) {
					that.vcontent = true;
					return false;
				} else {
					that.vcontent = false;
				}
				let _content = {
					button: "保存",
					tips: "是否确认保存《" + this.ruleForm.title + "》？",
					message: "保存成功后该操作将立即生效, 是否确认保存《" + this.ruleForm.title + "》？",
					_param: {
						token: global.data.getToken(),
						status: 1,
						communityIds: this.communityId,
						summaryImg: this.summaryImg,
						infoType: this.numflag,
						title: that.ruleForm.title,
						content: this.Editcontent,
						directPublish: 0,
						oid: 6
					},
					url: "api/jwContent/modifyJWContent.do"
				};

				if(this.numflag) {
					_content._param.msgStatus = 2;
				}
				let Bus = global.eventHub;
				that.makeSure(_content);
			},
			yulan() { //预览
				this.$emit("is_yulanTag");
			},
			cancelChoose() {
				this.is_object = false;
			}
		},
		created: function() {
			this.ruleForm.title = "";
			this.Editcontent = "";
			var that = this;
			var Bus = global.eventHub;
			Bus.$on("close_yl", function() {
				this.$emit("is_yulanTag");
			});
			Bus.$on("filterTagTan", function() {
				that.gofilterStatus(3)
			});
			Bus.$on("loading_true", function() {
				that.is_loading = true;
			});
			Bus.$on("loading_false", function() {
				that.is_loading = false;
			});
		},
		computed: {

		},
		created: function() {
			var Bus = global.eventHub;
			var that = this;
			Bus.$on("close_yl", function() {
				that.yulan();
			});
		}
	}
</script>
<style scoped="" lang="less">
	.wrd_add {
		.ha-dialog__title {
			font-size: 14px;
		}
		.cs-icon-img {
			background-image: url("/static/img/icon/xcimg.png");
			background-size: 35px 35px;
			height: 35px;
			line-height: 35px;
			width: 35px;
			margin-left: 30px;
			vertical-align: middle;
		}
		.avatar {
			width: 64px;
			height: 35px;
			line-height: 35px;
			position: relative;
			right: -20px;
			text-align: center;
		}
		.el-form-item {
			margin-bottom: 20px;
		}
		.avatar-uploader .el-icon-plus:before {
			content: "" !important;
		}
		.isnum {
			width: 100%!important;
		}
		.demo-ruleForm {
			background: url(/static/images/bg-icea.png);
			padding: 20px 15px 0;
			height: 95%;
		}
		.cs-all-learn-list {
			word-break: break-all;
			height: 400px;
			overflow-y: auto;
		}
		.cs-all-learn-list span {
			margin-right: 20px;
		}
		.cs-jcjb-dialog__wrapper {
			z-index: 200;
			background: rgba(0, 0, 0, 0.8);
			display: flex;
			justify-content: center;
		}
		.srimg {
			padding: 20px 15px 0 15px;
			display: flex;
			flex-direction: row;
		}
		.el-input {
			width: 90%;
			background: rgba(39, 94, 139, 0.5);
			border-radius: 2px;
			.el-input__inner {
				color: #fff;
			}
		}
		.el-button {
			width: 95px;
			height: 40px;
		}
		.avatar-uploader {
			float: right;
			display: block;
		}
		.avatar-uploader img {
			position: relative;
			left: 5px;
			vertical-align: middle;
		}
		.tishiyu {
			margin-left: 15px;
			color: red;
			font-size: 12px;
			padding-bottom: 20px;
		}
		.csyulan {
			height: 580px;
			position: absolute;
			margin-top: -290px;
			top: 50%;
			z-index: 330;
			width: 360px;
			overflow: hidden;
		}
		.cs-xinzen {
			position: absolute;
			margin-top: -290px;
			top: 50%;
			left: 50%;
			min-width: 507px;
			margin-left: -20%;
			width: 40%;
			min-height: 580px;
			z-index: 330;
			background: rgba(39, 94, 139, 0.3);
			box-sizing: border-box;
			border: 1px solid #285E8D;
		}
		.cs-head {
			height: 50px;
			width: 100%;
			float: left;
			padding-left: 15px;
			line-height: 52px;
			background: rgba(39, 94, 139, 0.7);
			color: #fff;
		}
		.cs_fwb {
			background: #fff;
		}
		.quill-editor {
			height: 200px;
		}
		.el-dialog__close {
			color: #fff;
		}
		.el-dialog__close:hover {
			color: #499EDB;
		}
		.el-dialog__headerbtn {
			position: relative;
			top: 0px;
			right: 0px;
			cursor: pointer;
			margin-right: 25px;
		}
		.warning {
			color: #FF4949;
			display: block;
			margin-top: -20px;
		}
		.cs-sqdt-right {
			cursor: pointer;
			float: left;
			margin-right: 20px;
			width: 70%;
			height: 40px;
			border: 1px solid #275e8b;
			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.cs-an-right {
			width: 100%;
			text-align: center;
			margin-top: 15px;
		}
		.guanbi {
			width: 100%;
			height: 100%;
			z-index: 310;
		}
	}
</style>