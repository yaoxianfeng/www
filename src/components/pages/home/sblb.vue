<template>
<div class="cs_shangbao">
  <div class="sblb">
    <el-row class="listname">
      <el-col :span="9" :offset="1">上级人员列表</el-col>
      <el-col :span="9" :offset="3"><label><input type="text" v-model="m_name"><i class="el-icon-search" v-on:click="f_search"></i></label></el-col>
    </el-row>
    <el-row class="details" v-for="obj in namelist">
      <el-col :span="2" :offset="1"><input type="checkbox"></el-col>
      <el-col :span="4" :offset="2"><div class="fm_name">{{obj.fm_name}}</div></el-col>
      <el-col :span="8"><div class="_status">{{obj._status}}</div></el-col>
      <el-col :span="5" :offset="2"><i class="_tel">联系他</i></el-col>
    </el-row>
  </div>
      <el-row class="cs_sbsub"><button>上报</button></el-row>
</div>
</template>
<script>
    export default {
        data: function() {
            return {
                memberlist: [{
                    fm_name: "李小",
                    _status: "在线"
                }, {
                    fm_name: "赵小龙",
                    _status: "在线"
                }, {
                    fm_name: "田小龙",
                    _status: "在线"
                }, {
                    fm_name: "付小龙",
                    _status: "在线"
                }, {
                    fm_name: "唐小龙",
                    _status: "在线"
                }, {
                    fm_name: "钱小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }, {
                    fm_name: "孙小龙",
                    _status: "在线"
                }],
                m_name: "",
                namelist: []
            }
        },
        created: function() {
          this.namelist=this.memberlist;
        },
        methods: {
            show_contact: function() {
                this.$emit('show_contact');
            },
            f_search: function() {
                var that = this;
                var res = [];
                this.namelist = this.memberlist;
                console.log(that.m_name + "1111");
                if (that.m_name) {
                    this.namelist.forEach(function(item, index) {
                        if (item.fm_name.indexOf(that.m_name) != -1) {
                            res.push(item);
                        }
                    });
                } else {
                    res = this.memberlist;
                }
                this.namelist = res;
            }
        }
    } 
</script>



<style>
.cs_shangbao{
    position: fixed;
    left: 200px;
    width: 280px;
    border:1px solid #e4e4e4;
}
.sblb{
  width: 280px;
  height: 410px;
  overflow: hidden;
}
.sblb .listname{
  background: #f2f2f2;
  height: 45px;
  padding-left: 14px;
  line-height: 45px;
  font-size: 16px;
  font-weight: 600;
}
.sblb .listname label input{
  width: 70px;
  height: 26px;
  border-radius: 13px!important;
  padding: 0 8px;
  outline: none;
}
.sblb .listname .el-icon-search{
  padding-left: 8px;
}
.sblb .details{
  background: #fff;
  border-top: 1px solid #e4e4e4;
  height: 45px;
  padding:0 14px;
  line-height: 45px;
  font-size: 14px;
}
.sblb ._status{
  text-align:center ;
  color: #00CC00;
}
.sblb ._tel{
  text-align:right ;
  color:#0099FF;
}
.cs_shangbao .cs_sbsub{
  background: #fff;
  height: 50px;
  line-height: 50px;
  padding-top: 9px;
}
.cs_shangbao .cs_sbsub button{
  background: #999999;
  width: 98px;
  height: 32px;
  outline: none;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 14px;
  line-height: 32px;
  display: block;
  margin: 0 auto;
}
</style>
