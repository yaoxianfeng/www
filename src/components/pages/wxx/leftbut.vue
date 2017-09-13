<template>
	<div class="cs-con-but">

		<div class="area_alarm-title">警情动态</div>

		<div class="area_alarm-main">
			<div class="echarts">
				<div class="echart_line lineleft-active"></div>
				<div id="xqjl_echarts_bar" class="echart_box"></div>
			</div>
		</div>

		<!--<div class="but-number" :style="chartHeight">
          <span class="baojin">
            <p>报警数</p><p>682</p>
          </span>
          <span class="jiean">
            <p>结案数</p><p>591</p>
          </span>
        </div>-->
		<!--<div class="indexs">
			<div v-if="appraise && appraise.length>0" class="tops" :style="appraise_style">
				<p>{{appraise[cur_index]}}</p>
				<p></p>
			</div>
			<div class="buts" :style="total_appraise_style">
				<p></p>
				<p>{{totalApprasie}}</p>
			</div>
			<p class="line"><i></i><i></i><i></i><i></i><b></b></p>
			<span class="sati">居民满意度</span>
		</div>-->
	</div>
</template>

<script>
	export default {
		data: () => {
			return {
				xqjl_echarts_bar: null,
				cur_time: new Date().getTime(),
				appraise: [], //评价列表
				totalApprasie: '', //总评价
				cur_index: 0,
				appraise_style: {}, //评价
				total_appraise_style: {}, //总评价
				timeInter: null,
				/*option: {

					tooltip: {},
					xAxis: {
						data: [],
						name: '',
						silent: false,
						splitArea: {
							show: false
						},
						splitLine: {
							show: false,
							lineStyle: {
								type: 'dashed',
								color: "#0177B4"
							}
						},
						nameTextStyle: {
							color: "#0177B4",
							fontStyle: "italic"
						},
						axisLine: {
							onZero: true,
							lineStyle: {
								color: "#0177B4"
							}
						}
					},
					yAxis: {
						inverse: false,
						splitArea: {
							show: false
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								color: "#0177B4"
							}
						},
						nameTextStyle: {
							color: "#0177B4",
							fontStyle: "italic"
						},
						axisLine: {
							lineStyle: {
								color: "#0177B4"
							}
						}
					},
					grid:{
						top:20,
						bottom:20,
						containLabel:true
					},
					animation: true,
					series: [{
							name: '报警数',
							type: 'bar',
							stack: '案情数',
							data: [],
							barMaxWidth: 18,
							itemStyle: {
								normal: {
									opacity: 0.8,
									color: '#32a5eb'
								}
							}
						},
						{
							name: '结案数',
							type: 'bar',
							stack: '案情数',
							data: [],
							barMaxWidth: 20,
							itemStyle: {
								normal: {
									opacity: 0.4,
									color: '#32a5eb'
								}
							}
						}
					]
				}*/

				option: {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					color: ['#3C6AA6', '#A6733C', '#ff5534'],
					legend: {
						data: [{
								name: '新警情',
								textStyle: {
									color: "#568dd6"
								}
							},
							{
								name: '已处理',
								textStyle: {
									color: "#a6733d"
								}
							},
							{
								name: '居民满意度',
								textStyle: {
									color: "#ff5534"
								}
							}
						]
					},

					grid: {
						left: '3%',
						right: '6%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
							type: 'category',
							data: [],
							axisPointer: {
								type: 'shadow'
							},
							splitLine: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#52b0ff',
									width: 1
								}
							},

						},

					],
					yAxis: [{
							type: 'value',
							name: '警情数量',
							axisLabel: {
								formatter: '{value}'
							},
							splitLine: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#52b0ff',
									width: 1

								}
							},
							
							 axisLabel:{  
                        interval:0,  
                        
                        margin:12,  
                        textStyle:{  
                            
                            color:"#52b0ff"  
                        }  
                    },    

						},

						{
							type: 'value',
							name: '满意度分值',
							min: 0,
							max: 5,
							interval: 1,
							splitLine: {
								show: true,
								lineStyle: {
									color: '#0060AE',
									width: 1
								}
							},
							
								 axisLabel:{  
                        interval:0,  
                        
                        margin:10,  
                        textStyle:{  
                            
                            color:"#52b0ff"  
                        }  
                    },    

							axisLine: {
								lineStyle: {
									color: '#52b0ff',
									width: 1
								}
							},

						}
					],
					series: [{

							name: '新警情',
							type: 'bar',
							data: []

						},
						{
							name: '已处理',
							type: 'bar',
							data: []
						},
						{
							name: '居民满意度',
							type: 'line',
							yAxisIndex: 1,
							data: []
						}
					]
				}

			}
		},
		methods: {
			echartsresize() { //echarts图表随窗口变化而变化
				if(this.xqjl_echarts_bar) {
					this.xqjl_echarts_bar.resize();

				}
			},

			/*	isFullscreen(){
				 if(explorer.indexOf('chrome')>0){
                if (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width) {
                 
                } else {
                   
                }
            }else{
                if (window.outerHeight == screen.height && window.outerWidth == screen.width) {
                   
                } else {
                    
                }
            }
				
			},
*/
			getRight(appraise) {
				if(appraise) {
					let _val = parseFloat(appraise);
					let _right = 0;

					_right = parseFloat(5 - _val) * 20 * parseFloat(354 / 100) - 15 + parseInt(5 - _val);

					//                if (5-_val <= 1) {
					//                    _right = parseFloat(5-_val)*parseFloat(55);
					//                } else {
					//                    _right = (5-_val)*55 + 6 + (parseInt(5-_val) -1) * 22;
					//                }

					return {
						right: _right + "px"
					};
				} else {
					return {
						right: 0
					};
				}
			},
			getCurAppraise() {
				let _cur_index = this.cur_index;
				_cur_index++;
				if(_cur_index >= this.appraise.length) {
					_cur_index = 0;
				}

				this.cur_index = _cur_index;
				let _cur_appraise = this.appraise[_cur_index];

				this.appraise_style = this.getRight(_cur_appraise);

			},

			createdTimeInterval() {

				if(this.timeInter) {
					window.clearInterval(this.timeInter);
					this.timeInter = null;
				}

				/* this.timeInter =  setInterval(()=>{
                
            },1000);
*/
				this.getCurAppraise();

			},

			getdata() {
				let that = this;
				let _param = {
					token: global.data.getToken()
				};
				that.$http.post(global.config.weburl + '/api/analysis/alertDoneBarChar.do', _param).then(function(res) {

					if(res.data.code == 0) {

						let _data = res.data.data;
						let _done = _data.done;
						let _arr = [];
						_done && _done.forEach(function(item, index) {
							_arr.push(item);
						})

						/*that.option.xAxis[0].data = _data.date;
						that.option.series[0].data = _data.recevie;
						that.option.series[1].data = _arr;
						that.option.series[2].data = _data.appraise;*/
						
						that.option.xAxis[0].data = _data.date;
						that.option.series[0].data = _data.recevie;
						/*that.option.series[1].data = _arr;*/
						that.option.series[1].data = _data.appraise;
						that.option.series[2].data = _data.appraise;
						that.xqjl_echarts_bar.setOption(that.option);

					} else {
						global.tools.handleError(res.data);
					}

				}, function(error) {

				});
			}
		},
		created: function() {
			this.getdata();
		},
		mounted: function() {
			this.xqjl_echarts_bar = echarts.init(document.getElementById('xqjl_echarts_bar'));

		},
		computed: {
			getPageInfos() {
				return this.$store.getters.getPageInfos;
			},

			contentHeight() {
				return this.$store.getters.getPageInfos.content_height;
			},
			contentWidth() {
				return this.$store.getters.getPageInfos.content_width;
			},

			chartWidth() {
				return {
					width: this.getPageInfos.content_width - 240 + "px"

				}
			}
		},
		watch: {
			getPageInfos: {
				handler(curVal, oldVal) {　　　　　　　
					if(this.cur_time && this.cur_time < new Date().getTime() - 400) {
						this.cur_time = new Date().getTime();
						this.echartsresize();
					}　　　　　
				},
				deep: true
			}
		}

	}
