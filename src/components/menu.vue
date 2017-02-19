<template>
  <div id="menu">
      <el-row>
          <el-col :span="8">
            <i class="fa fa-map-marker"></i>
          </el-col>
          <el-col :span="8">3</el-col>
          <el-col :span="8">4</el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  methods: {
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style type="text/css">
  #menu {
    position: absolute;
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #EEE;
    bottom: 0;
    font-size: 20px;
    z-index: 1000;
    background-color: #333;
  }
</style>