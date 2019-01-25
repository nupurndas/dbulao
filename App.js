/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,Button} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';



type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      isAlreadyLoggedin:false,
      name:'',
      photoUrl:'',
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
      '450067797788-i4mgtm3nmb3se0097n7d706errig8dol.apps.googleusercontent.com',
      
    });
  }
  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo.user);
      this.setState({ userInfo: userInfo,
      isAlreadyLoggedin:true,
      name:userInfo.user.name,
      photoUrl:userInfo.user.photo,
     });
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  _revokeAccess = async () => {
    //Remove your application from the user authorized applications.
    try {
      await GoogleSignin.revokeAccess();
      console.log('deleted');
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>Doctor Bulao</Text>
        {this.state.isAlreadyLoggedin ? 
        (
          <AlreadyLoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} signOut={this._signOut} />
        ):
        (
          <LoginPage signInFunc={this._signIn} />
        )}   
        
      </View>
    );
  }
}
const AlreadyLoggedInPage = props => {
  return(
    <View>
      <Text style={styles.header} >{props.name} is Logged In</Text>
      <Image style={styles.profileImage} source={{uri:props.photoUrl}}></Image>
      <Button title="Sign Out" onPress={props.signOut}></Button>
    </View>
  )
}

const LoginPage = props => {
  return(
    <View>
      <Text style={styles.header} >Sign In With Google</Text>
      <GoogleSigninButton
          style={styles.signInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={props.signInFunc}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  signInButton:{
      flex:1,
     
      width: 312, 
      height: 48, 
      flex:1,
  },
  profileImage:{
    flex:1,
    height:50,
    width:50,
    
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    overflow: 'hidden',
  },
});
