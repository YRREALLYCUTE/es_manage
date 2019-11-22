<template>
  <!-- 确定找回密码方式 a: 密保问题找回密码
     接下来两个页面 输入账号
                 选择设置的问题(增加干扰项) 输入答案
     b: 通过手机验证码找回密码
        两个页面  输入手机号  确认无误并发送验证码
                 输入验证码
     上述方式验证成功之后
           重置密码界面
             输入密码  再次输入  检测是否相同 确认后重置完成。
     -->
  <!--选择方式-->
  <div class="forget_card_style">
  <el-steps :active="active" finish-status="success" align-center simple>
    <el-step title="选择方式"></el-step>
    <el-step title="完善信息"></el-step>
    <el-step title="身份验证"></el-step>
    <el-step title="重置密码"></el-step>
  </el-steps>
  <transition name="el-zoom-in-top">
    <el-card  style="background-color: rgba(243,243,243,0.29);" v-show="show_card_forget" shadow="hover">
      <div v-if="type===1">
        <h3 align="center">选择找回方式</h3>
        <el-form :model="infoForm" align="center">
          <el-form-item>
            <el-radio-group v-model="choice" >
              <el-radio label="1">密保问题找回</el-radio>
              <el-radio label="2">手机验证找回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="change_type">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 两种方式的页面 -->
      <div v-if="type===2">
        <h3 align="center">请按照提示输入信息</h3>
        <el-form :model="infoForm" :label-position="labelposition" label-width="30%" v-if="choice==='1'">
          <el-form-item label="验证码">
            <el-row>
              <el-col :span="15">
                <el-input size="mini"
                          v-model="captcha.value"
                          prefix-icon="el-icon-picture-outline-round"
                          placeholder="请输入验证码"
                          @blur="checkCap(captcha.value, captcha.checked, captcha.type)"
                          :onchange="checkLength(captcha.value)"
                          id="cap_input"
                ></el-input>
              </el-col>
              <el-col :offset="1" :span="8" >
                <img v-if="captcha.checked===false" id="img" @click="flushCaptcha" src="../../assets/captcha.jpg" alt="获取验证码" title="点击更换验证码" style="margin-top: 10px"/>
                <i class="el-icon-circle-check" v-if="captcha.checked===true">&nbsp;&nbsp;&nbsp;验证通过</i>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input style="width: 70%; margin-right: 30%"
                      prefix-icon="el-icon-user"
                      v-model="infoForm.username" size="mini"
                      placeholder="请输入用户名"
                      @keyup.enter.native="checkUserName(infoForm.username)"
            ></el-input>
          </el-form-item>

        </el-form>
        <el-form :model="infoForm" :label-position="labelposition" label-width="30%" v-if="choice==='2'">
          <el-form-item label="手机号">
            <el-input style="width: 70%; margin-right: 30%" v-model="infoForm.phoneNum" size="mini" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 20%; margin-right: 50%" size="mini" type="primary" @click="checkPhoneNum(infoForm.phoneNum)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="type===3">
        <h3 align="center">请填写验证信息</h3>
        <el-form label-width="30%" :label-position="labelposition" :model="infoForm" v-if="choice==='1'">
          <el-form-item label="Q: ">
            <span>{{infoForm.question}}</span>
          </el-form-item>
          <el-form-item label="A: ">
            <el-input v-model="infoForm.answer" size="mini" style="width: 70%; margin-right: 30%;"
                      placeholder="请输入答案" @keyup.enter.native="checkAnswer(infoForm.answer, infoForm.username)"
            ></el-input>
          </el-form-item>
        </el-form>
        <!--    使用手机号找回密码，填写验证码验证身份    -->
        <el-form label-width="30%" :label-position="labelposition" :model="infoForm" v-if="choice==='2'">
          <el-form-item label="验证码">
            <el-input v-model="infoForm.msgcode" size="mini" style="width: 70%; margin-right: 30%;"
                      placeholder="请输入验证码" @keyup.enter.native="checkMsg(infoForm.msgcode)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 重置密码界面 完成后跳转到登陆界面 -->
      <div v-if="type===4">
        <div v-if="resetState===false">
          <h3 align="center">重置密码</h3>
          <el-form label-width="30%" :model="infoForm" :label-position="labelposition">
            <el-form-item label="新密码">
              <el-input v-model="infoForm.password" size="mini" type="password" show-password
                        prefix-icon="el-icon-lock" placeholder="输入密码"
                        style="width: 70%; margin-right: 30%">
              </el-input>
            </el-form-item>
            <el-form-item label="重新输入">
              <el-input v-model="infoForm.repassword" size="mini" type="password" show-password
                      prefix-icon="el-icon-lock" placeholder="输入密码"
                      style="width: 70%; margin-right: 30%"
                      @keyup.enter.native="resetPassword(infoForm.password, infoForm.repassword)">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="resetState===true">
          <span> 重置成功，稍后返回登录页面. 你可以<el-button type="text" @click="gotoLogin">点击这里</el-button>直接返回 </span>
        </div>
      </div>
    </el-card>
  </transition>
  </div>
