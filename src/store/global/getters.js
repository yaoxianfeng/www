module.exports = {
    getPageInfos(state) {
        //中间内容宽
        let page_width = state.page_info.body_width;
        let page_height=state.page_info.body_height;
        let nav_width = page_width * 152 /1000;
        if (nav_width > 240) {
            nav_width = 240;
        }
        let nav_left_width = page_width *3 / 100;
        state.page_info.left_width = nav_width;
        state.page_info.padding_left = nav_width+nav_left_width;
        state.page_info.padding_top = page_height*62/1000;
        state.page_info.padding_bottom = page_height*35/1000;
        state.page_info.main_width = page_width-state.page_info.padding_left-page_width*29/1000;

        let _all_height = state.page_info.body_height * 904/1000-6;

        //110 来源于顶部导航加面包屑
        state.page_info.main_height = _all_height;

        let _bar_height = _all_height * 9/100;
        if (_bar_height < 70){
            _bar_height = 70
        }
        state.page_info.top_bar_height  = _bar_height;
        state.page_info.content_height = _all_height - _bar_height;


        //表格的宽度等于主内容高度减去条件筛选栏的高
        state.page_info.table_height = state.page_info.content_height - 76;

        //右边的宽度等于表格加分页面器
        state.page_info.right_height = state.page_info.table_height;

        //console.log(state.page_info);

        return state.page_info;
    },
    getDialogTinyStyle (state) {
        return {
            'max_height' : state.dialog_tiny_info.height,
            'width' : state.dialog_tiny_info.width
        };
    },
    getDialogSmallStyle (state) {
        state.dialog_small_info.height = state.page_info.main_height - 200;
        return {
            'max_height' : state.dialog_small_info.height,
            'width' : state.dialog_small_info.width
        };
    },
    getDialogLargeStyle (state) {
        state.dialog_large_info.height = state.page_info.main_height;
        return {
            'max_height' : state.dialog_large_info.height,
            'width' : state.dialog_large_info.width
        };
    }
};