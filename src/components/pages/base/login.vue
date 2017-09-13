<template>
    <div class="row-bg">
        <span class="star"></span>
        <el-row type="flex" class="row-bg" justify="center" align="middle">
          <el-col :span="14" class="loginLeft">
              <img class="loginlogo" src="/static/img/login/loginlogo.png"/>
              <div class="animation">
                  <div class="item"><img class="img line" src="/static/img/login/line.png"/></div>
                  <div class="item"><img class="img sunshine" src="/static/img/login/sunshine.png"/></div>
                  <div class="item"><img class="img logodh" src="/static/img/login/logo.png"/></div>
                  <div class="item fixed"><img class="img circle3" src="/static/img/login/circle3.png"/></div>
                  <div class="item"><img class="img circle4" src="/static/img/login/circle3.png"/></div>
                  <div class="item"><img class="img circle5" src="/static/img/login/circle3.png"/></div>
                  <div class="item cic"><img class="img circle2 circle2-0" src="/static/img/login/circle2.png"/></div>
                  <div class="item cic"><img class="img circle2 circle2-1" src="/static/img/login/circle2-1.png"/></div>
                  <div class="item cic"><img class="img circle2 circle2-2" src="/static/img/login/circle2-2.png"/></div>
                  <div class="item cic"><img class="img circle2 circle2-3" src="/static/img/login/circle2-3.png"/></div>
                  <div class="item"><img class="img circle" src="/static/img/login/circle.png"/></div>
                  <div class="item"><img class="img dotted" src="/static/img/login/dotted.png"/></div>
                  <div class="item">
                      <span class="cuboid plate item4"></span>
                      <span class="cuboid plate2 item3"></span>
                      <span class="cuboid plate item2"></span>
                      <span class="cuboid plate2 item1"></span>
                  </div>
                  <div class="item roll1">
                      <span class="cuboid plate item4"></span>
                      <span class="cuboid plate2 item3"></span>
                      <span class="cuboid plate item2"></span>
                      <span class="cuboid plate2 item1"></span>
                  </div>
                  <div class="item roll2">
                      <span class="cuboid plate item4"></span>
                      <span class="cuboid plate2 item3"></span>
                      <span class="cuboid plate item2"></span>
                      <span class="cuboid plate2 item1"></span>
                  </div>
              </div>
          </el-col>
          <el-col :span="10" class="fcs_main">
            <div class="v-middle">
                <div class="_form loginbox trans">
                     <h2>光谷微警务</h2>
                     <h4>E-Police Auxiliary Platform</h4>
                    <div class="cs-login-in">
                        <span class="lgborder ibor1"></span><span class="lgborder ibor2"></span><span class="lgborder ibor3"></span><span class="lgborder ibor4"></span>
                         <h3>用户登录</h3>
                        <div class="cs-lg-item">
                           <label><i class="cs-l-icon"><img src="/static/img/l-icon-user.png"></i>
                           <el-autocomplete
                              :fetch-suggestions="querySearch"
                              placeholder="请输入用户名"
                              v-model="username"
                              @select="handleSelect">
                            </el-autocomplete>
                            </label>
                        </div>
                        <div class="cs-lg-item">
                            <label>
                                <i class="cs-l-icon"><img src="/static/img/l-icon-passwd.png"></i>
                                <input v-model="password" type="password" @keyup.enter="denglu" placeholder="请输入密码" autocomplete="new-password">
                            </label>
                        </div>
                       <button v-on:click="denglu">登录</button>
                        <div v-show="is_login" class="f_tips" ref="_tips">请输入密码</div>
                   </div>
                    <span class="test_cover trans"></span>
                </div>
            </div>
          </el-col>
        </el-row>
        <!--
        <div class="_footer">
            <i></i><span>2017 &copy; 华奥科技 版权所有</span>
        </div>-->
    </div>
</template>
<script>


import {short_md5} from '../../../../static/js/md5.js'




