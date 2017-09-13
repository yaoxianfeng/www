<template>
	<div class="cs-main-content" :style="main_style">
		<div :style="topbar_style"></div>
		<div class="main-content cs-wrd-page-content" :style="content_sytle">
			<i>
            <router-link :to="{path:'e_wrd'}" class="btn-goto-edit">

            </router-link>
        </i>
			<div class="cs-wrd-boards ">
				<el-row :gutter="10">
					<el-col :span="12">
						<div class="grid-content cs-left-grid-content">
							<el-card class="box-card cs_sqdt" :style="leftCardStyle">
								<div slot="header" class="clearfix">
									<span>社区动态</span>
									<router-link style="float: right;" :to="{ name: 'wrd_more', query: { infoType: 3 }}" class="cs-btn-more">更多
									</router-link>
								</div>
								<div v-if="listData_3.length== 0" class="cs-no-data">暂无数据</div>
								<div :key="ite.id" v-for="ite in listData_3" class="text item cs-media-appmsg" v-on:click="preview(ite)">
									<div class="cs-media_hd">
										<img class="weui_media_appmsg_thumb" :src="ite.summaryImg" alt="">
									</div>
									<div class="cs-media_bd">
										<h4 class="cs-media_title">{{ite.title}}</h4>
										<div class="cs-media_time">
											<p class="cs-media_desc" v-html="ite.viewcontent"></p>
											{{ite.updateTime,"YYYY-MM-DD"|moment}}</div>
									</div>
								</div>
							</el-card>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="grid-content cs-right-grid-content">
							<el-card class="box-card box-first-card" :style="rightCardStyle">
								<div slot="header" class="clearfix">
									<span>警情通报</span>
									<router-link style="float: right;" :to="{ name: 'wrd_more', query: { infoType: 1 }}" class="cs-btn-more">更多
									</router-link>
								</div>
								<div v-if="listData_1.length== 0" class="cs-no-data">暂无数据</div>
								<div class="text item" :key="ite.id" v-for="ite in listData_1" v-on:click="preview(ite)">
									<i class="cs_zhiding"></i>
									<div class="cs-line_media_title">
										{{ite.title}}
									</div>
									<div class="cs-line_media_time">{{ite.updateTime, "YYYY-MM-DD"|moment}}</div>
								</div>
							</el-card>
							<el-card class="box-card" :style="rightCardStyle">
								<div slot="header" class="clearfix">
									<span>防范小贴士</span>
									<router-link style="float: right;" :to="{ name: 'wrd_more', query: { infoType: 5 }}" class="cs-btn-more">更多
									</router-link>
								</div>
								<div v-if="listData_5.length== 0" class="cs-no-data">暂无数据</div>
								<div class="text item" :key="ite.id" v-for="ite in listData_5" v-on:click="preview(ite)">
									<i class="cs_zhiding"></i>
									<div class="cs-line_media_title">{{ite.title}}</div>
									<div class="cs-line_media_time">{{ite.updateTime, "YYYY-MM-DD"|moment}}</div>
								</div>
							</el-card>

							<el-card class="box-card" :style="rightCardStyle">
								<div slot="header" class="clearfix">
									<span>i学习</span>
									<router-link style="float: right;" :to="{ name: 'wrd_more', query: { infoType: 8 }}" class="cs-btn-more">更多
									</router-link>
								</div>
								<div v-if="listData_8.length== 0" class="cs-no-data">暂无数据</div>
								<div class="text item" :key="ite.id" v-for="ite in listData_8" v-on:click="preview(ite)">
									<i class="cs_zhiding"></i>
									<div class="cs-line_media_title">{{ite.title}}</div>
									<div class="cs-line_media_time">{{ite.updateTime, "YYYY-MM-DD"|moment}}</div>
								</div>
							</el-card>

						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<pcpreviewcomponent v-if="is_show_preview" :privewdata="privewdata" @hide_preview_dialog="hide_preview_dialog"></pcpreviewcomponent>
	</div>
