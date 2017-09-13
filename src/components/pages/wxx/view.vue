<template>

	<div class="ha-dialogPop wxx-view_page">
		<div class="ha-dialog__wrapper" @click='close()'></div>
		<div class="ha-dialog wxx-view-dialog">
			<div class="ha-dialog__body wxx-view_page__body">
				<div class="wxx-model-top">
					<div class="top_left"><span>荣誉展示</span><span>Honor show</span></div>
					<div class="top_center">
						<span :title="view_title">{{view_title}}</span>
					</div>
				</div>
				<div class="wxx-model_logo">
					<img class="model_logo_img" src="/static/img/dateil.png"/>
					<!-- <img class="model_logo_img" :src="'/static/img/'+showimg"/> -->
				</div>
				<div class="wxx-model_detail">
					<div></div>
					<ul>
						<li>{{view_summary}}</li>
					</ul>
				</div>
				<div class="wxx-model_bottom">
					<div class="wmb_left">
						<i :class="[goleft?'i_left1':'']"></i>
						<i :class="[goleft?'i_left2':'']"></i>
						<i :class="[goleft?'i_left3':'']"></i>
						<span :class="[goleft?'leftspan':'']"></span>
					</div>
					<div class="ullist">
						<ul>
							<li v-for="item in list" @click=titles(item) :title="item.data" :class="[goleft?'goto_left':goright?'goto_right':'']" >{{item.data}}</li>
						</ul>
						<ul>
							<li v-for="item in list" @click=titles(item) :title="item.data" :class="[goleft?'goto_left':goright?'goto_right':'']" >{{item.data}}</li>
						</ul>
						<ul>
							<li v-for="item in list" @click=titles(item) :title="item.data" :class="[goleft?'goto_left':goright?'goto_right':'']" >{{item.data}}</li>
						</ul>
					</div>
					<div class="wmb_right">
						<span :class="[goright?'rightspan':'']"></span>
						<i :class="[goright?'i_right1':'']"></i>
						<i :class="[goright?'i_right2':'']"></i>
						<i :class="[goright?'i_right3':'']"></i>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import mystyle from '../../../util/vue/style';
	export default {
		name: 'wxx_view',
		mixins: [mystyle],
		props: {
			content: '',
			but:'',
            buts:'',
            // imgs:''
		},
		data: function() {
			return {
				view_title:'',
				view_summary:{},
				isaction:false,
				list:[],
				datas:{},
				showimg:'',
				interlist:[],
				goleft:false,
				goright:false,
				extent:'',
				imgs:["A.jpg","B.jpg","C.jpg","D.jpg","X.jpg"],
				
			}
		},
		methods: {

			titles(item){
				console.log(item)
				var that=this;
				let num;
				let onum;
				let leng;
				let differ;
				leng = (this.list.length)*1;
				for(let j=0;j<leng;j++){
					if(item==this.list[j]){
						num=j;
					}
				}
				this.showimg=item.imgs;
				this.showimg=this.imgs[num];
				onum=Math.abs(2-num);
				this.view_summary=item.summary;
				console.log("view_summary:  "+ this.view_summary)
				this.view_title=item.data +"  "+ item.title;
				this.isaction=true;
				leng = (this.list.length)*1;
				differ=(this.extent)*1-leng*1;

				if(num<2){
					console.log("=====>")
					this.goleft=true;
					for(let i=onum;i>0;i--){
						this.interlist.push(this.list[leng-i])
					}
					this.interlist.push.apply( this.interlist , this.list)
					this.list=this.interlist;
					this.list.splice(leng, onum);
				}else if(num>2){
					console.log("<=====")
					this.goright=true;
					for(let i=0;i<onum;i++){
						this.interlist.push(this.list[i])
					}
					this.list.push.apply( this.list,this.interlist )
					this.list.splice(0, onum);
				}
				this.interlist=[];
				var tt=setTimeout(function(){
					that.goright=false;
					that.goleft=false;
					tt=null;
				},onum*200)
				
			},
			close() {
				this.$emit("closeView")
			}
		},
		computed: {

		},
		created: function() {

		},
		mounted() {
			this.datas=this.content.course;
			this.extent=this.content.course.length;
			for(let i=0;i<5;i++){
				this.list.push(this.datas[i])
			}
			// this.datas.splice(0,5);
			this.view_title=this.datas[2].data +"  "+ this.datas[2].title;
		}
	}
