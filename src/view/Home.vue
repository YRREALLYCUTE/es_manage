<template>
  <div>
    <el-link @click="gotoAnalyzer()">Analyzer Home</el-link>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    gotoAnalyzer () {
      this.$router.push('/AnalyzerHome')
    }
  }
}
</script>

<style scoped>

</style>
