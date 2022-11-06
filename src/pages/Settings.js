import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import {updateUserProfile} from '../actions/auth';

const styles = () => ({

});

const mapStateToProps = (state) => ({
  advancedUser: state.getIn(['auth', 'userProfile', 'advanced'], false),
  snakesShow: state.getIn(['auth', 'userProfile', 'snakesShow'], false),
  rollingPredictShow: state.getIn(['auth', 'userProfile', 'rollingPredictShow'], false)
});

const mapDispatchToProps = (dispatch) => ({
  updateUserProfile: userProfile => dispatch(updateUserProfile(userProfile))
});

class SettingsPage extends Component {
  onUserProfileChange = (key, value) => {
    this.props.setLoading(true);
    this.props.updateUserProfile({[key]: value})
        .then(() => {
          this.props.setLoading(false);
        });
  };
  
  render() {
    const {advancedUser, snakesShow, rollingPredictShow} = this.props;

    return (
      <div>
        <div>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Switch
                  checked={advancedUser}
                  onChange={(event) => this.onUserProfileChange('advanced', event.target.checked)}
                  value={advancedUser}
                />
              }
              label="Advanced User"
              labelPlacement="start"
            />
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Switch
                  checked={snakesShow}
                  onChange={(event) => this.onUserProfileChange('snakesShow', event.target.checked)}
                  value={snakesShow}
                />
              }
              label="Show Snakes"
              labelPlacement="start"
            />
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Switch
                  checked={rollingPredictShow}
                  onChange={(event) => this.onUserProfileChange('rollingPredictShow', event.target.checked)}
                  value={rollingPredictShow}
                />
              }
              label="Show Rolling Predict"
              labelPlacement="start"
            />
          </FormControl>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SettingsPage));
