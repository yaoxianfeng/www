<template>
	<div class="wel-content"  @click="gotoIndex">
		<div class="main_style">
			<div class="topbar" style="height:14.8%;padding-top: 4%;">
				<div class="titlebg">
					<img class="wel_face" src="/static/img/welcome/face.png">
					<img class="item1" src="/static/img/welcome/title.png"/>					
					<img class="item2" src="/static/img/welcome/title2.png"/>
					<img class="item3" src="/static/img/welcome/title3.png"/>
					<img class="item4" src="/static/img/welcome/title4.png"/>
					<img class="item5" src="/static/img/welcome/title5.png"/>
					<img class="item6" src="/static/img/welcome/title6.png"/>
					<img class="item7" src="/static/img/welcome/title7.png"/>
					<img class="item8" src="/static/img/welcome/title8.png"/>
					<img class="item9" src="/static/img/welcome/title9.png"/>
					<span>{{deptInfo.name}}</span>
				</div>
			</div>
			<div class="content css-transforms">

				<centercomponent></centercomponent>
				<fancomponent></fancomponent>




				<!--<div class="cs-roleFun">
                    <ul class="cs-role">
                        <li>值班警员</li>
                        <li>社区民警</li>
                        <li>居民</li>
                        <li>保安</li>
                        <li>社区居委会</li>
                        <li>办案刑警</li>
                    </ul>
                    <ul class="cs-axis">
                        <li><span>视频共享</span></li>
                        <li><span>一键找警</span></li>
                        <li><span>警情速递</span></li>
                        <li><span>群防群治</span></li>
                        <li><span>多元共治</span></li>
                        <li><span>数据挖掘</span></li>
                    </ul>
                </div>
                <!--<div class="ggwjw">
                    <div class="dp"><img src="/static/images/dp.png" alt="" class="dp-img"></div>
                    <img src="/static/images/ggwjw.png" alt="" class="ggwjw-img">
                    <div class="rygn"><img src="/static/images/renyuangongneng.png" alt="" class="rygn-img"></div>
                </div>-->

			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return{
				deptInfo:{},
                topbar: ''
			}
		},
		components: {
			centercomponent: function(resolve, reject) {
				require(['../welcome/center.vue'], resolve)
			},
			fancomponent: function(resolve, reject) {
				require(['../welcome/right.vue'], resolve)
				//require(['../welcome/fanchatr.vue'], resolve)
			}
		},
		methods:{
			gotoIndex:function () {
				//this.$router.push("/index");
			},
            resetPage : function () {
                let that = this;
                let body_height = document.documentElement.offsetHeight;
                let body_width = document.documentElement.offsetWidth;
                let left_width = 240;  //默认侧边栏宽度240px
                let _leftnavheight = document.documentElement.offsetHeight  - 68;
                that.leftnavstyle = {
                    height: _leftnavheight +"px"
                };

                this.$store.dispatch('update_page_info', {body_height, body_width, left_width});
            },
			getDeptInfo:function() {
				this.deptInfo = global.data.getUserInfo().dept;
				global.tools.getNavList()
			},
			
		},
		created: function() {
			this.token = global.data.getToken();
			this.getDeptInfo();
		},
		mounted() {
            let that = this;
            that.resetPage();
            window.onresize = function() {
                that.resetPage();
            }
        }
	}
</script>
<style lang="less">

	.wel-content{
		width: 100%;
		height: 100%;
		background: #000 url(/static/images/wel_bg.jpg) no-repeat;
		background-size: 100% 100%;
        

      @keyframes wel_face {
      	    0%{transform:rotate(0deg);}
      	    10%{transform:rotate(90deg); }
			20%{transform: rotate(0deg);}
			100%{transform: rotate(0deg);}
			
		}

		@keyframes welItemfadeIn {0% {opacity:0.5;}
			87.5% {opacity:1;}
			100%{opacity:0.5;}
		}

		.topbar{
			text-align:center;
			margin: 0 auto;
			position: relative;

			span{
				display: block;
				color: #55bdff;
				font-weight: bold;padding-left:35px;line-height: 70px;height: 80px;
				font-size: 28px;letter-spacing: 3px;    position: relative;
				z-index: 1;
			}
			.titlebg{position: relative;
				img{
					position: absolute;top:0;left:50%;margin-left:-270px;opacity:0.7;
				}
				.wel_face{position: absolute; top: 17px; left: 52.5%;
				animation:wel_face 3s  linear infinite;}
				.item2{animation:welItemfadeIn 3s linear 0s infinite normal; transform: translate(-5px);}
				.item3{animation:welItemfadeIn 3s linear 0.5s infinite normal; transform: translate(-5px);}
				.item4{animation:welItemfadeIn 3s linear 1s infinite normal; transform: translate(-5px);}
				.item5{animation:welItemfadeIn 3s linear 1.5s infinite normal; transform: translate(-5px);}
				.item6{animation:welItemfadeIn 3s linear 2s infinite normal; transform: translate(8px);}
				.item7{animation:welItemfadeIn 3s linear 2.5s infinite normal;}
				.item8{animation:welItemfadeIn 3s linear 3s infinite normal;}
				.item9{animation:welItemfadeIn 3s linear 3.5s infinite normal;}
			}
		}
		.content{
			position: relative; height: 100%;top: -20px;
		}
		.content .ggwjw{
			height: 600px;
			width: 600px;
			position: absolute;
			left: 50%;
			top:50%;
			margin-left: -300px;
			margin-top: -275px;
			background: url(/static/images/ggwjw.png) no-repeat;
			background-size: 600px 600px;
		}
		.content .ggwjw-img{
			height: 700px;
		}
		.content .dp{
			height: 300px;
			position: absolute;
			left: -450px;
			top: -41px;
		}
		.content .rygn{

			position: absolute;
			right: -400px;


			.rygn-img{
				height: 600px;
				width: auto;
			}

		}
	}
	@media (max-width: 1500px) {

		.wel-content {

		.content {
			height: 100%;
		}

		.content .ggwjw {
			height: 400px;
			width: 400px;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -200px;
			margin-top: -175px;
			background: url(/static/images/ggwjw.png) no-repeat;
			background-size: 100% 100%;
		}

		.content .ggwjw-img {
			height: 400px;
		}

		.content .dp {
			height: 300px;
			position: absolute;
			left: -320px;
			top: -41px;

		img {
			height: 200px;
			width: auto;
		}
	}

	.content .rygn {

		position: absolute;
		right: -243px;

	.rygn-img {
		height: 400px;
		width: auto;
	}

	}
	}
	}




</style>