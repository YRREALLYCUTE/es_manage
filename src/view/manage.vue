<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="3"  style="min-height: 100%;background-color: rgb(50, 64, 87)">
        <el-menu :default-active="defaultActive" text-color="#dadada"
                  style="min-height: 100%;" router>
          <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>索引管理</template>
            <el-menu-item index="indexHome">索引总览</el-menu-item>
            <el-menu-item index="addIndex">添加索引</el-menu-item>
            <el-menu-item index="dataAll">数据浏览</el-menu-item>
            <el-menu-item index="dataSync">数据同步</el-menu-item>
            <el-menu-item index="updIndex">索引更新</el-menu-item>
            <el-menu-item index="reindex">索引重建</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-plus"></i>分词管理</template>
            <el-menu-item index="analyzerHome">总览</el-menu-item>
            <el-menu-item index="customizeAnalyzer">自定义分词器</el-menu-item>
            <el-menu-item index="addAnalyzer">分词器安装</el-menu-item>
            <el-menu-item index="confAnalyzer">分词器配置</el-menu-item>
            <el-menu-item index="testAnalyzer">分词器测试</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-star-on"></i>查询分析</template>
            <el-menu-item index="searchAnalyzeHome">总览</el-menu-item>
            <el-menu-item index="logRecords">日志记录</el-menu-item>
            <el-menu-item index="userFrom">用户分布</el-menu-item>
            <el-menu-item index="hotWords">热门词汇</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-edit"></i>开发者工具</template>
            <el-menu-item index="simpleMode">简易模式</el-menu-item>
            <el-menu-item index="profMode">专业模式</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-setting"></i>插件管理</template>
            <el-menu-item index="pluginHome">插件总览</el-menu-item>
            <el-menu-item index="addPlugin">插件安装</el-menu-item>
            <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
          </el-submenu>
          <el-submenu index="7" >
            <template slot="title"><i class="el-icon-setting"></i>用户管理</template>
            <el-menu-item v-if="role === 'admin'" index="permissionConf">权限管理</el-menu-item>
            <el-menu-item v-if="role === 'admin'" index="roleConf">角色管理</el-menu-item>
            <el-menu-item index="userConf">用户设置</el-menu-item>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title"><i class="el-icon-warning"></i>说明</template>
            <el-menu-item index="explain">说明文档</el-menu-item>
            <el-menu-item index="editExplain">添加编辑</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="21" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'manage',
    data() {
      return {
        role: 'admin'
      }
    },
    mounted() {
      this.role = this.$store.state.userInfo.role
    },
    computed: {
      defaultActive: function(){
        return this.$route.path.replace('/', '');
      }
    },
  }
</script>


<style lang="less" scoped>
  @import '../style/mixin';
  @import "../style/common";

  .el-submenu{
    background-color: rgb(50, 64, 87) !important;
  }

  .el-menu-item {
    background-color: rgb(22, 38, 52) !important;
  }
  .el-menu-item:hover{
    background-color: rgb(29, 40, 60) !important;
  }
  .el-menu-item.is-active {
    background-color: rgb(16, 28, 43) !important;
  }

</style>
<style>
  .el-submenu__title:hover{
    background-color: rgb(70, 86, 110) !important;
  }
</style>
