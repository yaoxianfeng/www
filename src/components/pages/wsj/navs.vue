<template>
    <div class="cs-main-content" :style="main_style">
         <div  :style="topbar_style">
        </div>
         <navcomponent :style="content_sytle"></navcomponent>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    components: {
        navcomponent: function(resolve, reject) {
            require(['../../common/navigation/navigation.vue'], resolve)
        }
    }
}
</script>
