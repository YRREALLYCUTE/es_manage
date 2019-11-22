<template>
  <div>
    <head-top></head-top>
    <div style="margin-left: 6px;">
      <el-container>
        <el-aside width="30%">
          <el-input placeholder="请输入内容" v-model="esParam.host" size="medium">
            <template slot="prepend">Http://</template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="esParam.param"
                    size="medium"
                    class="input-with-select">
            <el-select v-model="esParam.method" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="1"></el-option>
              <el-option label="POST" value="2"></el-option>
              <el-option label="PUT" value="3"></el-option>
              <el-option label="DELETE" value="4"></el-option>
              <el-option label="查找往期执行" value="5"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="toRequest(esParam)"></el-button>
          </el-input>
          <editor v-model="esParam.content"
                  @setCompletions="setCompletions"
                  @init="editorInit"
                  @input="changeData"
                  lang="json"
                  theme="github"
                  :autocomplete="true"
                  width="100%"
                  height="845"
                  :options="myOptions"
                  style="font-family: 'Microsoft JhengHei'"
          ></editor>
        </el-aside>
        <el-container>
        <el-main style="height: 860px; overflow: scroll">
<!--          class="infinite-list" v-infinite-scroll="loadNewItem" style="overflow:auto">-->
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="item in collapseList" :key="item.name" :title="item.title + '   ---   ' + item.updateTime" :name="item.id">
              <el-form :inline="true" v-model="collapseList[parseInt(item.id) - 1]">
                <el-form-item label="标题">
                  <span>{{item.title}}</span>
                </el-form-item>
                <el-form-item label="请求URL">
                  <span>{{item.host}}{{item.url}}{{item.param}}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{item.description}}</span>
                </el-form-item>
                <br>
                <el-form-item label="参数">
                  <json-viewer style="width: 1000px;  overflow:scroll; max-height: 350px" :value="item.content" copyable sort></json-viewer>
                </el-form-item>
                <el-form-item label="结果" >
                  <json-viewer style="width: 1000px;  overflow:scroll; max-height: 350px" :value="item.result" copyable sort></json-viewer>
                </el-form-item>
                <br>
                <el-form-item>
                  <el-button type="text" size="medium" @click="drawerClick(item)">展开结果</el-button>
                  <el-button type="text" size="medium" @click="reEditRequest(item.method, item.content, item.param, item.host)">编辑请求</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-main>
          <el-footer style="height: 0.5px; background-color: #1e1e1e">
          </el-footer>
        </el-container>
      </el-container>
    </div>
    <el-drawer
      title="结果"
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
    >
      <json-viewer style="width: 100%;  overflow:scroll; max-height: 860px" :value="drawerView.result" :expand-depth="100" sort></json-viewer>
    </el-drawer>
  </div>
</template>

