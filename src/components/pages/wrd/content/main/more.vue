<template>
	<div class="cs-main-content" :style="main_style">
		<div class="ha-topbar-box" :style="topbar_style">
			<div class="ha-navbar-radiogroup">
				<router-link to="/wrd" class="ha-navbar-goback"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
			</div>
		</div>
		<div class="main-content cs-wrd-more-page-content" :style="content_sytle">

			<div class="cs-wrd-boards ">

				<div class="grid-content">

					<el-card class="box-card" v-loading.body="loading" v-if="infoType == 3">
						<div slot="header" class="clearfix title_bottom">
							<span>{{title}}</span>
						</div>
						<div class="box-card-main" :style="card_body_style">
							<div v-if="listData.length== 0" class="cs-no-data">暂无数据</div>
							<div v-if="listData.length>0" :key="ite.id" v-for="ite in listData" class="text item cs-media-appmsg" v-on:click="preview(ite)">
								<div class="cs-media_hd">
									<img class="weui_media_appmsg_thumb" :src="ite.summaryImg" alt="">
									<i v-if="ite.uptopDays? true : false" class="cs_zhiding"></i>
								</div>
								<div class="cs-media_bd">
									<h4 class="cs-media_title">{{ite.title}}</h4>
									<p class="cs-media_desc" v-html="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ite.viewcontent}}</p>
									<div class="cs-media_time">{{ite.updateTime,"YYYY-MM-DD"|moment}}</div>
								</div>
							</div>
						</div>

					</el-card>

					<el-card class="box-card cs-small-box-card" v-loading.body="loading" v-if="infoType != 3">
						<div slot="header" class="clearfix title_bottom">
							<span>{{title}}</span>
						</div>
						<div class="box-card-main" :style="card_body_style">
							<div v-if="listData.length== 0" class="cs-no-data">暂无数据</div>
							<div v-if="listData.length>0" :key="ite.id" v-for="ite in listData" class="text item" v-on:click="preview(ite)">
								<i v-if="ite.uptopDays? true : false" class="cs_zhiding"></i>
								<div class="cs-line_media_title">{{ite.title}}</div>
								<div class="cs-line_media_time">{{ite.updateTime, "YYYY-MM-DD"|moment}}</div>
							</div>
						</div>
					</el-card>

					<div class="cs-footer-page">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[10, 20 ,30 ,50]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.records">
						</el-pagination>
					</div>
				</div>

			</div>
		</div>
		<pcpreviewcomponent v-if="is_show_preview" :privewdata="privewdata" @hide_preview_dialog="hide_preview_dialog"></pcpreviewcomponent>
	</div>

</template>

<script>
	import mystyle from '../../../../../util/vue/style';

	export default {
		mixins: [mystyle],
		data() {
			return {
				mianStyle: {},
				mapHeight: {
					type: Number,
					default: 600
				},
				title: "",
				loading: false,
				listData: [],
				pageInfo: {
					pageSize: 20,
					page: 1,
					records: 0
				},
				privewdata: {},

				is_show_preview: false,
				infoType: null
			}
		},
		computed: {
			card_body_style() {
				let _height = this.$store.getters.getPageInfos.table_height - 36;
				return {
					height: _height + "px"
				}
			}
		},
		components: {
			pcpreviewcomponent: function(resolve, reject) {
				require(['./pc_preview.vue'], resolve)
			}
		},
		methods: {
			preview(item) {
				this.privewdata = item;
				this.is_show_preview = true;
			},
			hide_preview_dialog() {
				this.is_show_preview = false;
			},
			doFomartData(data) {
				let that = this;
				let infoType = that.infoType;
				if(infoType == 3) {
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
				}
				that.loading = false;
				that.listData = data;

			},
			getContentList: function() {
				let that = this;
				let token = global.data.getToken();
				if(!token) {
					return false;
				}
				let _params = {
					infoType: that.infoType,
					token: token,
					status: 3,
					page: that.pageInfo.page,
					pageSize: that.pageInfo.pageSize,
					sortby: "uptop_time desc,update_time desc"
				};
				that.loading = true;
				this.$http({
					method: 'GET',
					url: global.config.weburl + "api/jwContent/getJWContentList.do",
					params: _params
				}).then(
					function(res) {

						if(res.data.code == 0) {
							that.pageInfo = res.data.pageInfo;
							that.doFomartData(res.data.data);
						} else {
							global.tools.handleError(res.data);
						}

					}
				).catch(() => {
					that.loading = false;
				})
			},
			getAllData: function() {
				this.getContentList();
			},
			handleSizeChange(val) {
				let that = this;
				this.pageInfo.pageSize = val;
				that.getAllData();
			},
			handleCurrentChange(val) {
				let that = this;
				that.pageInfo.page = val;
				that.getAllData();
			}

		},
		created: function() {
			var that = this;
			var infoType = that.$route.query.infoType;
			if(infoType == 1) {
				that.title = "警情通报"
			} else if(infoType == 2) {
				that.title = "协查通报"
			} else if(infoType == 3) {
				that.title = "社区动态"
			} else if(infoType == 5) {
				that.title = "防范小贴士"
			} else if(infoType == 8) {
				that.title = "i学习"
			} else {
				return false;
			}

			that.infoType = infoType;
			this.getAllData();
		},
		mounted: function() {},

		beforeDestroy: function() {

		}
	}
