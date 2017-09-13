<template>
    <div class="wel_right_page" :style="pageStyle">


            <div class="wel_right" :style="fanBoxStyle">

                <div class="wel_right_text">一键找警</div>
                <div class="wel_right_text">指挥调度</div>
                <div class="wel_right_text">网上办事</div>
                <div class="wel_right_text">视频会议</div>
                <div class="wel_right_text">咨询服务</div>
                <div class="wel_right_text">数据分析</div>


            </div>

            <div class="wel_right_circle_box"><div class="wel_right_circle-hidebox" :style="fanCircleStyle"><img class="wel_right_circle" :style="circleImgStyle" src="/static/img/welcome/right_circle.png"/></div></div>

    </div>


</template>

<script>
    export default {
        data() {
            return{

            }
        },
        computed:{
            myHeight() {
                let _height = global.app.$store.state.global.page_info.body_height * 0.60;
                return _height;
            },
            pageStyle(){

                let _width = (this.myHeight/789 * 516);
                let _top = (this.myHeight) /2 - 80;
                let _left = this.myHeight/2;
                let _circleBox = {
                    width: _width+'px',
                    height:this.myHeight+"px",
                    'margin-top': (0 -_top) +"px",
                    'margin-left': _left +"px",
                };
                return _circleBox;
            },
            fanBoxStyle() {
                let _width = (this.myHeight/789 * 516);

                let _circleBox = {
                    width: _width+'px',
                    height:this.myHeight+"px"
                };
                return _circleBox;
            },
            fanCircleStyle() {

                let _y = this.myHeight/3.8;
                let _top = this.myHeight * 0.1;
                let _style= {
//                    'margin-top':_top+"px",
//                    'margin-bottom':_top+"px"
//                    transform:"translate(0, -"+_y+"px)"
                };
                return _style;
            },
            circleImgStyle() {
                let _y = this.myHeight*1.2;

//                let _left = 0 - this.myHeight * 0.4 + 44;
                let _left = 0 - this.myHeight*1.03 + 10;
                let _top = 0-this.myHeight * 0.05;


//                width: 650px;
//                height: 650px;
//                left: -575px;
//                top: -27.5px;

                let _style= {
                    width : _y +"px",
                    height:_y +"px",
                    'left':_left+"px",
                    'top':_top+"px"
                };



                return _style;

            }

        }
    }
</script>
<style lang="less">
.wel_right_page{
    position: absolute;
    top: 50%;
    left: 50%;

    .wel_right_box{

    }

    @keyframes fontani {
        0% {opacity: 0.6;}
        10% {opacity: 1;}
        100% {opacity: 0.6;}
    }

    .wel_right{
        position: absolute;
        background: url('/static/img/welcome/right_bg.png');
        background-size: 100% 100%;
        background-position: center center;

        z-index:2;


        .wel_right_text{
            color: #52b0ff;
            font-size: 1em;
            opacity: 1;
            width: 80px;
            font-weight: 500;
            position: absolute;
            cursor: pointer;
        }

        .wel_right_text:nth-child(1){
            top: 13%;
            right: 15%;
            transform: rotate(-16deg);
            animation:fontani 2s linear 0s 2 normal;
        }

        .wel_right_text:nth-child(2){
            top: 26.5%;
            right: 10%;
            transform: rotate(-10deg);
            animation:fontani 2s linear 0.1s 2 normal;
        }

        .wel_right_text:nth-child(3){
            top: 41%;
            right: 7%;
            transform: rotate(1deg);
            animation:fontani 2s linear 0.2s 2 normal;
        }

        .wel_right_text:nth-child(4){
            top: 55%;
            right: 7%;
            transform: rotate(6deg);
            animation:fontani 2s linear 0.3s 2 normal;
        }


        .wel_right_text:nth-child(5){
            top: 68.5%;
            right: 10%;
            transform: rotate(12deg);
            animation:fontani 2s linear 0.4s 2 normal;
        }

        .wel_right_text:nth-child(6){
            top: 83.5%;
            right: 15.5%;
            transform: rotate(24deg);

            animation:fontani 2s linear 0.5s 2 normal;

        }


        @media (max-width: 1500px) {
            .wel_right_text{
                color: #52b0ff;
                font-size: 12px;
                opacity: 1;
                width: 80px;
                font-weight: 500;
                position: absolute;
                cursor: pointer;
            }

            .wel_right_text:nth-child(1){
                top: 13%;
                right: 10%;
                transform: rotate(-16deg);
                animation:fontani 2s linear 0s 2 normal;
            }

            .wel_right_text:nth-child(2){
                top: 26.5%;
                right: 5%;
                transform: rotate(-10deg);
                animation:fontani 2s linear 0.1s 2 normal;
            }

            .wel_right_text:nth-child(3){
                top: 41%;
                right: 2%;
                transform: rotate(1deg);
                animation:fontani 2s linear 0.2s 2 normal;
            }

            .wel_right_text:nth-child(4){
                top: 55%;
                right: 2%;
                transform: rotate(6deg);
                animation:fontani 2s linear 0.3s 2 normal;
            }


            .wel_right_text:nth-child(5){
                top: 68.5%;
                right: 5%;
                transform: rotate(12deg);
                animation:fontani 2s linear 0.4s 2 normal;
            }

            .wel_right_text:nth-child(6){
                top: 83.5%;
                right: 10.5%;
                transform: rotate(24deg);

                animation:fontani 2s linear 0.5s 2 normal;

            }
        }

        @media (max-height: 900px) {
            .wel_right_text{
                color: #52b0ff;
                font-size: 12px;
                opacity: 1;
                width: 80px;
                font-weight: 500;
                position: absolute;
                cursor: pointer;
            }

            .wel_right_text:nth-child(1){
                top: 13%;
                right: 10%;
                transform: rotate(-16deg);
                animation:fontani 2s linear 0s 2 normal;
            }

            .wel_right_text:nth-child(2){
                top: 26.5%;
                right: 5%;
                transform: rotate(-10deg);
                animation:fontani 2s linear 0.1s 2 normal;
            }

            .wel_right_text:nth-child(3){
                top: 41%;
                right: 2%;
                transform: rotate(1deg);
                animation:fontani 2s linear 0.2s 2 normal;
            }

            .wel_right_text:nth-child(4){
                top: 55%;
                right: 2%;
                transform: rotate(6deg);
                animation:fontani 2s linear 0.3s 2 normal;
            }


            .wel_right_text:nth-child(5){
                top: 68.5%;
                right: 5%;
                transform: rotate(12deg);
                animation:fontani 2s linear 0.4s 2 normal;
            }

            .wel_right_text:nth-child(6){
                top: 83.5%;
                right: 10.5%;
                transform: rotate(24deg);

                animation:fontani 2s linear 0.5s 2 normal;

            }
        }



    }

    @keyframes rotateimg {
        0% {transform:rotate(0deg);}
        100% {transform:rotate(360deg);}
    }

    @keyframes rotateimg2 {
        0% {transform:rotate(360deg);}
        100% {transform:rotate(0deg);}
    }




    .wel_right_circle_box{
        overflow: hidden;
        position: relative;
        opacity: 1;
        height: 100%;
        width: 140px;
        margin-left:42%;
        /*padding-left: 38%;
        margin-top: 14%;*/

        .wel_right_circle-hidebox{

            transform: rotate(5deg);

        }

        .wel_right_circle{
            z-index: 2;
            position: absolute;

            animation:rotateimg2 80s infinite linear;
        }

    }


}
</style>