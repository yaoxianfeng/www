<template>
	<!-- v-show="isShow_jcjb" -->
	<div class="el-dialog__wrapper cs-comfirm-dialog__wrapper">
		<div class="cs-comfirm-dailog">
			<div class="el-dialog__header"><span class="el-dialog__title">确认{{content.button}}</span>
			</div>
			<div class="el-dialog__body cs-comfirm-dailog__body">
				<div class="cs-comfirm-box__message">{{content.tips}}</div>
				<span>{{content.message}}</span>

			</div>
			<div class="el-dialog__footer cs-comfirm-dailog__footer">
				<div class="dialog-footer">
					<el-button type="primary" @click="quxiaoclick" :plain="true"><span>取消</span></el-button>
					<el-button type="primary" @click="todoclick"><span>确认{{content.button}}</span></el-button>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	export default {
		props: {
			content: {
				type: Object,
				default: function() {
					return {
						button: "发布",
						message: "注意：发布成功后该操作将立即生效",
						_param: null,
						url: "",
						flag: true,
						tips: "",
						communityIds: ""
					}
				}
			},
			flag: {
				type: Boolean,
				default: true,
			},
			iso_publish: null
		},

		data: function() {
			return {

			}
		},
		methods: {
			todoclick() {
				var that = this;
				var Bus = global.eventHub;
				/*Bus.$emit("tankuang");
				Bus.$emit("loading_true");*/
				if(this.flag) {
					that.$http.post(global.config.weburl + that.content.url, that.content._param).then(function(res) {
						if(res.body.code == 0 || res.data.code == 0) {
							this.$message({
								type: 'success',
								message: that.content.button + "数据成功",
							});
							Bus.$emit("loading_false");
							Bus.$emit('filterTagTan', 3);
							Bus.$emit("tankuang");
							that.$emit('oupdateEdit', false);
							Bus.$emit('changePublish', false);
							that.$emit('filterTagTanZsk', 3);

						} else {

							Bus.$emit("tankuang");
							global.tools.handleError(res.data);
						}
					}, function(error) {
						this.$message({
							type: 'error',
							message: that.content.button + "数据失败",
						});
						Bus.$emit("tankuang");
					});
				} else {

					Bus.$emit("tankuang");
				}

			},
			quxiaoclick() {
				var Bus = global.eventHub;
				Bus.$emit('changePublish', false);
				Bus.$emit("tankuang");
			}
		},
		computed: {
			isoo_publish() {
				return {
					isoo_publish: this.iso_publish
				}
			}
		},
		created: function() {

		},
		mounted: function() {

		}

	}
</script>
<style scoped>
	.cs-comfirm-box__message {
		text-align: center;
		font-size: 16px;
		padding: 10px;
		word-break: break-all;
		color: #fff;
	}
	
	.cs-comfirm-dialog__wrapper {
		color: #fff;
		z-index: 2001;
		border: 1px solid #275e8b;
	}
	
	.cs-comfirm-dailog {
		top: 30%;
		right: 40%;
		width: 400px;
		position: absolute;
		background: rgba(39, 94, 139, 0.3);
		border-radius: 2px;
		color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
		box-sizing: border-box;
	}
	
	.el-dialog__body {
		color: #fff;
	}
	
	.cs-comfirm-dailog__footer {
		bottom: 0px;
		position: absolute;
		right: 100px;
	}
	
	.cs-comfirm-dailog__body {
		text-align: center;
		margin-bottom: 60px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	
	.el-dialog__header {
		padding: 10px 10px 10px 20px;
		background: #16354e;
		height: 100%;
	}
	
	.el-dialog__title {
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		height: 100%;
	}
</style>