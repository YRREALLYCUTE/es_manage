<template>
  <div>
    <head-top></head-top>
    <div style="margin-left: 6px;">
      <mavon-editor v-model="editorData"
                    ref=md
                    style="min-height: 870px"
                    :scrollStyle="true"
                    @imgAdd="imgAdd" @imgDel="imgDel"
                    @save="saveMavon(editorData)"
                    :ishljs = "true">
      </mavon-editor>
    </div>
  </div>
</template>

<script>
  import HeadTop from '../../components/layout/HeadTop'
  export default {
    name: 'edit-instruction',
    components: {HeadTop},
    data() {
      return {
        editorData: '# markdown',
        img_file: []
      }
    },
    methods: {
      // 绑定@imgAdd event
      imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
        this.img_file[pos] = $file;
        this.$axios({
          url: '/guest/uploadImg',
          method: 'post',
          name: 'file',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((res) => {
          // let json_res = JSON.parse(res.data)
          // 第二步.将返回的url替换到文本原位置[外链图片转存失败(img-Anv63SQR-1564734760257)(0)] -> [外链图片转存失败(img-OVX7vZS4-1564734760259)(url)]
          this.$refs.md.$img2Url(pos, this.$axios.defaults.baseURL + '/uploadFile/' +  res.data.fileName);
        })
      },
      imgDel(pos) {
        delete this.img_file[pos];
      },
      saveMavon(content){
        let title = content.split('\n')[0].split(" ")[1]
        let md_data = this.$qs.stringify({
          content: content,
          title: title
        })
        this.$axios({
          method: 'POST',
          data: md_data,
          url: this.$axios.defaults.baseURL + '/mdFile/save'
        }).then(res=>{
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }else{
            this.$message({
              type: 'warning',
              message: '保存失败'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>
<style>

</style>
