<template>
	<div class="jianshezhong" :style="main_style">
		<div :style="topbar_style"></div>
		<div class="cs-jianshe" :style="content_sytle"></div>
	</div>
</template>

<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
}
</script>

<style type="text/css" lang="less">
	.jianshezhong{
		.cs-jianshe{
			/* background: rgba(39, 94, 139, 0.3); */
			background:url('/static/img/building.png') no-repeat;
			background-size: 100% 100%; 
		}
	}
</style>