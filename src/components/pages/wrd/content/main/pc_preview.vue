<template>
	<div class="cs-wrd-dialog">
		<el-dialog @close="close" v-model="dialogVisible" size="small" class="mainDiv">

			<div class="cs-box cs-width100 cs-preview-header">
				<div class="dialog_title_thum">
					<img :src="privewdata.summaryImg" v-if="privewdata.summaryImg">
					
				</div>
				<div class="cs-priview-header">{{privewdata.title}}</div>
				<div class="cs-box-flex1 cs-width100 cs-create-username">
					发布人：{{privewdata.createName}}
					<span class="cs-create-time">{{privewdata.updateTime, "YYYY年MM月DD日"|moment}}</span>
				</div>
				<div @click="close()" class="el-dialog__headerbtn">
					<i class="el-dialog__close el-icon el-icon-close">
                </i>
				</div>
			</div>
			<div class=" cs-priview-msg-content f_main" v-html="privewdata.content"></div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		props: {
			privewdata: {}
		},
		data: function() {
			return {
				dialogVisible: true
			}
		},
		methods: {
			close() {
				this.$emit('hide_preview_dialog');
			}
			
			

		},
		created: function() {},
		mounted: function() {}

	}
</script>
<style lang="less">
	.dialog_title_thum {
		float: left;
		position: relative;
		margin: 20px 10px;
	}
	
	.dialog_title_thum img {
		max-width: 165px;
		width: 100px;
		max-height: 65px;
		height: 65px;
	}
	
	.cs-wrd-dialog {
		.el-dialog__header {
			display: none;
		}
		.cs-box {
			display: block;
		}
		.cs-priview-header {
			font-size: 18px;
			padding: 20px 0 0 20px;
		}
		.cs-create-username {
			padding: 20px 0 20px 20px;
		}
		.cs-create-time {
			margin-left: 20px;
		}
		.cs-priview-msg-content {
			margin-top: 10px;
			min-height: 200px;
			max-height: 500px;
			overflow-y: auto;
			font-size: 15px;
			padding: 0 20px 20px 20px;
			line-height: 3;
		}
		.cs-priview-msg-content table {
			border: none;
			border-collapse: collapse;
			box-sizing: border-box;
			width: 100%;
		}
		.cs-priview-msg-content table td {
			border: 1px solid #999;
			padding: 3px 5px;
			min-width: 50px;
			height: 20px;
			box-sizing: border-box;
		}
		.cs-preview-header {
			border: 1px solid #285E8D;
			background: rgba(39, 94, 139, 0.4);
			.el-dialog__headerbtn {
				margin-right: 25px;
				position: absolute;
				top: 9px;
				right: -12px;
				i {
					color: #4A9FDD;
					width: 16px;
					height: 16px;
				}
			}
		}
		.el-dialog__body {
			padding: 0;
		}
		.el-dialog .el-dialog__body {
			padding: 0;
		}
	}
	
	@media (min-width: 1280px) and (max-width: 1600px) {
		.cs-wrd-dialog {
			.cs-priview-msg-content {
				margin-top: 10px;
				min-height: 200px;
				max-height: 420px;
				overflow-y: auto;
				font-size: 15px;
				padding: 0 20px 20px 20px;
				line-height: 3;
			}
		}
	}
</style>