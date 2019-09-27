import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/view/Home'], resolve)
    },
    {
      path: '/HellowWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'test',
      component: resolve => require(['@/view/test/test'], resolve)
    },
    {
      path: '/AnalyzerHome',
      name: 'home-page',
      component: resolve => require(['@/view/Analyzer/HomePage'], resolve)
    },
    {
      path: '/login',
      name: 'login-sign',
      component: resolve => require(['@/view/UserSys/LoginSign'], resolve)
    },
    {
      path: '/forget',
      name: 'forget',
      component: resolve => require(['@/view/UserSys/Forget'], resolve)
    }

  ]
})