</script>
<style lang="less">
	.wxx-view_page {
		display: flex;
		.el-dialog,
		.ha-dialog {
			border: none;
		}
		.el-dialog:after,
		.ha-dialog:after {
			background: none;
		}
		.el-dialog:before,
		.ha-dialog:before {
			background: none;
		}
		.wxx-view-dialog {
			z-index: 9999;
			height: 800px;
			width: 1400px;
			/* background-color: #06243c; */
			background: url("../../../../static/images/popup.png")no-repeat;
			background-size: 100% 100%;
			position: absolute;
			display: flex;
			top: 50%;
			left: 50%;
			margin-top: -400px;
			margin-left: -700px;
			.ha-dialog__body {
				background: none;
			}
			.wxx-view_page__body {
				width: 100%;
				height: 100%;
				padding: 3%;
				.wxx-model-top{
					background: url("../../../../static/img/topcontbj.png") no-repeat;
					background-size: 100% 120%;
					width: 100%;height: 10%;border: 1px solid #275e8b;border-radius: 5px;
					margin-bottom: 2%;
					position: relative;
					.top_left{margin-left: 1%;
						float: left;height: 100%;width: 140px;
						span{width: 100%;height: 50%;display: block;padding: 5px 0;}
					}
					.top_center{float: left;width: 20%;height: 70%;background: #42648c;padding:1%;margin-top: 0.7%;margin-left: 30%;white-space: nowrap; text-align:center; text-overflow:ellipsis; overflow:hidden;border-radius: 5px;}
				}
				.wxx-model_logo {
					display: inline-block;
					width: 68%;
					height: 65%;
					position: absolute;
					text-align: center;
					margin: 0 auto;
					.model_logo_img {
						width: 100%;
						height: 100%;
					}
				}
				.wxx-model_detail {
					display: inline-block;
					width: 25%;
					height: 65%;
					position: absolute;
					left: 72%;
					background: url("../../../../static/img/dateil.png") 80% no-repeat;
					overflow: hidden;
					line-height: 2;
					div{
						width: 100%;height: 100%;background-color:#000;
					opacity: 0.4;position: relative;left: 0;top: 0;
					}
					ul{
						margin: 5%;
						position: absolute;top: 0;left: 0;
						width: 90%;height: 100%;
						li{
							color: #fff;
						}
					}
				}
				.wxx-model_bottom{
					width: 90%; height: 10%;
					position: absolute;margin: 0 5%;
					left: 0;top: 86%;
					.wmb_left{
						float: left;height: 100%; width: 9%;
						padding-top: 2%;
						i{width: 10px; height: 10px;background:#275e8b;border-radius: 50%;display: block;float: left;margin: 0 5px;position: relative;
						}
						.i_left1{
							animation: _left 0.5s 1 0s linear normal;
						}
						.i_left2{
							animation: _left 0.5s 1 0.1s linear normal;
						}
						.i_left3{
							animation: _left 0.5s 1 0.2s linear normal;
						}
						span{
							width: 30px;height: 10px;background: #275e8b;border-radius: 5px;margin: 0 5px; float: left;display: block;position: relative;
						}
						.leftspan{animation: _left 0.5s 1 0.3s linear normal;}
					}
					.wmb_right{
						float: right;height: 100%; width: 9%;padding-top: 2%;
						i{width: 10px; height: 10px;background:#275e8b;border-radius: 50%;display: block;float: left;margin: 0 5px;position: relative;
						}
						.i_right1{
							animation: _right 0.5s 1 0.2s linear normal;
						}
						.i_right2{
							animation: _right 0.5s 1 0.1s linear normal;
						}
						.i_right3{
							animation: _right 0.5s 1 0s linear normal;
						}
						span{
							width: 30px;height: 10px;background: #275e8b;border-radius: 5px;margin: 0 5px; float: left;display: block;position: relative;
						}
						.rightspan{animation: _right 0.5s 1 0.3s linear normal;}
					}
					.ullist{height: 100%;width: 80%;float: left;position: relative;overflow: hidden;}
					ul{height: 100%;width: 100%;float: left;position: relative;}
					ul li{display:inline-block; width: 17.5%;margin: 0 1%; height: 60%;background: url("../../../../static/img/tkalbj.png") no-repeat;background-size: 100% 100%;white-space: nowrap;  text-overflow:ellipsis; overflow:hidden;float: left;text-align: center;padding:1% 2%;margin-top: 1%;cursor: pointer;position: relative; float: left;}
					ul:nth-child(3){top: -158px;left: -100%;}
					ul:nth-child(2){top: -78px;left: 100%;}
					ul:nth-child(1) li:nth-child(3){
						margin: 0.2% 0.5%; height: 70%;padding:2% 2%;width: 20%}
					.goto_left{
						animation-fill-mode: forwards;
						animation: goto_left 0.5s infinite linear normal; 
					}
					.goto_right{
						animation-fill-mode: forwards;
						animation: goto_right 0.5s infinite linear normal; 
					}
				}
			}
		}
	}
	@media (min-width: 1024px) and (max-width: 1280px) {
		.wxx-view_page {
			display: flex;
			.wxx-view-dialog {
				height: 550px;
				width: 1000px;
				left: 50%;
				margin-top: -275px;
				margin-left: -500px;
				.wxx-view_page__body {
					width: 100%;
					height: 100%;
					padding: 3%;
					.wxx-model_logo {
						width: 68%;
						height: 65%;
						.model_logo_img {
							width: 100%;
							height: 100%;
						}
					}
					.wxx-model_detail {
						width: 25%;
						height: 65%;
					}
				}
			}
		}
	}
	@media (min-width: 1280px) and (max-width: 1600px) {
		.wxx-view_page {
			display: flex;
			.wxx-view-dialog {
				height: 600px;
				width: 1000px;
				top: 50%;
				left: 50%;
				margin-top: -300px;
				margin-left: -500px;
				.wxx-view_page__body {
					width: 100%;
					height: 100%;
					padding: 3%;
					.wxx-model_logo {
						width: 68%;
						height: 65%;
						.model_logo_img {
							width: 100%;
						height: 100%;
						}
					}
					.wxx-model_detail {
						width: 25%;
					height: 65%;
					}
				}
			}
		}
	}
	@keyframes _left{
		0%{left:0px; }
		50%{left:20px;}
		100%{left: 0;}
	}
	@keyframes _right{
		0%{right:0px; }
		50%{right:20px;}
		100%{right: 0;}
	}
	@keyframes goto_left{
		0%{left:0px; }
		100%{left: 40%;}
	}
	@keyframes goto_right{
		0%{right:0px; }
		100%{right: 40%;}
	}
	@keyframes bigs{
		0%{ width: 18%;margin: 0 1%; height: 60%;}
		100%{ width: 20%;margin: 0 0.5%; height: 80%;}
	}
</style>