import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import immutableToJsComponent from '../immutableToJsComponent';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/Remove';
// import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
// import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

import Hidden from '@material-ui/core/Hidden';

const classes = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 4,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class StockModelList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortColumn: 'trendScore',
      sortDirection: 'desc'
    };
  }

  onHeaderClick = (columnName) => {
    this.setState((oldState) => {
      let newSortDirection = null;
      if (oldState.sortDirection === 'desc') {
        newSortDirection = 'asc';
      } else {
        newSortDirection = 'desc';
      }

      return {
        sortColumn: columnName,
        sortDirection: newSortDirection
      };
    });
  }

  sort = (models, column, direction) => {
    if (column === null || direction === null) {
      return models;
    }

    return models.sort((m1, m2) => {
      if (m1[column] > m2[column]) {
        return 1 * direction;
      } else if (m1[column] < m2[column]) {
        return -1 * direction;
      } else {
        return 0;
      }
    });
  }

  componentDidMount() {
    const {models, onModelClick} = this.props;
    const {sortColumn, sortDirection} = this.state;

    if (models.length) {
      const modelsSorted = this.sort(
        JSON.parse(JSON.stringify(models)),
        sortColumn,
        (sortDirection === 'asc') ? 1 : -1
      );

      onModelClick(modelsSorted[0].modelIndex);
    }
  }

  render() {
    // const { models, onModelClick, selected, onModelDetailsClick, order, orderBy } = this.props;
    const { models, threshold, onModelClick, selected, onModelDetailsClick } = this.props;
    const {sortColumn, sortDirection} = this.state;

    const modelsSorted = this.sort(
      JSON.parse(JSON.stringify(models)),
      sortColumn,
      (sortDirection === 'asc') ? 1 : -1
    );

    // let highestScoreModelIdx = -1;
    // let highestScore = 0;
    // for (let i = 0; i < modelsSorted.length; i++) {
    //   if (modelsSorted[i].score > highestScore) {
    //     highestScoreModelIdx = i;
    //     highestScore = modelsSorted[i].score;
    //   }
    // }

    // console.log(modelsSorted)

    console.log(selected)

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding='none' style={{ width: '10%' }}></TableCell>
            <TableCell padding='none'>
              <TableSortLabel
                active={sortColumn === 'modelName'}
                direction={sortDirection}
                onClick={() => this.onHeaderClick('modelName')}
              >
                Model
              </TableSortLabel>
            </TableCell>
            <TableCell padding='none' style={{ textAlign: 'center' }}>
              <TableSortLabel
                active={sortColumn === 'trendScore'}
                direction={sortDirection}
                onClick={() => this.onHeaderClick('trendScore')}
              >
                Trend Score
              </TableSortLabel>
            </TableCell>
            <TableCell padding='none' style={{ textAlign: 'center' }}>
              <TableSortLabel
                active={sortColumn === 'trend'}
                direction={sortDirection}
                onClick={() => this.onHeaderClick('trend')}
              >
                Trend Prediction
              </TableSortLabel>
            </TableCell>
            <Hidden smDown>
              <TableCell padding='none' style={{ textAlign: 'center' }}>
                <TableSortLabel
                  active={sortColumn === 'score'}
                  direction={sortDirection}
                  onClick={() => this.onHeaderClick('score')}
                >
                  Accuracy Score
                </TableSortLabel>
              </TableCell>
              <TableCell padding='none' style={{ textAlign: 'center' }}>
                <TableSortLabel
                  active={sortColumn === 'percentageChange'}
                  direction={sortDirection}
                  onClick={() => this.onHeaderClick('percentageChange')}
                >
                  Price Prediction
                </TableSortLabel>
              </TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {modelsSorted.map((model, i) => (
            <TableRow key={i} style={{ backgroundColor: model.trendScore < threshold ? 'rgb(239,239,239)' : ''}}>
              <TableCell padding='none' onClick={() => onModelClick(model.modelIndex)}>
                <Checkbox
                  checked={selected.indexOf(model.modelIndex) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </TableCell>
              <TableCell padding='none' component="th" scope="row" onClick={() => onModelDetailsClick(model.modelIndex)}>
                <u><b>{model.modelName}</b></u>
              </TableCell>
              <TableCell padding='none' style={{ textAlign: 'center' }}>{(model.trendScore * 10).toFixed(2)}</TableCell>
              {
                model.trend === 1 &&
                <TableCell padding='none' style={{ color: 'green', textAlign: 'center' }}>
                  <ArrowUpwardIcon />
                </TableCell>
              }
              {
                model.trend === -1 &&
                <TableCell padding='none' style={{ color: 'red', textAlign: 'center' }}>
                  <ArrowDownwardIcon />
                </TableCell>
              }
              <Hidden smDown>
                <TableCell padding='none' style={{ textAlign: 'center' }}>{(model.score * 10).toFixed(2)}</TableCell>
                {
                  model.percentageChange > 0 &&
                  <TableCell padding='none' style={{ color: 'green', textAlign: 'center' }}>
                    <ArrowUpwardIcon /> {'+' + (model.percentageChange * 100).toFixed(2) + '%'}
                  </TableCell>
                }
                {
                  model.percentageChange < 0 &&
                  <TableCell padding='none' style={{ color: 'red', textAlign: 'center' }}>
                    <ArrowDownwardIcon /> {(model.percentageChange * 100).toFixed(2) + '%'}
                  </TableCell>
                }
                {
                  model.percentageChange === 0 &&
                  <TableCell padding='none' style={{ color: 'grey', textAlign: 'center' }}>
                    <RemoveIcon /> {(model.percentageChange * 100).toFixed(2) + '%'}
                  </TableCell>
                }
              </Hidden>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}



export default immutableToJsComponent(StockModelList);
