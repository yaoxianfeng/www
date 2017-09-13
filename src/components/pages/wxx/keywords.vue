<template>
    <div class="area_keywords">
        <div class="area_keywords-main">
            <div class="ball_content">
                <div class="con_mid_con">
                    <div class="sphere" >
                    <!-- <div class="sphere"> -->
                        <div></div>
                        <div :class="[player?'running':'paused','img1']"><img src="/static/img/neibiang.png"></div>
                        <div class="img2"><img src="/static/img/dizhuo.png"></div>
                        <div :class="[player?'running':'paused','img3']"><img src="/static/img/guanquan.png"></div>
                        <div class="img4"> <img src="/static/img/waigq.png"></div>
                        <div class="img5"><img src="/static/img/xxjt.png"></div> 
                        <div class="tagBall"> 
                                <div class="glowing"></div>
                                <img :src="'/static/img/'+icong" :class="[player?'running':'paused','before_img']">
                                <img :src="'/static/img/'+icongnext" :class="[player?'running':'paused','rear_img']">
                        </div> 
                    </div>
                </div>
            </div>

            <div class="content_mid">
                <div class="con_mid_top">
                    <span><i v-for="num in currentdate1">{{num}}</i></span>
                    <span>
                        <span class="police_badge"></span>
                    </span>
                    <span><i v-for="num in currentdate2">{{num}}</i></span>
                </div>

                <div class="con_mid_but">
                    <div class="but_top" >
                        <div v-for="item in this.buts" :class="[player?'running':'paused','topnum']">
                            <span class="list" >{{item}}</span>
                        </div>
                    </div>
                    <div class="but_but">
                        <span></span>
                        <span class="con_min_title">
                            <ul>
                                <li>
                                    <i></i>
                                    <i></i>
                                    <i>
                                        <div :class="[player?'running':'paused']"><img src="/static/img/tctop.png"></div>
                                    </i>
                                    <i></i>
                                    <i></i>
                                    </li>
                                <li ref="lefts">
                                    <el-button v-for="item in this.but"
                                    :class="[player?'running':'paused','key_button']">{{item}}</el-button>
                                </li>
                            </ul>
                        </span>
                        <span></span>
                    </div>
                </div>
                
            </div>

        </div>

    </div>
