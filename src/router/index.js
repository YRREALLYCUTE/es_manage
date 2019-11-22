import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import {Message} from 'element-ui'
import axios from 'axios'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/view/userSysBeforLogin/Login'], resolve),
    },
    {
      path: '/manage',
      name: 'manage',
      component: resolve => require(['@/view/manage'], resolve),
      children: [
        {
          path: '',
          name: 'home',
          component: resolve => require(['@/view/home'], resolve),
          mata: []
        },
        // 分词部分
        {
          path: '/confAnalyzer',
          name: 'conf-analyzer',
          component: resolve => require(['@/view/analyzer/ConfAnalyzer'], resolve),
          meta: ['分词管理', '分词器配置']
        },
        {
          path: '/testAnalyzer',
          name: 'test-analyzer',
          component: resolve=>require(['@/view/analyzer/TestAnalyzer'], resolve),
          meta: ['分词管理', '分词器测试']
        },
        {
          path: '/addAnalyzer',
          name: 'add-analyzer',
          component: resolve=>require(['@/view/analyzer/AddAnalyzer'], resolve),
          meta: ['分词管理', '添加分词器']
        },
        {
          path: '/customizeAnalyzer',
          name: 'customize-analyzer',
          component: resolve=>require(['@/view/analyzer/CustomizeAnalyzer'], resolve),
          meta: ['分词管理', '自定义分词器']
        },
        {
          path: '/analyzerHome',
          name: 'analyzer-home',
          component: resolve=>require(['@/view/analyzer/AnalyzerHome'], resolve),
          meta: ['分词管理', '总览']
        },
        // devTool
        {
          path: '/simpleMode',
          name: 'simple-mode',
          component: resolve=>require(['@/view/devTool/SimpleMode'], resolve),
          meta: ['开发者工具', '简易模式']
        },
        {
          path: '/profMode',
          name: 'prof-mode',
          component: resolve=>require(['@/view/devTool/ProfMode'], resolve),
          meta: ['开发者工具', '专业模式']
        },
        // index
        {
          path: '/addIndex',
          name: 'add-index',
          component: resolve=>require(['@/view/index/AddIndex'], resolve),
          meta: ['索引管理', '添加索引']
        },
        {
          path: '/dataAll',
          name: 'data-all',
          component: resolve=>require(['@/view/index/DataAll'], resolve),
          meta: ['索引管理', '数据浏览']
        },
        {
          path: '/dataSync',
          name: 'data-sync',
          component: resolve => require(['@/view/index/DataSync'], resolve),
          meta: ['索引管理', '数据同步']
        },
        {
          path: '/updIndex',
          name: 'upd-index',
          component: resolve=>require(['@/view/index/UpdIndex'], resolve),
          meta: ['索引管理', '索引更新']
        },
        {
          path: '/reindex',
          name: 'reindex',
          component: resolve=>require(['@/view/index/Reindex'], resolve),
          meta: ['索引管理', '索引重建']
        },
        {
          path: '/indexHome',
          name: 'index-home',
          component: resolve=>require(['@/view/index/IndexHome'], resolve),
          meta: ['索引管理', '总览']
        },
        // 说明
        {
          path: '/explain',
          name: 'instruction',
          component: resolve=>require(['@/view/instruction/Instruction'], resolve),
          meta: ['说明', '说明文档']
        },
        {
          path: '/editExplain',
          name: 'edit-instruction',
          component: resolve => require(['@/view/instruction/EditInstruction'], resolve),
          meta: ['说明', '编辑添加']
        },
        // 插件
        {
          path: '/pluginHome',
          name: 'plugin-home',
          component: resolve=>require(['@/view/plugins/PluginHome'], resolve),
          meta: ['插件管理', '总览']
        },
        {
          path: '/addPlugin',
          name: 'add-plugin',
          component: resolve=>require(['@/view/plugins/AddPlugin'], resolve),
          meta: ['插件管理', '添加插件']
        },
        // 查询分析
        {
          path: '/hotWords',
          name: 'hot-words',
          component: resolve=>require(['@/view/searchAnalyze/HotWords'], resolve),
          meta: ['查询分析', '热词分析']
        },
        {
          path: '/logRecords',
          name: 'log-records',
          component: resolve=>require(['@/view/searchAnalyze/LogRecord'], resolve),
          meta: ['查询分析', '日志记录']
        },
        {
          path: '/searchAnalyzeHome',
          name: 'search-analyze-home',
          component: resolve=>require(['@/view/searchAnalyze/SearchAnalyzeHome'], resolve),
          meta: ['查询分析', '总览']
        },
        {
          path: '/userFrom',
          name: 'user-from',
          component: resolve=>require(['@/view/searchAnalyze/UserFrom'], resolve),
          meta: ['查询分析', '用户分布']
        },
        {
          path: '/permissionConf',
          name: 'permission-conf',
          component: resolve=>require(['@/view/userManage/PermissionConf'], resolve),
          meta: ['用户管理', '权限管理']
        },
        {
          path: '/roleConf',
          name: 'role-conf',
          component: resolve=>require(['@/view/userManage/RoleConf'], resolve),
          meta: ['用户管理', '角色管理']
        },
        {
          path: '/userConf',
          name: 'user-conf',
          component: resolve=>require(['@/view/userManage/UserConf'], resolve),
          meta: ['用户管理', '用户管理']
        }
      ]
    },
    {
      path: '/HellowWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/forget',
      name: 'forget',
      component: resolve => require(['@/view/userSysBeforLogin/Forget'], resolve)
    },
    {
      path: '/sign',
      name: 'sign-in',
      component: resolve => require(['@/view/userSysBeforLogin/SignIn'], resolve)
    }
  ],
  strict: process.env.NODE_ENV !== 'production'
})

export default router
router.beforeEach((to, from, next) => {

  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let isLogin = sessionStorage.getItem('user')
  if (to.path === '/') {

    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if(isLogin) {
      next({ path: '/manage' })
    } else {
      next()
    }
  } else {
    // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
    if (!isLogin) {
      next([{ path: '/'}, {path: '/forget'}, {path: '/sign'}])
      if(to.path !== '/forget' && to.path !== 'sign') {
        Message({
          type: 'warning',
          message: '请先登录'
        })
        next()
        // next({ path: '/'})
      }
    } else {
      // 加载动态菜单和路由
      // addDynamicMenuAndRoutes()
      // 询问登录状态
      axios.get('/guest/loginState', {
        params: {
          name: isLogin
        }
      }).then(res=>{
        if(res.data.message === 'login'){
          next()
        }else{
          Message({
            type: 'warning',
            message: '您已下线，请重新登录'
          })
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("role")
          next({path: '/'})
        }
      })
    }
  }
})
