<template>
    <el-dialog title="办事指南类别" v-model="is_show" @close="close" class="bszn-catelist" >
            <div class="topbutton">
                <el-button  @click="addcategory" class="cs-button"><i class="el-icon-edit"></i>新增</el-button>
            </div>
            
            <div :class="[isaddcate?'width50':'width100','cs-bszn-cate-list-tab']"  >
                <el-table :data="subject_items" :height="tableheigth" highlight-current-row @row-click="rowClick">
                    <el-table-column label="序号" width="70">
                        <template scope="scope">
                            {{ scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="图标" width="70">
                        <template scope="scope">
                            <img :src=scope.row.image>
                        </template>
                    </el-table-column>
                    <el-table-column  label="名称" >
                        <template scope="scope">
                            {{myfilter(scope.row.name)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button @click="update(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="deleteCate(scope.$index, scope.row)"  type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="isaddcate" class="cs-bszn-cate-right">
                <div class="catename">
                    <div class="cates">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
                              <el-form-item label="类别名称：" prop="catename">
                                <el-input  :disabled="noall" v-model="ruleForm.catename" :maxlength="7"></el-input>
                              </el-form-item>
                        </el-form>
                    </div>
                    <div class="cates ">
                        <i>选择图标：</i>
                        <div class="icons" :style="dialogMainStyle" >
                            <div v-for="item in cateicons"  @click="clickicon(item)" >  
                                <!--<i>{{item.codenum}}</i>-->
                                <span v-if="item.url==cateimg" class="el-icon-circle-check redbj"></span>
                                <span v-if="item.url!=cateimg" class="el-icon-circle-check"></span>
                                <img :src="item.url" >
                            </div>
                        </div>
                    </div>
                    <div class="cates" >
                        <el-button @click="cancelcate">取消</el-button>
                        <el-button @click="savecate('ruleForm')">保存</el-button>
                    </div>
                </div>
            </div>
    </el-dialog>
</template>

<script>
import mystyle from '../../../util/vue/style';
export default {
    name: 'wrd_main',
    mixins: [mystyle],
    props: {
        subject_items:''
    },
    data: function () {
        return {
            is_show:false,
            dialogMainHeight:500,
            caterow:'',
            cateicons:[],
            cateimg:'',
            cateid:null,
            noall:false,
            isaddcate:false,
            codenum:'aq1',
            ruleForm: {
                catename:''
            },
            rules:{
                catename: [
                    {
                        validator: (rule, value, callback) => {
                            if (global.tools.isNullString(value)) {
                                callback(new Error('请输入类别名称'));
                            } else if (value.length > 7) {
                                callback(new Error('长度在 1 到 7 个字符'));
                            }  else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                  ],
            },
            is_show_add:true  //是否显示新增
        }
    },
    components:{
        addcate: function(resolve, reject) {
            require(['./catelist.vue'], resolve)
        }
    },
    methods: {
        rowClick(row){
            this.update(0, row);
        },
        showEditBox() {
            this.cateid = null;
            this.ruleForm.catename = "";
            this.isaddcate = true;
        },
        cancelcate() {  //取消  关闭新增类别
            this.ruleForm.catename=""
            this.isaddcate = false;
        },
        update(index, row) {  //更新
            this.caterow=row;
            this.isaddcate = true;
            this.cateid = row.id;
            //同步编辑时的图片
            this.cateimg = row.image;
            let all="全部";
            if(this.countSubstr(row.name,all)){
                this.noall=true;
            }else{
                this.noall=false;
            }
            this.ruleForm.catename = row.name.replace(/\([^\)]*\)/g,"");
            this.is_show_add = true;
        },
        countSubstr(str, substr) {  
            var reg = new RegExp(substr, "g");  
            return str.match(reg) ? str.match(reg).length : 0;
        },
        myfilter(value){
          return value.replace(/\([^\)]*\)/g,"");
        },  
        addcategory(){ //新增类别
            this.noall=false;
            if(!this.isaddcate){
                this.isaddcate=true;
            }

            this.cateimg = (this.cateicons && this.cateicons.length > 0) ? this.cateicons[0].url : '';

            this.is_show_add = false;
            this.ruleForm.catename='';
            this.cateid='';

        },
        close() { //关闭弹窗
            this.isaddcate=false;
            this.ruleForm.catename="";
            this.$emit('hideCatedialog');
        },
        savecate(formName) {  //保存
            this.$refs[formName].validate((valid) => {
                  if (valid) {
                        let that = this;
                        let token = global.data.getToken();
                        if(!token) {
                            return false;
                        }
                        if (!this.ruleForm.catename) {
                            this.$message({
                                type: 'error',
                                message: "请输入类别名称"
                            });
                            return false;
                        }
                        this.ruleForm.catename=this.ruleForm.catename.replace(/\s+/g,"");
                        if (this.cateid) {
                            that.doUpdateDate(token);
                        } else {
                            that.doSaveDate(token);
                        }
                  } else {
                        console.log('error submit!!');
                        return false;
                  }
            });
        },
        doUpdateDate(token) {   //更新办事指南
            let that = this;
            this.$http.post(global.config.weburl + "api/sysSubject/updateSysSubject.do",
                    {token:token, name:that.ruleForm.catename, id:that.cateid,image:that.cateimg})
                    .then(
                        function(res){
                            if(res.data.code==0){
                                that.cateid = null;
                                that.ruleForm.catename = "";
                                that.isaddcate = false;
                                that.$emit('changeCateList');
                                this.$message("修改成功！")
                            }else{
                                global.tools.handleError(res.data);
                            }
                        });
        },
        doSaveDate(token) {  //保存新建类别
            let that = this;
            this.$http.post(global.config.weburl + "api/sysSubject/addSysSubject.do",
                {token:token, name:that.ruleForm.catename, isUseable:1,isComment:1,image:that.cateimg})
                .then(
                    function(res){
                        if(res.data.code==0){
                            that.cateid = null;
                            that.ruleForm.catename = "";
                            that.isaddcate = false;
                            this.$message("添加成功！")
                            that.$emit('changeCateList');
                        } else{
                            global.tools.handleError(res.data);
                            that.ruleForm.catename = "";
                        }
            });
        },
        deleteCate(index, row) {  //删除
            let that = this;
            let token = global.data.getToken();
            if(!token) {
                return false;
            }
            this.$confirm('是否确认删除《' + row.name + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((ref) => {
                if (ref) {
                this.$http.post(global.config.weburl + "api/sysSubject/deleteSysSubject.do",
                    {token:token, id:row.id})
                    .then(
                            function(res){
                                if(res.data.code==0){
                                    that.cateid = null;
                                    that.ruleForm.catename = "";
                                    that.isaddcate = false;
                                    this.$message({
                                        type: 'success',
                                        message: "删除办事指南类别成功"
                                    });
                                    that.$emit('changeCateList');
                                }else{
                                    global.tools.handleError(res.data);
                                }
                            }
                    );
                }
            })
        },  
        getsubjectIco(){  //获取类别图标
            var that=this;
            let token = global.data.getToken();
            if (!token) {
                return false;
            }
            this.$http.post(global.config.weburl + "api/dict/findByParent.do", {
                token: token,
                code:'subjectIco'
            }).then(
                function(res) {
                    if (res.data.code == 0) {

                        let _data = res.data.data;
                        if(_data!=null || _data.length > 0) {

                            _data.forEach(function(item, index){
                                item.url =  global.config.weburl + item.name;
                            })

                            that.cateimg =_data[0].url;
                        }
                        that.cateicons = _data;
                    } else {
                        global.tools.handleError(res.data);
                    }
                }
            );
        },
        clickicon(item){  //选中某个图标
            //this.codenum=item.code;
            this.cateimg=item.url;
        }
    },
    computed:{
        tableheigth() {
            let _oheight = global.app.$store.getters.getPageInfos.content_height - 114;
            return _oheight
        },
        dialogMainStyle(){
            let _oheight = global.app.$store.getters.getPageInfos.content_height - 305;
            return{
                'height':_oheight+'px'
            } 
        }
    },
    created(){
    },
    watch(){
    },
    mounted:function() {
        this.subject_items.shift();
        this.is_show = true;
        this.getsubjectIco();
    },

}
</script>
<style lang="less">
.bszn-catelist{
        background: rgba(0, 0, 0, 0.4);
    .el-dialog{background: none;
        margin: 0;
        width: 70%;
        padding-bottom: 20px;
        top: 50%;
        margin-top:-60px; 
      }
    .topbutton{
        width: 100%;
        height: 36px;
        margin:-5px 0 10px 0;
        .cs-button{
            float: right;
            color: #fff;
            i{
                margin-right: 5px;
                font-size: 12px;
            }
        }
    }

    .cs-bszn-cate-list-tab{
        overflow-y:auto;
        float: left;
        .width50{width: 49%;}
        .width100{width: 100%;} 
        img{
            width: 30px;height: 30px;margin-top: 5px;
        } 
    }
    .cs-bszn-cate-right{
        float: right;
        width: 49%;
        .catename{
            width: 100%;
            float: right;
            border: 1px solid #275e8b;
            padding:10px 10px 10px 20px;
            .cates{
                min-height: 40px;
                line-height: 40px;

                white-space : normal ;

                .el-form-item__label{color: #fff;}
                i{
                    font-style:normal;

                }

                button{
                    background: #275e8b;
                    border: 1px solid #275e8b;
                    color: #fff;
                }
                button:nth-child(1){
                    margin-left:35%;
                }
                .icons{
                    overflow: auto;
                    div{
                        position: relative;
                        width: 70px;
                        height: 70px;
                        border: 1px solid #275e8b;
                        display:inline-block;
                        margin: 5px;
                        cursor: pointer;
                        span{
                            position: absolute;
                        }
                        img{
                            width: 60px;
                            height: 60px;
                            margin: 5px;
                        }
                        .redbj{
                            color:#499EDB;
                        }
                    }
                }
            }
        }
    }
}

</style>


