<template>
	<div class="menu-box" :style="circleBox">
		<div class="cs-shield">
			<div class="relative" :style="shieldStyle">
				<img class="item1" src="/static/img/welcome/police.png" />
			</div>
			<div class="item2" :style="itemStyle">
				<i class="horn"></i><i class="horn"></i><i class="horn"></i><i class="horn"></i>
				<ul class="roll">
					<li>
						<div>治安管理</div>
						<div>交通管理</div>
					</li>
					<li>
						<div>出入境管理</div>
						<div>户籍管理</div>
					</li>
				</ul>
				<ul class="roll2">
					<li>
						<div>治安管理</div>
						<div>交通管理</div>
					</li>
					<li>
						<div>出入境管理</div>
						<div>户籍管理</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="cs-link">
			<div class="relative">
				<img class="l_item1" src="/static/img/welcome/dashed.png" />
				<img class="l_item2" src="/static/img/welcome/link_tric.png" />
				<img class="l_item3" src="/static/img/welcome/link_tric.png" />
			</div>
		</div>

		<div class="cs-purp">
			<div class="relative">
				<img id="change" class="img yuan_s" src="/static/img/welcome/ys.png">
				<img class="img item1" src="/static/img/welcome/purp.png" />
				<img class="img item2" src="/static/img/welcome/tric.png" />

				<div class="r_idebox">
					<ul class="title_roll">
						<li>
							<div>增强警民互动</div>
						</li>
						<li>
							<div>提高服务效率</div>
						</li>
						<li>
							<div>推进群防群治</div>
						</li>
						<li>
							<div>建设智慧公安</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="menu-wrapper" :style="circleWrapper">
			<ul class="menu-bg">
				<li v-for="item in menu" :style="circleLi">
					<a :style="circleA" :href="item.href"></a>
				</li>
			</ul>
			<ul>
				<li v-for="item2 in menu" :style="circleLi">
					<a :style="circleA" :href="item2.href">
						<span><i :class="item2.icon"></i><i class="el-icon-d-arrow-right wel_center_arrow_icon"></i>{{item2.text}}</span>
					</a>
				</li>
			</ul>
			<span class="menu-after" :style="circleAfter"></span>
		</div>
		<div class="menu-element">
			<ul>
				<li><img class="img w_circle1" src="/static/img/welcome/circle1.png" /></li>
				<li><img class="img w_circle2" src="/static/img/welcome/circle2.png" /></li>
				<li class="circleLun"><span style="width: 25%;overflow: hidden"><img :style="circleLun" class="img w_circle3" src="/static/img/welcome/circle3.png"/></span></li>
				<li><img class="img w_circle4" src="/static/img/welcome/circle4.png" /></li>
				<li><img class="img w_circle5" src="/static/img/welcome/circle5.png" /></li>
				<li><img class="img w_circle6" src="/static/img/welcome/circle6.png" /></li>
				<li><img class="img arrow arrow1" src="/static/img/welcome/001.png" /></li>
				<li><img class="img arrow arrow2" src="/static/img/welcome/002.png" /></li>
				<li><img class="img arrow arrow3" src="/static/img/welcome/003.png" /></li>
				<li><img class="img arrow arrow4" src="/static/img/welcome/004.png" /></li>
				<li><img class="img scan" src="/static/img/welcome/scan.png" /></li>

				<li><img class="img spot spot1" src="/static/img/welcome/spot.png" /></li>
				<li><img class="img spot spot2" src="/static/img/welcome/spot2.png" /></li>
				<li><img class="img spot spot3" src="/static/img/welcome/spot3.png" /></li>
				<li><img class="img spot spot4" src="/static/img/welcome/spot4.png" /></li>
				<li><img class="img spot spot5" src="/static/img/welcome/spot5.png" /></li>
				<li><img class="img spot spot6" src="/static/img/welcome/spot6.png" /></li>
				<li><img class="img spot spot7" src="/static/img/welcome/spot7.png" /></li>
				<li><img class="img spot spot8" src="/static/img/welcome/spot8.png" /></li>
				<li><img class="img logoname" src="/static/img/welcome/logoname.png" /></li>
				<li><img class="img logoname2" src="/static/img/welcome/logoname2.png" /></li>

			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				menu: [{
						"href": "#/wxx",
						"icon": "icon-ha-wxx navicon",
						"text": "微信息"
					},
					{
						"href": "#/wrd",
						"icon": "icon-ha-wrd navicon",
						"text": "微热点"
					},
					{
						"href": "#/wgz",
						"icon": "icon-ha-wgz navicon",
						"text": "微工作"
					},
					{
						"href": "#/wlf",
						"icon": "icon-ha-wlf navicon",
						"text": "微联防"
					},
					{
						"href": "#/wfw",
						"icon": "icon-ha-wfw navicon",
						"text": "微服务"
					},
					{
						"href": "#/wsj",
						"icon": "icon-ha-wsj navicon",
						"text": "微数据"
					},
					{
						"href": "#/wfx",
						"icon": "icon-ha-wfx navicon",
						"text": "微分析"
					}
				]
			}
		},
		components: {

		},
		computed: {
			myHeight() {
				let _height = global.app.$store.state.global.page_info.body_height * 0.65;
				return _height;
			},
			circleBox() {
				let _circleBox = "width: " + this.myHeight + "px;height: " + this.myHeight + "px";
				return _circleBox;
			},
			circleWrapper() {
				let _wrap = this.myHeight * 0.92;
				let _half = (this.myHeight * 0.92) / 2;
				let _circleWrapper = "width: " + _wrap + "px;height: " + _wrap + "px;margin-top: -" + _half + "px;margin-left: -" + _half + "px";
				return _circleWrapper;
			},
			circleAfter() {
				let _wrap = (this.myHeight * 0.92) * 0.75;
				let _half = _wrap / 2;
				let _circleAfter = "width: " + _wrap + "px;height: " + _wrap + "px;margin-top: -" + _half + "px;margin-left: -" + _half + "px";
				return _circleAfter;
			},
			circleLi() {
				let _half = (this.myHeight * 0.92) / 2;
				let _circleLi = "width: " + _half + "px;height: " + _half + "px";
				return _circleLi;
			},
			circleA() {
				let _wrap = this.myHeight * 0.92;
				let _half = (this.myHeight * 0.92) / 2;
				let _circleA = "width: " + _wrap + "px;height: " + _wrap + "px" + ";right: -" + _half + "px;bottom: -" + _half + "px";
				return _circleA;
			},
			circleLun() {
				let _wrap = this.myHeight * 0.82;
				let _circleA = "width: " + _wrap + "px;height: " + _wrap + "px";
				return _circleA;
			},
			shieldStyle() {

				let _width = this.myHeight * 0.32;
				let _style = {
					width: _width + "px",
					margin: "0 auto"
				};
				return _style;

			},
			itemStyle() {
				let _width = this.myHeight * 0.32;
				let _style = {
					width: _width + "px"
				};
				if(_width < 160) {
					_style = {
						width: 160 + "px",
						"font-size": 12 + "px"
					}
				}

				return _style;
			}
		},
		methods: {},
		created: function() {}
	}
