<template>
  <div class="header_container">

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand" menu-align='start'>
<!--      <img :src="baseImgPath + adminInfo.avatar" class="avator">-->
      <img src="../../assets/avator.jpg" class="avator">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {baseImgPath} from '@/config/env'
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'head-top',
    data () {
      return {
        baseImgPath
      }
    },
    created(){
      if (!this.userInfo.id) {
        this.getAdminData()
      }
    },
    methods: {
      ...mapActions(['getAdminData']),
      async handleCommand(command) {
        if (command === 'home') {
          this.$router.push('/manage');
        }else if(command === 'logout'){
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('role')
          this.$axios.get('/logout').then(res=>{
            if( res.data.code === 200){
              this.$router.push({path: '/'})
            }
          })
        }
      }
    },
    computed: {
      ...mapState(['userInfo']),
    }
  }
</script>

<style lang="less">
  @import '../../style/mixin';
  .header_container{
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
  }
  .avator{
    .wh(36px, 36px);
    border-radius: 50%;
    margin-right: 37px;
  }
  .el-dropdown-menu__item{
    text-align: center;
  }
</style>

