import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {StockDetails, StockPriceChart, StockTimeFrame, StockModelList, StockGrade, SentimentGrade, ChartSettings} from '../components/stock';
import {getStock, getStockPrices, getPredictions} from '../actions/stock';
import {updateUserProfile} from '../actions/auth';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => ({
  advancedUser: state.getIn(['auth', 'userProfile', 'advanced'], false),
  stock: state.get('stock').get('stockDetails'),
  stockPrices: state.get('stock').get('stockPrices').get(ownProps.match.params.stockCode, null),
  predictions: state.getIn(['stock', 'predictions', ownProps.match.params.stockCode], null),
  models: state.getIn(['stock', 'models', ownProps.match.params.stockCode], null),
  grade: state.getIn(['stock', 'grade', ownProps.match.params.stockCode], null),
  threshold: state.getIn(['stock', 'threshold', ownProps.match.params.stockCode], null),
  upper: state.getIn(['stock', 'upper', ownProps.match.params.stockCode], null),
  lower: state.getIn(['stock', 'lower', ownProps.match.params.stockCode], null),
  snakes: state.getIn(['stock', 'snakes', ownProps.match.params.stockCode], null),
  rollingPredict: state.getIn(['stock', 'rollingPredict', ownProps.match.params.stockCode], null),
  stockTrendScore: state.getIn(['stock', 'stockTrendScore', ownProps.match.params.stockCode], null),
  sentimentTrendScore: state.getIn(['stock', 'sentimentTrendScore', ownProps.match.params.stockCode], null),
  snakesShow: state.getIn(['auth', 'userProfile', 'snakesShow'], false),
  rollingPredictShow: state.getIn(['auth', 'userProfile', 'rollingPredictShow'], false)
});

const mapDispatchToProps = (dispatch) => ({
  getStock: (stockCode) => dispatch(getStock(stockCode)),
  getStockPrices: (stockCode) => dispatch(getStockPrices(stockCode)),
  getPredictions: (stockCode) => dispatch(getPredictions(stockCode)),
  updateUserProfile: userProfile => dispatch(updateUserProfile(userProfile))
});

const styles = () => ({
  stockPriceChart: {
    height: '40vh',
    width: '100%'
  },
  stockModelList: {
    width: '100%'
  },
  sentimentGrade: {
    width: '100%'
  },
  stockGrade: {
    width: '100%'
  }
});

class DetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeInterval: moment().subtract(3, 'months').toDate(),
      modelIndex: [],
      chartSettingsOpen: false
    };
  }

  onTimeFrameClick = (timeFrameStr) => {
    if (timeFrameStr === 'max'){
      return this.setState({timeInterval: null});
    }

    let timeInterval = moment();

    switch(timeFrameStr) {
      case "1w":
        timeInterval = timeInterval.subtract(7, 'days');
        break;
      case "1m":
        timeInterval = timeInterval.subtract(1, 'months');
        break;
      case "3m":
        timeInterval = timeInterval.subtract(3, 'months');
        break;
      case "6m":
        timeInterval = timeInterval.subtract(6, 'months');
        break;
      case "1y":
        timeInterval = timeInterval.subtract(1, 'years');
        break;
      case "2y":
        timeInterval = timeInterval.subtract(2, 'years');
        break;
      default:
        timeInterval = timeInterval.subtract(5, 'years');
    }
    this.setState({timeInterval: timeInterval.toDate()});
  }

  onChartSettingsSave = ({snakesShow,rollingPredictShow}) => {
    this.props.setLoading(true);
    this.props.updateUserProfile({snakesShow, rollingPredictShow})
        .then(() => {
          this.props.setLoading(false);
        });
    this.setState({chartSettingsOpen: false});
  }

  onSettingsIconClick = () => {
    this.setState({chartSettingsOpen: true});
  }

  onChartSettingsClose = () => {
    this.setState({chartSettingsOpen: false});
  }

  onModelClick = (modelIndex) => {
    this.setState((state) => {
      let i = state.modelIndex.indexOf(modelIndex);

      if (i === -1) {
        state.modelIndex.push(modelIndex);
        return {modelIndex: state.modelIndex};
      } else {
        state.modelIndex.splice(i, 1);
        return {modelIndex: state.modelIndex};
      }
    });
  }

  onModelDetailsClick = (modelIdx) => {
    this.props.history.push(`/modelDetails/${this.props.match.params.stockCode}/${modelIdx}`);
  }

  componentDidMount() {
    this.props.setLoading(true);
    Promise.all([
      this.props.getStock(this.props.match.params.stockCode),
      this.props.getStockPrices(this.props.match.params.stockCode),
      this.props.getPredictions(this.props.match.params.stockCode)
    ])
    .then(() => {
      this.props.setLoading(false);
    });
  }

  render() {
    const {
      advancedUser,
      stock,
      stockPrices,
      predictions,
      models,
      grade,
      threshold,
      classes,
      upper,
      lower,
      snakes,
      rollingPredict,
      stockTrendScore,
      sentimentTrendScore,
      snakesShow,
      rollingPredictShow
    } = this.props;
    const {chartSettingsOpen} = this.state;

    return (
      <div>
        <StockDetails stock={stock} />
        {
          stockPrices &&
          predictions &&
          models &&
          <div>
            <div className={classes.stockPriceChart}>
              <StockPriceChart
                advancedUser={advancedUser}
                prices={stockPrices}
                predictions={predictions.filter((prediction, index) => this.state.modelIndex.indexOf(index) !== -1)}
                models={models.filter((model, index) => this.state.modelIndex.indexOf(index) !== -1)}
                timeInterval={this.state.timeInterval}
                upper={upper.filter((upper, index) => this.state.modelIndex.indexOf(index) !== -1)}
                lower={lower.filter((lower, index) => this.state.modelIndex.indexOf(index) !== -1)}
                snakes={snakes.filter((snakes, index) => this.state.modelIndex.indexOf(index) !== -1)}
                rollingPredict={rollingPredict.filter((rollingPredict, index) => this.state.modelIndex.indexOf(index) !== -1)}
                snakesShow={snakesShow}
                rollingPredictShow={rollingPredictShow} />
            </div>
            <div style={{display:'flex', justifyContent: 'space-between'}}>
              <StockTimeFrame
                onTimeFrameClick={this.onTimeFrameClick} />
              {
                advancedUser &&
                <SettingsIcon style={{marginTop: 'auto', marginBottom: 'auto'}} onClick={() => this.onSettingsIconClick()}/>
              }
            </div>
          </div>
        }
        {
          sentimentTrendScore !== null &&
          <SentimentGrade
            grade={sentimentTrendScore}
            className={classes.sentimentGrade} />
        }
        {
          stockTrendScore !== null &&
          <StockGrade
            grade={stockTrendScore}
            className={classes.stockGrade} />
        }
        {
          models &&
          <StockModelList
            models={models}
            threshold = {threshold}
            onModelClick={this.onModelClick}
            selected={this.state.modelIndex}
            onModelDetailsClick={this.onModelDetailsClick}
            className={classes.stockModelList} />
        }
        {
          advancedUser &&
          chartSettingsOpen &&
          <ChartSettings
              advancedUser={advancedUser}
              snakesShow={snakesShow}
              chartSettingsOpen={chartSettingsOpen}
              rollingPredictShow={rollingPredictShow}
              onChartSettingsSave={this.onChartSettingsSave}
              onChartSettingsClose={this.onChartSettingsClose} />
        }
      </div>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DetailsPage));
