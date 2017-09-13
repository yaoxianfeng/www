<template>
	<div>
		<div class="ha-topbar-box" :style="topbar_style">
			<div class="ha-navbar-tools ha-flexend ha-navbar-tools_back">
                <router-link to="/wsj" class="ha-navbar-goback"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
            </div>
		</div>
		<div class="contenttable ha-model-wait_doing" :style="content_sytle">
		        <img src="/static/images/doing.png" />
		</div>
	</div>
</template>
<script type="text/javascript">
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    data() {
    		return{

    		}
    	},
}
</script>