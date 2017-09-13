<template>
    <div class="cs_zddetail">
        <div class="_title"><span>站点详情</span><i class="el-icon-close" @click="hidezddetail"></i></div>
        <div class="listfloor">
            <div class="_lis">
                <span>站点名称：<em>{{zd_detail.entityName}}</em></span>
            </div>
            <div class="_lis">
                <span>联系电话：<em>{{zd_detail.telphone}}</em></span>
            </div>
        </div>
        <div class="listfloor">
            <div class="_lis">
                <span>责任民警：<em>{{zd_detail.liabPolicy}}</em></span>
            </div>
            <div class="_lis">
                <span>联系电话：<em>{{zd_detail.liabPolicyPhone}}</em></span>
            </div>
        </div>
        <div class="listfloor">
            <div class="_lis ">
                <span>地址：<em>{{zd_detail.address}}</em></span>
            </div>
        </div>
        <div class="listfloor">
            <div class="fengcai">
                <span class="_name2">站点风采：</span>
                <el-row :gutter="10" ref="zdimg">
                    <el-col :span="8" v-for="(n, index) in imageList" :key="n.id" :data-index="index">
                        <img v-if="n.url" :src="n.url">
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        zd_detail: {}
    },
    data: function() {
        return {
            imageList: [],
            viewer: null
        }
    },
    methods: {
        hidezddetail: function() {
            this.$emit('hidezddetail');
        },
        changeimg() {
            var that = this;
            that.imageList = [];
            if (that.zd_detail.imgs) {
                var arr = that.zd_detail.imgs.split(",");

                arr.forEach(function(value, index, array) {
                    if (value && value.indexOf("http") == 0) {
                        that.imageList.push({width: 900,height: 675,url:value});
                    } else if (value) {
                        var _value = global.config.imgbaseurl + value;
                        that.imageList.push({width: 900,height: 675,url:_value});
                    }

                });
            }
        }
    },
    created: function() {
        this.changeimg();
        // console.log(this.zd_detail);
    },
    watch: {
        zd_detail: {
            deep: true,
            handler: function() {
                this.changeimg();
            }
        }
    },
    mounted: function() {
        var that=this;
        if (this.imageList[0]) {
            this.viewer = new Viewer(this.$refs.zdimg.$el, {
                movable: false,
                viewed:function(){
                    that.viewer.image.parentNode.onclick = function() {
                        that.viewer.hide();
                    },
                    that.viewer.image.onclick = function(e) {
                        if (e && e.stopPropagation) {//非IE浏览器 
                        　　e.stopPropagation(); 
                        } 
                        else {//IE浏览器 
                            window.event.cancelBubble = true; 
                        } 
                    }
                }

            });
        }

    },
    updated() {
        var that=this;
        if (this.viewer) {
            this.viewer.update();
        } else {
            if (this.imageList[0]) {
                this.viewer = new Viewer(this.$refs.zdimg.$el, {
                    movable: false,
                    viewed:function(){
                        that.viewer.image.onclick=function(){
                            // console.log(that.$refs.imgcolse); 
                            that.viewer.hide();
                        }
                    }

                });
            }
        }
    }

}
</script>
<style lang="less">
.clearfix:after {
    overflow: hidden;
    content: ".";
    height: 0;
    visibility: hidden;
    display: none;
    clear: both;
}

.cs_zddetail {
    width: 600px;
    height: 500px;
    position: absolute;
    top:9%;
    right: 0;
    z-index: 200;
    background:url(/static/images/bg-icea.png);
    &:after{
        content:'';
        background:rgba(12, 28, 42,0.9);
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0; 
    }
    ._title {
        height: 50px;
        background: #275e8b;
        display: flex;
        padding: 0 20px;
        -ms-align-items: center;
        align-items: center;
        justify-content: space-between;
        span {
            color: #fff;
        }
        .el-icon-close{
            cursor: pointer;
            &:hover{
                color:#20a0ff;
            }
        }
    }
    .listfloor{
        display: flex;
        margin: 4% 2.8% 0 2.8%;
        border: 1px solid #275e8b;
        border-radius: 2px;
        background: rgba(39,94,139,0.5);
        ._lis{
            line-height: 35px;
            padding:0 20px 0 36px;
            font-size: 14px;
            em {
                font-style: normal;
                color: #fff;
            }
        }
    }
}
.fengcai {
    line-height: 31px;
    font-size: 14px;
    padding: 0 36px 0;
    height: 200px;
}

.fengcai img {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
    max-height: 130px;
}

.fengcai ._name2 {
    display: block;
    padding: 4px 0;
    color: #fff;
    text-align: left;
}
</style>
