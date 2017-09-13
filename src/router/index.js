import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/pages/base/login.vue'
import printpage from '@/components/pages/base/print.vue'
import indexvue from '@/components/pages/base/index.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: "/",
        component: login
    }, {
        path: "/print",
        component: printpage
    },{
        path: '/welcome',
        component: function(resolve, reject) {
            //require(['@/components/pages/base/welcome_bar.vue'], resolve)
            require(['@/components/pages/base/welcome.vue'], resolve)
        }
    },{
        path: "/index",
        component: indexvue,

        redirect: to => {
            return 'wxx'
        },

        children: [{
                path: '/wlf',
                component: function(resolve, reject) {
                    require(['@/components/pages/wlf/base.vue'], resolve)
                },

                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'map'
                    }
                }, {
                    path: 'map',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wlf/map/map.vue'], resolve)
                    }
                }, {
                    path: 'list',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wlf/list.vue'], resolve)
                    }
                }, {
                    path: 'add',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wlf/add.vue'], resolve)
                    }
                },  {
                    path: 'add_position',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wlf/add_position.vue'], resolve)
                    }
                }]
            }, {
                path: '/wxx',
                component: function(resolve, reject) {
                    require(['@/components/pages/wxx/base.vue'], resolve)
                },
                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'nav'
                    }
                }, {
                    path: 'nav',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wxx/main.vue'], resolve)
                    }
                }]
            }, {
                path: '/wfw',
                component: function(resolve, reject) {
                    require(['@/components/pages/wfw/base.vue'], resolve)
                },
                    children: [{
                        hidden: true,
                        path: '',
                        redirect: to => {
                            return 'nav'
                        }
                    }, {
                        path: 'nav',
                        component: function(resolve, reject) {
                            require(['@/components/pages/wfw/navs.vue'], resolve)
                        }
                    },{
                        path: 'bszn',
                        component: function(resolve, reject) {
                            require(['@/components/pages/wfw/bszn.vue'], resolve)
                        }
                    },{
                        path: 'wsbs',
                        component: function(resolve, reject) {
                            require(['@/components/pages/wfw/wsbs.vue'], resolve)
                        }
                    }]
            }, {
                path: '/wgz',
                component: function(resolve, reject) {
                    require(['@/components/pages/wgz/base.vue'], resolve)
                },
                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'nav'
                    }
                }, {
                    path: 'nav',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/navs.vue'], resolve)
                    }
                }, {
                    path: 'znbm',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/znbm.vue'], resolve)
                    }
                }, {
                    path: 'zskgl',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/zskgl.vue'], resolve)
                    }
                },{
                    path: 'vedio',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/vedio.vue'], resolve)
                    }
                },{
                    path: 'szxx',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/szxx.vue'], resolve)
                    }
                },{
                    path: 'smrz',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/smrz.vue'], resolve)
                    }
                },{
                    path: 'e_wgz',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wrd/content/list/list.vue'], resolve)
                    }
                },{
                    path: 'zxfw',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wgz/zxfw.vue'], resolve)
                    }
                }, {
                    path: 'upcom',
                    component: function(resolve, reject) {
                        require(['@/components/pages/base/upcoming.vue'], resolve)
                    }
                } ]
            },  {
                path: '/wrd',
                component: function(resolve, reject) {
                    require(['@/components/pages/wrd/base.vue'], resolve)
                },
                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'nav'
                    }
                }, {
                    path: 'nav',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wrd/content/main/main.vue'], resolve)
                    }
                },{
                    path: 'e_wrd',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wrd/content/list/list.vue'], resolve)
                    }
                },   {
                    path: 'wrd_more',
                    name: "wrd_more",
                    component: function(resolve, reject) {
                        require(['@/components/pages/wrd/content/main/more.vue'], resolve)
                    }
                }]
            }, {
                path: '/wsj',
                component: function(resolve, reject) {
                    require(['@/components/pages/wsj/base.vue'], resolve)
                },
                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'nav'
                    }
                }, {
                    path: 'nav',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wsj/navs.vue'], resolve)
                    }
                }, {
                    path: 'sssj',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wsj/sssj.vue'], resolve)
                    }
                },{
                    path: 'zdxx',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wsj/zdxx.vue'], resolve)
                    }
                },{
                    path: 'shsj',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wsj/wsjtest.vue'], resolve)
                    }
                }]
            },{
                path: '/wfx',
                component: function(resolve, reject) {
                    require(['@/components/pages/wfx/main.vue'], resolve)
                },
                children: [{
                    hidden: true,
                    path: '',
                    redirect: to => {
                        return 'xqjqtj'
                    }
                }, {
                    path: 'xqjqtj',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wfx/xqjqtj.vue'], resolve)
                    }
                }, {
                    path: 'xqjltj',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wfx/xqjltj.vue'], resolve)
                    }
                }, {
                    path: 'jlzyfx',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wfx/jlzyfx.vue'], resolve)
                    }
                }, {
                    path: 'afqkfx',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wfx/afqkfx.vue'], resolve)
                    }
                }, {
                    path: 'jqclfx',
                    component: function(resolve, reject) {
                        require(['@/components/pages/wfx/jqclfx.vue'], resolve)
                    }
                }]
            }
        ]
    }]
})
