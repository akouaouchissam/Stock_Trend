import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import firebase from 'firebase';
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/css/main.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/css/util.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/bootstrap/css/bootstrap.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/fonts/iconic/css/material-design-iconic-font.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/animate/animate.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/css-hamburgers/hamburgers.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/animsition/css/animsition.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/select2/select2.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/daterangepicker/daterangepicker.css'


const styles = theme => ({
  loginRoot: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: '50px',
    paddingRight: '50px',
    width: '100%'
  },
  loginBtn: {
    width: '100%'
  }
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
  }

  signup(e){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{console.log(u)})
    .catch((error) => {
        console.log(error);
      })
  }
  render() {
    return (
      <div class="container-login100" style ={ { backgroundImage: "url("+"/bg-01.jpg"+")" } }>

       <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
       <form class="login100-form validate-form">
              <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ><img src="/row.png" height="85" width="100" align="centre"/></div>
       
       <span class="login100-form-title p-b-37">Stock Trend</span>

      <div class="wrap-input100 validate-input m-b-20">
       <input value={this.state.email} onChange={this.handleChange} type="email" name="email" class="input100" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
       <span class="focus-input100"></span>
      </div>

      <div class="wrap-input100 validate-input m-b-25">
      <input value={this.state.password} onChange={this.handleChange} type="password" name="password" class="input100" id="exampleInputPassword1" placeholder="Password" />
      <span class="focus-input100"></span>
      </div>
      
      <div class="container-login100-form-btn">
        <button type="submit" onClick={this.login} class="login100-form-btn">Login</button>
      </div>
      <div class="text-center  p-b-20" style ={ { marginTop: `20px` } }><span class="txt1">Or</span></div>
      <div class="container-login100-form-btn">
        <button onClick={this.signup} className="login100-form-btn">Signup</button>
      </div>
      <div class="text-center p-t-57 p-b-20"><span class="txt1"><b>Made By:</b> Akouaouch Issam <br /> <b>Supervised By:</b> Bouayad Anass</span></div>
 </form>
 
 </div>
 </div>
    );
  }
}

export default withStyles(styles)(LoginPage);