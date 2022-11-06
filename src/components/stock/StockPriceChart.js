import React, {Component} from 'react';
import LineChart from '../charts/LineChart';
import immutableToJsComponent from '../immutableToJsComponent';

class StockPriceChart extends Component {
  parseData() {
    const { advancedUser, prices, predictions, models, timeInterval, upper, lower, snakes, rollingPredict, snakesShow, rollingPredictShow} = this.props;

    //current structure:
    //date, curprice, predprice, upper, lower, snake, rollingpredict, predprice, upper, lower, snake, rollingpredict

    let data = prices;
    let columns = [['date', 'Date'], ['number', 'Stock Price']];
    let series = [{color: 'blue'}];
    let options = {
      chart: {
        title: 'Stock Price'
      },
      legend: {
        position: 'none'
      },
      hAxis: {
        viewWindow: {
          min: timeInterval
        },
        gridlines: {
          color: 'transparent'
        }
      },
      legend: {
        position: 'top',
        maxLines: 3
      },
      chartArea: {
        width: "80%",
        height: "65%",
      },
      series: series,
      height: '100%',
      width: '100%'
    };

    // no models selected
    if (!predictions || predictions.length === 0) {
      return {data, columns, options};
    }

    const numOfModels = predictions.length;
    const predictionsLength = predictions[0].length;

    // calculate snakes and rolling predict column indexes in data
    let snakesColIdxs = [];
    let rollingPredictColIdxs = [];
    let dataColIdx = 1;
    for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
      dataColIdx++;
      if (upper && upper[modelIdx]) {
        dataColIdx++;
      }
      if (lower && lower[modelIdx]) {
        dataColIdx++;
      }
      if (advancedUser && snakes && snakes[modelIdx] && snakesShow) {
        dataColIdx++;
        snakesColIdxs.push(dataColIdx);
      } else {
        snakesColIdxs.push(null);
      }
      if (advancedUser && rollingPredict && rollingPredict[modelIdx] && rollingPredictShow) {
        dataColIdx++;
        rollingPredictColIdxs.push(dataColIdx);
      } else {
        rollingPredictColIdxs.push(null);
      }
    }
    
