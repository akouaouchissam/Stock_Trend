import React, {Component} from 'react';
import immutableToJsComponent from '../immutableToJsComponent';
import {withStyles} from '@material-ui/core/styles';

import PropTypes from 'prop-types';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const ExpansionPanel = withStyles({
  root: {
    border: '0px',
    boxShadow: 'none',
    backgroundColor:'transparent', 
    marginTop:'0',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    // borderBottom: '1px solid rgba(0,0,0,.125)',
    // marginBottom: -1,
    padding: '0',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    marginTop:'0',
    marginBottom: '0',
    '&$expanded': {
      marginTop: '0',
      marginBottom: '0'
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);


const styles = theme => ({
  // industryText:{
  //   textAlign
  // }
  industryTag:{
    color:'grey', 
    marginBottom:'0'
  },
  stockSector:{
    color:'grey',
    marginTop:'0',
    marginBottom:'0'
  },
  expansionSummary:{
    padding:'0',
    marginTop: '0'
  },
  expansionPanel:{
    border:'0px', 
    boxShadow:'none', 
    backgroundColor:'transparent', 
    marginTop:'0'
  }
});

class StockDetails extends Component {

  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };


  render() {
    const {stock, classes} = this.props;
    const {expanded} = this.state;
    return (
      <div>
        <h4 className={classes.stockSector}> {stock.sector} </h4>
        {/* <div style={{marginBottom:'10px'}}> */}
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <h2 style={{marginTop:'0px', marginBottom:'0px'}}>{stock.name} ({stock.code})</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{padding:'0'}}>
              <Typography variant="body2" style={{paddingBottom:'10px'}}>{stock.description}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        {/* </div> */}
      </div>
    );
  }
}

StockDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(immutableToJsComponent(StockDetails));
