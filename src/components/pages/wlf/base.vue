<template>
    <div :style="main_style">

    <router-view></router-view>


    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';
export default {
    mixins: [mystyle]
}
</script>

