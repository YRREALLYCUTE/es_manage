<template>
  <div>
    <head-top></head-top>
    <div style="margin-left: 6px">
      <analyzer></analyzer>
    </div>
  </div>
</template>

<script>
  import analyzer from '../../components/analyzer/Analyzer'
  import HeadTop from '../../components/layout/HeadTop'
  export default {
    name: 'test-analyzer',
    components: {
      HeadTop,
      analyzer
    }
  }
</script>

<style scoped>

</style>
