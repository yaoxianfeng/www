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
//        name: '1990',
//        data: data[0],
        type: 'scatter',
//        symbolSize: function (data) {
//            return Math.sqrt(data[2]) / 5e2;
//        },
        label: {
            emphasis: {
                show: true,
                formatter: function (param) {
                    return param.data[1];
                },
                position: 'top'
            }
        }
//        , itemStyle: {
//            normal: {
//                shadowBlur: 10,
//                shadowColor: 'rgba(120, 36, 50, 0.5)',
//                shadowOffsetY: 5,
//                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
//                    offset: 0,
//                    color: 'rgb(251, 118, 123)'
//                }, {
//                    offset: 1,
//                    color: 'rgb(204, 46, 72)'
//                }])
//            }
//        }
    };

    export default {
        data:function(){
            return {
                alarm_summary_chart: null,

                option :{
                    legend: {
                        right: 10,
                        data: [],   // ['群众举报', '举报线索','投诉监督']
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    xAxis: {
                        type: 'time',
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
                        data:[],        //["长城警务室", "光谷警务室", "天下警务室"]
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
                    series: []
                }


            }
        },
        methods:{
            closeDialog() {
                this.$emit("close");
            },
            getDataDictionary () {
                //获取数据字典
//                console.log("获取数据字典 : ");
//                console.log(global.tools.getDictChildByCode("alertClassifyDict", "1"));
                return global.tools.getDictChild(DICT_ALARM_CATE);
            },
            getDeptNameArr (childPoliceDepts){ //获取部门名称数组
                let that = this;
                let _child_depts = [];

                childPoliceDepts && childPoliceDepts.forEach(
                    function(item, index) {
                        _child_depts.push(item.name);
                    }
                );
                return _child_depts;
            },
            getYAxisData () {
                let that = this;
                let userinfo = global.data.getUserInfo();
                let user_dept = userinfo.dept;
                //获取部门下面的子部门集合
                global.tools.getChildPoliceDept(user_dept.id).then(function(ResultJson) {
                    //通过拿到的数据渲染页面
                    that.option.yAxis.data  = that.getDeptNameArr(ResultJson);
                    that.getWeekData();
                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑
                    console.log(ErrMsg);

                });
            },
            fomartAlarmCate(data) {

                let that = this;
                let _cate_list = global.data.dict[DICT_ALARM_CATE];
                let _legendData = [];
                let _legendDataCode = [];
                let _legendObject = {};
                let _alarm_class_data = data;

                _cate_list && _cate_list.forEach((item, index) => {
                    _legendData.push(item.name);
                    _legendDataCode.push(item.code);
                    _legendObject[PREFIX_AFARM_TYPE_CODE + item.code] = item;
                })

                this.option.legend.data = _legendData;


                this.legendDataType = _legendDataCode;  //与data相对应的类型数组
                this.legendObject = _legendObject;      //与data相对应的类型json
            },
            formartData(data) {
                //格式化报表的数据，转成散点图格式如下：按类型分布
//                let data = [
//                    [[1494905230171,"长城警务室"]],
//                    [[1494905250171,"光谷警务室"]],
//                    [[1494905290171,"天下警务室"]]
//                ];

                let that = this;
                let seriesObj = {};

                data && data.forEach((item, index)=>{
                    let _alerts_arr = item.alerts;
                    _alerts_arr && _alerts_arr.forEach(function (it, ix) {
                        let _arr = [it.alertTime, item.name, it.status ,it.type];
                        if (seriesObj[PREFIX_AFARM_TYPE_CODE + it.classify] && seriesObj[PREFIX_AFARM_TYPE_CODE + it.classify].data && seriesObj[PREFIX_AFARM_TYPE_CODE + it.classify].data.length > -1) {
                            seriesObj[PREFIX_AFARM_TYPE_CODE + it.classify].data.push(_arr);
                        } else {
                            let _new_arr = [];
                            _new_arr.push(_arr);
                            seriesObj[PREFIX_AFARM_TYPE_CODE + it.classify] = {
                                data : _new_arr,
                                name : that.legendObject[PREFIX_AFARM_TYPE_CODE + it.classify].name
                            };

                        }
                    })
                });

                let _series_data = [];
                for(var key in this.legendObject){
                    //获取到series正确格式的值
                    _series_data.push(global.tools.extend({name:this.legendObject[key].name, data:[]}, seriesObj[key], temp_series));
                }
                console.log(_series_data);
                this.option.series = _series_data;

                //更新报表
                this.updateEchart();

                //temp_series
            },
            getWeekData() {
                //获取最近七天的报表数据
                let that = this;
                let token = global.data.getToken();

                let _formdata = {
                    startTime: global.tools.formartDate(new Date(global.tools.getCurrentDate() - 6 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD 00:00:00'),
                    endTime: global.tools.formartDate(new Date(), 'YYYY-MM-DD 23:59:59')
                };
                _formdata.token = token;

                this.$http.post(global.config.weburl + "api/analysis/deptAlertInfo.do", _formdata)
                .then(
                        function(res) {
                            if (res.data.code == 0) {
                                that.formartData(res.data.data);
                            } else {
                                global.tools.handleError(res.data);
                            }
                        }
                );
            },
            getDeptAlertInfo() {

                let that = this;

                this.getDataDictionary().then(function(ResultJson) {
                    //通过拿到的数据渲染页面
                    that.fomartAlarmCate(ResultJson);

                    that.getYAxisData();


                }).catch(function(ErrMsg) {
                    //获取数据失败时的处理逻辑

                    console.log(ErrMsg);

//                    that.$message({
//                        type: 'error',
//                        message: "获取警情类型失败"
//                    });
                });

            },
            updateEchart() {
                this.alarm_summary_chart.setOption(this.option);
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
                this.alarm_summary_chart.resize();
            }
        },
        created:function(){

        },
        mounted(){
            this.alarm_summary_chart = echarts.init(document.getElementById('alarm-summary_chart'));
            //this.updateEchart();
            this.getDeptAlertInfo();
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
