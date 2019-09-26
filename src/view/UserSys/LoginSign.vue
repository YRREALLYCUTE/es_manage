<template>
    <div>
      <el-card style="width: 25%; margin: auto" shadow="hover">
        <el-form :model="user" :label-position="left" label-width="80px">
          <el-form-item label="用户名">
            <el-input prefix-icon="el-icon-user" size="mini" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input prefix-icon="el-icon-lock" size="mini" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>

          <el-form-item label="验证码" inline-message>
            <el-input size="mini" prefix-icon="el-icon-picture-outline-round" placeholder="请输入验证码"></el-input>
            <img onclick="getCapture()" src="" alt="点击更换验证码"/>
          </el-form-item>
        </el-form>

      </el-card>
    </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'login-sign',
    data () {
      return {
        user:{
          passwd: '123456',
          username: 'test1'
        },
      }
    },
    mounted () {
      this.getCapture()
    },
    methods: {
      login () {

      },
      signIn () {
      },
      getCapture(){
        let math = Math.round(Math.random() * 10000);
        this.$axios.get('/guest/captcha', {
          math: math
        }).then(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped>

</style>