export default {
        data:function(){
            return{
                is_login:false,
                restaurants: [],
                password: "",
                username: ""
                }
        },
        created: function() {
            let that = this;
            // that.resetPage();
            // window.onresize = function(){
            //     that.resetPage();
            // }
        },
        methods: {
            querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          createFilter(queryString) {
                return function(e){
                    return (e.value.indexOf(queryString.toLowerCase()) === 0);
                }
          },
          resetPage: function() {
               let screenH = document.documentElement.offsetWidth;

          },
          handleSelect(item) {
           // console.log(item);
          },
            launchFullscreen : function () {
                let marioVideo = document.documentElement;
                if (marioVideo.requestFullscreen) {
                    marioVideo.requestFullscreen();
                }
                else if (marioVideo.msRequestFullscreen) {
                    marioVideo.msRequestFullscreen();
                }
                else if (marioVideo.mozRequestFullScreen) {
                    marioVideo.mozRequestFullScreen();
                }
                else if (marioVideo.webkitRequestFullScreen) {
                    marioVideo.webkitRequestFullScreen();
                }
            },

        denglu:function() {
            var username=this.username;
            var pws=this.password;
            var re="^1[3|4|5|8][0-9]\d{4,8}$ ";
            let that = this;

            if (username=="") {
                this.$refs._tips.innerHTML="请输入用户名";
                this.is_login=true;
            }else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(username))){
                this.$refs._tips.innerHTML="请输入正确的手机号";
            }else if(pws==""){
                this.$refs._tips.innerHTML="请输入密码";
                this.is_login=true;
            }
            else{
                this.launchFullscreen();
                let _pwd =  short_md5(pws);

                this.$http.post(global.config.weburl+ 'api/auth/weblogin.do',{phone:username,password:_pwd})
                    .then(function(data){
                    var _data=data.data;
                    if(_data.code!=0){
                        that.$refs._tips.innerHTML=_data.msg;
                        that.is_login=true;
                    }else{
                        //data.user.isWebLogin
                        global.data.setUserInfo(_data.data.user);
                        global.data.setToken(_data.data.token);
                        global.data.setDeptid(_data.data.user.dept.id);

                        var arr=localStorage.getItem("username");
                        if(arr){
                            arr=JSON.parse(arr);
                            var step=0;
                            arr.forEach(function(value,index,array){
                                if(value.value==username){
                                    return false;
                                }
                                step++;
                            })

                            if(step==arr.length){

                                arr.push({"value":username})
                            }
                        }else{
                            arr=[];
                            arr.push({"value":username})
                        }
                        arr=JSON.stringify(arr)
                        localStorage.setItem("username", arr);
                        this.$router.push("/welcome");

                    }
                },function(error){
                });
            }
        }
    },
    mounted(){
        var usernamearr=localStorage.getItem("username");
        if(usernamearr){
            usernamearr=JSON.parse(usernamearr);
            this.restaurants=usernamearr;
        }else{
            this.restaurants=[];
        }

        $(function(){
            function isIE(){
                if(!!window.ActiveXObject || "ActiveXObject" in window){
                    return true;
                }else{
                    return false;
                }
            }
            function IEVersion(){
                var rv = -1;
                if (navigator.appName == 'Microsoft Internet Explorer'){
                    var ua = navigator.userAgent;
                    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                    rv = parseFloat( RegExp.$1 );
                }else if (navigator.appName == 'Netscape'){
                    var ua = navigator.userAgent;
                    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                    rv = parseFloat( RegExp.$1 );
                }
                return rv;
            }
            var ie9 = false;
            if (isIE()) {
                //if (IEVersion() <= 9) {
                    $(".loginlogo").show();
                    $(".animation").hide();
                    $(".test_cover").hide();
                    ie9 = true;
                //};
            };
            if(ie9 == false){

                var line = $(".line"),cuboid = $(".cuboid"),roll1 = $(".roll1"),roll2 = $(".roll2"),logo = $(".logodh"),sunshine = $(".sunshine"),
                    circle3 = $(".circle3"),circle4 = $(".circle4"),circle5 = $(".circle5"),dotted = $(".dotted"),circle = $(".circle"),circle2 = $(".circle2");
                var loginbox = $(".loginbox"),star = $(".star"),test_cover = $(".test_cover"),cs_login_in = $(".cs-login-in");
                var x = cs_login_in.offset().left-5,y = cs_login_in.offset().top;
                line.animate({"opacity": 1}).parent(".item").addClass("animat1");
                cuboid.animate({"opacity": 1}).parent(".item").attr("class", "item animat8");
                setTimeout(function(){
                    cuboid.parent(".item").attr("class", "item animat8-2");
                },1000);
                setTimeout(function(){
                    roll1.attr("class", "item roll1 animat8-2 animat8-3");
                    roll2.attr("class", "item roll2 animat8-2 animat8-3");
                },5000);
                setTimeout(function(){
                    logo.animate({"opacity": 1}).parent(".item").addClass("animat3");
                },1000);
                setTimeout(function(){
                    sunshine.animate({"opacity": 1}).parent(".item").addClass("animat2");
                },5000);
                setTimeout(function(){
                    circle3.animate({"opacity": 0.5});
                },5500);
                dotted.delay(6000).animate({"opacity": 1}).delay(600).parent(".item").addClass("animat7");
                circle.delay(7000).animate({"opacity": 1}).delay(600).parent(".item").addClass("animat6");
                circle2.delay(8000).animate({"opacity": 1}).delay(600).parent(".item").addClass("animat5");
                setTimeout(function(){
                    circle4.animate({"opacity": 1}).parent(".item").attr("class", "item animat4");
                },9000);
                setTimeout(function(){
                    circle4.hide(0);
                    circle5.show(0).animate({"opacity": 1}).parent(".item").attr("class", "item animat4-2");
                },11000);
                setTimeout(function(){
                    circle5.hide(0);
                    circle4.show(0).parent(".item").attr("class", "item animat4-3");
                },13000);
                var timer = null,i=0;
                timer = setInterval(function(){
                    $('.circle2-'+i).fadeIn(0).parent(".item").siblings(".cic").find(".circle2").fadeOut(0);
                    i++;
                    if(i>=$('.circle2').length){
                        i=0;
                    }
                },500);
                star.fadeIn(100).animate({top: y, left: x},1000).fadeOut(100);
                setTimeout(function(){
                    test_cover.addClass("hover");
                    loginbox.addClass("hover");
                },500);
                setTimeout(function(){
                    loginbox.removeClass("hover");
                    test_cover.hide();
                },1500);

            }
        })
    }
}
</script>
<style src="../../../../static/css/login/index.less" lang="less"></style>
<style>
*, *:before, *:after {-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
::-webkit-input-placeholder{color:#97a8be}
input[placeholder]{color:#97a8be}
.v-middle{margin-top: -480px;position: relative;top:50%;}
.row-bg.el-row--flex{display: -ms-flexbox;}
.row-bg .el-input .el-input__inner{border:none;}
.row-bg{height: 100%;position: relative;background:#000 url('/static/img/loginbg.jpg') no-repeat;background-size:100% 100%;}
.logindiv {width:100%;min-width:980px;height:100%;position:relative;overflow:hidden;}
.loginLeft{height: 100%;text-align: center;}
.loginlogo{max-width: 90%;}
.trajectory{max-width: 100%;position: absolute;}
.fcs_main {height: 100%;}
._form{padding:30% 10% 0;width: 100%;max-width: 640px;}
._form h2 {color:#4092ba;text-align:center;font-size:36px;font-weight:normal;line-height:36px;padding-bottom: 5px;}
._form h4{color:#4092ba;text-align:center;font-size:16px;font-weight:normal;padding-bottom: 30px;}
._form label {padding-left:44px;position: relative;border:2px solid #23578c;margin:25px 0;display:block;width:100%;overflow:hidden;background: #020d13;}
._form label img {width: 100%; height: 100%;}
._form label input {border-radius:0;padding-left:10px;width:100%;height:44px;font-size:14px;outline:none;border:none;background: none;}
.cs-login-in{padding:50px 0;}
._form  button {font-size: 18px;color:#fff;display:block;height:44px;outline:none;border:none;width:100%;background:#3cbcff;cursor: pointer;}
._footer {position:absolute;z-index:10;bottom:0;right:0;width:50%;text-align: center;}
._footer i {display:inline-block;margin:8px 10px 0 22px;background:url('/static/img/foot_xiaotubiao.png') no-repeat;background-size:100% 100%;width:44px;height:14px;margin-top:17px;}
._footer span {font-size:14px;color:#558dd7;line-height:34px;}
.cs-lg-item .el-input {margin-right:0;display:block;}
.cs-login-in h3{color:#0d79b8;font-size:24px;text-align: center;font-weight: normal;}
.cs-login-in{position:relative;border:2px solid #23578c;padding: 50px 60px 45px;background: #021018;}
.cs-login-in .el-autocomplete{display:block;}
.cs-login-in .cs-l-icon{position: absolute;left:0;width:44px;height: 44px;border-right:2px solid #23578c;text-align: center;}
.cs-login-tips{left:72%;top: 6px;background: #ff8e8e;color:#fff;}
.cs-lg-item{position: relative;}
.cs-tooltip__popper {position:absolute;border-radius:4px;padding:8px 15px;z-index:2000;font-size:12px;line-height:1.2}
.cs-tooltip__popper .popper__arrow,.el-tooltip__popper .popper__arrow:after {position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid}
.cs-tooltip__popper .popper__arrow {border-width:6px}
.cs-tooltip__popper .popper__arrow:after {content:" ";border-width:5px}
.cs-login-tips .popper__arrow{top: 11px;left: -6px;border-right-color: #ff8e8e;border-left-width: 0;}
.cs-login-tips .popper__arrow:after {bottom: -5px;left: 1px;}
.f_tips{display:noen;color: #fff;font-size: 14px;text-align: center;width: 55%;margin:20px auto 0;padding: 4px 18px;background: #b45c5e;border-radius: 3px;}
.lgborder{display: block;height: 42px;width: 42px;position: absolute;border-width: 6px;border-style:solid;}
.lgborder.ibor1{top:-2px;left:-2px;border-color:#3cbcff transparent transparent #3cbcff;}
.lgborder.ibor2{top:-2px;right:-2px;border-color:#3cbcff #3cbcff transparent transparent;}
.lgborder.ibor3{bottom:-2px;right:-2px;border-color:transparent #3cbcff #3cbcff transparent;}
.lgborder.ibor4{bottom:-2px;left:-2px;border-color:transparent transparent #3cbcff #3cbcff;}
</style>

