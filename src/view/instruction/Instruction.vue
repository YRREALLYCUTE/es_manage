<template>
  <div>
    <head-top></head-top>
    <div>
      <el-container style="height: 915px">
        <el-aside width="15%">
          <span style="font-size: small; font-weight: bold;">文档列表</span>
          <el-tree :data="mdfiles" :props="defaultProps" @node-click="getContent"></el-tree>

        </el-aside>
        <el-container>
          <el-main>
            <mavon-editor
              v-model="readmeContent"
              class="md"
              :value="readmeContent"
              :subfield = "false"
              :defaultOpen = md.defaultOpen
              :toolbarsFlag = md.editable
              :editable= md.editable
              :scrollStyle="true"
              :ishljs = "true"
              style="min-height: 800px"
            ></mavon-editor>
          </el-main>
          <el-footer >
            <el-button v-if="md.editable===false" type="text" size="medium" @click="editMdFile">编辑</el-button>
            <el-button v-if="md.editable===true" type="text" size="medium" @click="saveEditMdFile(ID)">保存</el-button>
            <el-button v-if="md.editable===false" type="text" size="medium" @click="removeFile(ID)">删除</el-button>
            <el-button v-if="md.editable===true" type="text" size="medium" @click="cancelEdit">取消</el-button>
          </el-footer>
        </el-container>
      </el-container>

    </div>
  </div>
</template>

<script>
  import HeadTop from '../../components/layout/HeadTop'
  import marked from 'marked'
  import highlightJs from 'highlight.js'
  export default {
    name: 'instruction',
    components: {HeadTop},
    data() {
      return {
        mdfiles: [],
        md:{
          defaultOpen: 'preview',
          editable: false
        },
        ID: 0,
        readmeContent: '',
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    activated() {
      this.getAllFiles()
    },
    methods: {

      getAllFiles(){
        this.$axios.get('/mdFile/getAll').then(
          res=>{
            if(res.data.code === 200){
              console.log(res.data.message)
              this.mdfiles = res.data.message
              if(this.ID === 0) {
                this.readmeContent = this.mdfiles[0].content
                this.ID = this.mdfiles[0].id
              }
            }else{
              this.$message({
                type: 'warning',
                message: '没有获取到数据'
              })
            }
          }
        ).catch(error=>{
          console.log(error)
        })
      },
      getContent(data){
        this.md.defaultOpen = 'preview'
        this.md.editable = false

        this.readmeContent = data.content
        this.ID = data.id
      },

      editMdFile(){
        this.md.defaultOpen = 'editor'
        this.md.editable = true
      },

      saveEditMdFile(id){
        let t1 = this.readmeContent.split("\n")[0].split(" ")[1]

        let postData = this.$qs.stringify({
          id: id,
          title: t1,
          content: this.readmeContent
        })

        this.$axios({
          method: 'POST',
          data: postData,
          url: this.$axios.defaults.baseURL + '/mdFile/update'
        }).then(res=>{
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.md.defaultOpen = 'preview'
            this.md.editable = false
          }else{
            this.$message({
              type: 'warning',
              message: '保存失败'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      cancelEdit(){
        this.md.defaultOpen = 'preview'
        this.md.editable = false
      },
      removeFile(id){
        this.$axios.get('/mdFile/delete', {
          params: {
            id: id
          }
        }).then(res=>{
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '删除成功'
            })

            this.getAllFiles()
          }else{
            this.$message({
              type: 'warning',
              message: '删除失败了'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    text-align: center;
  }
  .el-tree{
    background: #D3DCE6;
  }

</style>