</script>
<style lang="less">
	.cs-wrd-more-page-content {
		.el-card__header {
			padding: 23px 20px 7px 20px;
			border: none;
			.title_bottom {
				border-bottom: 1px solid #275e8b;
			}
			.clearfix {
				position: relative;
				span {
					height: 36px;
					line-height: 36px;
					border: 1px solid #275e8b;
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
		.el-card__body {
			padding: 0 20px;
			border: none;
		}
		.el-card {
			background: none;
			border: 0 none;
		}
		.box-card-main {
			overflow-y: auto;
		}
		.cs-media-appmsg {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			-webkit-box-align: center;
			/*-webkit-align-items: center;
        align-items: center;*/
			position: relative;
			box-sizing: border-box;
			border-bottom: 1px solid #275e8b;
			overflow-y: auto;
			padding: 33px 0;
			.cs-media_hd {
				position: relative;
				margin-right: .8em;
				width: 135px;
				height: 75px;
				line-height: 75px;
				text-align: center;
				.cs_zhiding {
					position: absolute;
					width: 20px;
					height: 20px;
					display: block;
					background: url(/static/img/icon/zhiding.png) no-repeat;
					-webkit-background-size: 100% 100%;
					background-size: 100% 100%;
					top: 0;
					left: 0;
				}
				.weui_media_appmsg_thumb {
					width: 100%;
					max-height: 100%;
					vertical-align: top;
				}
				img {}
			}
			.cs-media_bd {
				-webkit-box-flex: 1;
				-webkit-flex: 1;
				flex: 1;
				min-width: 0;
				padding-left: 10px;
				line-height: 2;
				.cs-media_title {
					font-weight: 400;
					font-size: 17px;
					width: auto;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-wrap: break-word;
					word-break: break-all;
					color: #4A9FDD;
				}
				.cs-media_desc {
					color: #d6d6d6;
					font-size: 14px;
					line-height: 2;
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
					font-size: 13px;
					line-height: 1.2;
					position: absolute;
					margin-top: 5px;
					bottom: 33px;
					color: #d6d6d6;
				}
			}
		}
		.cs-small-box-card {
			.item {
				display: -webkit-box;
				display: -moz-box;
				display: box;
				height: 36px;
				line-height: 36px;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				border-bottom: 1px solid #275e8b;
				position: relative;
				padding: 0 20px;
				cursor: pointer;
			}
			.item:last-child {
				border-bottom: 0 none;
			}
			.cs_zhiding {
				position: absolute;
				width: 20px;
				height: 20px;
				display: block;
				background: url(/static/img/icon/zhiding.png) no-repeat;
				-webkit-background-size: 100% 100%;
				background-size: 100% 100%;
				top: 10px;
				left: 0;
				z-index: 2000;
			}
			.cs-line_media_title {
				-webkit-box-flex: 1;
				-webkit-flex: 1;
				flex: 1;
				min-width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				word-wrap: break-word;
				word-break: break-all;
				display: -webkit-box;
				display: -moz-box;
				display: box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-size: 14px;
			}
			.cs-line_media_time {
				width: 100px;
				color: #d6d6d6;
				font-size: 13px;
				right: 0;
				text-align: right;
			}
		}
		.btn-goto-edit {
			position: fixed;
			right: 20px;
			margin-top: -30px;
			z-index: 2;
		}
	}
</style>