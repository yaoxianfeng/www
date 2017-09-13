<template>
    <div class="cs-wfx-content">
        <!-- 警情处理分析 -->
        <div class="cs-wfx-introductions">
            <div class="cs-wxf-flex">
                <ul class="cs-wfx-intro">
                    <li class="cs-box cs-wfx-intro-item cs-wfx-intro-item1">

                        <img class="cs-icon-day" src="/static/images/icon-day.png" />
                        <div class="cs-box-flex1">
                            <div class="cs-count-box">警情：<span>{{summaryData.day_all}}</span></div>
                            <div class="cs-count-box">已处理：<span>{{summaryData.day_online}}</span></div>
                        </div>

                        <!--    <i class="icon-ha-yestoday"></i>
                        <img class="cs-icon-yestoday" src="/static/img/icon-yestoday.png"/> -->
                    </li>
                    <li class="cs-box cs-wfx-intro-item cs-wfx-intro-item2">

                        <img class="cs-icon-week" src="/static/images/icon-week.png" />
                        <div class="cs-box-flex1">
                            <div class="cs-count-box">警情：<span>{{summaryData.week_all}}</span></div>
                            <div class="cs-count-box">已处理：<span>{{summaryData.week_online}}</span></div>
                        </div>

                        <!-- <i class="icon-ha-week"></i>
                        <img class="cs-icon-week" src="/static/img/icon-week.png"/> -->
                    </li>
                    <li class="cs-box cs-wfx-intro-item cs-wfx-intro-item3">
                        <img class="cs-icon-month" src="/static/images/icon-month.png" />
                        <div class="cs-box-flex1">
                            <div class="cs-count-box">警情：<span>{{summaryData.month_all}}</span></div>
                            <div class="cs-count-box">已处理：<span>{{summaryData.month_online}}</span></div>
                        </div>

                        <!-- <i class="icon-ha-month"></i>
                        <img class="cs-icon-month" src="/static/img/icon-month.png"/> -->
                    </li>
                    <li class="cs-box cs-wfx-intro-item cs-wfx-intro-item4">

                        <img class="cs-icon-quarter" src="/static/images/icon-quarter.png" />
                        <div class="cs-box-flex1">
                            <div class="cs-count-box">警情：<span>{{summaryData.quart_all}}</span></div>
                            <div class="cs-count-box">已处理：<span>{{summaryData.quart_online}}</span></div>
                        </div>

                        <!-- <i class="icon-ha-quarter"></i>
                        <img class="cs-icon-quarter" src="/static/img/icon-quarter.png"/> -->

                    </li>
                    <li class="cs-box cs-wfx-intro-item cs-wfx-intro-item5">

                        <img class="cs-icon-allday" src="/static/images/icon-all.png" />
                        <div class="cs-box-flex1">
                            <div class="cs-count-box">警情：<span>{{summaryData.all}}</span></div>
                            <div class="cs-count-box">已处理：<span>{{summaryData.all_online}}</span></div>
                        </div>

                        <!-- <i class="icon-ha-allday"></i>
                        <img class="cs-icon-allday" src="/static/img/icon-allday.png"/> -->
                    </li>
                </ul>
            </div>
            <div class="cs-wxf-flex cs-wfx-fifter-box">
                <el-form class="demo-ruleForm cs-wfx-fifter-form">
                    <el-form-item class="cs-fifter-time-box">
                        <el-col :span="11">
                            <el-form-item prop="startTime">
                                <el-date-picker type="date" placeholder="选择日期" v-model="startTime" :editable="false"
                                                style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line cs-wfx-item-label" :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="endTime">
                                <el-date-picker type="date" placeholder="选择日期" v-model="endTime" :editable="false"
                                                style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="cs-fifter-search-box">
                        <el-col :span="19">
                            <el-select v-model="deptId" placeholder="全部区域" clearable>
                                <el-option v-for="item in dept_options"
                                           :label="item.name"
                                           :value="item.id"
                                           :key="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="4">
                            <el-button type="primary" class="cs-button"
                            @click="getData">搜索
                        </el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>


    </div>


    <div class="cs-dashboard" :resize="resize()">
        <div class="echarts" :style="bar_style">
            <div id="jq_echarts_bar" class="echart_box"></div>
        </div>
        <div class="echarts" :style="pie_style">
            <div id="jq_echarts_pie" class="echart_box"></div>
        </div>
    </div>


