<template>
	<div class="wxx-content" :style="fullwidth">
		<div class="main_style">
			<div class="topbar" :style="topbar_style">
				<img src="/static/img/titleleft.png">
				<span>{{content.name}}</span>
				<img src="/static/img/titleright.png">
			</div>
			<div class="content" :style="content_sytle">

				<el-row :gutter="24">
					<!--left S==-->
					<el-col :sm="7" :md="8" :lg="6">
						<div class="grid-content">

							<div class="content_left">
								<div class="con_left_top" v-if="content.information && content.information.data" @click="showView(1)" >

									<div v-for="index in 6" :class="[(information_data.length<=index-1 )?'nodata':'','con_l_t']">
										<p v-if="information_data.length>index-1">{{information_data[index-1].num}}<br>{{information_data[index-1].name}}</p>
									</div>

								</div>

								<div class="con_left_but" :style="halfheight">
									<lbutcomponent ref="lbutcomponent"></lbutcomponent>
								</div>

							</div>

						</div>
					</el-col>

					<!--left E==-->

					<!--center S==-->
					<el-col :sm="10" :md="8" :lg="12">
						<div class="grid-content c">

							<div class="content_mid">
								<div class="con_mid_top">
									<span><i v-for="num in currentdate1">{{num}}</i></span>
									<span>{{content.name}}</span>
									<span><i v-for="num in currentdate2">{{num}}</i></span>
								</div>
								<div class="con_mid_con" :style="conheight">
									<div class="summary">
										<p>{{key}}</p>
										<div class="sum_but">{{des}} </div>
									</div>
									<div class="sphere" @click="showView(5)">
										<div class="tagBall" v-if="items && items.keywords">
											<a class="tag" v-for="num in items.keywords">{{num.keyword}}</a>
										</div>
										<!-- <span v-for="num in data.course.keywords">{{num.keyword}}</span> -->
										<!-- <spherecomponent ref="spherecomponent" :items="items" ></spherecomponent> -->
									</div>
								</div>
								<div class="con_mid_but" @click="showView(5)">
									<p class="course_year" v-if="content.course && content.course.data">
										<span :class="_numb == index ? 'cur_year' : ''" v-for="(num,index) in content.course.data">
									{{num.year}}
							</span>
									</p>
									<p class="course_content">{{events}}</p>
								</div>
							</div>

						</div>
					</el-col>
					<!--center E==-->

					<!--right S==-->
					<el-col :sm="7" :md="8" :lg="6">
						<el-row>
							<el-col :span="24">
								<div class="grid-content">
									<div class="con_right_top" :style="halfheight" @click="showView(2)">
										<personcomponent ref="personcomponent" v-if="content.population" :data1="content.population.data1" :data2="content.population.data2" :total="content.population.total"></personcomponent>
									</div>
								</div>
							</el-col>

							<el-col :span="21" :offset="3">
								<div class="grid-content">
									<div class="institution content_right">
										<div class="con_right_but" @click="showView(3)" v-if="content && content.institution && content.institution.data">

											<div class="c_r_b" v-for="index in 3">
												<div class="r_b_right">
													<p>{{(2*(index-1)
														< content.institution.data.length ) ? content.institution.data[2*(index-1)].type : "" }}</p>
															<p>{{(2*(index-1)+1
																< content.institution.data.length ) ? content.institution.data[2*(index-1)+1].type: ""}}</p>
												</div>

												<div class="r_b_left">
													<p>{{(2*(index-1)
														< content.institution.data.length ) ? content.institution.data[2*(index-1)].number: ""}}</p>
															<p>{{(2*(index-1)+1
																< content.institution.data.length ) ? content.institution.data[2*(index-1)+1].number: ""}}</p>
												</div>

												<img v-if="index == 1" src="/static/img/kejihua.png">
												<img v-if="index == 2" src="/static/img/shangqi.png">
												<img v-if="index == 3" src="/static/img/maozi.png">
											</div>

										</div>
									</div>
								</div>
							</el-col>
						</el-row>
					</el-col>
					<!--right E==-->
				</el-row>
			</div>
		</div>
		<viewcomponent v-if="dialogVisible" :detail="detail" @closeView="closeView"></viewcomponent>
	</div>
</template>