</script>

<style lang="less">
	.cs-con-but {
		bottom: 0;
		.area_alarm-title {
			color: #ffb83c;
			font-size: 18px;
			position: absolute;
			top: 10px;
			left: 20px;
		}
		.area_alarm-main {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -120px;
			margin-left: -150px;
			height: 240px;
			width: 300px;
		}
		@media (max-width: 1600px) {
			.area_alarm-main {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -96px;
				margin-left: -120px;
				height: 192px;
				width: 240px;
			}
		}
		@media (max-height: 900px) {
			.area_alarm-main {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -96px;
				margin-left: -120px;
				height: 192px;
				width: 240px;
			}
		}
		.echarts {
			width: 108%;
			height: 100%;
			position: relative;
			background: url('/static/images/wxx_bar_bg.png') no-repeat;
			background-size: 100% 100%;
			right: 2%;
			.echart_box {
				height: 100%;
			}
			.echart_line {
				position: absolute;
				z-index: 5;
				width: 10%;
				height: 100%;
				background-color: rgba(00, 00, 00, 0.2);
				border-right: 1px solid #0177B4;
			}
		}
		.but-number {
			float: right;
			width: 50px;
			span {
				margin: 0 35%;
				width: 100%;
				text-align: center;
				color: #a2fffc;
			}
		}
		.indexs {
			width: 354px;
			height: 60px;
			float: left;
			margin-top: 10px;
			position: relative;
			.tops,
			.buts {
				font-size: 12px;
				position: absolute;
			}
			.tops {
				color: #01cef4;
				width: 20px;
				bottom: 35px;
				p {
					width: 100%;
					text-align: center;
					height: 18px;
					line-height: 18px;
				}
				p:nth-child(2) {
					width: 0;
					height: 0;
					border-left: 5px solid transparent;
					border-right: 5px solid transparent;
					border-top: 10px solid #01cef4;
				}
			}
			.buts {
				width: 20px;
				color: #31bd91;
				margin-top: 35px;
				p {
					height: 18px;
					line-height: 18px;
				}
				p:nth-child(1) {
					width: 0;
					height: 0;
					border-left: 5px solid transparent;
					border-right: 5px solid transparent;
					border-bottom: 10px solid #31bd91;
				}
			}
			.line {
				background: #32a5eb;
				width: 100%;
				height: 2px;
				margin-top: 30px;
				position: relative;
				b {
					width: 0;
					height: 0;
					border-top: 5px solid transparent;
					border-left: 10px solid #32a5eb;
					border-bottom: 5px solid transparent;
					position: absolute;
					right: -10px;
					top: -4px;
				}
				i {
					width: 2px;
					height: 11px;
					background: #32a5eb;
					float: right;
					display: inline-block;
					display: flex;
					-ms-flex-pack: justify;
					margin-top: -5px;
					margin-right: 20%;
					/* font-size: 26px;width: 20px;top:-19px;color: #32a5eb;font-style:normal;float: right;display:-webkit-box;
              display:-webkit-flex;
              display:-ms-flexbox;
              display:flex;
              -webkit-box-pack:justify;
              -webkit-justify-content:space-between;
              -ms-flex-pack:justify;
              justify-content:space-between;margin-right: 15%;
              position: relative;*/
				}
			}
			.sati {
				font-size: 12px;
				color: #2ca784;
			}
		}
	}
	/*@media (min-width: 1023px) and (max-width: 1280px) {
		.cs-con-but {
			.echarts {
				max-height: 250px;
				width: 300px;
				position: relative;
				background-size: 100% 100%;
			
				
			}
		}
		
	}
	
	@media (min-width: 1279px) and (max-width: 1679px) {
		.cs-con-but {
			.echarts {
				max-height: 250px;
				width: 320px;
			}
		}
	}
	
	
	
 
	
	@media (min-width: 1280px) and (max-width: 1920px){
		.cs-con-but {
			.echarts {
				max-height: 250px;				
				position: relative;
				top: 10px;	
				background-size: 100% 100%;
			 
				
			}
		}
		
	}*/
</style>