<template>
  <!--主页暂时这样子不改，新加的内容会变一下-->
  <div>
    <head-top></head-top>
    <el-tabs style="height: 200px;width: 96%;margin-right: auto; margin-left: auto" @tab-click="handleTabClick">

      <el-tab-pane label="通用同义词配置">
        <tycb ref="myTycb"></tycb>
      </el-tab-pane>

      <el-tab-pane label="症状同义词配置">
        <tdcb></tdcb>
      </el-tab-pane>

      <el-tab-pane label="停用词配置">
        <div>
          <el-row>
            <el-col :span="9" :offset="0">
              <el-input placeholder="输入内容" v-model="stop_word" class="input-with-select" v-on:keyup.enter.native="get_stop_data(stop_word,'',0,size)">
                <el-button slot="append" @click="get_stop_data(stop_word, 0, 0, size)" >查询</el-button>
              </el-input>
            </el-col>

            <el-col :span="9" :offset="1">

              <el-input placeholder="添加词项" v-model="stop_word"   class="input-with-select" v-on:keyup.enter.native="get_stop_data(stop_word, 1, 0, size)">
                <el-button slot="append" @click="get_stop_data(stop_word, 1, 0, size)" >添加</el-button>
              </el-input>
            </el-col>

            <el-col :span="3" :offset="1">
              <el-popover
                placement="top-start"
                title="tips"
                width="400"
                trigger="hover"
                content="在向数据库导入一个完整的停用词表之后，进行全部更新，检测与同义词是否有重复，并替换重复项。添加词项时使用单项的更新即可。">
                <el-button slot="reference" type = 'warn' @click = "u_stop_u_syno(stop_table_data)"> 全部更新 </el-button>
              </el-popover>
              <el-popover
                placement="top-start"
                title="tips"
                width="400"
                trigger="hover"
                content="将数据库中的停用词，同义词同步到文件中。在更新好词表之后，需要点击同步。">
                <el-button slot="reference" type = "success" @click = "init_syno_text()"> 同步 </el-button>
              </el-popover>
            </el-col>
          </el-row>
          <el-table :data="stop_table_data" style="width: 100%" stripe>

            <el-table-column label="id" width = 200>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>

            <el-table-column label="词项" >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.stop_word }}</span>
              </template>
            </el-table-column>

            <el-table-column label = "状态" width = 200>
              <template slot-scope="scope">
                <span style="margin-left: 10px" v-if="scope.row.state===1">使用中</span>
                <span style="margin-left: 10px" v-else>已停用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width = 400>
              <template slot-scope="scope">
                <el-button size="mini" type="info" v-if="scope.row.state === 1" @click="handleStopStop(scope.$index, scope.row)">失效</el-button>
                <el-button size="mini" type="success" v-else @click="handleStopRecover(scope.$index, scope.row)">生效</el-button>
                <el-button size="mini" type="danger" @click="handleStopDelete(scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" @click = "handleStopTwiceOn(scope.$index, scope.row)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-size="14"
            :pager-count="11"
            @current-page="stop_current_page"
            @current-change="handle_stop_current_change"
            layout="total,prev, pager, next"
            :total="stop_word_list_length"
          >
          </el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="拓展词配置">
        <extend-words ref="myExtend"></extend-words>
      </el-tab-pane>

      <el-tab-pane label="词典下载">

        <h3>词典下载</h3>
        <!--<a href = "http://39.96.45.101:9301/analyzer/synonym.txt" download="synonym">synonym.txt</a>(推荐使用chrome或者firefox浏览器)<br>-->
        <a href="https://ronyun.com/test/analyzer/synonym_tycb.txt" download="synonym_tycb">通用同义词表</a><br>
        <a href="https://ronyun.com/test/analyzer/synonym_tdcb.txt" download="synonym_tdcb">症状同义词表</a><br>
        <a href="https://ronyun.com/test/analyzer/stopwords.dic" download="stopwords">停用词表</a><br>
        <a href="https://ronyun.com/test/analyzer/extend_word.dic" download="extend_words">拓展词表</a><br>
      </el-tab-pane>

      <el-tab-pane label="帮助">
        <helper></helper>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import ExtendWords from '../../components/analyzer/ExtendWords'
import ElTabPane from 'element-ui/packages/tabs/src/tab-pane'
import Analyzer from '../../components/analyzer/Analyzer'
import Tycb from '../../components/analyzer/TycbConfig'
import Tdcb from '../../components/analyzer/TdcbConfig'
import ElPopover from 'element-ui/packages/popover/src/main'
import Helper from '../../components/help/Helper'
import HeadTop from '../../components/layout/HeadTop'

