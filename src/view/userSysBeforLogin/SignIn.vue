<template>
  <div>
    <transition name="el-zoom-in-center">
      <el-card style="background-color: rgba(243,243,243,0.29);width: 25%; margin-left: auto;  margin-right: auto; margin-top: 8%" shadow="hover" v-show="show_card">
        <el-form v-model="user" label-width="20%" :label-position="position">
          <h3 align="center">用户注册</h3>

          <el-form :model="user" label-width="80px">

            <!-- 账密注册 -->
            <el-form-item v-if="type==='password'" label="用户名">

              <el-row>
                <el-col :span="15">
                  <el-input v-model="user.username" prefix-icon="el-icon-user" size="mini" placeholder="请输入用户名" :onchange="checkUserName(user.username)"></el-input>
                </el-col>

                <el-col :offset="1" :span="8">
                  <span style="color: #cf9236" v-if="checkInfo.username === 0">  任意长度字符 </span>
                  <span style="color: #5daf34" v-if="checkInfo.username === 11"> 用户名可用 </span>
                  <span style="color: #c82829" v-if="checkInfo.username === 10"> 用户名不可用 </span>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- end -->

            <!-- 手机号注册， 暂时不实现 -->
            <el-form-item v-if="type==='phone'" label="手机号">
              <el-input type="phone" v-model="user.phoneNum" prefix-icon="el-icon-phone" size="mini" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <!-- end -->

            <!-- 账密注册 密码 re密码 -->
            <el-form-item v-if="type==='password'" label="输入密码">
              <el-row>
                <el-col :span="15">
                  <el-input v-model="user.password" :onchange="checkPassword(user.password)" prefix-icon="el-icon-lock" size="mini" placeholder="请输入密码" type="password" show-password></el-input>
                </el-col>

                <el-col :offset="1" :span="8">
                  <span v-if="checkInfo.password===0" style="font-size: xx-small">至少包含<span style="color:#ff4d51;font-size: small">两种</span>字符</span>
                  <span v-if="checkInfo.password===10" style="font-size: xx-small">长度至少为<span style="color:#ff4d51;font-size: small">六位</span></span>
                  <el-progress v-if="checkInfo.password===11" style="margin-top: 15px" :percentage="percentage1" :format="format" :color="customColors"></el-progress>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item v-if="type==='password'" label="再次输入">
              <el-row>
                <el-col :span="15">
                  <el-input v-model="user.repassword" :onchange="checkRePassword(user.repassword)" prefix-icon="el-icon-lock" size="mini" placeholder="请再次输入密码" type="password" show-password></el-input>
                </el-col>

                <el-col :offset="1" :span="8">
                  <span v-if="checkInfo.repassword===0" style="font-size: smaller">请与上保持一致</span>
                  <i class="el-icon-circle-check" v-if="checkInfo.repassword===11" style="color: #5daf34"><span style="font-size: smaller">&nbsp;两次输入一致</span></i>
                  <i class="el-icon-circle-close" v-if="checkInfo.repassword === 10" style="color: red"> <span style="font-size: smaller">&nbsp;两次输入不一致</span> </i>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- end -->

            <el-form-item label="验证码" inline-message>
              <el-row>
                <el-col :span="15">
                  <el-input size="mini"
                            v-model="captcha.value"
                            prefix-icon="el-icon-picture-outline-round"
                            placeholder="请输入验证码"
                            @blur="checkCap(captcha.value, captcha.check, type)"
                            :onchange="checkLength(captcha.value)"
                            id="cap_input"
                  ></el-input>
                </el-col>
                <el-col :offset="1" :span="8" >
                  <div v-if="type==='password'">
                    <!--                  v-bind:src="captcha.captchaPath"-->
                    <img v-if="captcha.check===0" id="img" @click="flushCaptcha" src="../../assets/captcha.jpg" alt="获取验证码" title="点击更换验证码" style="margin-top: 10px"/>
                    <i class="el-icon-circle-check" v-if="captcha.check===1" style="color: #5daf34">&nbsp;验证通过</i>
                  </div>

                  <div v-if="type==='phone'">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="getMsg(user.phoneNum)"
                      v-if="btn_value==='获取验证码' && captcha.check === 0"
                    >{{btn_value}}</el-button>

                    <i class="el-icon-circle-check" v-if="captcha.check===1">   验证通过</i>
                  </div>
                  <div v-if="type==='phone'">
                    <el-button
                      size="mini"
                      type="primary"
                      disabled
                      v-if="btn_value!=='获取验证码' && captcha.check === 0"
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
                             @click="change_type()"
                  >手机注册</el-button>
                  <el-button type="text"
                             size="mini"
                             v-if="type==='phone'"
                             @click="change_type()"
                  >账密注册</el-button>
                </el-col>

                <el-col :offset="1" :span="5">
                  <el-button icon="el-icon-s-promotion" type="primary" size="mini" @click="signIn(user.username, user.password, user.repassword, type)">确认</el-button>
                </el-col>
                <el-col :offset="1" :span="5">
                  <el-button icon="el-icon-notebook-2" size="mini" @click="login()">返回</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-form>

      </el-card>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'sign-in',
    data(){
      return{
        percentage1: 33,

        customColors: [
          {color: '#f56c6c', percentage: 34},
          {color: '#e6a23c', percentage: 67},
          {color: '#5cb87a', percentage: 98}
        ],


        show_card: true,
        type: 'password',
        position: 'right',
        user:{
          username: '',
          password: '',
          repassword: ''
        },
        captcha: {
          path: '../../assets/captcha.jpg',
          value: '',
          check: ''
        },
        checkInfo: {
          username: 0,
          password: 0,
          repassword: 0
        }
      }
    },
    mounted(){
      this.flushCaptcha()
    },
    methods: {
      /* 接口功能 */
      // 注册用户
      signIn (name, password, repassword, type) {
        let dataInput = ''
        if(type === 'password'){
          console.log('here')
          dataInput = this.$qs.stringify({
            type: type,
            password: password,
            rePassword: repassword,
            name: name
          })
        }

        this.$axios({
          method: 'post',
          url: '/guest/signIn',
          data: dataInput
        }).then(res=>{
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.loading({
              text: '正在跳转至登录界面...',
              time: 500
              }
            )
            this.$router.push({path: '/login'})
          }
        })
      },
      // 获取短信
      getMsg (phone) {
        if (!/^1([345678])\d{9}$/.test(phone)) {
          this.$message({
            type: 'warning',
            message: '请填写正确的手机号码'
          })
        } else {
          this.$axios.get('/guest/msgCap',
            {
              params: {
                phoneNum: phone
              }
            }).then(res => {
            if (res.data === true) {
              this.$message({
                type: 'success',
                message: '成功生成验证码，请在手机上查看，验证码60s内有效'
              })
              this.checkTime(60)
            } else {
              this.$message({
                type: 'warning',
                message: '未能成功生成，请检查信息是否正确，然后重新点击生成验证码'
              })
            }
          })
        }
      },
      // 验证码状态
      flushState(){
        this.captcha.check = 0
      },
      // 刷新验证码
      flushCaptcha () {
        this.captcha.check = 0
        var imgsrc = this.$axios.defaults.baseURL + "/guest/captcha?math=" + Math.random()
        document.getElementById("img").setAttribute("src", imgsrc)
        this.captcha.captchaPath = imgsrc
      },

      /* 各种检查 */
      checkLength(word){
        if(word.length === 4){
          document.getElementById("cap_input").blur()
        }
      },
      checkUserName(name) {
        if(this.user.username !== '') {
          this.$axios.get('/guest/checkUserName', {
            params: {
              name: name
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.checkInfo.username = 11
            } else if (res.data.code === 300) {
              this.checkInfo.username = 10
            }
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.checkInfo.username = 0
        }
      },
      checkPassword (password){
        let reg_digit = /\d/
        let reg_letter = /[a-zA-Z]/
        let reg_char = /\W/

        if(password.length < 6 && password.length > 0){
          this.checkInfo.password = 10
        } else if(password.length === 0 ){
          this.checkInfo.password = 0
        } else {
          this.checkInfo.password = 11
          let level = 0

          if (reg_digit.test(password)) level ++
          if(reg_letter.test(password)) level ++
          if(reg_char.test(password)) level ++

          this.percentage1 = level * 33
          console.log(this.percentage1)
        }
      },
      checkRePassword(repwd){
        if(repwd.length === 0){
          this.checkInfo.repassword = 0
        } else if(repwd === this.user.password){
          this.checkInfo.repassword = 11
        }else if(repwd !== this.user.password){
          this.checkInfo.repassword = 10
        }
      },
      checkCap(captcha, state, type) {
        if(type === 'password') {
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
      checkTime (seconds) {
        let that = this
        let time = seconds
        that.btn_value = '重新获取(' + time + ' s)'
        this.interval = setInterval(function () {
          time = time - 1
          that.btn_value = '重新获取(' + time + ' s)'
          if(time === 0){
            that.btn_value = '获取验证码'
            clearInterval(that.interval)
          }
        }, 1000)
      },

      /* 页面功能 */
      // card动画转换
      change_type() {

        this.show_card = false;
        let time = 2;
        let that = this
        let inter = setInterval(function () {
          time = time - 1
          if(time === 0){
            if(that.type === 'password')
              that.type = 'phone';
            else
              that.type = 'password'
            that.show_card = true
            console.log('showcard')
            clearInterval(inter)
          }
        }, 200)
      },
      // 进度条进度变化
      format(percentage) {
        if(percentage === 33){
          return '低'
        }else if(percentage === 66){
          return '中'
        }else if(percentage === 99){
          return '高'
        }
      },
      // 页面跳转
      login () {
        this.$router.push({path: '/login'})
      },
      // 加载
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

</style>