    // Append the nulls
    for (let dateIdx = 0; dateIdx < data.length; dateIdx++) {
      for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
        data[dateIdx].push(null); // prediction
        if (upper && upper[modelIdx]) {
          data[dateIdx].push(null); // upper bound
        }
        if (lower && lower[modelIdx]) {
          data[dateIdx].push(null); // lower bound
        }
        if (snakesColIdxs[modelIdx] !== null) {
          data[dateIdx].push(null); // snakes
        }
        if (rollingPredictColIdxs[modelIdx] !== null) {
          data[dateIdx].push(null); // rolling predict
        }
      }
    }

    // initial point for the predictions
    let lastPriceRow = [data[0][0], null];
    for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
      lastPriceRow.push(data[0][1]);
      if (upper && upper[modelIdx]) {
        lastPriceRow.push(data[0][1]);
      }
      if (lower && lower[modelIdx]) {
        lastPriceRow.push(data[0][1]);
      }
      if (snakesColIdxs[modelIdx] !== null) {
        lastPriceRow.push(null);
      }
      if (rollingPredictColIdxs[modelIdx] !== null) {
        lastPriceRow.push(null);
      }
    }
    data.push(lastPriceRow);

    let lastDateTimestamp = data[0][0].getTime();

    //for upper lower bound
    for (let predictionIdx = 0; predictionIdx < predictionsLength; predictionIdx++) {
      let row = [new Date(lastDateTimestamp + (predictionIdx + 1) * 86400000), null];
      for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
        row.push(predictions[modelIdx][predictionIdx]);
        if (upper && upper[modelIdx]) {
          row.push(upper[modelIdx][predictionIdx]);
        }
        if (lower && lower[modelIdx]) {
          row.push(lower[modelIdx][predictionIdx]);
        }
        if (snakesColIdxs[modelIdx] !== null) {
          row.push(null);
        }
        if (rollingPredictColIdxs[modelIdx] !== null) {
          row.push(null);
        }
      }
      data.push(row);
    }

    for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
      columns.push(['number', models[modelIdx].modelName]);
      if (upper && upper[modelIdx]) {
        columns.push(['number', `${models[modelIdx].modelName} Upper Bound`]);
      }
      if (lower && lower[modelIdx]) {
        columns.push(['number', `${models[modelIdx].modelName} Lower Bound`]);
      }
      if (snakesColIdxs[modelIdx] !== null) {
        columns.push(['number', `${models[modelIdx].modelName} Snakes`]);
      }
      if (rollingPredictColIdxs[modelIdx] !== null) {
        columns.push(['number', `${models[modelIdx].modelName} Rolling Predict`]);
      }
    }

    //combine the multiple snakes array into one
    if (advancedUser) {
      for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
        //Put snakes values into 'snakes' columns in chart
        if (snakesColIdxs[modelIdx] === null) {
          continue;
        }
        const numOfSnakes = snakes[modelIdx].length;
        const snakesLen = snakes[modelIdx][0].length;
        for (let snakeIdx = 0; snakeIdx < snakes[modelIdx].length; snakeIdx++) {
          for (let valueIdx = 0; valueIdx < snakesLen; valueIdx++) {
            data[snakesLen * (numOfSnakes - snakeIdx) - valueIdx - 1][snakesColIdxs[modelIdx]] = snakes[modelIdx][snakeIdx][valueIdx];
          }
        }
      }

      for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
        //plot rollingPredict
        if (rollingPredictColIdxs[modelIdx] === null) {
          continue;
        }
        let rollingPredictLen = rollingPredict[modelIdx].length;
        for (let valueIdx = 0; valueIdx < rollingPredictLen; valueIdx++) {
          data[rollingPredictLen - valueIdx - 1][rollingPredictColIdxs[modelIdx]] = rollingPredict[modelIdx][valueIdx];
        }
      }

      //seperate the snakes for better user experience
      let firstSnakesModelIdx = -1;
      for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
        if (snakesColIdxs[modelIdx] !== null) {
          firstSnakesModelIdx = modelIdx;
          break;
        }
      }
      if (firstSnakesModelIdx !== -1) {
        for (let i = 0; i < snakes[firstSnakesModelIdx][0].length; i++) {
          let separateRow = [...data[10 * (10 - i) - 1]];
          for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
            separateRow[snakesColIdxs[modelIdx]] = null;
          }
          data.splice(10 * (10 - i), 0, separateRow);
        }
      }
    }

    //Push options for dashed lines and color mod
    const colorOptions = ['#0B66B2', '#14E84E', '#FFE62D', '#E8623D', '#77FF5A'];
    // const pastColorOptions = ['#fb8c00', '#E614E8', '#3EBCE8', '#FFE045', '#AC34FF'];
    for (let modelIdx = 0; modelIdx < numOfModels; modelIdx++) {
      let modelColorForPredict = colorOptions[modelIdx % colorOptions.length];
      series.push({ color: modelColorForPredict }); //prediction
      if (upper && upper[modelIdx]) {
        series.push({ color: modelColorForPredict, lineDashStyle: [4, 1] }); //upper bound
      }
      if (lower && lower[modelIdx]) {
        series.push({ color: modelColorForPredict, lineDashStyle: [4, 1] }); //lower bound
      }
      let modelColorForPast = colorOptions[modelIdx % colorOptions.length];
      if (snakesColIdxs[modelIdx] !== null) {
        series.push({ color: modelColorForPast, lineDashStyle: [5, 2] }); //snake
      }
      if (rollingPredictColIdxs[modelIdx] !== null) {
        series.push({ color: modelColorForPast, lineDashStyle: [5, 2] }); //rolling predict
      }
    }
    options.series = series;
    
    return {data, columns, options};
  }

  render() {
    var {data, columns, options} = this.parseData();

    return (
      <LineChart
        data={data}
        columns={columns}
        options={options}
        style={{
          height: '100%',
          width: '100%'
        }} />
    );
  }
}

export default immutableToJsComponent(StockPriceChart);
