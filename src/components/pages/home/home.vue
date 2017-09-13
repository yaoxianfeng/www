<template>
<div>
	 <li v-for="item in obj">
   		 {{ item.a }}
     </li>
</div>
   
</template>

<script>
export default {
	data:function(){
		return {
			obj:[]
		}
	},
    methods:{

    },
    created:function(){

        this.$emit('updatemenu', 'home');
    	var that=this;
    	this.$http.get("../../../json01.json",{'emulateJSON':true})
        .then(
            function(res){
            	that.obj=res.data
            }
        )


    }

}
</script>

