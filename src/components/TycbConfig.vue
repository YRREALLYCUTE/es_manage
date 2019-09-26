<template>
  <div>
    <el-row>
      <el-col :span="11" :offset="0">
        <el-input placeholder="输入内容" v-model="word" class="input-with-select" v-on:keyup.enter.native="get_table_data(word,'tycb',0,size)">
          <el-button slot="append" @click="get_table_data(word,'tycb',0,size)" >查询</el-button>
        </el-input>
      </el-col>

      <el-col :span="11" :offset="1">

        <el-input placeholder="添加词项" v-model="word"   class="input-with-select" v-on:keyup.enter.native="get_table_data(word, 'tycb', 0, size, 1)">

          <el-select v-model="word_type" slot="prepend" placeholder="请选择同义词表" style="width: 160px" clearable>
            <el-option v-for="item in type_values"
                       :key="item.value"
                       :value="item.value"
                       :label="item.label"
            >
            </el-option>
          </el-select>

          <el-button slot="append" @click="get_table_data(word, 'tycb', 0, size, 1)" >添加</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="table_data" style="width: 100%" stripe :cell-style="cellStyle" :header-cell-style="rowClass" @sort-change='sortChange'>

      <el-table-column label="id" width = 100>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="词项" >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.words }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" width = 150 >
      <template slot-scope="scope">
        <span style="margin-left: 10px" >通用</span>
      </template>
    </el-table-column>

      <el-table-column label="编辑次数" width = 100 sortable="custom" prop="editTimes" :sort-orders="['descending','ascending','descending']">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.editTimes}}</span>
        </template>
      </el-table-column>

      <el-table-column label="查询次数" width = 100 sortable="custom" prop="searchTimes" :sort-orders="['descending','ascending','descending']">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.searchTimes}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width = 200 sortable="custom" prop="createTime" :sort-orders="['descending','ascending','descending']">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createTime}}</span>
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="info" v-if="scope.row.state === 1" @click="handleStop(scope.$index, scope.row)">停用</el-button>
          <el-button size="mini" type="success" v-else @click="handleRecover(scope.$index, scope.row)">恢复</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="14"
      :pager-count="11"
      @current-page="current_page"
      @current-change="handle_current_change"
      layout="total,prev, pager, next"
      :total="word_list_length"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'tycb-config',
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

      stop_table_data: [],

      result1: [],
      result2: [],
      result3: [],
      result4: [],
      orders: 'id'
    }
  },
  mounted () {
    this.get_table_data(this.word, this.word_type, 0, this.size)
  },
  methods: {
    // 获取table data
    get_table_data: function (word, type, page, size, state = 0) {
      let vm = this

      this.$axios.get('/syno/findByWordAndType', {
        params: {
          word: word,
          page: page,
          size: size,
          type: type,
          order: vm.orders
        }
      }).then(function (response) {
        vm.table_data = response.data.content
        vm.word_list_length = response.data.totalElements
        console.log(response.data)
        if (vm.word_list_length === 0 && state === 1) {
          vm.$prompt('请输入要添加的词项', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: '/' + word + '/',
            inputPattern: /^\/((.*)\/)+(.*)\/$/,
            inputErrorMessage: '必须存在 / 作为分隔符, 且首尾使用 /'
          }).then(function (value) {
            vm.save(value.value)
          }).catch(function (reason) {
            vm.$message({
              type: 'warn',
              message: '已取消'
            })
          })
        }
      })
    },
    // 更改词典
    handleEdit (index, row) {
      console.log(index, row)
      let vm = this
      vm.$prompt('请输入修改后的词项', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.words,
        inputPattern: /^\/((.*)\/)+(.*)\/$/,
        inputErrorMessage: '必须存在 / 作为分隔符, 且首尾使用 /'
      }).then(function (value) {
        vm.$axios.post('/syno/update?id=' + row.id + '&words=' + value.value + '&type=' + row.type
        ).then(function (response) {
          vm.$message({
            type: 'success',
            message: response.data
          })

          if (response.data === '更新成功') {
            vm.get_table_data(vm.word, 'tycb', vm.current_page - 1, vm.size)
          }
        }).catch(function (reason) {
          console.log(reason)
        })
      }).catch(function (reason) {
        console.log(reason)
        vm.$message({
          type: 'warn',
          message: '已取消'
        })
      })
    },
    // 删除对应词
    handleDelete (index, row) {
      let vm = this
      vm.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$axios.get('/syno/realDelete?id=' + row.id
        ).then(function (response) {
          if (response.data === 'success') {
            vm.$message({
              type: 'success',
              message: '删除成功'
            })

            vm.get_table_data(vm.word, 'tycb', vm.current_page - 1, vm.size)
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
    // 添加词项
    save: function (wordsToSave) {
      let rgx = /^\/((.*)\/)+(.*)\/$/
      let vm = this
      if (wordsToSave.match(rgx) == null) {
        vm.$message({
          type: 'warn',
          message: '必须包含/切分词项, 且首尾使用 /'
        })
      } else {
        this.$axios.get('/syno/save?words=' + wordsToSave + '&type=' + vm.word_type
        ).then(function (value) {
          vm.$message({
            type: 'success',
            message: value.data
          })

          vm.get_table_data(vm.word, 'tycb', vm.current_page - 1, vm.size)
        }).catch(function (reason) {
          console.log(reason)
        })
      }
    },
    // 恢复使用
    handleRecover (index, row) {
      console.log(index, row)

      let vm = this
      this.$axios.get('/syno/recover?id=' + row.id
      ).then(function (response) {
        if (response.data === 'success') {
          vm.$message({
            type: 'success',
            message: '恢复成功'
          })

          vm.get_table_data(vm.word, 'tycb', vm.current_page - 1, vm.size)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // stop停用
    handleStop (index, row) {
      console.log(index, row)

      let vm = this
      this.$axios.get('/syno/delete?id=' + row.id + '&type=' + row.type
      ).then(function (response) {
        if (response.data === 'success') {
          vm.$message({
            type: 'success',
            message: '已停用'
          })

          vm.get_table_data(vm.word, 'tycb', vm.current_page - 1, vm.size)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 切换页
    handle_current_change: function (val) {
      console.log('now is page:', val)
      this.current_page = val
      this.get_table_data(this.word, 'tycb', val - 1, this.size)
    },
    cellStyle ({row, cloumn, rowIndex, columnIndex}) {
      return 'text-align: center;'
    },
    rowClass ({row, rowIndex}) {
      return 'text-align: center;'
    },
    sortChange (column, prop, order) {
      console.log(column, prop, order)
      if (column.order === 'descending') {
        this.orders = column.prop
        this.get_table_data(this.word, 'tycb', this.current_page - 1, this.size)
      } else {
        this.orders = 'id'
        this.get_table_data(this.word, 'tycb', this.current_page - 1, this.size)
      }
    }
  }
}
</script>

<style scoped>

</style>
