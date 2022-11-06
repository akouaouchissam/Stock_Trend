import firebase from 'firebase';
import {fromJS} from 'immutable';

export const updateUser = user => ({
  type: 'UPDATE_USER',
  user
});

export const getUserProfile = uid => {
  return (dispatch) => {
    if (uid !== null) {
      var docRef = firebase.firestore().collection('users').doc(uid);

      return docRef.get().then((doc) => {
        dispatch({
          type: 'GET_USER_PROFILE',
          userProfile: fromJS(doc.data())
        });
      });
    } else {
      dispatch({
        type: 'GET_USER_PROFILE',
        userProfile: null
      });
    }
  };
}

export const updateUserProfile = (userProfile) => {
  return (dispatch, getState) => {
    let state = getState();
    const uid = state.getIn(['auth', 'uid'], null);
    
    if (uid !== null){
      var docRef = firebase.firestore().collection('users').doc(uid);

      return docRef.update(userProfile).then(() => {
        dispatch({
          type: 'GET_USER_PROFILE',
          userProfile: userProfile //put result to reducer
        });
      });
    }
  }
}