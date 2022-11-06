import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import immutableToJsComponent from '../immutableToJsComponent';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="title">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class ChartSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snakesShow: props.snakesShow,
      rollingPredictShow: props.rollingPredictShow,
      chartSettingsOpen: props.chartSettingsOpen
    };
  }
  
  handleSnakeShowChange = event => {
    this.setState({ snakesShow: event.target.checked });
  };

  handleRollingPredictShowChange = event => {
    this.setState({ rollingPredictShow: event.target.checked });
  };

  render() {
    const {onChartSettingsSave, onChartSettingsClose} = this.props;
    const {snakesShow, rollingPredictShow} = this.state
    return (
      <React.Fragment>
        <Dialog
          open={this.state.chartSettingsOpen}
          onClose={() => onChartSettingsClose()}
          snakesShow={snakesShow}
          rollingPredictShow={rollingPredictShow}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle onClose={() => onChartSettingsClose()}>
            Chart Settings
          </DialogTitle>

          <DialogContent>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Switch
                    checked={snakesShow}
                    onChange={this.handleSnakeShowChange}
                  />
                }
                label="Show Snakes"
                labelPlacement="start"/>
              <FormControlLabel
                control={
                  <Switch
                    checked={rollingPredictShow}
                    onChange={this.handleRollingPredictShowChange}
                  />
                }
                label="Show Rolling Predict"
                labelPlacement="start"/>
            </FormControl>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => onChartSettingsSave({snakesShow, rollingPredictShow})} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default immutableToJsComponent(ChartSettings);
