<template>
	<div class="cs-wrd-left-box" :style="right_style" v-if="!is_rowdata_null">
		<div class="el-dialog__body  ha-dialog-right__body">
			<ul class="ul-style" v-if="this.selectRowData.infoType==9">
				<li class="active">
					常见问题
				</li>
				<li class="active"><i class="el-icon-arrow-right cs-jg-icon-arrow-right"></i> {{this.title}}
				</li>
			</ul>

			<el-form class="demo-ruleForm">

				<div class="input_box">
					<el-input v-model="title" :disabled="!editing" :style="imgStyle" @change="titledata" class="csinputtitle" placeholder="在这里输入问题" max="50" :maxlength="50">
					</el-input>
					<div v-if="is_need_upload &&!editing" class="avatar-uploader">
						<img :src="summaryImg|imgpathformat" class="avatar" />
					</div>
				

				<el-upload :action="uploadurl" :before-upload="beforeAvatarUpload" :on-success="handleAvatarScucess" :show-file-list="false" class="avatar-uploader" v-show="is_need_upload && editing">
					<img :src="summaryImg|imgpathformat" class="avatar" v-if="summaryImg" />
					<i class="el-icon-plus avatar-uploader-icon" v-else=""></i>
				</el-upload>
				</div>
				
				
				<el-form-item>
					<editcomponent v-if="Edit_id" :isBianjin="editing" :EditDiv="editor_style" :Edit_id="Edit_id" :article_data="selectRowData.content" @change="editdata" class="ss"></editcomponent>
				</el-form-item>
				
				<el-form-item v-show="is_need_object">
					<div class="cs-sqdt-right-title">发布对象:</div>
					<el-tooltip class="item" effect="dark" content="点击查看全部发布对象" placement="top-start">
						<div class="cs-sqdt-right" @click="zsobject()">{{commname}}</div>
					</el-tooltip>
					<el-button v-show="editing" @click="chooseObject()" type="text">+添加对象</el-button>
				</el-form-item>
				<el-form-item v-show="is_need_readnum">
					<div class="cs-learn-num">已读人员：{{selectRowData.alreadyRead}}/{{selectRowData.total}}
						<a v-if="selectRowData.alreadyRead>0" class="cs-learn-viewall" v-on:click="viewAllReadUsers">全部已读人员</a>
					</div>
					<div class="cs-learn-list">
						<span v-for="obj in selectRowData.learn" class="cs-learn-user" :key="obj.uid">{{obj.name}}</span>
					</div>
				</el-form-item>
			</el-form>

		</div>
		<div class="el-dialog__footer">
			<div class="dialog-footer">
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(0)" v-if="this.Auth==3"><img src="/static/img/audio/yulan.png">预览</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(1)" v-if="(this.Auth==1 && !is_need_readnum) || (this.Auth == 9 && !is_need_readnum )"><img src="/static/img/audio/chexia.png">撤下</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(2)" v-if="this.Auth==2 || this.Auth==9"><img src="/static/img/audio/bianji.png">编辑</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(3)" v-if="this.Auth==1||this.Auth==2 || this.Auth == 9"><img src="/static/img/audio/sanchu.png">删除</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(4)" v-if="(this.Auth==1 && is_need_up) ||(this.Auth==9 && is_need_up)"><img src="/static/img/audio/zhiding2.png">{{selectRowData.uptopTime?"取消置顶":"置顶"}}</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(5)" v-if="this.Auth==3"><img src="/static/img/audio/baochun.png">保存</el-button>
				<el-button type="primary" class="cs-button" v-on:click="updateAuth(6)" v-if="this.Auth==2||this.Auth==3"><img src="/static/img/audio/fabu.png">发布</el-button>
				<!--消息通知与其他的不同-->
				<el-button type="primary" class="cs-button" v-if="Auth==4" v-on:click="updateAuth(7)"><img src="/static/img/audio/fabu.png">重新发送</el-button>
				<el-button type="primary" class="cs-button" v-if="Auth==6" v-on:click="updateAuth(8)"><img src="/static/img/audio/bianji.png">编辑</el-button>
				<el-button type="primary" class="cs-button" v-if="Auth==7" v-on:click="updateAuth(5)"><img src="/static/img/audio/bianji.png">暂存</el-button>
				<el-button type="primary" class="cs-button" v-if="Auth==6 || Auth==7" v-on:click="updateAuth(6)"><img src="/static/img/audio/bianji.png">发送</el-button>
			</div>
		</div>
		<yulancomponent v-if="is_yulan" :is_yulan="is_yulan" :yulan_type="yulan_type" :content="yl_value" :confrom="confrom"></yulancomponent>
		<objectcomponent v-if="is_object" :numflag="selectRowData.infoType" :lyform="lyform" @cancelChoose="cancelChoose" @addobject="addChooseObject"></objectcomponent>

		<el-dialog v-model="isobject" :modal-append-to-body="false" size="small">
			<span slot="title" class="el-dialog__title">已添加对象</span>
			<div class="cs-all-learn-list">
				<span v-for="obj in objsnama" class="cs-learn-user" :key="obj.id">{{obj.name}}</span>
			</div>
		</el-dialog>

		<el-dialog v-model="is_show_readUsers" :modal-append-to-body="false" size="small">
			<span slot="title" class="el-dialog__title">{{readUserTitle}}</span>
			<div class="cs-all-learn-list">
				<span v-for="obj in selectRowData.learn" class="cs-learn-user" :key="obj.uid">{{obj.name}}</span>
			</div>
		</el-dialog>
		<tankuangcomponent v-if="is_tkshow" :content="para" @oupdateEdit="updateEdit" @filterTagTanZsk="gofilterStatus" :iso_publish="iso_publish"></tankuangcomponent>
	</div>

