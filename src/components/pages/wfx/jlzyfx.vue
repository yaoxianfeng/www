<template>
    <div class="cs-wfx-content">
        <!-- 警力资源分析 -->
        <div class="cs-wfx-fifter-box">
            <el-form class="demo-ruleForm cs-wfx-fifter-form">
                <el-form-item class="cs-fifter-time-box">
                    <el-col :span="4">
                        <el-form-item>
                            <el-date-picker type="date" placeholder="选择日期" v-model="startTime" :editable="false" style="width: 100%;" ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line cs-wfx-item-label" :span="1">至</el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-date-picker type="date" placeholder="选择日期" v-model="endTime" :editable="false" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line cs-wfx-item-label" :span="1">&nbsp;</el-col>
                    <el-col :span="6" class="cs-wfx-areabox">
                        <el-form-item>
                            <el-select v-model="deptId" placeholder="全部区域" clearable>
                                <el-option v-for="item in dept_options" :label="item.name" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="cs-button" @click="getData">搜索</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
        <div class="cs-dashboard" :resize="resize()">
            <div class="echarts" :style="bar_style">
                <div id="jl_echarts_bar" class="echart_box"></div>
            </div>
            <div class="echarts" :style="pie_style">
                <div id="jl_echarts_pie" class="echart_box"></div>
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
        jl_echarts_bar: null,
        jl_echarts_pie: null,
        startTime: new Date(global.tools.getCurrentDate() - 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(),
        deptId: '',
        dept_options: [],
        pie: {
            color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949", "#61a0a8"],
            title: {
                text: '职位类型',
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
            series: [{
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
            }]
        },
        bar: {
            color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949"],
            title: {
                text: '区域分布',
                textStyle: {
                    color: '#fff'
                }
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: [{
                type: "bar",
                barMaxWidth: 40,
                data: []
            }]
        }
    }),
    methods: {
        echartsresize(){   //echarts图表随窗口变化而变化 
            if (this.jl_echarts_pie) {
                this.jl_echarts_pie.resize();
            }
            if(this.jl_echarts_bar){
                this.jl_echarts_bar.resize();
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
        formartData: function(data) {
            let bar_xAxis_total = data.bar.depts;
            let _xAxis_data = [],
                _series_arr = [];
            bar_xAxis_total.forEach(function(value, index, array) {
                if (value) {
                    let _str_arr = value.split(",");
                    _xAxis_data.push(_str_arr[0]);
                    _series_arr.push(_str_arr[1]);
                }
            });

            let _bar = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    textStyle:{
                        color:'#fff',
                    },
                    top:'50%',
                },
                color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949"],
                title: {
                    text: '区域分布',
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

                series: [{
                    name: "警力",
                    type: "bar",
                    stack: "人数",
                    barMaxWidth: 40,
                    data: _series_arr
                }]
            };
            this.jl_echarts_bar.setOption(_bar);

            let pie_data = data.pie;
            let _legend_data = [],
                _pie_series_arr = [];
            pie_data.forEach(function(value, index, array) {
                if (value) {
                    _legend_data.push(value.jobName);
                    _pie_series_arr.push({
                        name: value.jobName,
                        value: value.count
                    });
                }
            });

            let _pie = {
                color:["#42a2df","#6e66bc","#00cc99","#ffee88","#a9e190"],
                title: {
                    text: '职位类型',
                    x: 'center',
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
                    left:'right',
                    top:'bottom',
                    data: _legend_data,
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [{
                    name: '职位类型',
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
                }]
            }
            this.jl_echarts_pie.setOption(_pie);
        },
        getData: function() {
            let that = this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            if (!that.startTime || !that.endTime) {
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

            if (this.endTime > new Date()) {
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
                _formdata.deptId = that.deptId;
            }
            this.$http.post(global.config.weburl + "api/analysis/getPoliceAreaChart.do", _formdata)
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
        timeLimit: function() {
            let that = this;
            let _start_time = that.startTime;
            let _end_time = that.endTime;
            that.picker_startTime = {
                    disabledDate(time) {
                        return (_end_time < time.getTime()) || (time.getTime() < _end_time - 15 * 24 * 60 * 60 * 1000);
                    }
                },
                that.picker_endTime = {
                    disabledDate(time) {
                        return _start_time > time.getTime() || (time.getTime() > new Date()) || (time.getTime() > _start_time + 15 * 24 * 60 * 60 * 1000);
                    }
                };
        }

    },
    created: function() {
        let that = this;

        let _deptid = (global.data.getUserInfo() && global.data.getUserInfo().dept) ? global.data.getUserInfo().dept.id : "";
        global.tools.getAllPoliceDept().then(function(ResultJson) {
            //通过拿到的数据渲染页面
            that.dept_options = ResultJson;
            that.getData();
        }).catch(function(ErrMsg) {
            //获取数据失败时的处理逻辑
            that.$message({
                type: 'error',
                message: "获取部门数据失败"
            });
        });

    },

    mounted: function() {
        this.jl_echarts_bar = echarts.init(document.getElementById('jl_echarts_bar'));
        this.jl_echarts_pie = echarts.init(document.getElementById('jl_echarts_pie'));
    }
}
</script>
<style scoped>
.echarts {
    float: left;
}

.cs-fifter-time-box {
    margin-top: 10px;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>