</template>
<script>
	import mystyle from '../../../../../util/vue/style';
	export default {
		name: 'wrd_main',
		mixins: [mystyle],
		data() {
			return {
				mapHeight: {
					type: Number,
					default: 600
				},
				loading_3: true,
				loading_2: true,
				loading_1: true,
				loading_5: true,
				loading_8: true,

				listData_1: [],
				listData_2: [],
				listData_3: [],
				listData_5: [],
				listData_8: [],
				privewdata: {},
				is_show_preview: false
			}
		},
		components: {
			pcpreviewcomponent: function(resolve, reject) {
				require(['./pc_preview.vue'], resolve)
			}
		},
		methods: {

			preview(item) {
				//console.log(item);
				this.privewdata = item;
				this.is_show_preview = true;
			},
			hide_preview_dialog() {
				this.is_show_preview = false;
			},
			doFomartData(infoType, data) {
				let that = this;
				switch(infoType) {
					case 1:
						that.loading_1 = false;
						that.listData_1 = data;
						break;
					case 2:
						that.loading_2 = false;
						that.listData_2 = data;
						break;
					case 3:
						that.loading_3 = false;
						data.forEach(function(value, index, array) {
							if(value && value.summaryImg && value.summaryImg.indexOf("http") < 0) {
								value.summaryImg = global.config.imgbaseurl + value.summaryImg;
							}

							if(value && value.content && value.content.indexOf("<") > -1) {
								//去掉内容中所有的标签
								value.viewcontent = value.content.replace(/\<.*?\>/ig, "");
							} else {
								value.viewcontent = value.content;
							}
						});
						that.listData_3 = data;
						break;
					case 5:
						that.loading_5 = false;
						that.listData_5 = data;
						break;
					case 8:
						that.loading_8 = false;
						that.listData_8 = data;
						break;
				}

			},
			getContentList: function(infoType, pageSize) {
				let that = this;
				let token = global.data.getToken();
				if(!token) {
					return false;
				}
				let _params = {
					infoType: infoType,
					token: token,
					status: 3,
					page: 1,
					pageSize: pageSize,
					sortby: "uptop_time desc,update_time desc"
				};
				this.$http({
					method: 'GET',
					url: global.config.weburl + "api/jwContent/getJWContentList.do",
					params: _params
				}).then(
					function(res) {
						if(res.data.code == 0) {
							that.doFomartData(infoType, res.data.data);
						} else {
							global.tools.handleError(res.data);
						}

					}
				)
			},
			getAllData: function() {
				this.getContentList(3, this.left_num);
				this.getContentList(1, this.right_num);
				this.getContentList(5, this.right_num);
				this.getContentList(8, this.right_num);
			}

		},
		computed: {
			left_num() {
				let _height = this.$store.getters.getPageInfos.content_height - 56;
				return parseInt((_height - 36) / 115);
			},
			right_num() {
				let _height = this.$store.getters.getPageInfos.content_height - 56;
				return parseInt((_height - 178) / 108);
			},
			leftCardStyle() {
				let _height = this.$store.getters.getPageInfos.content_height - 42;
				return {
					height: _height + "px"
				}
			},
			rightCardStyle() {
				let _height = this.$store.getters.getPageInfos.content_height - 42;
				return {
					height: (_height - 50) / 3 + "px"
				}
			}

		},
		created: function() {
			this.getAllData();
		},
		mounted: function() {

		}
	}