</script>
<style scoped>
	.relative {
		display: block;
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.relative .yuan_s {
		animation: change 20s linear infinite;
		width: 100%;
		height: 100%;
	
	}
	
	.r_idebox {		
		/*width: 100px;*/
		height: 170px;		
		text-align: center;
		overflow: hidden;
	}
	
	.cs-shield {
		position: absolute;
		top: -70px;
		left: -50%;
	}
	
	.cs-shield .item1 {
		width: 100%;
		height: auto;
	}
	
	.cs-shield .item2 {
		padding: 10px 15px;
		position: relative;
		margin-top: 5px;
		line-height: 2em;
		color: #c2f0ff;
	}
	
	.cs-shield .item2 .horn {
		position: absolute;
		display: block;
		width: 20px;
		height: 15px;
		border: solid #06689a;
	}
	
	.cs-shield .item2 .horn:first-child {
		top: 0;
		left: 1px;
		border-width: 1px 0 0 1px;
	}
	
	.cs-shield .item2 .horn:nth-child(2) {
		top: 0;
		right: 1px;
		border-width: 1px 1px 0 0;
	}
	
	.cs-shield .item2 .horn:nth-child(3) {
		bottom: 0;
		left: 1px;
		border-width: 0 0 1px 1px;
	}
	
	.cs-shield .item2 .horn:nth-child(4) {
		bottom: 0;
		right: 1px;
		border-width: 0 1px 1px 0;
	}
	
	.cs-shield .item2:after,
	.cs-shield .item2 ul:after {
		content: '';
		display: table;
		clear: both;
	}
	
	.cs-shield .item2 li:nth-child(1),
	.cs-shield .item2 li:nth-child(3) {}
	
	.cs-purp {
		position: absolute;
		bottom: 2%;
		left: -51%;
		width: 49%;
		height: 49%;
	}
	
	.cs-purp .img {
		position: absolute;
		top: 0;
		left: 0;
	}
	
	.cs-purp .relative {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.cs-purp .item2 {
		animation: rotate_small 4s ease-in-out alternate infinite;
	}
	
	.cs-purp p {
		line-height: 1.5em;
		color: #9fe3fa;
	}
	
	.cs-link {
		position: absolute;
		left: -20%;
		width: 30%;
	}
	
	.cs-link .l_item1 {
		width: 100%;
		height: auto;
	}
	
	.cs-link .l_item2,
	.cs-link .l_item3 {
		position: absolute;
	}
	
	.cs-link .l_item2 {
		top: 0;
		left: 0;
		animation: welmove 5s infinite 0s linear normal;
	}
	
	.cs-link .l_item3 {
		bottom: 0;
		right: 0;
		animation: welmove2 5s infinite 0s linear normal;
	}
	
	.menu-element {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.menu-element ul {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.menu-element li {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.circleLun {
		justify-content: flex-end;
	}
	
	.circleLun .img {
		max-width: inherit;
		max-height: inherit;
	}
	
	.circleLun span {
		width: 25%;
		overflow: hidden;
		position: relative;
		transform: rotate(180deg);
		right: 8%;
	}
	
	.menu-element .logoname {
		width: 40%;
		position: relative;
		top: -10px;
	}
	
	.menu-element .logoname2 {
		width: 33%;
		position: relative;
		top: 45px;
	}
	
	.menu-element .w_circle1,
	.menu-element .w_circle2 {
		width: 100%;
		height: 100%;
	}
	
	.menu-element .w_circle3 {
		width: 82%;
		height: 82%;
	}
	
	.menu-element .w_circle4,
	.menu-element .w_circle5,
	.menu-element .w_circle6,
	.menu-element .spot,
	.menu-element .arrow {
		width: 72%;
		height: 72%;
	}
	
	.menu-element .spot {
		opacity: 0;
	}
	
	.menu-element .arrow {
		opacity: 0.5;
	}
	
	@keyframes rotate_big {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	
	
	@keyframes rotate_small {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(180deg);
		}
	}
	
	@keyframes fade_in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	
	@keyframes fade_in_2 {
		0% {
			opacity: 0;
		}
		5% {
			opacity: 0.8;
		}
		10% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
	
	@keyframes fade_in_3 {
		0% {
			opacity: 0.5;
		}
		10% {
			opacity: 1;
		}
		20% {
			opacity: 0.9;
		}
		100% {
			opacity: 0.5;
		}
	}
	
	@keyframes scale {
		0% {
			transform: scale(0.9) translate(0, -14px);
		}
		100% {
			transform: scale(1) translate(0, -18px);
		}
	}
	
	@keyframes welmove {
		0% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(140px, 70px);
		}
		100% {
			transform: translate(0, 0);
		}
	}
	
	@keyframes welmove2 {
		0% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-140px, -70px);
		}
		100% {
			transform: translate(0, 0);
		}
	}
	
	
	@keyframes wordroll {0% {top:0;opacity: 1;}
        25% {top:32px;opacity: .1;}
        50% {top:64px;opacity: 0;}
        51% {top:-64px;opacity: 0;}
        75% {top:-32px;opacity: .1;}
        100% {top:0;opacity: 1;}
    }
    @keyframes wordroll2 {0% {top:0;opacity: .1;}
        25% {top:32px;opacity: .1;}
        50% {top:64px;opacity: 0; }
        51% {top:-64px;opacity: 0;}
        75% {top:-32px;opacity: 1;}
        100% {top:0;opacity: .1;}
    }

    @keyframes wordroll3 {0% {top:-128px;opacity: 0;}
        25% {top:-96px;opacity: 0;}
        50% {top:-64px;opacity: 1;}
        75% {top:-32px;opacity: 0.1;}
        100% {top:0;opacity: 0;}
    }

    @keyframes wordroll4 {0% {top:-128px;opacity: 0;}
        25% {top:-96px;opacity: 1;}
        50% {top:-64px;opacity: 0.1;}
        75% {top:-32px;opacity: 0.1;}
        100% {top:0;opacity: 0;}
    }


	@keyframes titleRoll1 {0% {top:0;opacity: 0;}
		25% {top:32px;opacity: .5;}
		50% {top:64px;opacity: 1;font-size: 18px;}
		75% {top:96px;opacity: .5;}
		100% {top:128px;opacity: 0;}
	}

	@keyframes titleRoll2 {0% {top:0px;opacity: .5;}
		25% {top:32px;opacity: 1;font-size: 18px;}
		50% {top:64px;opacity: .5;}
		75% {top:96px;opacity: 0;}
		76% {top:-32px;opacity: 0;}
		100% {top:0px;opacity: .5;}
	}

	@keyframes titleRoll3 {0% {top:0px;opacity: 1;font-size: 18px;}
		50% {top:64px;opacity: 0;font-size: 14px;}
		51% {top:-64px;opacity: 0;font-size: 14px;}
		100% {top:0px;opacity: 1;font-size: 18px;}
	}

	@keyframes titleRoll4 {0% {top:0px;opacity: .5;}
		25% {top:32px;opacity: 0;}
		26% {top:-96px;opacity: 0;}
		50% {top:-64px;opacity: .5;}
		75% {top:-32px;opacity: 1;font-size:18px;}
		100% {top:0px;opacity: .5;}
	}
	
	
	
	@-webkit-keyframes change {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	

	
	.cs-shield .item2 {
		height: 80px;
		overflow: hidden;
	}
	
	.roll li,
	.roll2 li{
		position: relative;
		display: flex;
		justify-content: space-between;
		width: 100%;
		user-select: none;
        font-size: 15px;
		height: 32px;
		line-height: 32px;

	}


	
	.roll li:nth-child(1) {
		animation: wordroll 10s infinite 0s linear normal;
	}
	
	.roll li:nth-child(2) {
		animation: wordroll2 10s infinite 0s linear normal;
	}
	
	/*.roll li:nth-child(3) {
		animation: wordroll 6s infinite 0s linear normal;
	}
	
	.roll li:nth-child(4) {
		animation: wordroll2 6s infinite 0s linear normal;
	}*/
	/*.roll li:nth-child(3),.roll li:nth-child(4){animation:roll2 10s infinite 0s linear normal;}*/
	
	.roll2 li:nth-child(1) {
		animation: wordroll3 10s infinite 0s linear normal;
	}
	
	.roll2 li:nth-child(2) {
		animation: wordroll4 10s infinite 0s linear normal;
	}



	.title_roll li {
		position: relative;
		display: flex;
		justify-content: center;
		width: 100%;
		user-select: none;
		font-size: 15px;
		height: 32px;
		line-height: 32px;

	}


	.title_roll li:nth-child(1) {
		animation: titleRoll1 10s infinite 0s linear normal;
	}

	.title_roll li:nth-child(2) {
		animation: titleRoll2 10s infinite 0s linear normal;
	}

	.title_roll li:nth-child(3) {
		animation: titleRoll3 10s infinite 0s linear normal;
	}
	.title_roll li:nth-child(4) {
		animation: titleRoll4 10s infinite 0s linear normal;
	}

	
	.menu-element .arrow1 {
		animation: fade_in_3 2s infinite 0s linear normal;
	}
	
	.menu-element .arrow2 {
		animation: fade_in_3 2s infinite 0.2s linear normal;
	}
	
	.menu-element .arrow3 {
		animation: fade_in_3 2s infinite 0.7s linear normal;
	}
	
	.menu-element .arrow4 {
		animation: fade_in_3 2s infinite 1.2s linear normal;
	}
	
	.menu-element .scan {
		width: 74%;
		height: 74%;
		animation: rotate_big 14s infinite linear;
	}
	
	.menu-element .w_circle3 {
		animation: rotate_big 80s infinite linear;
	}
	
	.menu-element .w_circle4 {
		animation: rotate_big 20s infinite linear;
	}
	
	.menu-element .w_circle6 {
		animation: rotate_big 500s infinite linear;
		animation-direction: reverse;
	}
	
	.menu-element .logoname {
		animation: scale 8s linear 2s infinite alternate;
		animation-fill-mode: forwards;
	}
	
	.menu-element .logoname2 {
		animation: fade_in 8s linear 2s infinite alternate;
	}
	
	.menu-element .spot1 {
		animation: fade_in_2 14s linear 2s infinite normal;
	}
	
	.menu-element .spot2 {
		animation: fade_in_2 14s linear 3s infinite normal;
	}
	
	.menu-element .spot3 {
		animation: fade_in_2 14s linear 4s infinite normal;
	}
	
	.menu-element .spot4 {
		animation: fade_in_2 14s linear 6s infinite normal;
	}
	
	.menu-element .spot5 {
		animation: fade_in_2 14s linear 6s infinite normal;
	}
	
	.menu-element .spot6 {
		animation: fade_in_2 14s linear 10s infinite normal;
	}
	
	.menu-element .spot7 {
		animation: fade_in_2 14s linear 12s infinite normal;
	}
	
	.menu-element .spot8 {
		animation: fade_in_2 14s linear 13s infinite normal;
	}
	
	.spot_paused {
		animation-play-state: paused;
	}
	
	.spot_run {
		animation-play-state: running;
	}
	
	.menu-box {
		width: 816px;
		height: 816px;
		margin: 0 auto;
		padding: 2.5%;
		position: relative;
		top: 70px;
	}
	
	.css-transforms .menu-wrapper {
		overflow: hidden;
		zoom: 1;
		position: relative;
		top: 50%;
		left: 50%;
		z-index: 9;
		width: 756px;
		height: 756px;
		margin: -378px 0 0 -378px;
		border-radius: 50%;
		background: transparent;
		pointer-events: auto;
	}
	
	.css-transforms .menu-wrapper .menu-after {
		color: transparent;
		content: ".";
		display: block;
		position: absolute;
		z-index: 10;
		left: 50%;
		top: 50%;
		margin-left: -246px;
		margin-top: -246px;
		width: 492px;
		height: 492px;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
	}
	
	.css-transforms .menu-wrapper li {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 378px;
		height: 378px;
		transform-origin: 100% 100%;
		pointer-events: none;
	}
	
	.css-transforms .menu-wrapper li a {
		opacity: 0.95;
		position: absolute;
		right: -378px;
		bottom: -378px;
		display: block;
		width: 756px;
		height: 756px;
		border-radius: 50%;
		color: #3ecfff;
		text-align: center;
		text-decoration: none;
		background: radial-gradient(transparent 58%, #154A8F 35%);
		transform: skew(-55deg) rotate(-72deg) scale(1);
		pointer-events: auto;
	}
	
	.css-transforms .menu-wrapper li a:hover,
	.css-transforms .menu-wrapper li a:active,
	.css-transforms .menu-wrapper li a:focus {
		background: radial-gradient(transparent 56%, #2262b7 35%);
	}
	
	.css-transforms .menu-wrapper li a span {
		position: relative;
		top: 0.8em;
		font-size: 20px;
		font-weight: 500;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.css-transforms .menu-wrapper li:nth-child(5) a,
	.css-transforms .menu-wrapper li:nth-child(6) a,
	.css-transforms .menu-wrapper li:nth-child(7) a {
		transform: skew(-55deg) rotate(-252deg) scale(1);
	}
	
	.css-transforms .menu-wrapper li:nth-child(5) span,
	.css-transforms .menu-wrapper li:nth-child(6) span,
	.css-transforms .menu-wrapper li:nth-child(7) span {
		top: 92%;
	}
	
	.css-transforms .menu-wrapper li:first-child {
		transform: rotate(-260deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(7) {
		transform: rotate(-140deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(6) {
		transform: rotate(-100deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(5) {
		transform: rotate(-60deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(4) {
		transform: rotate(-20deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(3) {
		transform: rotate(20deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper li:nth-child(2) {
		transform: rotate(60deg) skew(55deg);
	}
	
	.css-transforms .menu-wrapper .navicon {
		color: #cef0fc;
		position: relative;
		top: 3px;
		left: -8px;
		font-size: 18px;
	}
	
	.css-transforms .menu-wrapper li:nth-child(5) .navicon,
	.css-transforms .menu-wrapper li:nth-child(6) .navicon,
	.css-transforms .menu-wrapper li:nth-child(7) .navicon {
		top: 0;
	}
	
	.css-transforms .menu-wrapper .menu-bg li a {
		background: radial-gradient(transparent 56%, rgba(34, 101, 209, 0.9) 35%);
		transform: skew(-55deg) rotate(-72deg) scale(1);
	}
	
	.wel_center_arrow_icon {
		margin-right: 5px;
		font-size: 14px;
	}




	@media (max-width: 1500px) {
		@keyframes welmove {
			0% {
				transform: translate(0, 0);
			}
			50% {
				transform: translate(100px, 50px);
			}
			100% {
				transform: translate(0, 0);
			}
		}
		@keyframes welmove2 {
			0% {
				transform: translate(0, 0);
			}
			50% {
				transform: translate(-100px, -50px);
			}
			100% {
				transform: translate(0, 0);
			}
		}


		.css-transforms .menu-wrapper .navicon{font-size: 14px;}
		.wel_center_arrow_icon{margin-right:5px;font-size: 14px; }
		.css-transforms .menu-wrapper li a span{font-size: 18px;}
		.cs-purp p{font-size: 13px;}

		.roll li,
		.roll2 li, .title_roll li{
			font-size: 13px;
		}


		@keyframes titleRoll1 {0% {top:0;opacity: 0;}
			25% {top:32px;opacity: .5;}
			50% {top:64px;opacity: 1;font-size: 16px;}
			75% {top:96px;opacity: .5;}
			100% {top:128px;opacity: 0;}
		}

		@keyframes titleRoll2 {0% {top:0px;opacity: .5;}
			25% {top:32px;opacity: 1;font-size: 16px;}
			50% {top:64px;opacity: .5;}
			75% {top:96px;opacity: 0;}
			76% {top:-32px;opacity: 0;}
			100% {top:0px;opacity: .5;}
		}

		@keyframes titleRoll3 {0% {top:0px;opacity: 1;font-size: 16px;}
			50% {top:64px;opacity: 0;font-size: 14px;}
			51% {top:-64px;opacity: 0;font-size: 14px;}
			100% {top:0px;opacity: 1;font-size: 16px;}
		}

		@keyframes titleRoll4 {0% {top:0px;opacity: .5;}
			25% {top:32px;opacity: 0;}
			26% {top:-96px;opacity: 0;}
			50% {top:-64px;opacity: .5;}
			75% {top:-32px;opacity: 1;font-size:16px;}
			100% {top:0px;opacity: .5;}
		}

	}

	@media (max-height: 900px) {
		@keyframes welmove {
			0% {
				transform: translate(0, 0);
			}
			50% {
				transform: translate(100px, 50px);
			}
			100% {
				transform: translate(0, 0);
			}
		}
		@keyframes welmove2 {
			0% {
				transform: translate(0, 0);
			}
			50% {
				transform: translate(-100px, -50px);
			}
			100% {
				transform: translate(0, 0);
			}
		}


		.css-transforms .menu-wrapper .navicon{font-size: 14px;}
		.wel_center_arrow_icon{margin-right:5px;font-size: 14px; }
		.css-transforms .menu-wrapper li a span{font-size: 18px;}
		.cs-purp p{font-size: 13px;}

		.roll li,
		.roll2 li, .title_roll li{
			font-size: 13px;
		}


		@keyframes titleRoll1 {0% {top:0;opacity: 0;}
			25% {top:32px;opacity: .5;}
			50% {top:64px;opacity: 1;font-size: 18px;}
			75% {top:96px;opacity: .5;}
			100% {top:128px;opacity: 0;}
		}

		@keyframes titleRoll2 {0% {top:0px;opacity: .5;}
			25% {top:32px;opacity: 1;font-size: 16px;}
			50% {top:64px;opacity: .5;}
			75% {top:96px;opacity: 0;}
			76% {top:-32px;opacity: 0;}
			100% {top:0px;opacity: .5;}
		}

		@keyframes titleRoll3 {0% {top:0px;opacity: 1;font-size: 16px;}
			50% {top:64px;opacity: 0;font-size: 14px;}
			51% {top:-64px;opacity: 0;font-size: 14px;}
			100% {top:0px;opacity: 1;font-size: 16px;}
		}

		@keyframes titleRoll4 {0% {top:0px;opacity: .5;}
			25% {top:32px;opacity: 0;}
			26% {top:-96px;opacity: 0;}
			50% {top:-64px;opacity: .5;}
			75% {top:-32px;opacity: 1;font-size:16px;}
			100% {top:0px;opacity: .5;}
		}

	}


	@media screen and (max-height: 680px) {
		.css-transforms .menu-wrapper .navicon{font-size: 12px;}
		.wel_center_arrow_icon{margin-right:5px;font-size: 12px; }
		.css-transforms .menu-wrapper li a span{font-size: 12px;}
		.cs-purp p{font-size: 12px;}
	}

	@media (max-width: 1300px) {
		.css-transforms .menu-wrapper .navicon{font-size: 12px;}
		.wel_center_arrow_icon{margin-right:5px;font-size: 12px; }
		.css-transforms .menu-wrapper li a span{font-size: 12px;}
		.cs-purp p{font-size: 12px;}
	}
	

	/*不支持css3*/
	
	.no-transforms .menu-wrapper {
		margin: 10em auto;
		overflow: hidden;
		text-align: center;
		padding: 1em;
		border: 1px solid #000;
	}
	
	.no-transforms .menu-wrapper ul {
		display: inline-block;
	}
	
	.no-transforms li {
		width: 120px;
		height: 50px;
		float: left;
		line-height: 50px;
		text-align: center;
		margin-right: 20px;
		background-color: #fff;
		/*border:1px solid red;*/
	}
	
	.no-transforms li a {
		display: block;
		height: 100%;
		width: 100%;
		line-height: 50px;
		text-decoration: none;
		color: #fff;
	}
	
	.no-transforms .menu-wrapper li a span {
		display: block;
	}
	
	.no-transforms .menu-wrapper li a img {
		display: none;
	}
	
	.no-transforms li a.first {
		background-color: #e88503;
	}
	
	.no-transforms li a.second {
		background-color: #b40303;
	}
	
	.no-transforms li a.last {
		background-color: #028b09;
	}
	
	.no-transforms .menu-wrapper li a:hover,
	.no-transforms .menu-wrapper li a:active,
	.no-transforms .menu-wrapper li a:focus {
		-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
		filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
	}
</style>