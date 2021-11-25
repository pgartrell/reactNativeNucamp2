import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Input, CheckBox, Button, Icon } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { baseUrl } from "../shared/baseUrl";

class LoginTab extends Component {
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
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="sign-in"
        type="font-awesome"
        iconStyle={{ color: tintColor }}
      />
    ),
  };

  //This says if the remember box is checked then activete SecureStore
  //If checkbox is not checked, delete any user info in the SecureStore
  handleLogin() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        /*Remember there has to be a key value which is the 'userinfo' and it has to be a string. */
        "userinfo",
        JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      ).catch((error) => console.log("Could not save user info", error));
    } else {
      SecureStore.deleteItemAsync("userinfo").catch((error) =>
        console.log("Could not delete user info", error)
      );
    }
  }

  //This checks if there was any data saved under the key info. Logically if you were able to uncheck remember me, that means it was
  //checked in the first place and so this code works
  componentDidMount() {
    SecureStore.getItemAsync("userinfo").then((userdata) => {
      const userinfo =
        JSON.parse(
          userdata
        ); /*Turning it back into an object and storing the js object into the userinfo variable*/

      /*This checks to see if the userinfo variable contains a non null truthy value and if so update the login component state from the userinfo in the above object*/
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ password: userinfo.password });
        this.setState({ remember: true });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder="Username"
          leftIcon={{ type: "font-awesome", name: "user-o" }}
          //Whenever username text value is changed state will be updated
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username} //This will always reflect the state
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "font-awesome", name: "key" }}
          //Whenever username text value is changed state will be updated
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password} //This will always reflect the state
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <CheckBox
          title="Remember Me"
          center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button
            onPress={() => this.handleLogin()}
            title="Login"
            icon={
              <Icon
                name="sign-in"
                type="font-awesome"
                color="#fff"
                iconStyle={{ marginRight: 10 }}
              />
            }
            buttonStyle={{ backgroundColor: "#5637DD" }}
          />
        </View>
        <View style={styles.formButton}>
          <Button
            onPress={() => this.props.navigation.navigate("Register")}
            title="Register"
            type="clear"
            icon={
              <Icon
                name="user-plus"
                type="font-awesome"
                color="blue"
                iconStyle={{ marginRight: 10 }}
              />
            }
            titleStyle={{ color: "blue" }}
          />
        </View>
      </View>
    );
  }
}

class RegisterTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      remember: false,
      imageUrl: baseUrl + "images/logo.png",
    };
  }

  static navigationOptions = {
    title: "Register",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="user-plus"
        type="font-awesome"
        iconStyle={{ color: tintColor }}
      />
    ),
  };

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA); //Asking for permission to access camera/cameraroll
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    //If permission is granted for camera and cameral roll, we put the image in const (capturedImage)
    if (
      cameraPermission.status === "granted" &&
      cameraRollPermission.status === "granted"
    ) {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true, //Allows user to edit the photo
        aspect: [1, 1], //Picture ratio is 1 1
      });

      //Display image in the register tab. But first have to make sure image picking process was not cancelled
      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        this.setState({ imageUrl: capturedImage.uri });
      }
    }
  };

  //This says if the remember box is checked then activete SecureStore
  //If checkbox is not checked, delete any user info in the SecureStore
  handleRegister() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        /*Remember there has to be a key value which is the 'userinfo' and it has to be a string. */
        "userinfo",
        JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      ).catch((error) => console.log("Could not save user info", error));
    } else {
      SecureStore.deleteItemAsync("userinfo").catch((error) =>
        console.log("Could not delete user info", error)
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: this.state.imageUrl }}
              loadingIndicatorSource={require("./images/logo.png")} //In case it takes a while to load the image from the server, this default image will load
              style={styles.image}
            />
            <Button title="Camera" onPress={this.getImageFromCamera} />
          </View>
          <Input
            placeholder="Username"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            //Whenever username text value is changed state will be updated
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username} //This will always reflect the state
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder="Password"
            leftIcon={{ type: "font-awesome", name: "key" }}
            //Whenever username text value is changed state will be updated
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password} //This will always reflect the state
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder="First Name"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            //Whenever username text value is changed state will be updated
            onChangeText={(firstname) => this.setState({ firstname })}
            value={this.state.firstname} //This will always reflect the state
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder="Last Name"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            //Whenever username text value is changed state will be updated
            onChangeText={(lastname) => this.setState({ lastname })}
            value={this.state.lastname} //This will always reflect the state
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder="email"
            leftIcon={{ type: "font-awesome", name: "envelope-o" }}
            //Whenever username text value is changed state will be updated
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email} //This will always reflect the state
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <CheckBox
            title="Remember Me"
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleRegister()}
              title="Register"
              icon={
                <Icon
                  name="user-plus"
                  type="font-awesome"
                  color="#fff"
                  iconStyle={{ marginRight: 10 }}
                />
              }
              buttonStyle={{ backgroundColor: "#5637DD" }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: "#5637DD",
      inactiveBackgroundColor: "#CEC8FF",
      activeTintColor: "#fff",
      inactiveTintColor: "#808080",
      labelStyle: { fontSize: 16 },
    },
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 10,
  },
  formIcon: {
    marginRight: 10,
  },
  formInput: {
    padding: 8,
  },
  formCheckbox: {
    margin: 8,
    backgroundColor: null,
  },
  formButton: {
    margin: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
});

export default Login;
