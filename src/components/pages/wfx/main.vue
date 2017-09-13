<template>
    <div class="main-content-out-bg">

        <div class="page-wfx-content ha_page_content" :style="main_style">

            <div class="ha-topbar-box ha-navbar-nopadding" :style="topbar_style">
                <el-row class="cs-width100">
                    <el-col :span="15" class="cs-box ha-navbar-box">
                        <!-- 筛选 -->
                        <div class="ha-navbar-item">
                            <router-link to='xqjqtj' class="ha-navbar-link item1">辖区警情统计</router-link>
                        </div>
                        <div class="ha-navbar-item">
                            <router-link to='xqjltj' class="ha-navbar-link item2">辖区警力统计</router-link>
                        </div>
                        <div class="ha-navbar-item">
                            <router-link to='jlzyfx' class="ha-navbar-link item3">警力资源分析</router-link>
                        </div>
                        <div class="ha-navbar-item">
                            <router-link to='afqkfx' class="ha-navbar-link item4">案发情况分析</router-link>
                        </div>
                        <div class="ha-navbar-item">
                            <router-link to='jqclfx' class="ha-navbar-link item5">警情处理分析</router-link>
                        </div>
                    </el-col>
                    <el-col :span="9"></el-col>

                </el-row>
            </div>

            <div class="main-content" :style="content_sytle">
                <transition name="fadeRightBig" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>


        </div>
    </div>
</template>
<script>
import mystyle from '../../../util/vue/style';

export default {
    name: 'wrd_main',
    mixins: [mystyle]
}
</script>
<style>
.echarts {
    float: left;
    width: 100%;
    height: 100%;
}

.page-wfx-content {
    overflow-y: auto;
}
</style>
