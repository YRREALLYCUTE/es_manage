<template>
  <div>
    <el-row>
      <el-col :span="11" :offset="0">
        <el-input placeholder="输入内容" v-model="word" v-on:keyup.enter.native="getAllExpendWords(word,0)">
          <el-button slot="append" @click="getAllExpendWords(word,0)" >查询</el-button>
        </el-input>
      </el-col>

      <el-col :span="11" :offset="1">

        <el-input placeholder="添加词项" v-model="word"   class="input-with-select" v-on:keyup.enter.native="getAllExpendWords(word, 0, 1)">
          <el-button slot="append" @click="getAllExpendWords(word, 0, 1)" >添加</el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table :data="extendWords" style="width: 100%" stripe>

      <el-table-column label="id" width = 200>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="词项">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.extend_word}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width = 300>
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.state === 0">已停用</span>
          <span style="margin-left: 10px" v-else>使用中</span>
        </template>
      </el-table-column>

      <el-table-column label="添加方式" width = 300>
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.human === 1">手动</span>
          <span style="margin-left: 10px" v-else>自动</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width = 400>
        <template slot-scope="scope">
          <el-button size="mini" type="info" v-if="scope.row.state === 1" @click="stopUsing(scope.row.id)">停用</el-button>
          <el-button size="mini" type="success" v-else @click="recover(scope.row.id)">恢复</el-button>
          <el-button size="mini" type="danger" @click="deleteWords(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      :page-size="size"
      :pager-count="11"
      @current-page="page"
      @current-change="handle_current_change"
      layout="total,prev, pager, next"
      :total="totalNum"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'extend-words',
  data () {
    return {
      extendWords: [{
        id: 1,
        extend_word: '测试',
        state: 0
      }],
      page: 0,
      totalNum: 0,
      word: '',
      size: 14
    }
  },
  mounted () {
    this.getAllExpendWords(this.word, 0)
  },
  methods: {
    // 在这里修改
    getAllExpendWords (word, page, state = 0) {
      this.$axios.get('/extend/findByWordLike', {
        params: {
          word: word,
          size: this.size,
          page: page
        }
      }).then(response => {
        this.extendWords = response.data.content
        this.totalNum = response.data.totalElements
        if (this.totalNum === 0 && state === 1) {
          this.save(word)
        }
      })
    },
    handle_current_change (val) {
      this.page = val
      this.getAllExpendWords(this.word, val - 1)
    },
    save (word) {
      if (word !== '') {
        this.$axios.get('/extend/save', {
          params: {
            word: word
          }
        }).then(response => {
          if (response.data === 'success') {
            this.$message({
              type: 'success',
              message: 'success'
            })
            console.log()
            this.getAllExpendWords(word, 0)
          } else {
            this.$message.error(
              'failed'
            )
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message({
          type: 'warning',
          message: 'invalid input'
        })
      }
    },
    stopUsing (id) {
      this.$axios.get('/extend/stopUsing', {
        params: {
          id: id
        }
      }).then(response => {
        if (response.data === 'success') {
          this.$message({
            type: 'success',
            message: 'success'
          })
          this.getAllExpendWords(this.word, this.page - 1)
        } else {
          this.$message({
            type: 'warn',
            message: 'failed'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    recover (id) {
      this.$axios.get('/extend/recover', {
        params: {
          id: id
        }
      }).then(response => {
        if (response.data === 'success') {
          this.$message({
            type: 'success',
            message: 'success'
          })
          this.getAllExpendWords(this.word, this.page - 1)
        } else {
          this.$message({
            type: 'warn',
            message: 'failed'
          })
        }
      })
    },
    deleteWords (id) {
      let vm = this
      vm.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$axios.get('/extend/delete', {
          params: {
            id: id
          }
        }).then(response => {
          if (response.data === 'success') {
            this.$message({
              type: 'success',
              message: 'success'
            })
            vm.getAllExpendWords(this.word, this.page - 1)
          } else {
            vm.$message({
              type: 'warn',
              message: 'failed'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    update (id, word) {

    }
  }
}
</script>

<style scoped>

</style>
