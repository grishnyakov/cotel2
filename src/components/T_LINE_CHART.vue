<template>
  <div class="container">
    <canvas ref="canvas" style="width: 100%"></canvas>
  </div>
</template>

<script>
    import VueCharts from 'vue-chartjs'

    export default  {
      name: "T_LINE_CHART",
      extends: VueCharts.Line,
      props: ['data', 'options'],
      mounted () {
        this.renderChart(this.data, this.options)
      }
    };

</script>
