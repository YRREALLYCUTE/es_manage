<template>
  <div>
    <div>
      <el-input placeholder="请输入url" v-model="input_url">
        <template slot="prepend">Http(s)://</template>
        <el-button slot="append" @click="dialogFormVisible = true">连接</el-button>
      </el-input>

      <el-dialog title="请进行身份认证" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="账号" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off" v-on:keyup.enter.native="connect(form.username, form.password)"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" placeholder="请输入密码" show-password v-on:keyup.enter.native="connect(form.username, form.password)"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="connect(form.username, form.password)">确 定</el-button>
        </div>
      </el-dialog>

      <el-input placeholder="请输入indexname" v-model="input_index" disabled>
        <template slot="prepend">Index :</template>
      </el-input>
    </div>
    <el-row>
      <el-col :span="3">
        <el-input v-model="input_analyze" placeholder="输入分词器"></el-input>
      </el-col>

      <el-col :span="21">
        <el-input placeholder="输入内容" v-model="input" class="input-with-select" v-on:keyup.enter.native="analyze()">
          <el-select v-model="select" slot="prepend" placeholder="请选择分词器" style="width: 200px;" clearable disabled>
            <el-option v-for="item in option_values"
                       :key="item.value"
                       :value="item.value"
                       :label="item.label">
            </el-option>
          </el-select>
          <el-button slot="append" @click="analyze()" >查询</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-left:2%;margin-top:15px;height:650px;overflow-y:scroll;">
      <span v-for="item in tokens" v-bind:key="item.start">{{item.start_offset}}: {{item.token}}&emsp;</span>
      <div id="analyze_max"></div>
      <div id="analyze_std"></div>
      <div id="analyze_syno_max_ty"></div>
      <div id="analyze_syno_max_td"></div>
      <div id="analyze_smart"></div>
      <div id="analyze_syno_ty"></div>
      <div id="analyze_syno_td"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'analyzer',
  data () {
    return {
      // 分词器
      option_values: [{
        label: 'max&std&syno',
        value: 'max&std&syno'
      },
      {
        label: 'ik_smart',
        value: 'ik_smart'
      },
      {
        label: '通用tycb',
        value: 'ik_syno_ty'
      },
      {
        label: '特定tdcb',
        value: 'ik_syno_td'
      }
      ],
      input_url: 'ronyun.com/es1',
      input: '',
      select: 'max&std&syno',
      tokens: [],
      input_analyze: '',
      input_index: 'syno',
      source_index: 'zxcx',
      dest_index: '',

      dialogFormVisible: false,
      form: {
        username: '',
        password: ''
      },
      formLabelWidth: '80px',
      auth: ''
    }
  },
  mounted () {

  },
  methods: {

    connect (username, password) {
      this.auth = 'Basic ' + btoa(username + ':' + password)
      this.dialogFormVisible = false
      let vm = this
      this.$axios.post('https://' + vm.input_url + '/' + vm.input_index + '/_analyze',
        {
          text: 'test',
          analyzer: 'ik_smart'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password)
          }
        }).then(response => {
        if (response.data.tokens[0].token === 'test') {
          vm.$message({
            type: 'success',
            message: '登录成功'
          })
        }
      }).catch(error => {
        if (error.message === 'Network Error') {
          vm.$message({
            type: 'danger',
            message: '登陆失败, 请检查用户名密码是否正确！'
          })
        }
      })
    },
    // 返回分词结果
    analyze () {
      let vm = this
      let analyzerName
      analyzerName = 'standard'

      let analyzers = ['ik_max_word', 'my_max', 'ik_smart', 'ik_syno_ty', 'ik_syno_td', 'ik_syno_max_ty', 'ik_syno_max_td']
      let names = ['max(ik分词器max模式，建立索引时使用）:', 'std(标准分词器，建立索引使用):', 'ik_smart(ik分词器smart模式，查询时选用)', 'syno_ty(ik分词器smart模式 + 通用同义词，查询时选用):',
        'syno_zz(ik分词器smart模式 + 症状同义词，查询时选用):', 'syno_max_ty(ik分词器max模式 + 通用同义词，查询时选用):', 'syno_max_zz(ik分词器max模式 + 症状同义词，查询时选用):']
      let ids = ['analyze_max', 'analyze_std', 'analyze_smart', 'analyze_syno_ty', 'analyze_syno_td', 'analyze_syno_max_ty', 'analyze_syno_max_td']

      if (vm.select === 'max&std&syno') {
        vm.tokens = []
        for (let num = 0; num < analyzers.length; num++) {
          this.$axios.post('https://' + vm.input_url + '/' + vm.input_index + '/_analyze',
            {
              text: vm.input,
              analyzer: analyzers[num]
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': this.auth
              }
            }
          ).then(function (response) {
            console.log(response)
            vm.result1 = response.data.tokens

            let innerHtml = "<span style='font-weight: bold;font-size: large;color: darkred;'>" + names[num] + '</span><br><span>'
            for (let i = 0; i < vm.result1.length; i++) {
              innerHtml += vm.result1[i].start_offset + ': ' + vm.result1[i].token + '&emsp;&emsp;'
              // console.log(innerHtml)
            }
            innerHtml += '</span></span><br><br><hr>'
            let a = document.getElementById(ids[num])
            a.innerHTML = innerHtml
          }).catch(function (error) {
            if (error.message === 'Network Error') {
              vm.$message({
                type: '',
                message: '无权限访问, 请检查用户名密码是否正确！'
              })
            } else {
              vm.$message({
                type: '',
                message: '分词器不存在，更换分词器试一下'
              })
            }
            console.log('error: ' + error.message)
          })
        }
      } else {
        let a
        for (let i = 0; i < analyzers.length; i++) {
          a = document.getElementById(analyzers[i])
          a.innerHTML = ''
        }
        if (vm.input_analyze !== '') {
          analyzerName = vm.input_analyze
        } else if (vm.select !== '') {
          analyzerName = vm.select
        }

        this.$axios.post('https://' + vm.input_url + '/' + vm.input_index + '/_analyze',
          {
            text: vm.input,
            analyzer: analyzerName
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then(function (response) {
          console.log(response)
          vm.tokens = response.data.tokens
          console.log(vm.tokens)
        }).catch(function (error) {
          vm.$message({
            type: '',
            message: '分词器不存在，更换分词器试一下'
          })
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