export default {
  name: 'conf-analyzer',
  data () {
    return {
      size: 14,
      // 分页管理
      word_list_length: 1000,
      stop_word_list_length: 1000,
      current_page: 1,
      stop_current_page: 1,
      word: '',
      word_type: 'tycb',

      stop_word: '',

      // 同义词表
      type_values: [{
        label: '通用',
        value: 'tycb'
      }, {
        label: '症状',
        value: 'tdcb'
      }
      ],

      // 同义词表展示
      table_data: [{
        words: '这个,这,this',
        id: 1,
        type: 'tycb'
      }, {
        words: '这个,这,this',
        id: 2,
        type: 'tycb'
      }, {
        words: '这个,这,this',
        id: 3,
        type: 'zxcx'
      }, {
        words: '这个,这,this',
        id: 4,
        type: 'zxcx'
      }],

      stop_table_data: []
    }
  },
  mounted () {
    this.get_stop_data(this.stop_word, 1, 0, this.size)
  },
  methods: {

    // 获取停用词表
    get_stop_data: function (word, state, page, size) {
      let vm = this

      this.$axios.get('/stop/findByWordLike', {
        params: {
          word: word,
          page: page,
          size: size
        }
      }).then(function (response) {
        vm.stop_table_data = response.data.content
        vm.stop_word_list_length = response.data.totalElements
        console.log(response.data)
        if (vm.stop_word_list_length === 0 && state === 1) {
          vm.save_stop(word)
        }
      })
    },

    handle_stop_current_change: function (val) {
      console.log('now is page:', val)
      this.stop_current_page = val
      this.get_stop_data(this.stop_word, 0, val - 1, this.size)
    },

    handleStopTwiceOn: function (index, row) {
      console.log(index, row)
      let vm = this
      this.$axios.get('/stop/twiceOn?stopword=' + row.stop_word).then(
        function (value) {
          if (value.data === 'success') {
            vm.$message({
              type: 'success',
              message: '成功'
            })
          }
        })
    },

    handleStopStop: function (index, row) {
      console.log(index, row)

      let vm = this
      this.$axios.post('/stop/stopUsing?id=' + row.id
      ).then(function (response) {
        if (response.data === 'success') {
          vm.$message({
            type: 'success',
            message: '已停用'
          })

          vm.get_stop_data(vm.word, 0, vm.stop_current_page - 1, vm.size)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    handleStopRecover: function (index, row) {
      console.log(index, row)

      let vm = this
      this.$axios.post('/stop/recover?id=' + row.id
      ).then(function (response) {
        if (response.data === 'success') {
          vm.$message({
            type: 'success',
            message: '恢复成功'
          })

          vm.get_stop_data(vm.stop_word, 0, vm.stop_current_page - 1, vm.size)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    handleStopDelete: function (index, row) {
      console.log(index, row)
      let vm = this
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$axios.post('/stop/delete?id=' + row.id
        ).then(function (response) {
          if (response.data === 'success') {
            vm.$message({
              type: 'success',
              message: '删除成功'
            })

            vm.get_stop_data(vm.stop_word, 0, vm.stop_current_page - 1, vm.size)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    save_stop: function (wordsToSave) {
      let vm = this
      if (wordsToSave !== '') {
        this.$axios.post('/stop/save?word=' + wordsToSave
        ).then(function (value) {
          vm.$message({
            type: 'success',
            message: value.data
          })
          vm.stop_current_page = parseInt((vm.stop_word_list_length / vm.size).toString()) + 1
          vm.get_stop_data(vm.stop_word, 0, vm.stop_current_page - 1, vm.size)
        }).catch(function (reason) {
          console.log(reason)
        })
      } else {
        this.$message({
          type: 'warning',
          message: 'invalid input'
        })
      }
    },

    init_syno_text: function () {
      let vm = this

      this.$axios.post('/syno/init').then(
        function (value) {
          if (value.data === 'success') {
            vm.$message({
              type: 'success',
              message: '成功同步同义词表'
            })
          }
        }
      )
    },

    u_stop_u_syno: function () {
      let vm = this
      let judge = 1
      let data = []

      this.$axios.get('/stop/findAllNonPage').then(
        function (value) {
          data = value.data
          console.log(data.length)
          console.log(data)
          if (data.length !== 0) {
            for (var i = 0; i < data.length; i++) {
              vm.$axios.get('/stop/twiceOn?stopword=' + data[i].stop_word
              ).then(function (value) {
                if (value !== 'success') {
                  judge = 0
                }
              })
            }

            if (judge === 1) {
              vm.$message({
                type: 'success',
                message: '更新成功！ 请执行同步操作，检查同义词表。'
              })
            }
          } else {
            vm.$message({
              type: 'warn',
              message: '没有得到停用词信息。'
            })
          }
        }
      )
    },
    handleTabClick (tab, event) {
      console.log(tab, event)
      console.log(tab.label)
      if (tab.label === '拓展词配置') {
        this.$refs.myExtend.getAllExpendWords('', 0)
      } else if (tab.label === '通用同义词配置') {
        this.$refs.myTycb.get_table_data('', 'tycb', 0, 14)
      }
    }
  },
  components: {
    HeadTop,
    ElPopover,
    ElTabPane,
    ExtendWords,
    Analyzer,
    Tdcb,
    Tycb,
    Helper
  }
}
</script>

<style scoped>

</style>
