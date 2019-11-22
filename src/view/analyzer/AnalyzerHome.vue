<template>
    <div>
      <head-top></head-top>
      <div style="margin-left: 6px">
        <span> {{msg}}</span>
      </div>
    </div>
</template>

<script>
  import HeadTop from '../../components/layout/HeadTop'
  export default {
    name: 'analyze-home',
    components: {HeadTop},
    data () {
      return {
        msg: 'this is analyzer home'
      }
    }
  }
</script>

<style scoped>

</style>
