import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {ModelDetails} from '../components/model';
import {getPredictions} from '../actions/stock';

const mapStateToProps = (state, ownProps) => ({
  model: state.getIn(['stock', 'models', ownProps.match.params.stockCode, parseInt(ownProps.match.params.modelIdx)], null)
});

const mapDispatchToProps = (dispatch) => ({
  getPredictions: (stockCode) => dispatch(getPredictions(stockCode))
});

const styles = () => ({

});

class ModelDetailsPage extends Component {
  componentDidMount() {
    this.props.setLoading(true);
    this.props.getPredictions(this.props.match.params.stockCode)
        .then(() => {
          this.props.setLoading(false);
        });
  }

  render() {
    const {model} = this.props;

    if (!model) {
      return null;
    }

    return <ModelDetails model={model} />;
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ModelDetailsPage));
