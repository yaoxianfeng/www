<template>
    <div class="ha-trees">
        <el-radio-group v-model=" userId " style="width: 100%; height: 100%;font-size: 16px;">
            <div class="list " v-for="(item,index) in treedata" :key="item.id ">
                <div class="place_name" @click="handleclick(item)"><span class="tree-icon-span"><i :class="[item.expanded? 'active-true-Class' : 'active-false-Class', 'el-icon-caret-right'] "></i></span><span>{{item.addname}}</span></div>
                <transition name="treetrop">
                    <div class="tree-item" v-if="item.expanded">
                        <el-radio :label="lable.userId " v-for="(lable,num) in item.children " :key="lable.id ">{{lable.username}}</el-radio>
                    </div>
                </transition>
            </div>
        </el-radio-group>
    </div>
</template>
<script>
export default {
    props: {
    	treedata:{
    		type:Array,
    		default:function(){
    			return []
    		}
    	}
    },
    data() {
        return {
        	userId:'',
            arr:[false,false,false]
        }
    },
    components: {

    },
    watch:{
    	userId(val){
    		this.$emit('change',val)
    	}
    },
    methods: {
        handleclick(item) {
            item.expanded = !item.expanded;
        }
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style>
.ha-trees{
	width: 100%;
	height:100%;
}
.ha-trees .list{
	width: 100%;
	line-height: 50px;
	font-size: 16px;
}
.ha-trees .place_name{
	border-bottom: 1px solid #ccc;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #efefef;
}
.ha-trees .tree-item .el-radio{
	display: flex;
	justify-content: center;
	align-content: center;
	margin: 0;
	background: #fff;
	border-bottom: 1px solid #ccc;
}
.ha-trees .el-radio .el-radio__input{
	position: absolute;
	width: 70px;
	height: 50px;
	text-align: center;
	line-height: 58px;
	top:0;
	left: 0;
	border-right: 1px solid #ccc;
}
.ha-trees .tree-icon-span{
	color: #c1c1c1;
	border-right: 1px solid #ccc;
	 position: absolute;
	 width: 70px;
	 height:50px;
	 top: 0;
	 left: 0;
	 display: flex;
	 justify-content: center;
	 align-items: center;
}
.active-true-Class{
    animation: iconroute-false .2s both;
    transform-origin: center center;
    transition: var(--md-fade-transition);
}
.active-false-Class{
    animation: iconroute-true .2s both;
    transform-origin: center center;
    transition: var(--md-fade-transition);
}
@keyframes iconroute-false{
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(90deg);
    }
}
@keyframes iconroute-true{
    0% {
        transform: rotate(90deg);
    }
    100% {
        transform: rotate(0);
    }
}






.treetrop-enter-active {
    animation: my-bounce-in .2s;
    transform-origin: center top;
    transition: var(--md-fade-transition);
}

.treetrop-leave-active {
    animation: my-bounce-out .2s;
    transform-origin: center top;
    transition: var(--md-fade-transition);
}

@keyframes my-bounce-in {
    0% {
        opacity: 0;
        transform: scaleY(0);
    }
    100% {
        opacity: 1;
        transform: scaleY(1);
    }
}

@keyframes my-bounce-out {
    0% {
        opacity: 1;
        transform: scaleY(1);
    }
    100% {
        opacity: 0;
        transform: scaleY(0);
    }
}
</style>
