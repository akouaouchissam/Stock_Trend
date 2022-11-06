import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExitToApp from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
import HomeIcon from '@material-ui/icons/Home';
import FavouriteIcon from '@material-ui/icons/Favorite';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import {Home, Details, ModelDetails, Settings, Login} from './pages';
import {connect} from 'react-redux';
import {updateUser, getUserProfile} from './actions/auth';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Input from '@material-ui/core/Input';
import firebase, { db }  from 'firebase';
import './App.css';
import { Transform } from 'stream';

const google = window.google;
google.charts.load('current', {packages: ['corechart']});

const mapStateToProps = state => ({
  uid: state.get('auth').get('uid'),
  userProfile: state.get('auth').get('userProfile')
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => {dispatch(updateUser(user))},
  getUserProfile: uid => {dispatch(getUserProfile(uid))}
});

const drawerWidth = 240;

const styles = theme => ({
  loginIcons:{
    transform:'scale(1.8)',
    position: 'absolute',
    top:'0px'
  },
  loginOptionContainer:{
    position:'relative',
    height: '150px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: '50px',
    marginRight: '50px'
  },
  loginOption:{
    position:'absolute'
  },
  root: {
    display: 'flex',
    minHeight: '100%',
    width: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#bd59d4'
  },
  drawerIcon: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  grow:{
    flexGrow:0.2
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 500,
    },
  },
});

class AppBar extends Component {
  render() {
    const {onMobileDrawerToggle, onLogoutBtnClick, history, location, loading, classes} = this.props;

    let appBarIcon;
    // if (location.pathname === '/') {
      appBarIcon =
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMobileDrawerToggle}
            className={classes.drawerIcon}
          >
            <MenuIcon />
          </IconButton>;
    // } else {
    //   appBarIcon =
    //       <IconButton
    //         color="inherit"
    //         aria-label="back"
    //         onClick={history.goBack}
    //       >
    //         <ArrowBackIcon />
    //       </IconButton>;
    // }

    let pageTitle;
    if (location.pathname === '/favourite'){
      pageTitle = 'Favourite'
    }
    else if (location.pathname === '/recent'){
      pageTitle = 'Recent'
    }
    else if (location.pathname === '/settings'){
      pageTitle = 'Settings'
    }
    else {
      pageTitle = 'Stock Trend'
    }

    return (
      <MaterialAppBar className={classes.appBar}>
        <Toolbar>
          {appBarIcon}
          <Typography variant="title" color="inherit" noWrap>
          <img src="/row.png" height="40" width="48" align="centre"/>
            {" "+pageTitle}
          </Typography>
          <div className={classes.grow}/>
          {
            location.pathname === '/' &&
            <IconButton
			  style={{marginLeft: 'auto'}}
              color="inherit"
              onClick={onLogoutBtnClick}
            >
              <ExitToApp />
            </IconButton>
          }
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </MaterialAppBar>
    );
  }
}
AppBar = withRouter(AppBar);

class AppDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 1
    }
  }

  handleListItemClick = () => {
    console.log('test');
  }
  
  onDrawerBtnClick = (link) => {
    if (this.props.location.pathname !== (link))
    {
      this.props.history.push(link);
    }
    
    if (this.props.device === 'mobile') {
      this.props.mobileDrawerToggle();
    }
  };
  
  render(){
    const {device, classes, location} = this.props;

    // let HomeIcon;
    // if (location.pathname === '/') {
    //   HomeIcon =
    //     <ListItem button key={'Home'} onClick={() => this.onDrawerBtnClick('/')} disabled={true}>
    //       <ListItemIcon><HomeIcon /></ListItemIcon>
    //       <ListItemText primary={'Home'} />
    //     </ListItem>;
    // } else {
    //   HomeIcon =
    //     <ListItem button key={'Home'} onClick={() => this.onDrawerBtnClick('/')}>
    //       <ListItemIcon><HomeIcon /></ListItemIcon>
    //       <ListItemText primary={'Home'} />
    //     </ListItem>;
    // }

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List component="nav">
          <ListItem button key={'Home'} onClick={() => this.onDrawerBtnClick('/')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
          <ListItem button key={'Favourite'} onClick={() => this.onDrawerBtnClick('/favourite')}>
            <ListItemIcon><FavouriteIcon /></ListItemIcon>
            <ListItemText primary={'Favourite'} />
          </ListItem>
          <ListItem button key={'Settings'} onClick={() => this.onDrawerBtnClick('/settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItem>
        </List>
      </div>
    );

    if (device === 'mobile') {
      return (
        <Drawer
          variant="temporary"
          open={this.props.mobileOpenStatus}
          onClose={this.props.mobileDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawer}
        </Drawer>
      );
    } else {
      return (
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {drawer}
        </Drawer>
      );
    }
  }
}
AppDrawer = withRouter(AppDrawer);

function FacebookIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Artboard" transform="translate(-137.000000, -47.000000)" fill="#475993" fill-rule="nonzero">
              <g id="facebook" transform="translate(137.000000, 47.000000)">
                  <path d="M20.7658696,0 L3.2340717,0 C1.44797877,0 0,1.44790943 0,3.23404797 L0,20.7658346 C0,22.5519731 1.44792006,23.9998826 3.2340717,23.9998826 L11.8806708,23.9998826 L11.8954071,15.423623 L9.66728231,15.423623 C9.37772179,15.423623 9.14270338,15.189487 9.14158788,14.8999286 L9.13090255,12.1354443 C9.12978705,11.8443007 9.36550999,11.6076989 9.6566557,11.6076989 L11.8807295,11.6076989 L11.8807295,8.93650499 C11.8807295,5.83660969 13.7739692,4.14869321 16.5392957,4.14869321 L18.8084592,4.14869321 C19.098783,4.14869321 19.3342124,4.38406215 19.3342124,4.6744425 L19.3342124,7.00546983 C19.3342124,7.29573275 19.0989591,7.53104299 18.8087528,7.53121912 L17.4161968,7.53186493 C15.9123256,7.53186493 15.6211211,8.24648473 15.6211211,9.29522393 L15.6211211,11.6077576 L18.9256455,11.6077576 C19.2405103,11.6077576 19.484805,11.8826971 19.4476999,12.1953873 L19.1200362,14.9598716 C19.0886848,15.2244195 18.8643517,15.4237404 18.5979818,15.4237404 L15.6358575,15.4237404 L15.6211211,24 L20.765987,24 C22.5520799,24 24,22.5520906 24,20.7660107 L24,3.23404797 C23.9999413,1.44790943 22.5520212,0 20.7658696,0 Z" id="Shape"></path>
              </g>
          </g>
      </g>
    </SvgIcon>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      googleChartsLoaded: false,
      mobileDrawerOpen: false,
      loading: false
    };
    this.authListener = this.authListener.bind(this);
  }
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }
  render() {
    return (
     <div>{this.state.user ?  ( <Home/>) : (<Login />)}</div>
    )}

  onSignInAnonymouslyClick = () => {
    // var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInAnonymously();
  };

  onLogoutBtnClick = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  };

  onGoogleChartsLoaded = () => {
    this.setState({googleChartsLoaded: true});
  };

  onMobileDrawerToggle = () => {
    this.setState(state => ({mobileDrawerOpen: !state.mobileDrawerOpen}));
  };

  setLoading = (loading) => {
    this.setState({loading: loading});
  };

  componentDidMount() {
    this.unsubscribeAuthChanged = firebase.auth().onAuthStateChanged(user => {
      this.props.updateUser(user);

      if (user) {
        const uid = user.uid;
        this.props.getUserProfile(uid);
      } else {
        this.props.getUserProfile(null);
      }
    });

    google.charts.setOnLoadCallback(this.onGoogleChartsLoaded);
  }

  componentWillUnmount() {
    this.unsubscribeAuthChanged();
  }

  render() {
    const {uid, classes} = this.props;

    const drawer = (
      <div></div>
    );

    if (!uid) {
      return (
        <Login onSignInFacebookClick={this.onSignInFacebookClick} />
      );
    }

    if (!this.state.googleChartsLoaded) {
      return null;
    }

    return (
      <div className={classes.root}>
        <Router>
          <div className={classes.root}>
            <AppBar onMobileDrawerToggle={this.onMobileDrawerToggle} onLogoutBtnClick={this.onLogoutBtnClick} loading={this.state.loading} classes={classes} />
            <Hidden mdUp>
              <AppDrawer
                mobileOpenStatus={this.state.mobileDrawerOpen}
                mobileDrawerToggle={this.onMobileDrawerToggle}
                device="mobile"
                classes={classes} />
              {/* <Drawer
                variant="temporary"
                open={this.state.mobileDrawerOpen}
                onClose={this.onMobileDrawerToggle}
                classes={{
                  paper: classes.drawerPaper
                }}
                ModalProps={{
                  keepMounted: true
                }}
              >
                {drawer}
              </Drawer> */}
            </Hidden>
            <Hidden smDown>
              <AppDrawer
                device="desktop"
                classes={classes} />
              {/* <Drawer
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                {drawer}
              </Drawer> */}
              
            </Hidden>
            <div className={classes.container}>
              <div className={classes.toolbar} />
                <main className={classes.content}>
                <Route
                  path="/"
                  exact
                  render={(props) => <Home {...props} setLoading={this.setLoading} />} />
                <Route
                  path="/favourite"
                  render={(props) => <Home {...props} favouriteOnly={true} setLoading={this.setLoading} />} />
                <Route
                  path="/recent"
                  render={(props) => <Home {...props} recentOnly={true} setLoading={this.setLoading} />} />
                <Route
                  path="/settings"
                  render={(props) => <Settings {...props} setLoading={this.setLoading} />} />
                <Route
                  path="/stockDetails/:stockCode"
                  render={(props) => <Details {...props} setLoading={this.setLoading} />} />
                <Route
                  path="/modelDetails/:stockCode/:modelIdx"
                  render={(props) => <ModelDetails {...props} setLoading={this.setLoading} />} />
                </main>
              </div>
            </div>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(App));
