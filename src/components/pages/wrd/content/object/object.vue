<template>
    <div class="cs-object" :style="ylstyle">
        <div class="el-dialog__wrapper ">
            <div class="guanbi" @click="cancel()"></div>
            <div class="cds-tables">
                <div class="cs-table">
                    <el-table :data="gridData" border highlight-current-row @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="address" label="地址"></el-table-column>
                    </el-table>
                </div>
                <div class="cs-adjct-button">
                    <el-button @click="cancel()">关闭</el-button>
                    <el-button @click="Deter()">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        numflag: '',
        RowDataid: '',
        lyform: '',
        commname: ''
    },
    data() {
        return {
            keyword: '',
            gridData: [],
            multipleSelection: '',
            ylstyle: {},
            num: '',
            result: []
        }
    },
    methods: {
        Deter() { //确定
            this.$emit('addobject', {
                data: this.multipleSelection
            });
            //this.cancel();
        },
        cancel() { //关闭
            this.$emit("cancelChoose");
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getAllArea() {
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            let _deptid = (global.data.getUserInfo() && global.data.getUserInfo().dept) ? global.data.getUserInfo().dept.id : "";
            this.$http({
                method: 'POST',
                url: global.config.weburl + "api/dept/findByUserPoliceStation.do",
                params: {
                    token: token,
                    parentId: _deptid
                }
            }).then(
                function(res) {
                    if (res.data.code != 0) {
                        global.tools.handleError(res.data);
                        return;
                    }
                    this.gridData = res.data.data;
                }
            );
        },
        getAllPoliceDeptsWithSelf() {
            let that = this;
            global.tools.getAllPoliceDeptsWithSelf().then(function(ResultJson) {
                //通过拿到的数据渲染页面
                that.gridData = ResultJson;
            }).catch(function(ErrMsg) {
                //获取数据失败时的处理逻辑
                that.$message({
                    type: 'error',
                    message: "获取部门数据失败"
                });
            });
        },
        arrayIntersection(a, b) { //对比两个数组，取出相同的值
            var ai = 0,
                bi = 0;
            this.result = new Array();
            while (ai < a.length && bi < b.length) {
                if (a[ai] < b[bi]) {
                    ai++;
                } else if (a[ai] > b[bi]) {
                    bi++;
                } else /* they're equal */ {
                    result.push(a[ai]);
                    ai++;
                    bi++;
                }
            }
            console.log(this.result)
        },
        checked() {

        }
    },
    mounted: function() {
        
        this.checked(); //每次更新了数据，触发这个函数即可。
        //this.$refs.table.toggleRowSelection(this.gridData[0]) // 選中第二個
        // 選中 value = 1 那行
        //this.$refs.table.toggleRowSelection(this.data.find(d => d.value === 1))
    },
    created: function() {

        if (this.numflag == 8) { //政策学习
            this.getAllPoliceDeptsWithSelf();

        } else {
            this.getAllArea();
        }
        
        if (this.lyform) {
            this.ylstyle = {
                position: "absolute",
                top: "5%",
                left: "20%"
            }
        } else {
            this.ylstyle = {}
        }

    }
}
</script>
<style lang="less">
.is-checked {
    border-color: #fff;
}

.cs-object {
    position: relative;
    /* width: 500px;
            height: 580px; */
    z-index: 400;
    /* left: 30px;
            padding: 20px; */
    /* border: 1px solid #275e8b; */

    .el-upload--text {
        width: 35px;
        height: 35px;
        overflow: hidden;
    }
}

.cds-tables {
    position: fixed;
    left: 34%;
    top: 20%;
    padding: 5px;
    background: url(/static/images/bg-icea.png);
    width: 600px;
    min-height: 460px;
    border: 1px solid #275e8b;
    z-index: 600;
}

.cs-object:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
}

.cs-table {
    background: rgba(39, 94, 139, 0.3);
    width: 100%;
    height: 440px;
    overflow-y: auto;
    ;
    .el-checkbox__inner {
        background: #599dd4;
        border: 1px solid #599dd4;
        border-radius: 0;
    }
}

.cs-adjct-button {
    background: rgba(39, 94, 139, 0.3);
    width: 100%;
    height: 15%;
    padding-bottom: 4%;
    text-align: center;
    .el-button {
        background: #275e8b;
        color: #fff;
        border: #275e8b;
    }
}

.el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #fff;
}

.guanbi {
    width: 100%;
    height: 100%;
    z-index: 450;
}

.avatar {
    right: 0!important;
    float: left;
}


</style>
