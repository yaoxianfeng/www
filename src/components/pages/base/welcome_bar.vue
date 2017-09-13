<template>
    <div class="wel-content"  @click="gotoIndex">
        <div class="main_style">
            <div class="topbar">
                <img src="/static/img/titleleft.png">
                <span>{{content.name}}</span>
                <img src="/static/img/titleright.png">
            </div>
            <div class="content">



                <div class="ggwjw">

                    <div class="menu-box" :style="circleBox">
                        <div class="cs-shield">
                            <img class="item1" src="/static/images/dp.png"/>

                            <img class="wel_line" src="/static/images/wel_line.png"/>
                            <!--<div class="item2">
                                <i class="horn"></i><i class="horn"></i><i class="horn"></i><i class="horn"></i>
                                <ul>
                                    <li>治安管理</li>
                                    <li>交通管理</li>
                                    <li>出入境管理</li>
                                    <li>户籍管理</li>
                                </ul>
                            </div>-->

                        </div>
                        <div class="cs-purp">

                        </div>

                    </div>

                    <!--<div class="dp"><img src="/static/images/dp.png" alt="" class="dp-img"></div>-->
                    <!--<img src="/static/images/ggwjw.png" alt="" class="ggwjw-img">-->
                    <div class="rygn"><img src="/static/images/renyuangongneng.png" alt="" class="rygn-img"></div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return{
                content:{
                },
                _loadPromise :null,
            }
        },
        methods:{
            gotoIndex:function () {
                this.$router.push("/index");
            },
            getData() {
                let that = this;
                let _param = {
                    token: global.data.getToken()
                }
                that.$http.post(global.config.weburl + 'api/deptInformation/queryData.do', _param).then(function(res) {
                    var code = res.data.code;
                    if (code == 0) {
                        that.content = res.data.data;
                    } else {
                        global.tools.handleError(res.data);
                    }
                });
            },
        },
        created: function() {
            let that=this;
            this._loadPromise = new Promise(function(resolve,reject) {
                that.getData();
                resolve();
            });
        },
    }
</script>
<style lang="less">
    .wel-content{
        width: 100%;
        height: 100%;
        background: url(/static/images/wel_bg.jpg) no-repeat;
        background-size: 100% 100%;
        .topbar{
            text-align:center;
            margin: 0 auto;
            padding-top: 3%;
            position: relative;

        span{
            margin: 0 10px;
            color: #55bdff;
            font-weight: 200;
            font-size: 26px;
            position: relative;
            top: -25px;
            }
        }
        .content{
            height: 100%;
        }
        .content .ggwjw{
            height: 600px;
            width: 600px;
            position: absolute;
            left: 50%;
            top:50%;
            margin-left: -300px;
            margin-top: -275px;
            background: url(/static/images/ggwjw.png) no-repeat;
            background-size: 600px 600px;
            z-index: 2;
        }
        .content .ggwjw-img{
            height: 700px;
        }
        .content .dp{
            height: 300px;
            position: absolute;
            left: -450px;
            top: -41px;
        }
        .content .rygn{

            position: absolute;
            right: -370px;


            .rygn-img{
                height: 600px;
                width: auto;
            }

        }


        .cs-shield{position: absolute;top:-100px;left:-370px;width: 238px;}
        .wel_line{width: 200px;height: auto;position: absolute; top: 90px;  left: 240px;}

        .cs-purp{position: absolute;bottom:-15%;left:50%;width:440px;margin-left: -650px;height: 408px;background: url(/static/images/purp.png) no-repeat center center;background-size: contain;}

    }

    @media (max-width: 1500px) {


        .wel-content{


            .content{
                height: 100%;
            }
            .content .ggwjw{
                height: 400px;
                width: 400px;
                position: absolute;
                left: 50%;
                top:50%;
                margin-left: -200px;
                margin-top: -175px;
                background: url(/static/images/ggwjw.png) no-repeat;
                background-size: 100% 100%;
            }
            .content .ggwjw-img{
                height: 400px;
            }
            .content .dp{
                height: 300px;
                position: absolute;
                left: -320px;
                top: -41px;

                img{
                    height: 200px;
                    width: auto;
                }
            }
            .content .rygn{

                position: absolute;
                right: -243px;


                .rygn-img{
                    height: 400px;
                    width: auto;
                }

            }

            .wel_line{width: 200px;height: auto;position: absolute; top: 70px;  left: 120px;}

            .cs-shield{position: absolute;top:-100px;left:-185px;width: 119px;}
            .cs-shield img{width: 120px; height: auto;}

            .cs-purp{position: absolute;bottom:-15%;left:50%;width:220px;margin-left: -360px;height: 204px;background: url(/static/images/purp.png) no-repeat center center;background-size: contain;}

    }

       /* .wel-content .content .rygn-img{
            height: 382px;
            width: auto;
            position: absolute;
            left: -597px;
            top: 162px;
        }
        .wel-content .content .ggwjw-img{
            height: 400px;
            position:absolute;
            top:50%;left:50%;
            margin-left: -208px;
            margin-top: -315px;
        }
        .wel-content .content .dp-img{
            height: 200px;
            position: absolute;
            left: 240px;
            top: 90px;}*/

    }

</style>