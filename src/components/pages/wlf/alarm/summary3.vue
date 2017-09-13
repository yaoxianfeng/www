<template>
    <ha-dialog title="近七日警情简报" class="alarm-summary_page" size="small" @close="closeDialog" :modal="false">
        <div class="map_echarts" id="alarm-summary_chart"></div>
    </ha-dialog>
</template>

<script>
    import echarts from 'echarts';
    const DICT_ALARM_CATE ="alertClassifyDict";
    const PREFIX_AFARM_TYPE_CODE ="code_";

    let temp_series = {
        type: 'scatter',
        label: {
            emphasis: {
                show: true,
                formatter: function (param) {
                    return param.data[1];
                },
                position: 'top'
            }
        }
    };

    export default {
        data:function(){
            return {
                alarm_summary_chart: null,
            }
        },
        methods:{
            closeDialog() {
                this.$emit("close");
            },
        },
        computed: {
            mainWidth() {
                let mainWidth = this.$store.getters.getPageInfos.main_width;
                return mainWidth
            }
        },
        watch: {
            mainWidth :function () {
                this.alarm_summary_chart.resize();
            }
        },
        created:function(){

        },
        mounted(){
            this.alarm_summary_chart = echarts.init(document.getElementById('alarm-summary_chart'));
        }
    }

</script>
<style>

    .alarm-summary_page .ha-dialog{
        bottom:0;
    }
    .map_echarts{
        height: 400px;
        width: 100%;
    }

</style>
