import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      remember: false,
    };
  }

  static navigationOptions = {
    title: "Login",
  };

  //This says if the remember box is checked then activete SecureStore
  //If checkbox is not checked, delete any user info in the SecureStore  
  handleLogin() {
    console.log(JSON.stringify(this.state))
    if (this.state.remember) {
        SecureStore.setItemAsync( /*Remember there has to be a key value which is the 'userinfo' and it has to be a string. */
            'userinfo',
            JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        ).catch(error => console.log('Could not save user info', error))
    } else {
        SecureStore.deleteItemAsync('userinfo').catch(
            error => console.log('Could not delete user info', error)
        );
    }
}  

  //This checks if there was any data saved under the key info. Logically if you were able to uncheck remember me, that means it was
  //checked in the first place and so this code works
  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
        .then(userdata => {
            const userinfo = JSON.parse(userdata) /*Turning it back into an object and storing the js object into the userinfo variable*/
            
            /*This checks to see if the userinfo variable contains a non null truthy value and if so update the login component state from the userinfo in the above object*/
            if (userinfo) {
                this.setState({username: userinfo.username})
                this.setState({password: userinfo.password})
                this.setState({remember: true})
            }
        });
}

render() {
    return (
        <View style={styles.container}>
            <Input
                placeholder='Username'
                leftIcon={{type: 'font-awesome', name: 'user-o'}}
//Whenever username text value is changed state will be updated
                onChangeText={username => this.setState({username})}
                value={this.state.username}//This will always reflect the state
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input
                placeholder='Password'
                leftIcon={{type: 'font-awesome', name: 'key'}}
//Whenever username text value is changed state will be updated
                onChangeText={password => this.setState({password})}
                value={this.state.password}//This will always reflect the state
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <CheckBox
                title='Remember Me'
                center
                checked={this.state.remember}
                onPress={() => this.setState({remember: !this.state.remember})}
                containerStyle={styles.formCheckbox}
            />
            <View style={styles.formButton}>
                <Button
                    onPress={() => this.handleLogin()}
                    title='Login'
                    color='#5637DD'
                />
            </View>
        </View>
    );
}
}



const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 20,
  },
  formIcon: {
    marginRight: 10,
  },
  formInput: {
    padding: 10,
  },
  formCheckbox: {
    margin: 10,
    backgroundColor: null,
  },
  formButton: {
    margin: 40,
  },
});

export default Login;
