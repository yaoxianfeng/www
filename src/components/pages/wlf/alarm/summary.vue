<template>


    <ha-dialog title="近七日警情简报" class="alarm-summary_page" size="small" @close="closeDialog" :modal="false">
        <div class="summary_page_content">
            <div class="map_echarts" id="summary_chart1" v-loading="isloading1"></div>
            <div class="map_echarts" id="summary_chart2" v-loading="isloading2"></div>
            <div class="map_echarts" id="summary_chart3" v-loading="isloading3"></div>
        </div>
    </ha-dialog>

</template>

<script>
    const DICT_ALARM_CATE ="alertClassifyDict";
    const PREFIX_AFARM_TYPE_CODE ="code_";

    export default {
        data:function(){
            return {
                alarm_summary_chart1: null,
                alarm_summary_chart2: null,
                alarm_summary_chart3: null,

                isloading1:true,
                isloading2:true,
                isloading3:true,


                option1 : {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            name:'警情',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:0, name:'未解除', selected:true},
                                {value:0, name:'已解除'}
                            ]
                        },
                        {
                            name:'警情',
                            type:'pie',
                            radius: ['40%', '55%'],

                            data:[
                                {value:0, name:'处理中'},
                                {value:0, name:'已委派'},
                                {value:0, name:'尚未评价'},
                                {value:0, name:'差评'},
                                {value:0, name:'中评'},
                                {value:0, name:'好评', selected:true},
                            ]
                        }
                    ]
                },
                option2 : {
                    legend: {
                        data:["提交警情","解除警情","委派警情"],
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    grid: {
                        left: '3%',

                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            textStyle:{
                                color:'#fff'
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed',
                                    color :"#0177B4"
                                }
                            },
                            nameTextStyle:{
                                color :"#0177B4",
                                fontStyle:"italic"
                            },
                            axisLine: {
                                lineStyle:{
                                    color :"#0177B4"
                                }
                            }

                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed',
                                    color :"#0177B4"
                                }
                            },
                            nameTextStyle:{
                                color :"#0177B4",
                                fontStyle:"italic"
                            },
                            axisLine: {
                                lineStyle:{
                                    color :"#0177B4"
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'提交警情',
                            type:'bar',
                            stack: "提交警情",
                            data:[]
                        },
                        {
                            name:'解除警情',

                            type:'bar',
                            stack: '处理警情',
                            data:[]
                        },
                        {
                            name:'委派警情',
                            type:'bar',
                            stack: '处理警情',
                            data:[]
                        }

                    ]
                },
                option3 : {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: [],
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    grid: {
                        left: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value',
                        textStyle:{
                            color:'#fff'
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color :"#0177B4"
                            }
                        },
                        nameTextStyle:{
                            color :"#0177B4",
                            fontStyle:"italic"
                        },
                        axisLine: {
                            lineStyle:{
                                color :"#0177B4"
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: ['解除警情','委派警情','提交警情'],
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color :"#0177B4"
                            }
                        },
                        nameTextStyle:{
                            color :"#0177B4",
                            fontStyle:"italic"
                        },
                        axisLine: {
                            lineStyle:{
                                color :"#0177B4"
                            }
                        }
                    },
                    series: [

                    ]
                }


            }
        },
        methods:{
            closeDialog() {
                this.$emit("close");
            },


            getAlertDonePaiChart() {
                let that = this;
                let _param = {token:global.data.getToken()};

                //嵌套
                that.$http.post(global.config.weburl + '/api/analysis/alertDonePaiChart.do', _param).then(function(res) {

                    if (res.data.code == 0) {
                        let _data = res.data.data;

                        let _undo = _data.undo;
                        that.option1.series[0].data[0].value = _undo;
                        let _done = _data.done;
                        that.option1.series[0].data[1].value = _done;

                        let _doing = _data.doing;	//	处理中
                        let _delegate = _data.delegate;	//	已委派
                        let _noAppraise = _data.noAppraise;	//	尚未评价
                        let _appraise1	= _data.appraise1;//	好评
                        let _appraise2 = _data.appraise2;	//	中评
                        let _appraise3 = _data.appraise3;	//	差评


                        that.option1.series[1].data[0].value = _doing;
                        that.option1.series[1].data[1].value = _delegate;
                        that.option1.series[1].data[2].value = _noAppraise;
                        that.option1.series[1].data[3].value = _appraise3;
                        that.option1.series[1].data[4].value = _appraise2;
                        that.option1.series[1].data[5].value = _appraise1;

                        that.alarm_summary_chart1.setOption(this.option1);




                    } else {
                        global.tools.handleError(res.data);
                    }
                    that.isloading1 = false;

                }, function(error) {
                    that.isloading1 = false;
                });
            },

            getDoneBar(){
                let that = this;
                let _param = {token:global.data.getToken()};


                that.$http.post(global.config.weburl + '/api/analysis/alertDoneBarChar.do', _param).then(function(res) {

                    if (res.data.code == 0) {


                        let _data = res.data.data;
                        that.option2.xAxis[0].data = _data.date;

                        that.option2.series[0].data =_data.recevie;
                        that.option2.series[1].data =_data.done;
                        that.option2.series[2].data =_data.delegate;

                        that.alarm_summary_chart2.setOption(this.option2);


                    } else {
                        global.tools.handleError(res.data);
                    }

                    that.isloading2=false;

                }, function(error) {
                    that.isloading2=false;
                });
            },

            getAlertDoneLineChar() {
                let that = this;
                let _param = {token:global.data.getToken()};

                that.$http.post(global.config.weburl + '/api/analysis/alertDoneLineChar.do', _param).then(function(res) {

                    if (res.data.code == 0) {
                        let _data = res.data.data;
                        let  _classifyList = _data.classifyList;
                        let  _alertData = _data.alertData;

                        that.option3.legend.data = _classifyList;

                        let _series_arr = [];
                        _classifyList.forEach(function (item, index) {
                            _series_arr.push(
                                {
                                    name: item,
                                    type: 'bar',
                                    stack: '总量',
//                                    label: {
//                                        normal: {
//                                            show: true,
//                                            position: 'inside'
//                                        }
//                                    },
                                    data: eval(_alertData[index])
                                }
                            )
                        })

                        that.option3.series = _series_arr;
                        that.alarm_summary_chart3.setOption(that.option3);



                    } else {
                        global.tools.handleError(res.data);
                    }

                    that.isloading3=false;
                }, function(error) {

                    that.isloading3=false;
                });
            },


            resize() {
                this.alarm_summary_chart1.resize();
                this.alarm_summary_chart2.resize();
                this.alarm_summary_chart3.resize();
            },
            getData() {
                this.getAlertDonePaiChart();
                this.getDoneBar();
                this.getAlertDoneLineChar();
            }
        },
        computed: {
            mainWidth() {
                let mainWidth = this.$store.getters.getPageInfos.main_width;
                return mainWidth
            }
        },
        watch: {
            mainWidth :function () {
                this.resize();
            }
        },
        created:function(){

        },
        mounted(){
            this.alarm_summary_chart1 = echarts.init(document.getElementById('summary_chart1'));
            this.alarm_summary_chart2 = echarts.init(document.getElementById('summary_chart2'));
            this.alarm_summary_chart3 = echarts.init(document.getElementById('summary_chart3'));
            this.getData();
        }
    }

</script>
<style lang="less">
    .alarm-summary_page{

        .summary_page_content {
            position: relative;
            height: 420px;

            .map_echarts{
                height: 400px;
                width: 33%;
                float: left;
            }
        }
        .ha-dialog{
            bottom:0;
        }


    }



</style>
