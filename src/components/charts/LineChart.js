import React, {Component} from 'react';

const google = window.google;

export default class LineChart extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  drawChart() {
    let data = new google.visualization.DataTable();
    for (let i = 0; i < this.props.columns.length; i++) {
      data.addColumn(this.props.columns[i][0], this.props.columns[i][1]);
    }
    data.addRows(this.props.data);
    let priceFormatter = new google.visualization.NumberFormat({prefix: '$'});
    for (let i = 1; i < this.props.columns.length; i++) {
      priceFormatter.format(data, i);
    }
    let chart = new google.visualization.LineChart(this.ref.current);
    chart.draw(data, this.props.options);
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  render() {
    return <div
      ref={this.ref}
      style={{
        height: '100%',
        width: '100%'
      }} />;
  }
}
