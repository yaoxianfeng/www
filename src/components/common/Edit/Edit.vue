<template>
    <div class="edit_container">
    <div class="cs_Edit">
        <div :id="Edit_id" ref="editor_pannel" :style="EditDiv" v-html="article_data"></div>
    </div>
    </div>
</template>
<script>
    export default {
    // name: 'edit-article',
    props:{
        EditDiv:{
            type :Object,
            default:function(){
                return {
                    height:"250px"
                }
            }
        },
//        editor_height:{
//            type:Number,
//            default: 250
//        },
        article_data: {
            type:String,
            default: ""
        },
        Edit_id:{
            type:String,
            default: "article"
        },
        isBianjin:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            editor:null,
            content:null,
            wangEditor: {
                bar: [
                    'bold', 'italic', 'img','link','table','fullscreen'
                ]
            }
        }
    },
    methods: {
        /**
         * 提交表单
         * @param  {string} formName 表单名称
         */
        setContent(html, text) {
            // console.log(html);
            var partten=/^<p><br><\/p>$/;
            if(partten.test(html)){
                html="";
            }
            this.$emit("change",html);
			//firefox编辑禁用默认
			if(window.navigator.userAgent.toLowerCase().indexOf('firefox')>0){	
				if (document.queryCommandEnabled('enableObjectResizing')) {
					document.execCommand('enableObjectResizing', false, 'false');
					document.execCommand("enableInlineTableEditing", null, false);
				}
			}
			
        }
    },
    created() {
       
    },
    watch:{
        article_data:function(){
            this.editor.$txt.html(this.article_data);
        },
        isBianjin:function(){
            if(this.isBianjin){
                 this.editor.enable();
            }else{
                this.editor.disable();
            }
        }


    },
    mounted() {
        var self = this;
        this.editor = new wangEditor(this.Edit_id);

        // console.log(editor.config);

        // editor.config.jsFilter = false;
        //console.log(this.editor.menus);
        //新增禁止firefox默认行为
		if(window.navigator.userAgent.toLowerCase().indexOf('firefox')>0){	
			if (document.queryCommandEnabled('enableObjectResizing')) {
				document.execCommand('enableObjectResizing', false, 'false');
				document.execCommand("enableInlineTableEditing", null, false);
			}
		}
        this.editor.config.uploadImgFileName = this.Edit_id;

        this.editor.config.uploadImgUrl = global.config.imgloadurl;

        // 配置自定义参数（举例）
        this.editor.config.uploadParams = {
            // token: this.$store.state.user.userinfo.token,
            // username: this.$store.state.user.userinfo.username
            name:'fff'
        };
         // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
        // this.editor.config.hideLinkImg = true;
        // 自定义load事件
        this.editor.config.uploadImgFns.onload = (data) => {
            data=JSON.parse(data);
            if (data.code==0) {
                // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
                var originalName = this.editor.uploadImgOriginalName || '';

                // 如果 resultText 是图片的url地址，可以这样插入图片：
                this.editor.command(null, 'insertHtml', '<img src="' + global.config.webupload+data.data + '" alt="' + originalName + '" style="max-width:100%;"/>');
            } else {
                this.$message.error('上传错误信息：' + data.msg);
                // if (data.status === 404) {
                //     this.$message.error('上传错误信息：token无效！');
                // } else {
                //     this.$message.error('上传错误信息：' + data.msg);
                // }
            }

        };
        this.editor.config.uploadImgFns.onerror = (xhr) => {
            this.$message.error('上传错误信息：网络错误！');
        };

        this.editor.config.menus = this.wangEditor.bar;

        //编辑器改变事件时，同步更新文章内容
        this.editor.onchange = function() {

            var text = this.$txt.text().replace(/(^\s*)|(\s*$)/g, ""),
                html = this.$txt.html();
            /*console.log(text);
            console.log(html);*/

            self.setContent(html, text);
        };

        // editor.config.hideLinkImg = true;

        //自定义上传图片错误事件
        this.editor.create();
        if(!this.isBianjin){
           this.editor.disable(); 
        }
        //if (this.article_data) {
//            this.editor.$txt.html(this.article_data);
        //}
        this.$emit("change",this.article_data);
        this.$refs.editor_pannel.style.height = this.EditDiv.height;
    }
}
</script>
<style lang="less">
    .cs_Edit{
        .wangEditor-container{
            background: none;
        }
        a{
            color: #47acff;
        }
    }
</style>
