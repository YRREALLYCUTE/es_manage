<template>
    <div>
      <el-card style="width: 25%; margin-left: auto;  margin-right: auto; margin-top: 8%" shadow="hover">
        <h3 align="center">用户登录</h3>

        <el-form :model="user" label-width="80px">
          <el-form-item v-if="type==='password'" label="用户名">
            <el-input v-model="user.username" prefix-icon="el-icon-user" size="mini" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item v-if="type==='phone'" label="手机号">
            <el-input type="phone" v-model="user.phoneNum" prefix-icon="el-icon-phone" size="mini" placeholder="请输入手机号"></el-input>
          </el-form-item>

          <el-form-item v-if="type==='password'" label="密码">
            <el-input v-model="user.passwd" prefix-icon="el-icon-lock" size="mini" placeholder="请输入密码" type="password" show-password></el-input>
          </el-form-item>

          <el-form-item label="验证码" inline-message>
            <el-row>
              <el-col :span="15">
                <el-input size="mini"
                          v-model="captcha.value"
                          prefix-icon="el-icon-picture-outline-round"
                          placeholder="请输入验证码"
                          @blur="checkCap(captcha.value, captcha.check)"
                          :onchange="checkLength(captcha.value)"
                          id="cap_input"
                ></el-input>
              </el-col>
              <el-col :offset="1" :span="8" >
                <div v-if="type==='password'">
                  <img v-if="captcha.check===0" id="img" @click="flushCaptcha" v-bind:src="captcha.captchaPath" alt="获取验证码" title="点击更换验证码" style="margin-top: 10px"/>
                  <i class="el-icon-circle-check" v-if="captcha.check===1">&nbsp;&nbsp;&nbsp;验证通过</i>
                </div>

                <div v-if="type==='phone'">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="getMsg(user.phoneNum)"
                    v-if="btn_value==='获取验证码'"
                  >{{btn_value}}</el-button>
                </div>
                <div v-if="type==='phone'">
                  <el-button
                    size="mini"
                    type="primary"
                    disabled
                    v-if="btn_value!=='获取验证码'"
                  >{{btn_value}}</el-button>
                </div>

              </el-col>
            </el-row>

          </el-form-item>

          <el-form-item >
            <el-row>
              <el-col :offset="0" :span="4">
                <el-button type="text"
                           size="mini"
                           v-if="type==='password'"
                           @click="function change() {
                             type = 'phone'
                           }"
                >手机登录</el-button>
                <el-button type="text"
                           size="mini"
                           v-if="type==='phone'"
                           @click="function change() {
                             type = 'password'
                           }"
                >账密登录</el-button>
              </el-col>

              <el-col :offset="1" :span="5">
                <el-button icon="el-icon-s-promotion" type="primary" size="mini" @click="login(user.username, user.passwd, type)">登录</el-button>
              </el-col>
              <el-col :offset="1" :span="5">
                <el-button icon="el-icon-notebook-2" size="mini" @click="signIn()">注册</el-button>
              </el-col>
              <el-col :offset="4" :span="4">
                <el-button size="mini" type="text" @click="$router.push({path: '/forget'})">忘记密码?</el-button>
              </el-col>
            </el-row>
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
          passwd: '',
          username: '',
          phoneNum: '',
          check_pwd: 0
        },
        type: 'password',
        captcha: {
          value:'',
          check: 0,
          captchaPath: ''
        },
        btn_value: '获取验证码'
      }
    },
    mounted () {
      this.flushCaptcha()
    },
    methods: {
      login (username, password, type) {
        password = window.btoa(password)
        let postData = this.$qs.stringify({
          name: username,
          password: password,
          type: type
        })
        this.$axios({
         method: 'post',
         url: '/login',
         data: postData
        }).then(res=>{
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: res.data.message
            })

            this.$router.push({path:'/AnalyzerHome'})
          }else if(res.data.code === 401){
            this.$message({
              type: 'warning',
              message: res.data.message
            })

            this.flushState()
            this.flushCaptcha()
            this.user.username = ''
            this.user.passwd = ''
          }else{
            this.$message({
              type: 'danger',
              message: res.data.message
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      signIn () {
      },
      flushState(){
        this.captcha.check = 0
      },
      flushCaptcha () {
        this.captcha.check = 0
        var imgsrc = this.$axios.defaults.baseURL + "/guest/captcha?math=" + Math.random()
        document.getElementById("img").setAttribute("src", imgsrc)
        this.captcha.captchaPath = imgsrc
      },
      checkLength(word){
        if(word.length === 4){
          document.getElementById("cap_input").blur()
        }
      },

      checkCap(captcha, state) {
        if (state === 0 && this.captcha.value !== '') {
          this.$axios.get(
            '/guest/checkCaptcha?input=' + captcha
          ).then(res => {
            if (res.data.code === 200) {
              this.captcha.check = 1
            } else if (res.data.code !== 200) {
              this.captcha.check = 2
              this.$message({
                type: 'warning',
                message: '验证码不正确'
              })

              this.flushCaptcha()
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      getMsg (phone) {
        console.log("phone")
        this.checkTime(60)
      },
      checkTime (seconds) {
        let that = this
        let time = seconds
        that.btn_value = '重新获取(' + time + ' s)'
        var interval = setInterval(function () {
          time = time - 1
          that.btn_value = '重新获取(' + time + ' s)'
          if(time === 0){
            that.btn_value = '获取验证码'
            clearInterval(interval)
          }
        }, 1000)
      }

    }
  }
</script>

<style scoped>

</style>
