import * as types from './mutations_types'




export default {
    [types.SHOW_LOADING](state) {
        state.ajax_loading = true;
    },

    [types.HIDE_LOADING](state) {
        state.ajax_loading = false;
    },

	[types.FL_HOME_WXX](state) {
        state.home_wxx = false;
    },

    [types.TR_HOME_WXX](state) {
        state.home_wxx = true;
    },

    [types.UPDATE_PAGE_INFO](state, pageInfo) {
        state.page_info = global.tools.extend(state.page_info, pageInfo);

    }
};