</template>

<script>
  export default {
    name: 'forget',
    data () {
      return {
        labelposition: 'right',
        ImgPath:'',
        active: 0,
        type: 1,
        show_card_forget: true,
        choice: '1',
        resetState: false,
        infoForm: {
          username: '',
          question: '',
          answer:'',
          phoneNum:'',
          captcha: '',
          password: '',
          repassword: '',
          msgcode: ''
        },
        captcha: {
          path: '../../assets/captcha.jpg',
          checked: false,
          value: '',
          type: 'password'
        }
      }
    },
    mounted () {
      this.flushCaptcha()
    },
    methods: {
      // 步骤
      change_type() {
        this.active += 1
        this.show_card_forget = false
        let time = 2
        let that = this
        let inter = setInterval(function () {
          time = time - 1
          if(time === 0){
           that.type += 1
            if(that.type > 4) that.type = 1
            that.show_card_forget = true
            console.log('showcard', that.type)
            clearInterval(inter)
          }
        }, 200)
      },
      change_type_minus() {
        this.active -= 1
        this.show_card_forget = false
        let time = 2
        let that = this
        let inter = setInterval(function () {
          time = time - 1
          if(time === 0){
            that.type -= 1
            if(that.type < 1) that.type = 1
            that.show_card_forget = true
            console.log('showcard', that.type)
            clearInterval(inter)
          }
        }, 200)
      },

      // 信息检查
      checkUserName (username) {
        if(this.captcha.checked === false) {
          this.$message({
            type: 'warning',
            message: '请先完成验证码验证'
          })
        } else {
          let that = this
          this.$axios.get('/guest/checkUserName', {
            params: {
              name: username
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'warning',
                message: '没有该用户'
              })
              this.flushCaptcha()
              this.captcha.checked = false
              // this.change_type_minus()
            } else {
              this.$axios.get('/guest/findQuestionByUserName', {
                params: {
                  name: username
                }
              }).then(res => {
                that.infoForm.question = res.data.message
              })

              this.change_type()
            }
          })
        }
      },
      checkPhoneNum(phoneNum){
        var TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
        if(TEL_REGEXP.test(phoneNum)){
          this.$axios.get('/guest/msgCap',{
            params:{
              phoneNum: phoneNum
            }
          }).then(res=>{
            if(res.data){
              this.$message({
                type: 'success',
                message: '验证码已发送，请在60s内完成验证'
              })
              this.change_type()
            }else{
              this.$message({
                type: 'warning',
                message: '验证码发送失败，请重试'
              })
              this.change_type_minus()
            }
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.$message({
            type: 'warning',
            message: '您输入的电话号码有误'
          })
        }
      },
      checkAnswer(answer, username){
        let postJson = this.$qs.stringify({
          name: username,
          answer: answer
        })
        this.$axios({
          url: '/guest/findPwdByQA',
          method: 'post',
          data: postJson
        }).then(res=>{
          if(res.data.code === 200){
            this.change_type()
            this.$message({
              type: 'success',
              message: res.data.message
            })
          }else{
            this.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
      },
      checkMsg (msgCode) {
        this.$axios.get('/guest/checkMsg',{
          params:{
            input: msgCode
          }
        }).then(res=>{
          if(res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '验证成功！'
            })
            this.$axios.get('/guest/findPwdBackByPhone', {
              params: {
                phone: this.infoForm.phoneNum
              }
            }).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '您可以重置密码了，请在3min内完成'
                })
                this.change_type()
              }else{
                this.$message({
                  type: 'warning',
                  message: res.data.message
                })
                if(res.data.code === 401){
                  this.change_type_minus()
                }
                this.change_type_minus()
              }
            })
          }else{
            this.$message({
              type: 'warning',
              message: '验证失败! 请重新发送验证码'
            })
            this.change_type_minus()
          }
        })
      },
      // 重置密码
      resetPassword(pwd, repwd) {
        if(pwd === repwd) {
          let type = 'QA'
          if (this.choice === '2') {
            type = 'phone'
          }

          let postData = this.$qs.stringify({
            pwd: pwd,
            type: type
          })
          this.$axios({
            method: 'post',
            url: '/guest/resetPwd',
            data: postData
          }).then(res => {
            if (res.data.code === 200) {
              // this.$message({
              //   type: 'success',
              //   message: '密码重置成功！稍后跳转到登陆页面'
              // })
              this.resetState = true
              // let that = this
              // let time = 2
              // let inter = setInterval(function () {
              //   time -= 1
              //   if (time === 0) {
              //     clearInterval(that.inter)
              //     that.$router.push({path:'/login'})
              //   }
              // }, 1000)
              this.loading({
                text: '密码重置成功！正在跳转到登陆页面...'
              })
              this.$router.push({path:'/login'})
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message
              })
            }
          })
        }else{
          this.$message({
            type: 'warning',
            message: '两次输入密码不一致，请核对'
          })
        }
      },

      // 验证码部分
      flushCaptcha () {
        this.captcha.checked = false
        var imgsrc = this.$axios.defaults.baseURL + "/guest/captcha?math=" + Math.random()
        document.getElementById("img").setAttribute("src", imgsrc)
        this.captcha.captchaPath = imgsrc
      },
      checkLength(word){
        if(word.length === 4){
          document.getElementById("cap_input").blur()
        }
      },

      checkCap(captcha, state, type) {
        if(type === 'password') {
          if (state === false && this.captcha.value !== '') {
            this.$axios.get(
              '/guest/checkCaptcha?input=' + captcha
            ).then(res => {
              if (res.data.code === 200) {
                this.captcha.checked = true
              } else if (res.data.code !== 200) {
                this.captcha.checked = false
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
        }else if(type === 'phone'){

          if(state === 0 && this.captcha.value !== ''){
            this.$axios.get(
              '/guest/checkMsg?input=' + captcha
            ).then(res => {
              if(res.data.code === 200){
                this.$message({
                  type: 'success',
                  message: res.data.message
                })
                this.captcha.check = 1;
              }else{
                this.$message({
                  type: 'warning',
                  message: res.data.message
                })

                this.btn_value = '获取验证码'
                if(this.interval !== '')
                  clearInterval(this.interval)
              }
            }).catch(error => {
              console.log(error)
            })
          }
        }
      },
      gotoLogin(){
        this.$router.push({path: '/login'})
      },
      loading ({text='loading', fullscreen=true, lock=true, time=1000, background='rgba(0, 0, 0, 0.7)'} = {}) {
        const load = this.$loading({
          fullscreen: fullscreen,
          text: text,
          background: background,
          lock: lock,
          spinner: 'el-icon-loading'
        })
        setTimeout(() => {
          load.close()
        }, time)
      }
    }
  }
</script>

<style scoped>
  .forget_card_style{
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8%
  }
</style>