</template>
<script>
    export default {
        name: 'wxx_area_insitutions',
        props:{
            content:'',
            but:'',
            buts:'',
            // imgs:''
        } ,
        
        data() {
            return {
                hot_data:[],
                currentdate1: '',
                currentdate2: '',
                hot_index: 0,
                onum:2,
                course_index: 0,
                isFirst: false,
                player:true,
                items:{},
                key: '',
                des: '',
                events: '',
                icong:'',
                icongnext:'',
                formatDate:null,
                icon:null,
                play:null,
                imgs:["A.jpg","B.jpg","C.jpg","D.jpg","X.jpg"]
            }
        },
        watch: {

        },
        computed: {
            conheight() {
                let _height = this.$store.getters.getPageInfos.content_height - 280;
                if(_height < 400) {
                    _height = 400;
                }

                let _top = (_height - 440) / 2;

                return {
                    height: _height + 'px',
                    "padding-top": _top + 'px'
                }
            },
            spheretop() {
                let _top = (this.$store.getters.getPageInfos.content_height - 440) / 2;
                return {
                    top: _top + 'px',
                }
            }
        },
        methods: {
            getNowFormatDate() { //时间
                let date = new Date();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                let hours = date.getHours();
                let min = date.getMinutes();
                if(month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if(strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                if(hours >= 0 && hours <= 9) {
                    hours = "0" + hours;
                }
                if(min >= 0 && min <= 9) {
                    min = "0" + min;
                }
                this.currentdate1 = month + "." + strDate;
                this.currentdate2 = hours + ":" + min;
            },
            animationplay(){
                var that=this;
                var t1 = window.setTimeout(function(){
              
                    that.replaceimg();
                    that.repimg();
                },1000);
                that.getNowFormatDate();
                if(this.formatDate) {
                    window.clearInterval(this.formatDate);
                    this.formatDate = null;
                }
                if(this.icon) {
                    window.clearInterval(this.icon);
                    this.icon = null;
                }
                if(this.play) {
                    window.clearInterval(this.play);
                    this.play = null;
                }
                this.formatDate=setInterval(function(){
                  that.getNowFormatDate();
                },5000)
                this.play=setInterval(function(){
                    that.isplayer();
                },4000)
            },
            repimg(){
                var that=this;
                this.icon=setInterval(function(){
                  that.replaceimg();
                },8000)
            },
            isplayer(){
                this.player=!this.player;
            },
            replaceimg(){
                if(this.onum==0){
                    this.icong=this.imgs[0];
                    this.icongnext=this.imgs[1];
                }else{
                    if(this.onum<this.imgs.length){
                        this.icong=this.imgs[this.onum];
                        this.icongnext=this.imgs[this.onum+1];
                        if(this.onum == this.imgs.length){
                            this.icong=this.imgs[0];
                            this.icongnext=this.imgs[1];
                        }
                        if(this.onum+1 > this.imgs.length-1){
                            this.icongnext=this.imgs[0];
                        }
                    }   
                }
                this.onum++;
                if(this.onum==this.imgs.length){
                   this.onum=0;
                }
            }
        },
        mounted() {
           // console.log(this.$refs.lefts.childNodes);
        },
        watch(){
        },
        updated() {
            // console.log(this.but);
            // console.log(this.buts)
        },
        created() {
            this.animationplay();
        },
        beforeDestroy: function() {
            let that = this;
            if(that.formatDate) {
                window.clearInterval(that.formatDate);
                that.formatDate = null;
            }
            if(that.icon) {
                window.clearInterval(that.icon);
                that.icon = null;
            }
            if(that.play) {
                window.clearInterval(that.play);
                that.play = null;
            }
        }
    }
</script>
<style lang="less">
.area_keywords{
    position: relative;
    height: 100%;
    width:100%;
    .area_keywords-main{
        position: relative;
        height: 100%;
        width:100%;
    }
    .paused{
        animation-play-state:paused!important;
        -webkit-animation-play-state: paused!important;
        -moz-animation-play-state: paused!important;
    }
    .running{ 
        animation-play-state:running!important;
        -webkit-animation-play-state:running!important;
        -moz-animation-play-state:running!important;
    }
    .ball_content{
        position: absolute;
        height: 100%;
        width:100%;
        .con_mid_con {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            .summary {
                width: 199px;
                height: 121px;
                color: #cdf0ff;
                font-size: 14px;
                padding: 10px 20px;
                background: url('/static/img/sumbj.png') no-repeat;
                -moz-background-size: 100% 100%;
                background-size: 100% 100%;
                float: left;
                position: absolute;
                left: 12px;
                text-align: left;
                p {
                    width: 160px;
                    display: block;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .sum_but {
                    margin-top: 15px;
                    width: 160px;
                    max-height: 100px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
            }
            .sphere {
                float: left;
                margin-left:-200px;
                margin-top:-250px;
                width: 400px;
                height: 400px;
                left: 50%;
                top: 50%;
                position: relative;
                div{
                    position: absolute;
                    top: 0;
                    left:0;

                    img{width: 100%; height: 100%;}
                }
                .img1{
                        z-index: 10;
                        margin-top: -1%;
                         margin-left: -2%;
                        border-radius: 50%;
                        width: 105%;height: 105%;
                        animation-fill-mode: forwards;
                        animation: hovertreespin 4s infinite 0s cubic-bezier(.5,.29,.04,.93) normal;
                    }
                .img2{
                    width: 100%;height: 100%;
                    img{
                        width: 50%;height: 10%;
                        position: absolute;bottom: 0;left: 25%;
                    }
                }
                .img3{
                    width: 90%;height:90%;
                    margin-top: 7%;margin-left: 5%;
                    animation-fill-mode: forwards;
                    animation: hovertreespin 4s infinite 0s cubic-bezier(.7,0,.11,.95) normal;
                }
                .img4{
                    width: 103%;height:90%;
                    margin-top: 7%;left: -2%;
                }
                .img5{
                    width: 10%;height: 5%;
                    left: 45%;top: 101%;
                }
                span {
                    color: #2ba6d4;
                }
                
                .tagBall {
                    width: 85%;
                    border-radius: 50%;
                    overflow: hidden; 
                    height: 85%;
                    margin: 9% auto;
                    position: relative;
                    .glowing{
                        z-index: 30;
                        width: 100%;height: 100%;border-radius: 50%;
                        box-shadow:0px 0px 60px #001f79 inset;
                    }
                    img{
                        position: absolute;
                        left: 0;top: 0;
                        width: 100%;
                        /* border: 1px solid red; */
                        height: 100%;
                        border-radius: 50%;
                    }
                    .before_img{
                        animation: fade_out 8s infinite 0s linear normal;
                    }
                    .rear_img{
                        animation: fade 8s infinite 4s linear normal;
                    }
                }
            }
        }
    }

    .content_mid {
        position: relative;
        height: 100%;
        width:100%;
        padding: 30px 0 0px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .con_mid_top {
            background: url('/static/img/datatop.png') no-repeat;
            background-size: 100% 100%;
            height: 42px;
            align-items: center;
            width: 90%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin:0 auto;
            span {
                i {
                    font-style: normal;
                    padding: 5px 10px;
                    margin: 0 2px;
                    font-size: 14px;
                    border: 1px solid #275e8b;
                    border-radius: 2px;
                    width: 25px;
                    height: 28px;
                }
                .police_badge{
                    background: url('/static/img/police_badge.png') no-repeat;
                    background-size: 120px 120px;
                    background-position: center center;
                    width: 120px;
                    height: 120px;
                    margin-bottom: 10px;
                }
            }
            .con_mid_top .left {
                float: left;
            }
            .con_mid_top .right {
                float: right;
            }
            span:nth-child(1) {
                flex: 4;
                display: flex;
                justify-content: center;
            }
            span:nth-child(2) {
                flex: 2;
                display: flex;
                justify-content: center;
            }
            span:nth-child(3) {
                flex: 4;
                display: flex;
                justify-content: center;
            }
        }

        .con_mid_but {
            position: relative;
            height: 150px;
            width: 90%;
            margin: 0 auto;
            line-height: 36px;
            background-size: contain;
            justify-content: space-between;
            background-position: center;
            bottom: 10px;
            overflow: hidden;
            .but_top{
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                width: 250%;
                margin-left: -75%;
                height: 45px;
                background: url('/static/img/contitle.png') 50% no-repeat;
                background-size: 20% 100%;
                display: flex;
                position: relative;
                flex-direction: row;
                overflow: hidden;
                div{
                    flex: 2;
                    position: relative;
                    height: 100%;
                    width: 18%;
                    opacity: 0;
                     overflow: hidden;
                    span{
                        text-align: center;
                        width: 90%;margin: 0 5%;overflow: hidden;
                        display:block;
                        white-space:nowrap;
                        line-height: 45px;
                        text-overflow:ellipsis;
                    }
                }
                div:nth-child(1){
                    animation: title1 20s infinite 0s cubic-bezier(.72,.35,.3,.69) normal;
                }
                div:nth-child(2){
                    animation: title2 20s infinite 0s cubic-bezier(.72,.35,.3,.69)normal;
                }
                 div:nth-child(3){
                    animation: title3 20s infinite 0s cubic-bezier(.72,.35,.3,.69)normal;
                }
                div:nth-child(4){
                    animation: title4 20s infinite 0s cubic-bezier(.72,.35,.3,.69)normal; 
                }
                div:nth-child(5){
                    animation: title5 20s infinite 0s cubic-bezier(.72,.35,.3,.69)normal;
                }
            }
            .but_but{
                height: 50%;
                display: flex;
                margin-top: 5px;
                flex-direction: row;
                span{height:100%;}
                span:nth-child(1) {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                }
                span:nth-child(2) {
                    flex: 8;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    ul{width: 100%;height: 100%;position: relative; overflow: hidden;
                        li{
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            overflow: hidden;
                        }
                        li:nth-child(1){
                            height: 40%;
                            background: url('/static/img/timezhou.png') 0% 50% no-repeat;
                            i{
                                flex: 2;
                                background:url('/static/img/timezhu.png') 50% 50%  no-repeat;
                            } 
                            i:nth-child(3){
                                background:url('/static/img/timezhu.png') 50% 50%  no-repeat;
                                background-size: 20%;
                                text-align: center;
                                div{
                                    margin: 0 auto;
                                    width: 14px;
                                    height: 100%;
                                    /* position: relative; */
                    animation: treespin 8s infinite 0s ease-in normal;
                                   img{position: absolute;top: 0;left: 0;}
                                }
                            }
                        }
                        li:nth-child(2){
                            height: 65%;
                            position: absolute;
                            margin-top: 1%;
                            button{
                                height: 30px;
                                width: 60%;
                                border:0;
                                margin-top: 1.5%;
                                background: url('/static/img/border.png') no-repeat;
                                background-size: 100% 100%;
                                color: #fff;
                                flex: 2;
                                border-radius: 0;
                                position: relative;
                            }
                            button:nth-child(1){
                                animation: lantern1 20s infinite 0s ease-in normal;
                                margin-left: 10px;
                            }
                            button:nth-child(2){
                                animation: lantern2 20s infinite 0s ease-in normal;
                            }
                             button:nth-child(3){
                                animation: lantern3 20s infinite 0s ease-in normal;
                            }
                            button:nth-child(4){
                                animation: lantern4 20s infinite 0s ease-in normal;
                            }
                            button:nth-child(5){
                                animation: lantern5 20s infinite 0s ease-in normal;
                            } 
                        }
                    }
                }
                span:nth-child(3) {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                }
            }
            .course_content {
                width: 60%;
                margin: 0 auto;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-align: center;
                max-height: 45px;
            }
            p:nth-child(1) {
                /* 分散对齐 */
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -webkit-justify-content: space-between;
                -ms-flex-pack: justify;
                justify-content: space-between;
                margin-bottom: 15px;
            }
        }
    }

    @media (max-height: 900px) {
        .ball_content{
            .con_mid_con {
                .sphere {
                    margin-left: -150px;
                    margin-top: -170px;
                    width: 300px;
                    height: 300px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                }
            }
        }

        .content_mid .con_mid_top span .police_badge {
            background: url('/static/img/police_badge.png') no-repeat;
            background-size: 100px 100px;
            background-position: center center;
            width: 100px;
            height: 100px;
            margin-bottom: 10px;
        }
        .content_mid .con_mid_but{
            height: 160px;
        }
    }

    @media (max-width: 1600px) {
        .ball_content{
            .con_mid_con {
                .sphere {
                    margin-left:-150px;
                    margin-top:-170px;
                    width: 300px;
                    height: 300px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                }
            }

        }
        .content_mid .con_mid_top span .police_badge{
            background: url('/static/img/police_badge.png') no-repeat;
            background-size: 100px 100px;
            background-position: center center;
            width: 100px;
            height: 100px;
            margin-bottom: 10px;
        }
        .content_mid .con_mid_but{
            height: 160px;
        }
    }
    
    @keyframes lantern1 {
        0%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        18%{left: -20%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        19%{left: 80%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        20%{opacity: 0.6}
        40%{left: 60%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        60%{left: 40%;opacity: 1; height: 38px;margin-top: 0.5%;padding-top: 15px;}
        80%{left: 20%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        100%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
    }
    @keyframes lantern2 {
        0%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        20%{left: -20%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        38%{left: -40%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        39%{left: 60%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        40%{opacity: 0.6}
        60%{left: 40%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        80%{left: 20%;opacity: 1;height: 38px;margin-top: 0.5%;padding-top: 15px;}
        100%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
    }
    @keyframes lantern3 {
        0%{left: 0%;opacity: 1;height: 38px;margin-top: 0.5%;padding-top: 15px;}
        20%{left: -20%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        40%{left: -40%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        58%{left: -60%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        59%{left: 40%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        60%{opacity: 0.6}
        80%{left: 20%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        100%{left: 0%;opacity: 1;height: 38px;margin-top: 0.5%;padding-top: 15px;}
    }
    @keyframes lantern4 {
        0%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        20%{left: -20%;opacity: 1;height: 38px;margin-top: 0.5%;padding-top: 15px;}
        40%{left: -40%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        60%{left: -60%;opacity: 0.5;height: 30px;padding-top: 10px;margin-top: 1%;}
        78%{left: -80%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        79%{left: 20%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        80%{opacity: 0.6}
        100%{left: 0%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
    }
    @keyframes lantern5 {
        0%{left: 0%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        0.1%{opacity: 0.6}
        20%{left: -20%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        40%{left: -40%;opacity: 1;height: 38px;margin-top: 0.5%;padding-top: 15px;}
        60%{left: -60%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        80%{left: -80%;opacity: 0.6;height: 30px;padding-top: 10px;margin-top: 1%;}
        99%{left: -100%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
        100%{left: 0%;opacity: 0;height: 30px;padding-top: 10px;margin-top: 1%;}
    }
    @keyframes title1{
        0%{left: 0%;opacity: 0;}
        20%{left: -20%;opacity: 0;}
        20.1%{left: 80%;opacity: 0}
        40%{left: 60%;opacity: 0;}
        50%{opacity: 0.25;}
        60%{left: 40%;opacity: 1; }
        70%{opacity: 0;}
        80%{left: 20%;opacity: 0;}
        100%{left: 0%;opacity: 0;}
    }
    @keyframes title2{
        0%{left: 0%;opacity: 0;}
        20%{left: -20%;opacity: 0;}
        40%{left: -40%;opacity: 0;}
        40.1%{left: 60%;opacity: 0;}
        60%{left: 40%;opacity: 0;}
        70%{opacity: 0.25;}
        80%{left: 20%;opacity: 1;}
        85%{opacity: 0;}
        100%{left: 0%;opacity: 0;}
    }
    @keyframes title3{
        0%{left: 0%;opacity: 1;}
        10%{opacity: 0;}
        20%{left: -20%;opacity: 0;}
        40%{left: -40%;opacity: 0;}
        60%{left: -60%;opacity: 0;}
        60.1%{left: 40%;opacity: 0;}
        80%{left: 20%;opacity: 0;}
        90%{opacity: 0.25;}
        100%{left: 0%;opacity: 1;}
    }
    @keyframes title4{
        0%{left: 0%;opacity: 0;}
        10%{opacity: 0.25;}
        20%{left: -20%;opacity: 1;}
        30%{opacity: 0;}
        40%{left: -40%;opacity: 0;}
        60%{left: -60%;opacity: 0;}
        80%{left: -80%;opacity: 0;}
        80.1%{left: 20%;opacity: 0;}
        100%{left: 0%;opacity: 0;}
    }
    @keyframes title5{
        0%{left: 0%;opacity: 0;}
        20%{left: -20%;opacity: 0;}
        30%{opacity: 0.25;}
        40%{left: -40%;opacity: 1;}
        50%{opacity: 0;}
        60%{left: -60%;opacity: 0;}
        80%{left: -80%;opacity: 0;}
        99.9%{left: -100%;opacity: 0;}
        100%{left: 0%;opacity: 0;}
    }
    @keyframes hovertreespin {
        0%{
            transform: rotate(0deg)
        }
        100%{
            transform:rotate(180deg);
        }
    }
    @keyframes treespin {
        0%{
            transform: rotate(0deg)
        }
        50%{
            transform:rotate(180deg);
        }
        100%{
            transform:rotate(360deg);
        }
    }
    @keyframes fade_out{
        0%{opacity: 1;}
        100%{opacity: 0;}
    }
    @keyframes fade{
         0%{opacity: 0;}
        100%{opacity: 1;}
    }
}
</style>