<script>
  import HeadTop from '../../components/layout/HeadTop'
  import editor from 'vue2-ace-editor'
  import 'brace/ext/language_tools'
  import JsonViewer from 'vue-json-viewer'

  export default {
    name: 'prof-mode',
    data() {
      return {
        drawerView: {},
        direction: 'rtl',
        jsonData: '{' +
          '"test": test' +
          '}',
        myOptions: {
          showPrintMargin: false,
          fontSize: '13pt'
        },
        esParam: {
          host: 'localhost:9200',
          content: '',
          param: '_all',
          method: 'GET'
        },
        drawer: false,
        activeName: '1',
        collapseList:[{
          title: 'http://localhost:9200/_all',
          id: '1',
          host: 'http://localhost:9200',
          param: '/_all',
          method:'GET',
          description: 'this is a test for json-viewer',
          content: {
            "query": {
              "match_all1": {}
            }
          },
          result: {
            "took": 1,
            "timed_out": false,
            "_shards": {
              "total": 1,
              "successful": 1,
              "skipped": 0,
              "failed": 0
            },
            "hits": {
              "total": 12,
              "max_score": 1,
              "hits": [
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "3",
                  "_score": 1,
                  "_source": {
                    "id": 3,
                    "ip": "127.0.0.1",
                    "time": 1573701313335,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[舌质红绛, 5, org.apache.catalina.connector.RequestFacade@2a834734]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "4",
                  "_score": 1,
                  "_source": {
                    "id": 4,
                    "ip": "127.0.0.1",
                    "time": 1573701702496,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[舌质红绛, 5, org.apache.catalina.connector.RequestFacade@4a2c6592]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "10",
                  "_score": 1,
                  "_source": {
                    "id": 10,
                    "ip": "127.0.0.1",
                    "time": 1573704829207,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[舌质红绛, 5, org.apache.catalina.connector.RequestFacade@a66fc5a]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "11",
                  "_score": 1,
                  "_source": {
                    "id": 11,
                    "ip": "127.0.0.1",
                    "time": 1573704860242,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[精神萎靡, 5, org.apache.catalina.connector.RequestFacade@a66fc5a]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "5",
                  "_score": 1,
                  "_source": {
                    "id": 5,
                    "ip": "127.0.0.1",
                    "time": 1573701862672,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[舌质红绛, 5, org.apache.catalina.connector.RequestFacade@a66fc5a]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "7",
                  "_score": 1,
                  "_source": {
                    "id": 7,
                    "ip": "127.0.0.1",
                    "time": 1573701979537,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[身热夜甚, 5, org.apache.catalina.connector.RequestFacade@a66fc5a]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
                ,
                {
                  "_index": "records",
                  "_type": "doc",
                  "_id": "8",
                  "_score": 1,
                  "_source": {
                    "id": 8,
                    "ip": "127.0.0.1",
                    "time": 1573702017982,
                    "methodName": "searchBzjczzAndBzlcbxByBzmc",
                    "searchContent": "[大汗淋漓, 5, org.apache.catalina.connector.RequestFacade@a66fc5a]",
                    "country": "XX",
                    "city": "内网IP",
                    "isp": "内网IP",
                    "province": "XX"
                  }
                }
              ]
            }
          },
          datetime: '2019-11-15 08:15：24'
        }],

        collapseListCount: 12,
        test:''
      }
    },
    mounted() {
        this.getAllRequests()
    },

    methods: {
      getAllRequests(){
        this.$axios.get('/devTool/findAll').then(res=>{
          this.collapseList = res.data.message
          for(let i = 0; i < res.data.message.length; i++){
            this.collapseList[i].content = JSON.parse(this.collapseList[i].content);
            this.collapseList[i].result = JSON.parse(this.collapseList[i].result);
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      changeData(value){
        this.jsonData = value
      },
      editorInit(){
        console.log('here is ini')
        require('brace/index')
        require('brace/mode/json')
        require('brace/mode/python')
        require("brace/theme/github")
        require("brace/ext/emmet")
        require("brace/ext/language_tools")
      },
      setCompletions(editor, session, pos, prefix, callback) {
        console.log('here is setcompletions')
        let data = [
          {caption: 'code', meta: '返回值', value: 'code'},
          {caption: 'message', meta: '返回值', value: 'message'},
          {caption: '@name', meta: 'mock字段：姓名', value: '@name'},
          {caption: '@phone', meta: 'mock字段：电话', value: '@phone'}
        ]
        if(prefix.length === 0){
          return callback(null, [])
        }else{
          return callback(null, [data])
        }
      },

      loadNewItem(){
        this.collapseListCount += 3
        console.log("scroll " + this.collapseListCount)
      },

      toRequest(esParam){
        console.log(esParam.content.toString())
        if(esParam.content === null || esParam.content === ''){
          esParam.content = '{}';
        }
        this.$axios.get('/devTool/elasticsearchHttpApi', {
          params :{
            method: esParam.method,
            param: esParam.param,
            content: esParam.content.toString(),
            host: 'http://' + esParam.host
          }
        }).then(res => {
            if(res.data.code === 200){
              this.collapseList = res.data.message
              for(let i = 0; i < res.data.message.length; i++){
                this.collapseList[i].content = JSON.parse(this.collapseList[i].content);
                this.collapseList[i].result = JSON.parse(this.collapseList[i].result);
              }
            }
        }).catch(error=>{
          console.log(error)
        })
      },


      reEditRequest(method, content, param, host) {
        // 注意从后台读取数据的时候要将得到的字符串转化为json，并赋值给data中的对象
        // 需要注意，data中的对象的类型并不是json，而是obServer， 而JSON-Viewer中使用的是
        // obServer 而不是纯json .... （很尴尬0.0）
        this.esParam.content = JSON.stringify(content)
        this.esParam.method = method
        this.esParam.param = param
        this.esParam.host = host
      },

      drawerClick(item){
        this.drawer = true
        this.drawerView = item
      }
    },
    components: {
      HeadTop,
      editor,
      JsonViewer
    }
  }
</script>

<style>
  /*@font-face {*/
  /*  font-family: myfont;*/
  /*  src: local("Times New Roman");*/
  /*}*/
  /*.fc{*/
  /*  font-size: 18px;*/
  /*  font-family: myfont;*/
  /*}*/
  .el-select .el-input {
    width: 130px !important;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
