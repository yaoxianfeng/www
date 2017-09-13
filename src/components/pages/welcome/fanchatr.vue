<template>

	<div class="trapezoid_box">
		<div class="trapezoid">
			<ul>

				<li>
					<div class="first">
						<a href="javascript:;"><span>派出所</span></a>
					</div>

				</li>
				<li>
					<div class="second">
						<a href="javascript:;"><span>社区民警</span></a>
					</div>

				</li>
				<li>
					<div class="third">
						<a href="javascript:;"><span>社区居民</span></a>
					</div>
				</li>
				<li>
					<div class="four">
						<a href="javascript:;"><span>辖区企业</span></a>
					</div>
				</li>
				<li>
					<div class="five">
						<a href="javascript:;"><span>社区群干</span></a>
					</div>
				</li>
				<li>
					<div class="six">
						<a href="javascript:;"><span>物业保安</span></a>
					</div>
				</li>

			</ul>

		</div>

	</div>

</template>

<script>
	export default {

	}
</script>

<style scoped>
	.trapezoid_box {
		position: absolute;
		right: 42%;
		top: 0%;
		height: 600px;
	}
	
	.trapezoid {
		border-radius: 50%;
		height: 802px;
		overflow: hidden;
		pointer-events: auto;
		position: absolute;
		top: 11%;
		width: 483px;
		transform: rotate(-5deg);
	}
	
	.trapezoid ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
	
	.trapezoid ul li {
		border-bottom: 9px solid transparent;
		border-right: 170px solid #1893b4;
		border-top: 23px solid transparent;
		height: 69px;
		left: 20%;
		list-style: none;
		position: relative;
		top: 120px;
		transform: rotate(88deg);
		width: 0;
		z-index: 1;
	}
	
	
	.trapezoid ul li a {
		color: #3ecfff;
		display: -moz-inline-box;
		font-size: 20px;
		height: 0;
		pointer-events: auto;
		text-align: center;
		text-decoration: none;
		transform: translate(44px, 10px) rotate(360deg);
	}
	
	.trapezoid li a span {
		position: relative;
		display: block;
		font-size: 20px;
		text-transform: uppercase;
	}
	
	.trapezoid ul li:nth-child(1) {
		border-radius: 10px 185px 80px 20px / 220px 1220px 714px 163px;
		transform: translate(107px, 20px) rotate(-17deg) skew(7deg);
		height: 90px;
	}
	
	.trapezoid ul li .first {
		border-bottom: 9px solid transparent;
		border-radius: 10px 185px 80px 20px / 220px 1220px 714px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -22px) rotate(1deg) skew(4deg);
		width: 0;
	}
	
	.trapezoid ul li:nth-child(2) {
		border-radius: 0 250px 184px 20px / 220px 2220px 2220px 163px;
		height: 85px;
		transform: translate(132px, 8px) rotate(-6deg) skew(5deg);
	}
	
	.trapezoid ul li .second {
		border-bottom: 9px solid transparent;
		border-radius: 14px 250px 184px 20px / 220px 3000px 2220px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -22px) rotate(1deg) skew(4deg);
		width: 0;
	}
	
	.trapezoid ul li:nth-child(3) {
		border-radius: 0 350px 184px 20px / 220px 2220px 2220px 163px;
		height: 85px;
		transform: translate(140px, 4px) rotate(5deg) skew(5deg);
	}
	
	.trapezoid ul li .third {
		border-bottom: 9px solid transparent;
		border-radius: 0 350px 184px 20px / 220px 3000px 2220px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -23px) rotate(1deg) skew(4deg);
		width: 0;
	}
	
	.trapezoid ul li:nth-child(4) {
		border-radius: 0 150px 184px 20px / 220px 2220px 2220px 163px;
		height: 85px;
		transform: translate(135px, 1px) rotate(17deg) skew(8deg)
	}
	
	.trapezoid ul li .four {
		border-bottom: 9px solid transparent;
		border-radius: 0 150px 184px 20px / 220px 3000px 2220px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -23px) rotate(1deg) skew(4deg);
		width: 0;
	}
	
	.trapezoid ul li:nth-child(5) {
		border-radius: 0 250px 184px 20px / 220px 2220px 2220px 163px;
		height: 85px;
		transform: translate(117px, -4px) rotate(29deg) skew(7deg)
	}
	
	.trapezoid ul li .five {
		border-bottom: 9px solid transparent;
		border-radius: 0 150px 184px 20px / 220px 3000px 2220px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -23px) rotate(1deg) skew(4deg);
		width: 0;
	}
	
	.trapezoid ul li:nth-child(6) {
		border-radius: 0 350px 184px 20px / 220px 2220px 2220px 163px;
		height: 90px;
		transform: translate(77px, -19px) rotate(40deg) skew(-3deg);
	}
	
	
	.trapezoid ul li .six {
		border-bottom: 9px solid transparent;
		border-radius: 0 150px 184px 20px / 220px 3000px 2220px 163px;
		border-right: 170px solid #08336d;
		border-top: 23px solid transparent;
		height: 90px;
		position: relative;
		transform: translate(0px, -23px) rotate(1deg) skew(4deg);
		width: 0;
	}
</style>