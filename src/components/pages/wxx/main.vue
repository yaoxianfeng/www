<template>
	<div class="wxx-content" >
		<div class="main_style">
			<div class="topbar" :style="topbar_style">

				<div class="topbar_main">
					<img src="/static/img/titleleft.png">
					<span>{{deptInfo.name}}</span>
					<img src="/static/img/titleright.png">
				</div>

			</div>

			<div class="wxx-main" :style="content_sytle">

				<div class="wxx-main-box">
					<el-row  class="wxx-main-box-row" :gutter="10">
						<!-- 左侧 -->
						<el-col :xs="7" :sm="7" :md="7" :lg="7" class="height100">
							<div class="wxx-main-box-left" >
								<div class="group-component" :style="side_style" @click="showView(1)">
									<div class="comp-radius_lt"></div>
									<div class="comp-radius_lb"></div>
									<div class="comp-radius_rt"></div>
									<div class="comp-radius_rb"></div>

									<areainfocomponent v-if="content" :content="content" ></areainfocomponent>

								</div>
								<div class="group-component" :style="side_style">
									<div class="comp-radius_lt"></div>
									<div class="comp-radius_lb"></div>
									<div class="comp-radius_rt"></div>
									<div class="comp-radius_rb"></div>

									<lbutcomponent ref="lbutcomponent" ></lbutcomponent>

								</div>
							</div>
						</el-col>

						<!-- 中间 -->
						<el-col :xs="10" :sm="10" :md="10" :lg="10" class="height100">
							<div  class="wxx-main-box-center" >

								<div class="group-component" :style="center_style" @click="showView(5)">
									<div class="comp-radius_lt"></div>
									<div class="comp-radius_lb"></div>
									<div class="comp-radius_rt"></div>
									<div class="comp-radius_rb"></div>

									<!-- 中间球以及其上下两部分 -->
									<keywordscomponent v-if="content && isbut" :content="content" :but="but" :buts="buts"></keywordscomponent>

								</div>

							</div>
						</el-col>

						<!-- 右侧 -->
						<el-col :xs="7" :sm="7" :md="7" :lg="7"  class="height100 main-box-right_col">
							<div class="wxx-main-box-right">
								<div class="group-component" :style="side_style" @click="showView(2)">
									<div class="comp-radius_lt"></div>
									<div class="comp-radius_lb"></div>
									<div class="comp-radius_rt"></div>
									<div class="comp-radius_rb"></div>

									<personcomponent v-if="content.population"  ref="personcomponent" :detail="content"  :data1="popudata1" :data2="popudata2" :total="poputotal"></personcomponent>
								</div>
								<div class="group-component" :style="side_style" @click="showView(3)">
									<div class="comp-radius_lt"></div>
									<div class="comp-radius_lb"></div>
									<div class="comp-radius_rt"></div>
									<div class="comp-radius_rb"></div>

									<institutionscomponent v-if="content" :detail="content" ></institutionscomponent>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<viewcomponent v-if="dialogVisible"  @closeView="closeView" :content="content" :but="but" :buts="buts" :imgs="imgs"></viewcomponent>
	</div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
	name: 'wrd_main',
	mixins: [mystyle],
	data() {
		return {
			content: {},
			deptInfo:{},
			dialogVisible:false,
			vuewdata: {
				html: '',
				img: ''
			},
			isbut:false,
			popudata1:new Array(),
			popudata2:new Array(),
			poputotal:'',
			but:new Array(),
            buts:new Array(),
            imgs:new Array()
		}
	},
	components: {
		areainfocomponent: function(resolve, reject) {
			require(['./area_info.vue'], resolve)
		},
		lbutcomponent: function(resolve, reject) {
			require(['./leftbut.vue'], resolve)
		},
		keywordscomponent: function(resolve, reject) {
			require(['./keywords.vue'], resolve)
		},
		institutionscomponent: function(resolve, reject) {
			require(['./institutions.vue'], resolve)
		},
		personcomponent: function(resolve, reject) {
			require(['./personview.vue'], resolve)
		},
		viewcomponent: function(resolve, reject) {
			require(['./view.vue'], resolve)
		}
	},
	methods: {
		getDeptInfo:function() {
			this.deptInfo = global.data.getUserInfo().dept;
			this.getData();
		},
		getData() {
			let that = this;
			let _param = {
				token: global.data.getToken()
			}
			that.$http.post(global.config.weburl + 'api/deptInformation/queryDataNew.do', _param).then(function(res) {
				var code = res.data.code;
				console.log(res)
				if(code == 0) {
					that.content = res.data.data;
					that.popudata();
					console.log(that.content.course)
				} else {
					global.tools.handleError(res.data);
				}
			});
		},
		showView(index) {
			let that = this;

			var Bus=global.eventHub;
			Bus.$emit("hideleft");

			if (!this.content) {
				return false;
			}

			if(index == 5) {
				 that.dialogVisible = true;
				 that.vuewdata=that.content.course;
			}
		},
		// showView(index) {
		// 	let that = this;

		// 	var Bus=global.eventHub;
		// 	Bus.$emit("hideleft");

		// 	if (!this.content) {
		// 		return false;
		// 	}

		// 	that.dialogVisible = true;
		// 	if(index == 1) {
		// 		that.detail.html = that.content.information.description;
		// 	} else if(index == 2) {
		// 		that.detail.html = that.content.population.description;
		// 	} else if(index == 3) {
		// 		that.detail.html = that.content.institution.description;
		// 	} else if(index == 5) {
		// 		that.detail.html = that.content.hot.description;
		// 		// console.log(that.detail.html)
		// 	}
		// 	that.detail.img = "../../../../static/images/" + index + ".png";
		// },
		closeView() {
			this.dialogVisible = false;
		},
		popudata(){
			let n=-1;
			for(let i=0;i<this.content.population.length;i++){
				if(i==1){
					this.poputotal=this.content.population[i].data;
				}
				if(i>0 && i<3){
		   			for(let j=0;j<3;j++){
		   				this.popudata1[j]={name:(this.content.population[i+j].title),value:(this.content.population[i+j].data)}
		   			}
				}
				if(i>4 && i<this.content.population.length){
					n++;
		   				this.popudata2[n]={name:(this.content.population[i].title),value:(this.content.population[i].data)}

				}
			}
			// console.log(this.content.course)
				
			for(let i=0;i<5;i++){
              this.buts.push(this.content.course[i].data);
              this.but.push(this.content.course[i].title);
              this.imgs.push(this.content.course[i].image);
            }
            
            this.isbut=true;
		}

	},
	computed: {
		content_height () {
			let _height = global.app.$store.getters.getPageInfos.content_height * 86.5 /100;
			if (_height < 500) {
				_height = 500;
			}
			return _height;
		},
		content_sytle() {
			let _height = this.content_height;
			let _top = global.app.$store.getters.getPageInfos.content_height * 7 /100;
			return  {height:_height + "px",'margin-top':_top+'px','padding':'10px 3% 10px 4.5%'}
		},
		center_style()  {
			let _comp_height = this.content_height - 20;
			return {height:_comp_height+ "px"}
		},
		side_style()  {
			let _comp_height = this.content_height - 20;
			return {height:(_comp_height-10)/2+ "px"}
		}
	},
	created() {
		this.getDeptInfo();
	},
	mounted() {

	},
	updated() {

	}
}
</script>
<style scoped>
	.wxx-content{
		min-height: 600px;
		min-width: 1200px;
	}

	.topbar {
		text-align: center;
		margin: 0 auto;
		padding-top: 1%;
		text-align: center;
		margin: 0 auto;
		position: relative;
	}
	.topbar .topbar_main{
		position: absolute;
		width: 100%;
		bottom: -30px;
	}
	.topbar span {
		margin: 0 10px;
		color: #55bdff;
		font-weight: 200;
		font-size: 26px;
		position: relative;
		top: -25px;
	}

	.wxx-main-box{

		width: 100%;
		height: 100%;
	}
	.wxx-main-box-row{
		width: 100%;
		height: 100%;
	}
	.wxx-main-box-left{
		height: 100%;

	}
	.wxx-main-box-center{
		height: 100%;

	}
	.wxx-main-box-right{
		height: 100%;

	}
	.group-component{
		background-color: rgba(131,200,255,0.1);
		position: relative;
	}

	.group-component:nth-child(2n){
		margin-top: 10px;
	}



	.height100{height: 100%}
	.wxx-main-box-row .main-box-right_col{
		padding-right: 0 !important;
	}

	.comp-radius_lt {
		width: 20px;
		height: 20px;
		position: absolute;
		top:0px;
		left:0px;
		border-left: 1px solid #4c8fab;
		border-top: 1px solid #4c8fab;
	}
	.comp-radius_lb {
		width: 20px;
		height: 20px;
		position: absolute;
		bottom:0px;
		left: 0px;
		border-left: 1px solid #4c8fab;
		border-bottom: 1px solid #4c8fab;
	}
	.comp-radius_rt {
		width: 20px;
		height: 20px;
		position: absolute;
		right:0px;
		top:0px;
		border-right: 1px solid #4c8fab;
		border-top: 1px solid #4c8fab;
	}
	.comp-radius_rb {
		width: 20px;
		height: 20px;
		position: absolute;
		right:0px;
		bottom: 0px;
		border-right: 1px solid #4c8fab;
		border-bottom: 1px solid #4c8fab;

	}

</style>