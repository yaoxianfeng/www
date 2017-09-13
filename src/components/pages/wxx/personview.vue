<template>

	<div class="personview_page_content">

		<div class="area_person-title">辖区人口</div>
		<div class="area_person-main">

			<div class="tong_x"></div>
			<div class="personview_echarts" id="personview_chart1"></div>
			<div class="personview_total" v-if="total">
				<div class="personview_total_num">{{total}}</div>
				<div class="person_unit">万人</div>
			</div>
		</div>
	</div>

</template>

<script>
	const DICT_ALARM_CATE = "alertClassifyDict";
	const PREFIX_AFARM_TYPE_CODE = "code_";

	export default {
		props: {
			echart_height: {
				type: Number,
				default: 300,
			},
			data1: {
			},
			data2: {
			},
			total: ""
		},
		data: function() {
			return {
				cur_time: new Date().getTime(),
				personview_chart1: null,
				option1: {
					grid:{
						height:300,
						width:300,
						left:'50%',
						right:'50%',
						top:'50%',
						bottom:'50%',
						containLabel:true
					},
					legend: {
						orient: 'vertical',

						right:16,
						bottom:10,
						textStyle:{
							color:'#fff'
						},
						data:[],
						selectedMode:false,
						formatter: (name)=> {
							let _data1 = this.data1;
							let _legend_data = [];
							let _val = "";
							_data1 && _data1.forEach(function(item, index) {

								if (name == item.name) {
									_val = item.value;
									return;
								}

							})

							return name + " "+ _val ;
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					//					graphic: {
					//						type: 'image',
					//						left: 15,
					//
					//						style: {
					//							image: '/static/images/wxx_chart_bg.png',
					//							width: 350,
					//							height: 350,
					//							opacity: 0.4,
					//							data:{
					//								div_map:'div_map'
					//							}
					//						}
					//					},
					series: [{
						name: '人员类型',
						type: 'pie',
						selectedMode: 'single',
						scaleLimit: {
							min: 0.8,
							max: 1.1
						},
						radius: ['20%', '36%'],
						roseType: 'radius',
						label: {
							normal: {
								show: false
								//                                    position: 'inside',
								//                                    textStyle:{
								//                                        color:"#6FDC6F",
								//                                        fontSize:10
								//                                    }
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						itemStyle: {
							normal: {
								opacity: 0.4
							}
						}

					},
						{
							name: '人员',
							type: 'pie',
							radius: ['60%', '72%'],
							roseType: 'radius',
							data: [],
							label: {
								normal: {
									show: false
									//                                    position: 'inside',
									//                                    textStyle:{
									//                                        color:"#6FDC6F",
									//                                        fontSize:10
									//                                    }
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							itemStyle: {
								normal: {
									opacity: 0.4
								}
							}
						}
					]
				}
			}
		},
		methods: {
			echartsresize() { //echarts图表随窗口变化而变化
				if(this.personview_chart1) {
					this.personview_chart1.resize();

				}
			}
		},
		computed: {
			getPageInfos() {
				return this.$store.getters.getPageInfos;
			}
		},
		watch: {
			getPageInfos:{
				handler(curVal,oldVal){
					if(this.cur_time && this.cur_time < new Date().getTime() - 400) {
						this.cur_time = new Date().getTime();
						this.echartsresize();
					}
				},
				deep:true
			}
		},
		created: function() {

		},
		mounted() {
			this.personview_chart1 = echarts.init(document.getElementById('personview_chart1'));
			let _colorArr = ["#4292c5", "#a2dbff", "#42c5ab"];
			//            let _lable_colorArr = ["#108AC6","#6FDC6F","#30577C"];
			let _data1 = this.data1;
			let _legend_data = [];
			_data1 && _data1.forEach(function(item, index) {

				item["itemStyle"] = {
					normal: {
						opacity: 0.4,
						color: _colorArr[index]
					}
				}
				_legend_data.push(item["name"]);

				//                item["label"]= {
				//                    normal: {
				//                        position: 'inside',
				//                        textStyle:{
				//                            color:_lable_colorArr[index],
				//                            fontSize:10
				//                        }
				//                    }
				//                }
			})

			let _data2 = this.data2;
			_data2 && _data2.forEach(function(item, index) {
				item["itemStyle"] = {
					normal: {
						opacity: 0.6,
						color: _colorArr[index]
					}
				}
				//_legend_data.push(item["name"]);
			})

			this.option1.series[0].data = _data1;
			this.option1.series[1].data = _data2;


			this.option1.legend.data= _legend_data;

			this.personview_chart1.setOption(this.option1);

		}
	}
</script>
<style lang="less">
	.personview_page_content:after {
		clear: both;
	}

	.personview_page_content {
		height: 100%;
		width: 100%;
		position: relative;
		/*background: url("/static/images/wxx_chart_bg.png") no-repeat;
        background-size: cover cover;*/
		padding: 0 !important;


	.area_person-title{
		color: #ffb83c;
		font-size: 18px;
		position: absolute;
		top:10px;
		right: 20px;
	}

	.area_person-main{
		position: absolute;
		/*top: 50%;
		left: 50%;
		margin-top: -150px;
		margin-left: -150px;
		height: 300px;
		width: 300px;*/
		height: 100%;
		width: 100%;


	.tong_x {
		background: url("/static/images/wxx_chart_bg.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		width: 300px;
		height: 300px;
		top: 50%;
		left:50%;
		margin-left: -150px;
		margin-top: -150px;
	}


	@media (max-width: 1600px) {
		.tong_x {
			background: url("/static/images/wxx_chart_bg.png") no-repeat;
			background-size: 240px 240px;
			position: absolute;
			width: 240px;
			height: 240px;
			top: 50%;
			left:50%;
			margin-left: -120px;
			margin-top: -120px;
		}
	}

	@media (max-height: 900px) {
		.tong_x {
			background: url("/static/images/wxx_chart_bg.png") no-repeat;
			background-size: 240px 240px;
			position: absolute;
			width: 240px;
			height: 240px;
			top: 50%;
			left:50%;
			margin-left: -120px;
			margin-top: -120px;
		}
	}


	#personview_chart1 {
		/*height: 300px;
		width: 300px;*/
		height: 100%;
		width: 100%;

	canvas {
		left: -20px;
	}
	}

	.personview_total {
		cursor: pointer;
		position: absolute;
		width: 60px;
		margin-left: -30px;
		left: 50%;
		top: 50%;
		color: #1DB6CF;
		margin-top: -30px;

	.personview_total_num {
		font-size: 26px;
		text-align: center;
		color: #24e3ff;
	}

	.person_unit {
		text-align: center;
		height: 20px;

		font-size:  14px;
		color: #24e3ff;

	}
	}
	}


	}


	/*@media (min-width: 1024px) and (max-width: 1280px) {
		.personview_page_content {
			position: absolute;
			#personview_chart1 {
				position: relative;
				right: 10px;
				top: 50px;
				width: 280px;
				height: 280px;
			}
		}
		.personview_page_content .tong_x {
			width: 280px;
			height: 280px;
			top: 50px;
			left: -10px;
		}
		.personview_page_content .personview_total .personview_total_num {
			position: relative;
			right: 57px;
			top: 20px;
		}
		.personview_page_content .personview_total .person_unit {
			position: relative;
			right: 57px;
			top: 20px;
		}
	}

	@media (min-width: 1279px) and (max-width: 1680px) {
		.personview_page_content {
			width: 290px;
			position: relative;
			#personview_chart1 {
				position: relative;
				right: 50px;
			}
		}
		.personview_page_content .tong_x {
			width: 290px;
			height: 290px;
			top: 30px;
			left: -5px;
		}
		.personview_page_content .personview_total .personview_total_num {
			position: relative;
			right: -10px;
			top: 2px;
		}
		.personview_page_content .personview_total .person_unit {
			position: relative;
			right: -10px;
			top: 8px;
		}
	}*/
</style>