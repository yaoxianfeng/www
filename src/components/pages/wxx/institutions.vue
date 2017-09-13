<template>
    <div class="area_insitutions">

        <div class="area_insitutions-title">辖区单位</div>
        <div class="area_insitutions-main">

            <div class="institution content_right">
                <div class="con_right_but"  v-if="detail.institution">

                    <div class="c_r_b" v-for="index in 3">
                        <div class="r_b_right">
                            <p>{{(2*(index-1)< detail.institution.length ) ? detail.institution[2*(index-1)].title : "" }}</p>
                            <p>{{(2*(index-1)+1< detail.institution.length ) ? detail.institution[2*(index-1)+1].title: ""}}</p>
                        </div>

                        <div class="r_b_left">
                            <p>{{(2*(index-1) < detail.institution.length ) ? detail.institution[2*(index-1)].data: ""}}</p>
                            <p>{{(2*(index-1)+1< detail.institution.length ) ? detail.institution[2*(index-1)+1].data: ""}}</p>
                        </div>

                        <img v-if="index == 1" src="/static/img/technology.png">
                        <img v-if="index == 2" src="/static/img/company.png">
                        <img v-if="index == 3" src="/static/img/school.png">

                    </div>

                </div>
            </div>

        </div>

    </div>
</template>
<script>
    export default {
        name: 'wxx_area_insitutions',
        props: ['detail'],
        data() {
            return{
                
            }
        },
        watch: {
        },
        computed: {
        },
        methods: {
        },
        mounted() {
        }
    }
</script>
<style lang="less">
.area_insitutions{

    .area_insitutions-title{
        color: #ffb83c;
        font-size: 18px;
        position: absolute;
        top:10px;
        right: 20px;
    }

    .area_insitutions-main{
        position:absolute;
        top: 50%;
        left: 50%;
        margin-top: -120px;
        margin-left: -150px;
        height: 240px;
        width: 300px;
    }

    .content_right{

        .con_right_but {
            display: flex;
            flex-direction: column;

            .c_r_b {
                background: url('/static/img/dept_bg.png') no-repeat;
                background-size: 300px 70px;
                flex-direction: column;
                justify-content: flex-end;
                position: relative;
                margin-top: 10px;
                width: 300px;
                height: 70px;


                img {
                    width: 40px;
                    height: 40px;
                    position: absolute;
                    top: 50%;
                    left: 20px;
                    margin-top: -20px;


                }
                div {
                    float: right;

                    p {
                        padding-top: 10px;
                        font-size: 12px;
                        color: #a2dbff;
                        text-align: right;
                    }
                    p:nth-child(2) {
                        color: #abffa2;
                    }
                }
                .r_b_left {
                    width: 34%;
                    justify-content: center;

                    p {
                        font-size: 20px;
                    }

                    p:nth-child(1) {
                        line-height: 25px;
                        font-size: 26px;
                    }
                }
                .r_b_right {
                    width: 40%;

                    p {
                        padding-top: 0;
                        padding-left: 20px;
                        height:35px;
                        line-height:35px;
                        overflow: hidden;
                        text-align: left;
                    }

                }
            }


        }
    }



    @media (max-width: 1600px) {
        .area_insitutions-main{
            position:absolute;
            top: 50%;
            left: 50%;
            margin-top: -96px;
            margin-left: -120px;
            height: 192px;
            width: 240px;
        }


        .content_right{

            .con_right_but {


                .c_r_b {
                    background: url('/static/img/dept_bg.png') no-repeat;
                    background-size: 240px 56px;
                    flex-direction: column;
                    justify-content: flex-end;
                    position: relative;
                    margin-top: 8px;
                    width: 240px;
                    height: 56px;


                    img {
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        top: 50%;
                        left: 15px;
                        margin-top: -15px;


                    }
                    div {
                        float: right;

                        p {
                            padding-top:3px;
                            font-size: 10px;
                            color: #a2dbff;
                            text-align: right;
                        }
                        p:nth-child(2) {
                            color: #abffa2;
                        }
                    }
                    .r_b_left {
                        width: 34%;
                        justify-content: center;

                        p {
                            font-size: 16px;
                        }

                        p:nth-child(1) {
                            line-height: 25px;
                            font-size: 20px;
                        }
                    }
                    .r_b_right {
                        width: 40%;

                        p {
                            padding-top: 0;
                            padding-left: 20px;
                            height:28px;
                            line-height:28px;
                            overflow: hidden;
                            text-align: left;
                        }

                    }
                }


            }
        }


    }


    @media (max-height: 900px) {
        .area_insitutions-main{
            position:absolute;
            top: 50%;
            left: 50%;
            margin-top: -96px;
            margin-left: -120px;
            height: 192px;
            width: 240px;
        }


        .content_right{

            .con_right_but {


                .c_r_b {
                    background: url('/static/img/dept_bg.png') no-repeat;
                    background-size: 240px 56px;
                    flex-direction: column;
                    justify-content: flex-end;
                    position: relative;
                    margin-top: 8px;
                    width: 240px;
                    height: 56px;


                    img {
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        top: 50%;
                        left: 15px;
                        margin-top: -15px;


                    }
                    div {
                        float: right;

                        p {
                            padding-top:3px;
                            font-size: 10px;
                            color: #a2dbff;
                            text-align: right;
                        }
                        p:nth-child(2) {
                            color: #abffa2;
                        }
                    }
                    .r_b_left {
                        width: 34%;
                        justify-content: center;

                        p {
                            font-size: 16px;
                        }

                        p:nth-child(1) {
                            line-height: 25px;
                            font-size: 20px;
                        }
                    }
                    .r_b_right {
                        width: 40%;

                        p {
                            padding-top: 0;
                            padding-left: 20px;
                            height:28px;
                            line-height:28px;
                            overflow: hidden;
                            text-align: left;
                        }

                    }
                }


            }
        }


    }


}


</style>
