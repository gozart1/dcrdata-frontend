import { Line, mixins } from 'vue-chartjs'
import _ from 'lodash'

const linePlugin = {
  debouncedDraw: _.debounce((chart, pointIndex) => {
    let meta = chart.getDatasetMeta(0) // first dataset is used to discover X coordinate of a point
    let data = meta.data
    let lineLeftOffset = data[pointIndex]._model.x
    let scale = chart.scales['y-axis-0']
    let context = chart.chart.ctx
    // render vertical line
    context.beginPath()
    context.strokeStyle = 'rgb(49, 54, 149)'
    context.moveTo(lineLeftOffset, scale.top)
    context.lineTo(lineLeftOffset, scale.bottom)
    context.stroke()
    // write label
    context.fillStyle = 'rgb(49, 54, 149)'
    context.textAlign = 'center'
    context.fillText('Latest Reward Reduction', lineLeftOffset + 75, scale.top + 40)
  }, 16),
  beforeDatasetsDraw: function (chart, easing) {
    let pointIndex = chart.config.data.lineAtIndex[0]
    if (pointIndex) {
      this.debouncedDraw(chart, pointIndex)
    }
  }
}

export default Line.extend({
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    if (this.chartData.lineAtIndex) {
      this.addPlugin(linePlugin)
    }
    this.renderChart(this.chartData, this.options)
  }
})
