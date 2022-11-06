import {fromJS} from 'immutable';

const INITIAL_STATE = fromJS({
  stocks: [],
  stockCodeIndexMap: {},
  stockDetails: {},
  stockPrices: {},
  models: {},
  predictions: {},
  upper: {},
  lower: {},
  snakes: {},
  rollingPredict: {}
});

const stock = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_STOCKS':
      return state.set('stocks', action.stocks).set('stockCodeIndexMap', action.stockCodeIndexMap);
    case 'GET_STOCK':
      return state.set('stockDetails', action.stock);
    case 'GET_STOCK_PRICES':
      return state.setIn(['stockPrices', action.stockCode], action.stockPriceData);
    case 'GET_PREDICTIONS':
      return state
          .setIn(['predictions', action.stockCode], action.predictions)
          .setIn(['models', action.stockCode], action.models)
          .setIn(['grade', action.stockCode], action.grade)
          .setIn(['threshold', action.stockCode], action.threshold)
          .setIn(['upper', action.stockCode], action.upper)
          .setIn(['lower', action.stockCode], action.lower)
          .setIn(['snakes', action.stockCode], action.snakes)
          .setIn(['rollingPredict', action.stockCode], action.rollingPredict)
          .setIn(['sentimentTrendScore', action.stockCode], action.sentimentTrendScore)
          .setIn(['stockTrendScore', action.stockCode], action.stockTrendScore);
    default:
      return state;
  }
};

export default stock;
