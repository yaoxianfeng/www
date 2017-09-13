<template>
    <div class="area_info-page">
        <!-- 辖区信息 -->
        <div class="area_info-title">辖区信息</div>
        <div class="area_info-main">

            <div class="con_left_top" v-if="content.information && content.information.length"  >

                <div v-for="index in 7" :class="[(information_data.length<=index-1 ) ? '':'nodata','con_l_t']" @click="showView(content.information[index])">
                    <p v-if="content.information.length>index-1">
                    <span class="wxx_info_num">{{content.information[index-1].data}}</span><br>
                    <span class="wxx_info_desc">{{content.information[index-1].title}}</span>
                    </p>
                </div>

            </div>
        </div>

    </div>
</template>
<script>
    export default {
        name: 'wxx_area_info',
        props:{
          content:''
        } ,
        data() {
            return{
                information_data:[]
            }
        },
        watch: {

        },
        computed: {

        },
        methods: {
        	showView(type){
        		console.log(type)
        	}
        },
        created(){

        }
    }
</script>
<style lang="less">
.area_info-page{
    .area_info-title{
        color: #ffb83c;
        font-size: 18px;
        position: absolute;
        top:10px;
        left: 20px;
    }
    .con_left_top {
        position:absolute;
        top: 50%;
        left: 50%;
        margin-top: -127.5px;
        margin-left: -111.5px;
        height: 255px;
        width: 223px;
        background: url('/static/img/zzw.png') no-repeat;
        background-size: 100% 100%;

        .con_l_t {
        	cursor: pointer;
            width: 82px;
            height: 86px;
            float: left;
            position: relative;
            background: url('/static/img/qbx.png') no-repeat;
            -moz-background-size: 100% 100%;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            p {
                color: #55bdff;
                flex: 1;
                line-height: 20px;
                font-size: 13px;
                text-align: center;
            }
        }
        div:nth-child(1) {
            left: 65px;
            top: 83px;
            background:none;

            .wxx_info_desc {
                font-size:  14px;
                color: #24e3ff;
            }
            .wxx_info_num{
                font-size:  26px;
                color: #24e3ff;
            }
        }
        div:nth-child(2) {
            left: -70px;
            top: -10px;
        }
        div:nth-child(3) {
            left: 120px;
            top: -95px;
        }
        div:nth-child(4) {
            left: 90px;
            top: 0;
        }
        div:nth-child(5) {
            left: 120px;
            top: 0;
        }
        div:nth-child(6) {
            left: -70px;
            top: 0;
        }
        div:nth-child(7) {
            color: #24e3ff;
            left: -40px;
            top: -175px;
        }
        .nodata {
            background: url('/static/img/shizijia.png') no-repeat;
            -moz-background-size: 100% 100%;
            background-size: 100% 100%;
        }
    }

    @media (max-width: 1600px) {
		.con_left_top {
			position:absolute;
			top: 50%;
			left: 50%;
			margin-top: -96px;
			margin-left: -88.5px;
			height: 192px;
			width: 167px;
			background: url('/static/img/zzw.png') no-repeat;
			background-size: 167px 192px;

			.con_l_t {
				width: 61px;
				height: 65px;
				float: left;
				position: relative;
				background: url('/static/img/qbx.png') no-repeat;
				-moz-background-size: 61px 65px;
				background-size: 61px 65px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				p {
					color: #55bdff;
					flex: 1;
					line-height: 20px;
					font-size: 12px;
					text-align: center;
				}
			}
			div:nth-child(1) {
				left: 50px;
				top: 62px;
				background:none;

				.wxx_info_desc {
					font-size:  12px;
					color: #24e3ff;
				}
				.wxx_info_num{
					font-size:  16px;
					color: #24e3ff;
				}
			}
			div:nth-child(2) {
				left: -50px;
				top: -10px;
			}
			div:nth-child(3) {
				left: 90px;
				top: -75px;
			}
			div:nth-child(4) {
				left: 70px;
				top: 0;
			}
			div:nth-child(5) {
				left: 90px;
				top: 0;
			}
			div:nth-child(6) {
				left: -50px;
				top: 0;
			}
			div:nth-child(7) {
				color: #24e3ff;
				left: -30px;
				top: -135px;
			}
			.nodata {
				background: url('/static/img/shizijia.png') no-repeat;
				-moz-background-size: 61px 65px;
				background-size: 61px 65px;
			}
		}
    }

	@media (max-height: 900px) {
		.con_left_top {
			position:absolute;
			top: 50%;
			left: 50%;
			margin-top: -96px;
			margin-left: -88.5px;
			height: 192px;
			width: 167px;
			background: url('/static/img/zzw.png') no-repeat;
			background-size: 167px 192px;

			.con_l_t {
				width: 61px;
				height: 65px;
				float: left;
				position: relative;
				background: url('/static/img/qbx.png') no-repeat;
				-moz-background-size: 61px 65px;
				background-size: 61px 65px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				p {
					color: #55bdff;
					flex: 1;
					line-height: 20px;
					font-size: 12px;
					text-align: center;
				}
			}
			div:nth-child(1) {
				left: 50px;
				top: 62px;
				background:none;

				.wxx_info_desc {
					font-size:  12px;
					color: #24e3ff;
				}
				.wxx_info_num{
					font-size:  16px;
					color: #24e3ff;
				}
			}
			div:nth-child(2) {
				left: -50px;
				top: -10px;
			}
			div:nth-child(3) {
				left: 90px;
				top: -75px;
			}
			div:nth-child(4) {
				left: 70px;
				top: 0;
			}
			div:nth-child(5) {
				left: 90px;
				top: 0;
			}
			div:nth-child(6) {
				left: -50px;
				top: 0;
			}
			div:nth-child(7) {
				color: #24e3ff;
				left: -30px;
				top: -135px;
			}
			.nodata {
				background: url('/static/img/shizijia.png') no-repeat;
				-moz-background-size: 61px 65px;
				background-size: 61px 65px;
			}
		}
    }
}
</style>