</script>
<style lang="less">
	.cs-wrd-page-content {
		width: 100%;
		margin: 0;
		padding: 20px;
		overflow: hidden;
		color: #fff;
		.el-card {
			border-radius: 0;
		}
		.btn-goto-edit {
			background: url(/static/img/bianji.png) no-repeat;
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
			width: 60px;
			height: 60px;
			position: fixed;
			right: 0px;
			margin-top: -60px;
			z-index: 2;
			margin-right: 20px;
		}
		.el-card__header {
			padding: 0;
			border: 0;
			.clearfix {
				position: relative;
				span {
					height: 36px;
					line-height: 36px;
					border: 1px solid #183f5e;
					border-bottom: 0 none;
					background: rgba(39, 94, 139, 0.3);
					min-width: 130px;
					text-align: center;
					display: inline-block;
					font-size: 14px;
				}
				.cs-btn-more {
					float: right;
					position: relative;
				}
			}
		}
		.cs_sqdt {
			.el-card__body {
				padding: 0;
			}
		}
		.cs-btn-more {
			line-height: 36px;
			width: 60px;
			text-align: right;
			display: inline-block;
			font-size: 14px;
			border-radius: 4px;
			color: #008dd4;
			-webkit-appearance: none;
		}
		.cs-media-appmsg {
			display: -webkit-box;
			float: left;
			width: 100%;
			display: -webkit-flex;
			display: flex;
			-webkit-box-align: center;
			-webkit-align-items: center;
			align-items: center;
			position: relative;
			cursor: pointer;
			.cs-media_hd {
				position: relative;
				margin-right: .8em;
				width: 135px;
				height: 75px;
				line-height: 75px;
				text-align: center;
				.weui_media_appmsg_thumb {
					width: 100%;
					max-height: 100%;
					vertical-align: top;
				}
			}
			.cs-media_bd {
				-webkit-box-flex: 1;
				-webkit-flex: 1;
				flex: 1;
				height: 85px;
				min-width: 0;
				color: #fff;
				.cs-media_title {
					color: #559ad5;
					font-weight: 400;
					font-size: 14px;
					width: auto;
					height: 20px;
					line-height: 20px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-wrap: normal;
					word-wrap: break-word;
					word-break: break-all;
				}
				.cs-media_desc {
					height: 40px;
					color: #d6d6d6;
					font-size: 12px;
					text-indent: 2em;
					line-height: 20px;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					word-break: break-all;
					display: -webkit-box;
					display: -moz-box;
					display: box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
				.cs-media_time {
					height: 65px;
					color: #d6d6d6;
					font-size: 12px;
					line-height: 1.2;
					margin: 5px 0 10px 0;
				}
			}
		}
		.cs-left-grid-content {
			border-right: 1px solid #183f5e;
			padding-right: 2.5%;
			.box-card {
				border: 0;
				background: transparent;
				.cs-media-appmsg {
					border-top: 1px solid #183f5e;
					padding: 15px 0;
				}
			}
		}
		.cs-right-grid-content {
			padding-left: 2.5%;
			position: relative;
			.el-card__body {
				border-top: 1px solid #183f5e;
			}
			.box-card {
				border: 0;
				margin-top: 20px;
				background: transparent;
				overflow: hidden;
				.item {
					display: -webkit-box;
					display: -moz-box;
					display: box;
					height: 36px;
					line-height: 36px;
					display: -webkit-box;
					display: -webkit-flex;
					display: flex;
					position: relative;
					cursor: pointer;
				}
				.cs-line_media_title {
					-webkit-box-flex: 1;
					-webkit-flex: 1;
					flex: 1;
					margin-left: 20px;
					min-width: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-wrap: normal;
					word-wrap: break-word;
					word-break: break-all;
					position: relative;
					font-size: 14px;
				}
				.cs_zhiding {
					position: absolute;
					width: 15px;
					height: 15px;
					display: block;
					background: url(/static/img/icon/jiantou.png) no-repeat;
					-webkit-background-size: 100% 100%;
					background-size: 100% 100%;
					top: 10px;
					left: -18px;
					z-index: 2000;
				}
				.cs-line_media_time {
					width: 100px;
					color: #d6d6d6;
					font-size: 12px;
					right: 0;
					text-align: right;
				}
				.cs-line_media_title:nth-child(1) {
					width: 300px;
				}
			}
			.box-first-card {
				margin: 0;
			}
		}
	}
</style>