<script>
	import mystyle from '../../../util/vue/style';

	const FONT_COLOR_ARR = ["#00d8ff", "#809eff", "#00ffd2", "#00ff5a", "#ffb400", "#fcff00", "#ff7800"];
	var tagEle,
		paper,
		RADIUS =120,
		fallLength = 500,
		tags = [],
		angleX = Math.PI / 1500,
		angleY = Math.PI / 500,
		CX,
		CY,
		EX,
		EY;

	Array.prototype.forEachWithCallback = function(callback) {
		for(var i = 0; i < this.length; i++) {
			callback.call(this[i]);
		}
	}

	function getClass(className) {
		var ele = document.getElementsByTagName("*");
		var classEle = [];
		for(var i = 0; i < ele.length; i++) {
			var cn = ele[i].className;
			if(cn === className) {
				classEle.push(ele[i]);
			}
		}
		return classEle;
	}

	function innit() {
		for(var i = 0; i < tagEle.length; i++) {
			var a, b;
			var k = (2 * (i + 1) - 1) / tagEle.length - 1;
			var a = Math.acos(k);
			var b = a * Math.sqrt(tagEle.length * Math.PI);
			// var a = Math.random()*2*Math.PI;
			// var b = Math.random()*2*Math.PI;
			var x = RADIUS * Math.sin(a) * Math.cos(b);
			var y = RADIUS * Math.sin(a) * Math.sin(b);
			var z = RADIUS * Math.cos(a);
			var t = new tag(tagEle[i], x, y, z);
			tagEle[i].style.color = FONT_COLOR_ARR[i % 7];
			//tagEle[i].style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
			tags.push(t);
			t.move();
		}
	}

	function animate() {
		setInterval(function() {
			rotateX();
			rotateY();
			tags.forEachWithCallback(function() {
				this.move();
			})
		}, 20)
	}

	function rotateX() {
		var cos = Math.cos(angleX);
		var sin = Math.sin(angleX);
		tags.forEachWithCallback(function() {
			var y1 = this.y * cos - this.z * sin;
			var z1 = this.z * cos + this.y * sin;
			this.y = y1;
			this.z = z1;
		})

	}

	function rotateY() {
		var cos = Math.cos(angleY);
		var sin = Math.sin(angleY);
		tags.forEachWithCallback(function() {
			var x1 = this.x * cos - this.z * sin;
			var z1 = this.z * cos + this.x * sin;
			this.x = x1;
			this.z = z1;
		})
	}

	var tag = function(ele, x, y, z) {
		this.ele = ele;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	export default {
		name: 'wrd_main',
		mixins: [mystyle],
		data: function() {
			return {
				isicon: true,
				dialogVisible: false,
				currentdate1: '',
				currentdate2: '',

				items: {},
				_numa: '',
				_numb: '',
				isFirst: false,
				_loadPromise: null,

				key: '',
				des: '',
				events: '',
				content: {},
				keywordTimeInter: null,
				detail: {
					html: '',
					img: ''
				}

			}
		},
		components: {
			// spherecomponent: function(resolve, reject) {
			//     require(['./ere.vue'], resolve)
			// },
			lbutcomponent: function(resolve, reject) {
				require(['./leftbut.vue'], resolve)
			},
			personcomponent: function(resolve, reject) {
				require(['./personview.vue'], resolve)
			},
			viewcomponent: function(resolve, reject) {
				require(['./view.vue'], resolve)
			}
		},

		mounted() {

			let that = this;
			this._loadPromise.then(function() {
				that.createdTimeInterval();

			})

			//this.createdTimeInterval();
		},

		methods: {
			showView(index) {
				let that = this;

				var Bus=global.eventHub;
				Bus.$emit("hideleft");

				that.dialogVisible = true;
				if(index == 1) {
					that.detail.html = that.content.information.description;
				} else if(index == 2) {
					that.detail.html = that.content.population.description;
				} else if(index == 3) {
					that.detail.html = that.content.institution.description;
				} else if(index == 5) {
					that.detail.html = that.content.hot.description;
				}
				that.detail.img = "../../../../static/images/" + index + ".png";

			},
			getNowFormatDate() { //时间
				let date = new Date();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				let hours = date.getHours();
				let min = date.getMinutes();
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				if(hours >= 0 && hours <= 9) {
					hours = "0" + hours;
				}
				if(min >= 0 && min <= 9) {
					min = "0" + min;
				}
				this.currentdate1 = month + "." + strDate;
				this.currentdate2 = hours + ":" + min;
			},

			getkeywords() {

				this._numb++;
				this._numa++;
				if(this.content && this.content.hot && this.content.hot.keywords && this.content.hot.keywords.length > 0) {
					if(this._numa == this.content.hot.keywords.length) {
						this._numa = 0;

					}

					this.key = this.content.hot.keywords[this._numa].keyword;
					this.des = this.content.hot.keywords[this._numa].description; //球形关键字
				}

				if(this.content && this.content.course && this.content.course.data.length > 0) {
					if(this._numb == this.content.course.data.length) {
						this._numb = 0;
					}
					this.events = this.content.course.data[this._numb].event; //底部
				}

			},

			scroll() {
				innit();
				animate();
			},
			getData() {
				let that = this;
				let _param = {
					token: global.data.getToken()
				}
				that.$http.post(global.config.weburl + 'api/deptInformation/queryData.do', _param).then(function(res) {
					var code = res.data.code;
					if(code == 0) {

						that.content = res.data.data;

						that.loadData();

					} else {
						global.tools.handleError(res.data);
					}
				});
			},
			createdTimeInterval() {

				let that = this;

				if(this.keywordTimeInter) {
					window.clearInterval(this.keywordTimeInter);
					this.keywordTimeInter = null;
				}

				this.keywordTimeInter = setInterval(function() {
					that.getkeywords();
					that.getNowFormatDate();
				}, 2000)
			},
			loadData() {
				let that = this;

				that.getNowFormatDate();
				if(this.content && this.content.hot && this.content.hot.keywords && this.content.hot.keywords.length > 0) {
					that.key = this.content.hot.keywords[this._numa].keyword;
					that.des = this.content.hot.keywords[this._numa].description;
				}

				if(this.content && this.content.course && this.content.course.data.length > 0) {
					that.events = this.content.course.data[this._numb].event;
				}

				that.items = that.content.hot;
			},
			iniTag() {

				if(!this.isFirst && document.querySelectorAll(".tag").length > 0) {
					this.isFirst = true;
				} else {
					return false;
				}

				tag.prototype = {
					move: function() {
						var scale = fallLength / (fallLength - this.z);
						var alpha = (this.z + RADIUS) / (2 * RADIUS);
						this.ele.style.fontSize = 15 * scale + "px";
						this.ele.style.opacity = alpha + 0.5;
						this.ele.style.filter = "alpha(opacity = " + (alpha + 0.5) * 100 + ")";
						this.ele.style.zIndex = parseInt(scale * 100);
						this.ele.style.left = this.x + CX - this.ele.offsetWidth / 2 + "px";
						this.ele.style.top = this.y + CY - this.ele.offsetHeight / 2 + "px";
					}
				}

				tagEle = "querySelectorAll" in document ? document.querySelectorAll(".tag") : getClass("tag");
				paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0];

				CX = paper.offsetWidth / 2;
				CY = paper.offsetHeight / 2;
				EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
				EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

				this.scroll();

				if("addEventListener" in window) {
					paper.addEventListener("mousemove", function(event) {
						var x = event.clientX - EX - CX;
						var y = event.clientY - EY - CY;
						angleY = -x * (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > RADIUS / 4 ? 0.000002 : 0.00001);
						angleX = -y * (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > RADIUS / 4 ? 0.00002 : 0.0001);

					});
				} else {
					paper.attachEvent("onmousemove", function(event) {
						var x = event.clientX - EX - CX;
						var y = event.clientY - EY - CY;
						angleY = x * 0.0001;
						angleX = y * 0.0001;
					});
				}

			},
			closeView() {
				this.dialogVisible = false;
			}

		},
		computed: {
			fullwidth() {
				return {
					width: this.$store.getters.getPageInfos.body_width * 0.97 + "px",
				}
			},
			halfheight() {
				return {
					height: this.$store.getters.getPageInfos.content_height - 500 + "px",
				}
			},
			conheight() {
				let _height = this.$store.getters.getPageInfos.content_height - 280;
				if(_height < 400) {
					_height = 400;
				}

				let _top = (_height - 440) / 2;

				return {
					height: _height + 'px',
					"padding-top": _top + 'px'
				}
			},
			spheretop() {
				let _top = (this.$store.getters.getPageInfos.content_height - 440) / 2;
				return {
					top: _top + 'px',
				}
			},
			information_data() {
				//console.log(this.content.information.data);
				return(this.content.information && this.content.information.data) ? this.content.information.data : [];
			}
		},
		created: function() {
			var that = this;
			this._numa = 0;
			this._numb = 0;

			this._loadPromise = new Promise(function(resolve, reject) {
				that.getData();
				resolve();
			});
			

		},
		updated() {
			this.iniTag();
		}

	}
