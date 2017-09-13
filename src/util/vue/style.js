export default{
    data:function(){
        return {

        }
    },
    methods: {

    },
    computed: {
        main_style () {
            let _height = global.app.$store.getters.getPageInfos.main_height;
            return  {height:_height + "px"}
        },
        right_style () {
            let _height = global.app.$store.getters.getPageInfos.right_height;
            return  {height:_height + "px"}
        },
        topbar_style() {
            let _height = global.app.$store.getters.getPageInfos.top_bar_height;
            let _top = (_height - 40) - 5;
            //return  {height:_height + "px","padding-top":_top +"px"}
            return  {height:_height + "px"}
        },
        content_sytle() {
            let _height = global.app.$store.getters.getPageInfos.content_height;
            return  {height:_height + "px"}
        },
        tableheight() {
            let _oheight = this.$store.getters.getPageInfos.table_height;
            return _oheight;
        },
        bar_style() {
            let _height = global.app.$store.getters.getPageInfos.content_height - 114;
            let _width = global.app.$store.getters.getPageInfos.main_width-2;
            let bar_width = _width*0.6;

            return  {
                height:_height +"px",
                width:bar_width+"px"
            }
        },
        pie_style() {
            let _height = global.app.$store.getters.getPageInfos.content_height - 114;
            let _width = global.app.$store.getters.getPageInfos.main_width-2;
            let pie_width = _width*0.36;
            return{
                height:_height +"px",
                width:pie_width+"px"
            }
        },
        dialog_tiny_style () {
            return global.app.$store.getters.getDialogTinyStyle;
        },
        dialog_small_style () {
            return global.app.$store.getters.getDialogSmallStyle;
        },
        dialog_large_style () {
            return global.app.$store.getters.getDialogLargeStyle;
        }

    }

}