</template>
<script>
	import detail_js from'./detail.js';
	export default detail_js;
</script>
<style lang="less">
	.input_box {
		display: flex;
		flex-direction: row;
	}
	
	.input_w {
		width: 50%;
	}
	
	.cs-wrd-left-box {
		border: 1px solid #285E8D;
		overflow: auto;
		.el-dialog__body {
			padding: 10px 20px 0 20px;
			.el-form-item__content {
				color: #d5d5d5;
			}
		}
		.el-input__inner {
			height: 50px;
			font-size: 14px;
		}
		.el-input.is-disabled .el-input__inner {
			color: #fff;
		}
		.yulan {
			z-index: 200;
		}
		.cs-icon-img {
			width: 35px;
			height: 35px;
			background-image: url(/static/img/icon/xcimg.png);
			background-size: 35px 35px;
		}
		.avatar {
			float: right;
			position: relative;
			text-align: center;
			vertical-align: middle;
			max-width: 60px;
			width: 60px;
			top:6px;
			right: -10px;
			height: 48px;
			
		}
		.avatar img {
			overflow: hidden;
			position: absolute;
			width: 60px;
			height: 48px;
			clip: rect(0, 0, 100px, 0);
		}
		.avatar-uploader .el-icon-plus:before {
			content: "" !important;
		}
		.avatar-uploader {
			float: right;
			height: 0px;
			position: relative;
			
			
		}
		.cs-jcjb-dialog__wrapper {
			z-index: 200;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			padding-top: 200px;
		}
		.el-input {
			margin: 6px 0;
			color: #fff;
		}
		.el-button {
			height: 35px;
			padding: 8px 15px;
		}
		.ul-style {
			line-height: 24px;
			background-color: transparent;
			display: inline-block;
			margin: 0 22px 0 12px;
			padding: 0;
			font-size: 13px;
			color: #fff;
			border-radius: 0;
			overflow: hidden;
		}
		.breadcrumb>li,
		.breadcrumb>li.active {
			color: #555;
		}
		.ul-style>li {
			float: left;
		}
		.cs-head {
			height: 40px;
			background: #eef1f6;
			padding-left: 15px;
			line-height: 40px;
		}
		.cs_fwb {
			background: #fff;
		}
		.el-dialog__headerbtn {
			margin-right: 25px;
		}
		.mainDiv .el-dialog__headerbtn {
			position: relative;
			top: 0px;
			right: 0px;
		}
		.warning {
			color: #FF4949;
			display: block;
			margin-top: -20px;
		}
		.cs-sqdt-right {
			float: left;
			margin-right: 20px;
			width: 70%;
			height: 40px;
			border: 1px solid #275e8b;
			display: block;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			padding-left: 5px;
		}
		.csinputtitle {
			background: rgba(39, 94, 139, 0.5);
		}
		.cs-an-right {
			width: 100%;
			text-align: center;
			margin-top: 15px;
		}
		.cs-learn-viewall {
			float: right;
			color: #275e8b;
			cursor: pointer;
		}
		.cs-learn-list {
			float: left;
			margin-right: 20px;
			width: 70%;
			height: 40px;
			border: 1px solid #275e8b;
			display: block;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.cs-all-learn-list {
			word-break: break-all;
			height: 400px;
			overflow-y: auto;
		}
		.cs-all-learn-list span {
			margin-right: 20px;
		}
		.cs-learn-user {
			display: inline-block;
			margin-right: 10px;
		}
	}
</style>