</script>

<style scoped lang="less">
	.wxx-content {
		/*background:url('/static/img/wxxbottom.jpg') no-repeat;*/
		-moz-background-size: 100% 100%;
		background-size: 100% 100%;
		z-index: -10;
		border: 0;
		.topbar {
			text-align: center;
			margin: 0 auto;
			padding-top: 1%;
			text-align: center;
			margin: 0 auto;
			position: relative;
			span {
				margin: 0 10px;
				color: #55bdff;
				font-weight: 200;
				font-size: 26px;
				position: relative;
				top: -25px;
			}
		}
		.cur_year {
			color: #55bdff;
		}
		.content {		
			-moz-background-size: 100% 100%;
			background-size: 100% 100%;
			margin: 2.1% 4%;
			.content_right,
			.content_left {
				div {
					padding: 0px 4%;
					display: block;
				}
				.con_right_but {
					display: flex;
					flex-direction: column;
					div {
						width: 100%;
						height: 120px;
						margin-top: -20px;
					}
					.c_r_b {
						background: url('/static/img/sxbj.png') no-repeat;
						-moz-background-size: 100% 100%;
						background-size: 100% 100%;
						flex-direction: column;
						justify-content: flex-end;
						height: 120px;
						img {
							margin-top: 65px;
							width: 35px;
							margin-right: 30px;
						}
						div {
							height: 80px;
							float: right;
							margin: 37px 0;
							p {
								margin-top: 10px;
								font-size: 12px;
								color: #a2dbff;
								text-align: right;
							}
							P:nth-child(2) {
								color: #abffa2;
							}
						}
						.r_b_left {
							width: 34%;
							justify-content: center;
							
							p {
								font-size: 20px;
							}
							p:nth-child(1) {
								line-height: 25px;
								font-size: 26px;
							}
						}
						.r_b_right {
							width: 32%;
							p {
								margin-top: 10px;
							}
							p:nth-child(1) {
								margin-top: 0px;
							}
							p:nth-child(2) {
								margin-top: 5px;
							}
						}
					}
				}
			}
			.content_left {
				line-height: 35px;
				text-align: center;
				align-items: center;
				position: relative;
				flex-direction: column;
				.con_left_top {
					height: 350px;
					width: 400px;
					margin-top: 20px;
					background: url('/static/img/zzw.png') no-repeat 50%;
					.con_l_t {
						width: 100px;
						height: 100px;
						float: left;
						position: relative;
						background: url('/static/img/qbx.png') no-repeat;
						-moz-background-size: 100% 100%;
						background-size: 100% 100%;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						p {
							color: #55bdff;
							flex: 1;
							line-height: 20px;
							font-size: 13px;
							text-align: center;
						}
					}
					div:nth-child(1) {
						left: 19%;
						top: 5%
					}
					div:nth-child(2) {
						left: 26%;
						top: 6%
					}
					div:nth-child(3) {
						left: 14%;
						top: 37%
					}
					div:nth-child(4) {
						left: 53%;
						top: 37%
					}
					div:nth-child(5) {
						left: -8%;
						top: 38%
					}
					div:nth-child(6) {
						left: -54%;
						top: 7%
					}
					div:nth-child(7) {
						background: none;
						color: #24e3ff;
						font-size: 16px;
						font-weight: bold;
						left: 35%;
						top: -23%
					}
					.nodata {
						background: url('/static/img/shizijia.png') no-repeat;
						-moz-background-size: 100% 100%;
						background-size: 100% 100%;
					}
				}
				.con_left_but {
					padding: 0;
					
					/* background:url('/static/img/baojinshu.png') no-repeat;
						-moz-background-size:100% 100%;
						background-size:100% 100%; */
				}
			}
			.content_right {
				flex-direction: column;
				line-height: 35px;
				text-align: center;
				.con_right_top {
				
					img {
						margin-left: 10%;
						width: 300px;
						height: 300px;
					}
				}
			}
			.content_mid {
				margin-top: 20px;
				justify-content: center;
				.con_mid_top {
					background: url('/static/img/datatop.png') no-repeat;
					background-size: 100% 100%;
					height: 42px;
					justify-content: center;
					white-space: nowrap;
					display: flex;
					max-width: 612px;
					margin: 50px auto 0 auto;
					align-items: center;
					span {
						i {
							font-style: normal;
							padding: 5px 10px;
							margin: 0 2px;
							font-size: 14px;
							border: 1px solid #275e8b;
							border-radius: 2px;
							width: 25px;
							height: 28px;
						}
					}
					.con_mid_top .left {
						float: left;
					}
					.con_mid_top .right {
						float: right;
					}
					span:nth-child(1) {
						flex: 4;
						display: flex;
						justify-content: center;
					}
					span:nth-child(2) {
						flex: 2;
						display: flex;
						justify-content: center;
					}
					span:nth-child(3) {
						flex: 4;
						display: flex;
						justify-content: center;
					}
				}
				.con_mid_con {
					box-sizing: border-box;
					position: relative;
					.summary {
						width: 199px;
						height: 121px;
						color: #cdf0ff;
						font-size: 14px;
						padding: 10px 20px;
						background: url('/static/img/sumbj.png') no-repeat;
						-moz-background-size: 100% 100%;
						background-size: 100% 100%;
						float: left;
						position: absolute;
						left: 12px;
						text-align: left;
						p {
							width: 160px;
							display: block;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						.sum_but {
							margin-top: 15px;
							width: 160px;
							max-height: 100px;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
							overflow: hidden;
						}
					}
					.sphere {
						margin: 30px 0 0 -200px;
						padding: 15px 30px 30px 30px;
						width: 400px;
						height: 360px;
						position: absolute;
						left: 50%;
						background: url('/static/img/zhongxin.png') no-repeat;
						-moz-background-size: 100% 100%;
						background-size: 100% 100%;
						span {
							color: #2ba6d4;
						}
						.tagBall {
							width: 100%;			
							border-radius: 50%;
							height: 100%;
							margin: 0 auto;
							position: relative;
							.tag {
								display: block;
								position: absolute;
								left: 0px;
								top: 0px;
								color: #277eb7;
								text-decoration: none;
								font-size: 20px;
							}
						}
					}
				}
				.con_mid_but {
					height: 107px;
					line-height: 36px;
					background: url('/static/img/timeline.png') no-repeat;
					background-size: contain;
					background-position: center;
					.course_year {
						width: 60%;
						margin: 0 auto;
					}
					.course_content {
						/*width: 60%;*/
						margin: 0 auto;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-align: center;
						max-height: 45px;
					}
					p:nth-child(1) {
						/* 分散对齐 */
						display: -webkit-box;
						display: -webkit-flex;
						display: -ms-flexbox;
						display: flex;
						-webkit-box-pack: justify;
						-webkit-justify-content: space-between;
						-ms-flex-pack: justify;
						justify-content: space-between;
						margin-bottom: 15px;
					}
				}
			}
		}
	}
	
	.content_right .con_right_but {
		margin-top: 60px;
	}
	
	.el-row {
		margin:0;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.grid-content {
		min-height: 100%;
		height: 100%;
	}
	
	

	
	@media (min-width: 1023px) and (max-width: 1280px) {
	.wxx-content .content .content_right .con_right_but .c_r_b:nth-child(1){
				margin-top: 100px;}		
	.wxx-content .content .content_right .con_right_but {					
					flex-direction: column;										
					.c_r_b {
						background: url('/static/img/sxbj_media.png') no-repeat;		
						flex-direction: column;
						justify-content: flex-end;
						align-items: flex-end;
						height:63px;
						background-size: 100% 100%;			
						margin-top: 15px;
						img {
							margin-top: 15px;
							width: 28px;
							margin-right: 35px;
						}
						div {
							
							float: right;
							
							p {								
								font-size: 12px;
								line-height: 35px;
								color: #a2dbff;
								text-align: right;
							}
							P:nth-child(2) {
								color: #abffa2;
							}
						}
						.r_b_left {
							width: 20%;
							justify-content: center;
							position: relative;
							top: -45px;
							right: 10px;
							
							p {
								font-size:14px;
								line-height: 25px;
								
							}
							p:nth-child(1) {							
								font-size:16px;
							}
						}
						.r_b_right {
							width: 42%;	
																
							p:nth-child(1) {
								margin-top: -40px;
								
								
							}
							p:nth-child(2) {
								margin-top: 1px;
							
							}
						}
					}
				}					
    			
		.c {
			width: 100%;
			margin: 0 80px;
		}
		.wxx-content .content .content_mid .con_mid_but {			
			background-size: 100% 100%;
			width: 400px;
			margin: 30px auto 0 auto;
			line-height: 36px;
			font-size: 13px;
		}
		.wxx-content .content .content_left {
			line-height: 35px;
			text-align: center;
			align-items: center;
			position: relative;
			flex-direction: column;
			.con_left_top {
				background: url('/static/img/zzw_media.png') no-repeat 40% 40%;
				
				.con_l_t {
					background: url('/static/img/qbx_media.png') no-repeat 50% 50%;
					p {
						color: #55bdff;
						flex: 1;
						line-height: 20px;
						font-size: 12px;
						text-align: center;
					}
				}
				div:nth-child(1) {
					left: 17%;
					top: 8%
				}
				div:nth-child(2) {
					left: 18%;
					top: 8%
				}
				div:nth-child(3) {
					left: 4%;
					top: 32%
				}
				div:nth-child(4) {
					left: 46%;
					top: 28%
				}
				div:nth-child(5) {
					left: -8%;
					top: 28%
				}
				div:nth-child(6) {
					left: -49%;
					top: 3%
				}
				div:nth-child(7) {
					background: none;
					color: #24e3ff;
					font-size: 16px;
					font-weight: bold;
					left: 35%;
					top: -23%
				}
				.nodata {
					background: url('/static/img/shizijia.png') no-repeat;
					-moz-background-size: 100% 100%;
					background-size: 100% 100%;
				}
			}
		}
		.wxx-content .content .content_mid .con_mid_top {
			width: 28.5rem;
			span {
				i {
					font-style: normal;
					padding: 3px 6px;
					margin: 0 2px;
					font-size: 12px;
					border: 1px solid #275e8b;
					border-radius: 2px;
					width: 1.2rem;
					height: 1.5rem;
				}
			}
		}
		.wxx-content .content .content_mid .con_mid_con .sphere {
			margin: 2.5rem 0 0 -200px;
			padding: 15px 30px 30px 30px;
			width: 20.6rem;
			height: 18.1rem;
			position: absolute;
			left: 55%;
			top: 25%;
			.tagBall {
							width: 120%;			
							border-radius: 50%;
							height: 100%;
							margin: 0 auto;
							position: relative;
							
						}
		}
		
		.r_b_right p {
			white-space: nowrap;
		}
		
	}
	
	@media (min-width: 1279px) and (max-width: 1680px) {
		.c {
			width: 100%;
			margin: 0 80px;
			
		}
		
		.wxx-content .content .content_mid .con_mid_con .sphere {
			margin: 20px 0 0 -200px;
			padding: 15px 30px 30px 30px;
			width: 20.6rem;
			height: 18.1rem;
			position: absolute;
			left: 55%;
			top: 25%;
			
			.tagBall {
							width: 110%;			
							border-radius: 100%;
							height: 100%;							
							margin: 0 auto;
							position: relative;
							
						}
		}
		
		.wxx-content .content .content_mid .con_mid_but {			
			width: 460px;
			background-size: 100% 100%;
			margin: 20px auto 0 auto;
			line-height: 36px;
			font-size: 15px;
		}
		
		.wxx-content .content .content_mid .con_mid_top {
			width: 460px;
			span {
				i {
					font-style: normal;
					padding: 3px 6px;
					margin: 0 2px;
					font-size: 12px;
					border: 1px solid #275e8b;
					border-radius: 2px;
					width: 1.2rem;
					height: 1.5rem;
				}
			}
		}
	.wxx-content .content .content_right .con_right_but .c_r_b:nth-child(1){
				margin-top: 100px;}		
	.wxx-content .content .content_right .con_right_but {					
					flex-direction: column;										
					.c_r_b {
						background: url('/static/img/sxbj_media.png') no-repeat;		
						flex-direction: column;
						justify-content: flex-end;
						align-items: flex-end;
						height:63px;
						background-size: 100% 100%;			
						margin-top: 15px;
						img {
							margin-top: 15px;
							width: 28px;
							margin-right: 35px;
						}
						div {
							
							float: right;
							
							p {								
								font-size: 12px;
								line-height: 35px;
								color: #a2dbff;
								text-align: right;
							}
							P:nth-child(2) {
								color: #abffa2;
							}
						}
						.r_b_left {
							width: 20%;
							justify-content: center;
							position: relative;
							top: -45px;
							right: 10px;
							
							p {
								font-size:14px;
								line-height: 25px;
								
							}
							p:nth-child(1) {							
								font-size:16px;
							}
						}
						.r_b_right {
							width: 42%;	
																
							p:nth-child(1) {
								margin-top: -40px;
								
								
							}
							p:nth-child(2) {
								margin-top: 1px;
							
							}
						}
					}
				}	
		
		
		.con_right_but {
			width: auto;
		}
		.r_b_right p {
			white-space: nowrap;
		}
	}
	
	
	
	
</style>