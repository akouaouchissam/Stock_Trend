import firebase from 'firebase';
import {fromJS} from 'immutable';
import rp from 'request-promise';

export const getStocks = () => {
  return (dispatch) => {
    return firebase.functions().httpsCallable('getStock')({})
        .then((result) => {
          dispatch({
            type: 'GET_STOCKS',
            stocks: fromJS(result.data.stocks),
            stockCodeIndexMap: fromJS(result.data.stockCodeIndexMap)
          });
        });
  };
};
export const getStock = (stockCode) => {
  return (dispatch, getState) => {
    let state = getState();

    if (state.get('stock').get('stockCodeIndexMap').has(stockCode)) {
      dispatch({
        type: 'GET_STOCK',
        stock: state.get('stock').get('stocks').get(state.get('stock').get('stockCodeIndexMap').get(stockCode))
      });
    } else {
      return firebase.functions().httpsCallable('getStock')({stockCode: stockCode})
          .then((result) => {
            dispatch({
              type: 'GET_STOCK',
              stock: fromJS(result.data.stock)
            });
          });
    }
  };
};

export const getStockPrices = (stockCode) => {
  return async (dispatch) => {
    let stockPrices;
    try {
        const stockPricesRef = firebase.storage().ref(`stock_prices/${stockCode}.json`);
        const downloadUrl = await stockPricesRef.getDownloadURL();
        const stockPricesJsonStr = await rp(downloadUrl);
        stockPrices = JSON.parse(stockPricesJsonStr);
    } catch (err) {
      return;
    }
    for (let i = 0; i < stockPrices.stockPrices.length; i++) {
      stockPrices.stockPrices[i][0] = new Date(stockPrices.stockPrices[i][0]);
    }
    dispatch({
      type: 'GET_STOCK_PRICES',
      stockCode: stockCode,
      stockPriceData: fromJS(stockPrices.stockPrices)
    });
  };
};

export const getPredictions = (stockCode) => {
  return async (dispatch) => {
    let predictions;
    try {
        const predictionsRef = firebase.storage().ref(`predictions/${stockCode}/predictions.json`);
        const downloadUrl = await predictionsRef.getDownloadURL();
        const predictionsJsonStr = await rp(downloadUrl);
        predictions = JSON.parse(predictionsJsonStr);
    } catch (error) {
      console.log(error);
      return;
    }
    dispatch({
      type: 'GET_PREDICTIONS',
      stockCode: stockCode,
      predictions: fromJS(predictions.predictions),
      models: fromJS(predictions.models),
      upper: fromJS(predictions.upper),
      lower: fromJS(predictions.lower),
      snakes: fromJS(predictions.snakes),
      rollingPredict: fromJS(predictions.rollingPredict),
      grade: fromJS(predictions.grade),
      threshold: fromJS(predictions.threshold),
      stockTrendScore: fromJS(predictions.stockTrendScore),
      sentimentTrendScore: fromJS(predictions.sentimentTrendScore)

    });
  };
};