</div>
</template>

<script>
// import echarts from 'echarts';
import mystyle from '../../../util/vue/style';

export default {
    mixins: [mystyle],
    data: () => ({
        jq_echarts_bar :null,
        jq_echarts_pie:null,
        startTime: new Date(global.tools.getCurrentDate() - 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(),
        deptId: null,
        dept_options: [],
        summaryData: {
            day_all: 0,
            day_online: 0,
            week_all: 0,
            week_online: 0,
            month_all: 0,
            month_online: 0,
            quart_all: 0,
            quart_online: 0,
            all: 0,
            all_online: 0
        },
        pie: {
            color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949", "#61a0a8"],
            title: {
                text: '区域分布',
                textStyle: {
                    color: '#fff',
                    fontSize:"16",
                    fontWeight:"normal"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        },
        bar: {
            color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949"],
            title: {
                text: '警情处理分析',
                textStyle: {
                    color: '#fff',
                    fontSize:"16",
                    fontWeight:"normal"
                }
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: []
        }
    }),
    methods: {
        echartsresize(){   //echarts图表随窗口变化而变化 
            if (this.jq_echarts_pie) {
                this.jq_echarts_pie.resize();
            }
            if(this.jq_echarts_bar){
                this.jq_echarts_bar.resize();
            }
        },
        resize(){  //监控窗口变化
            if(this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            let that = this;
            this.resizeTimer = setTimeout(function() {
                that.echartsresize();
            },100);
        },
        formartData : function (data) {
            let bar_xAxis_total = data.category.all;
            let bar_series_online = data.category.done;
            let bar_series_undo = data.category.undo;
            let _xAxis_data = [], _series_arr = [], _xAxis_online_data = [], _series_online_arr = [], _xAxis_undo_arr = [], _series_undo_arr = [];
            bar_xAxis_total.forEach(function (value, index, array) {
                if (value) {
                    let _str_arr = value.split(",");
                    _xAxis_data.push(global.tools.formartDate(parseInt(_str_arr[0], 10), 'YYYY-MM-DD'));
                    _series_arr.push(_str_arr[1]);
                }
            });

            bar_series_online.forEach(function (value, index, array) {
                if (value) {
                    let _str_arr = value.split(",");
                    _xAxis_online_data.push(global.tools.formartDate(parseInt(_str_arr[0], 10), 'YYYY-MM-DD'));
                    _series_online_arr.push(_str_arr[1]);
                }
            });

            bar_series_undo.forEach(function (value, index, array) {
                if (value) {
                    let _str_arr = value.split(",");
                    _xAxis_undo_arr.push(global.tools.formartDate(parseInt(_str_arr[0], 10), 'YYYY-MM-DD'));
                    _series_undo_arr.push(_str_arr[1]);
                }
            });


            this.bar = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['总警情数', '已处理', '未处理'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949"],
                title: {
                    text: '警情处理分析',
                    color: "#fff",
                    left: "40px",
                    textStyle: {
                        color: '#fff',
                        fontSize:"16",
                        fontWeight:"normal"
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    data: _xAxis_data,
                    splitLine:{
                        lineStyle:{color :"#0177B4"}
                    },
                    nameTextStyle:{
                        color :"#0177B4",
                        fontStyle:"italic"
                    },
                    axisLine: {
                        lineStyle:{
                            color :"#0177B4"
                        }
                    },
                    axisLabel: { show: true, textStyle: { color: '#0177B4' } }
                },
                yAxis:{
                    splitLine:{
                        lineStyle:{color :"#0177B4"}
                    },
                    nameTextStyle:{
                        color :"#0177B4",
                        fontStyle:"italic"
                    },
                    axisLine: {
                        lineStyle:{
                            color :"#0177B4"
                        }
                    },
                    axisLabel: { show: true, textStyle: { color: '#0177B4' } }
                },
                series: [
                    {
                        type: "line",
                        name: "总警情数",
                        data: _series_arr
                    },
                    {
                        type: "line",
                        name: "已处理",
                        data: _series_online_arr

                    },
                    {
                        type: "line",
                        name: "未处理",
                        data: _series_undo_arr

                    }
                ]
            };

            this.jq_echarts_bar.setOption(this.bar);


            let pie_data = data.pie;
            let _legend_data = [], _pie_series_arr = [];
            pie_data.forEach(function (value, index, array) {
                if (value) {
                    _legend_data.push(value.deptName);
                    _pie_series_arr.push({
                        name: value.deptName,
                        value: value.count
                    });
                }
            });

            this.pie = {
                color:["#42a2df","#6e66bc","#00cc99","#ffee88","#a9e190"],
                title: {
                    text: '区域分布',
                    x: 'center',
                    textStyle:{
                        color:'#fff',
                        fontSize:"16",
                        fontWeight:"normal"
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left:'right',
                    top:'bottom',
                    data: _legend_data,
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: _pie_series_arr,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }



            this.jq_echarts_pie.setOption(this.pie);

        },
        getData : function () {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if (!that.startTime||!that.endTime) {
                this.$message({
                    type: 'warning',
                    message: "时间不能为空"
                });
                return false;
            }
            if (that.startTime > that.endTime) {
                this.$message({
                    type: 'warning',
                    message: "开始时间不能大于结束时间"
                });
                return false;
            }
            
            if(this.endTime>new Date()){
                 this.$message({
                   message: '截止时间不能大于当前时间',
                   type: 'warning'
                });
                 return false;
            }


            if (that.startTime < that.endTime - 15 * 24 * 60 * 60 * 1000) {
                this.$message({
                    type: 'warning',
                    message: "只能查询15天以内的结果"
                });
                return false;
            }

            let _startTime = global.tools.formartDate(that.startTime, 'YYYY-MM-DD');
            let _endTime = global.tools.formartDate(that.endTime, 'YYYY-MM-DD');

            let _formdata = {
                startTime: _startTime,
                endTime: _endTime
            };
            _formdata.token = token;
            let _userinfo = global.data.getUserInfo();
            if (that.deptId) {
                _formdata.deptId =that.deptId;
            }
            this.$http.post(global.config.weburl + "api/analysis/getAlertProcessChart.do", _formdata)
                    .then(
                            function (res) {
                                if (res.data.code == 0) {
                                    that.formartData(res.data.data);
                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                    );
        },

        formartSummaryData: function (data) {
            this.summaryData = {
                day_all: data.day.split(",")[0],
                day_online: data.day.split(",")[1],
                week_all: data.week.split(",")[0],
                week_online: data.week.split(",")[1],
                month_all: data.month.split(",")[0],
                month_online: data.month.split(",")[1],
                quart_all: data.quart.split(",")[0],
                quart_online: data.quart.split(",")[1],
                all: data.all.split(",")[0],
                all_online: data.all.split(",")[1]
            }
        },
        getAlertSummary:function () {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }

            this.$http.post(global.config.weburl + "api/analysis/getAlertSummary.do", {token: token, type: 3})
                    .then(
                            function (res) {
                                if (res.data.code == 0) {
                                    that.formartSummaryData(res.data.data);
                                } else {
                                    global.tools.handleError(res.data);
                                }
                            }
                    );
        },
        doloaddata : function () {
            let that = this;
            let _dept = global.data.getUserInfo() ? global.data.getUserInfo().dept: {};
            let _level = _dept.level;


            if (5==_level) {
                //派出所
                global.tools.getAllPoliceDept().then(function(ResultJson){
                    //通过拿到的数据渲染页面
                    that.dept_options = ResultJson;
                    that.getData();
                }).catch(function(ErrMsg){
                    //获取数据失败时的处理逻辑
                    that.$message({
                        type: 'error',
                        message: "获取数据失败"
                    });
                });


            } else {
                global.tools.getAllArea().then(function(ResultJson){
                    //通过拿到的数据渲染页面
                    that.dept_options = ResultJson;
                    that.getData();
                }).catch(function(ErrMsg){
                    //获取数据失败时的处理逻辑
                    that.$message({
                        type: 'error',
                        message: "获取数据失败"
                    });
                });
            }
        }
    },
    created: function () {
        let that = this;

        that.getAlertSummary();
        that.doloaddata();

    },
    mounted:function() {
        this.jq_echarts_bar = echarts.init(document.getElementById('jq_echarts_bar'));
        this.jq_echarts_pie = echarts.init(document.getElementById('jq_echarts_pie'));
    }
}
</script>

<style scoped>
.echarts {
    float: left;
    width: 500px;
    height: 400px;
}

.cs-wfx-intro-item-right {
    position: absolute;
    right: 0px;
    width: 100px;
    font-size: 14px;
}



</style>
