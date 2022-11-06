import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import immutableToJsComponent from '../immutableToJsComponent';

class StockTimeFrame extends Component {
  constructor(props) {
    super(props);
	this.state = {timeframe: '3m'}
  }

  render() {
    const {onTimeFrameClick} = this.props;

    return (
	  <React.Fragment>
	    <Hidden smDown>
				<div>
					<InputLabel htmlFor="timeframe" style={{marginRight: '1vw'}}>Time Frame</InputLabel>
					<Button onClick={() => onTimeFrameClick('1w')}>1 Week</Button>
					<Button onClick={() => onTimeFrameClick('1m')}>1 Month</Button>
					<Button onClick={() => onTimeFrameClick('3m')}>3 Months</Button>
					<Button onClick={() => onTimeFrameClick('6m')}>6 Months</Button>
					<Button onClick={() => onTimeFrameClick('1y')}>1 Year</Button>
					<Button onClick={() => onTimeFrameClick('2y')}>2 Years</Button>
					<Button onClick={() => onTimeFrameClick('max')}>Max</Button>
				</div>
	    </Hidden>
	    <Hidden mdUp>
				<div>
					<InputLabel htmlFor="timeframe" style={{marginRight: '5vw'}}>Time Frame</InputLabel>
					<Select
						onChange={(event) => { this.setState({timeframe: event.target.value}); onTimeFrameClick(event.target.value); }}
						value={this.state.timeframe}
							inputProps={{id: 'timeframe'}}
					>
						<MenuItem value={'1w'}>1 Week</MenuItem>
						<MenuItem value={'1m'}>1 Month</MenuItem>
						<MenuItem value={'3m'}>3 Months</MenuItem>
						<MenuItem value={'6m'}>6 Months</MenuItem>
						<MenuItem value={'1y'}>1 Year</MenuItem>
						<MenuItem value={'2y'}>2 Years</MenuItem>
						<MenuItem value={'max'}>Max</MenuItem>
					</Select>
				</div>
	    </Hidden>
	  </React.Fragment>
	);
  }
}

export default immutableToJsComponent(StockTimeFrame);
