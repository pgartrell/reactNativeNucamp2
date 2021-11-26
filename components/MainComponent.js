import React, { Component } from "react";
import Home from "./HomeComponent";
import Directory from "./DirectoryComponent";
import CampsiteInfo from "./CampsiteInfoComponent";
import Constants from "expo-constants";
import {
  View,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  ToastAndroid
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import About from "./AboutComponent";
import Contact from "./ContactComponent";
import Reservation from "./ReservationComponent";
import Favorites from "./FavoritesComponent";
import Login from './LoginComponent';
import { Icon } from "react-native-elements";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from 'react-redux';
import { fetchCampsites, fetchComments, fetchPromotions,
    fetchPartners } from '../redux/ActionCreators';
import NetInfo from '@react-native-community/netinfo'

//These are action creators that have been thunked to send asychronous calls from fetch to the server. 
//mapDispatchToProps allows us to access the action creators as props 
const mapDispatchToProps = {
  fetchCampsites,
  fetchComments,
  fetchPromotions,
  fetchPartners
};


const DirectoryNavigator = createStackNavigator(
  {
    Directory: {
      screen: Directory,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <Icon
            name="list"
            type="font-awesome"
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      }),
    },
    CampsiteInfo: { screen: CampsiteInfo },
  },
  {
    initialRouteName: "Directory",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const HomeNavigator = createStackNavigator(
  {
    Home: { screen: Home },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="home"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

const AboutNavigator = createStackNavigator(
  {
    About: { screen: About }, //Navigation available/listed in the stack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="info-circle"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

const ContactNavigator = createStackNavigator(
  {
    Contact: { screen: Contact }, //Navigation available/listed in the stack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="address-card"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

const ReservationNavigator = createStackNavigator(
  {
    Reservation: { screen: Reservation }, //Navigation available/listed in the stack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="tree"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

const FavoritesNavigator = createStackNavigator(
  {
    Favorites: { screen: Favorites }, //Navigation available/listed in the stack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="heart"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: { screen: Login }, //Navigation available/listed in the stack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
      headerLeft: (
        <Icon
          name="sign-in"
          type="font-awesome"
          iconStyle={styles.stackIcon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);

//CustomDrawerContentComponent will recieve props as its parameter and will return the drawer
//SafeAreaView is for the iphone x and defines the area as safe area where nothing else will be layed out.
//This accounts for the specific layout of this iphone.
const CustomDrawerContentComponent = props => (
  <ScrollView>
  <SafeAreaView 
      style={styles.container}
      forceInset={{top: 'always', horizontal: 'never'}}>
      {/* First inner-<View> Will take up 1/3 of a space and the second will take up 2/3 */}
      <View style={styles.drawerHeader}>
                <View style={{flex: 1}}>
                    <Image source={require('./images/logo.png')} style={styles.drawerImage} />
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.drawerHeaderText}>NuCamp</Text>
                </View>

        {/* Spread out items in the props and passing them to draweritem component */}
      </View>
      <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const MainNavigator = createDrawerNavigator(
  {
    Login: {
      screen: LoginNavigator,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="sign-in"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="home"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },
    Directory: {
      screen: DirectoryNavigator,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="list"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },
    Reservation: {
      screen: ReservationNavigator,
      navigationOptions: {
        drawerLabel: 'Reserve Campsite',
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="tree"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },

    Favorites: {
      screen: FavoritesNavigator,
      navigationOptions: {
        drawerLabel: 'My Favorites',
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="heart"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },

    About: {
      screen: AboutNavigator,
      navigationOptions: {
        drawerLabel: "About Us",
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="info-circle"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },
    Contact: {
      screen: ContactNavigator,
      navigationOptions: {
        drawerLabel: "Contact Us",
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="address-card"
            type="font-awesome"
            size={24}
            color={tintColor} //Note the tint colors prop will change depending on if the screen is active. active=blue inactive=gray
          />
        ),
      },
    },
  },
  {
    initialRouteName:'Home', //Without this the login screen would appear first. We want the home THEN the login 
    drawerBackgroundColor: "#CEC8FF",
    //connecting drawer navigator to this MainNavigator
    contentComponent: CustomDrawerContentComponent
  }
);

//Connects top level navigator to application environment
const AppNavigator = createAppContainer(MainNavigator);

//Goal: render the CampsiteInfoComponent to the view when one of the campsites in the directory is clicked.
class Main extends Component {

  componentDidMount() {
    this.props.fetchCampsites();
    this.props.fetchComments();
    this.props.fetchPromotions();
    this.props.fetchPartners();

    //Fetch that returns a promise to display connection info
    NetInfo.fetch().then(connectionInfo => {
        (Platform.OS === 'ios')
          ? Alert.alert('Initial Network Connectivity Type:', connectionInfo.type )
          : ToastAndroid.show('Initial Network Connectivity Type:' + //Toast is a brief message that pops up for a few seconds then goes away
            connectionInfo.type, ToastAndroid.LONG)
    })

    //Listen to changes before the application loads. Used to unsubscribe the listener as its own return value
    //We use "this" to specifiy that we are using this on the parent class and not the local variable here in Main
    this.unsubscribeNetInfo = NetInfo.addEventListener(connectionInfo => {
      this.handleConnectivityChange(connectionInfo)
    })
}

//Stop listening to connection changes when the component unmounts 
componentWillUnmount() {
  this.unsubscribeNetInfo();
}

handleConnectivityChange = connectionInfo => {
  let connectionMsg = 'You are now connected to an active network'
  switch (connectionInfo.type) {
    case 'none':
      connectionMsg = 'No network connection is active'
      break
    case 'unkown' :
      connectionMsg = 'The network connection stat is now unkown'
      break
    case 'cellular':
        connectionMsg = 'You are now connected to a cellular network.';
        break;
    case 'wifi':
        connectionMsg = 'You are now connected to a WiFi network.';
        break;
  }
  (Platform.OS === 'ios')
    ? Alert.alert('Connection change:', connectionMsg)
    : ToastAndroid.show(connectionMsg, ToastAndroid.LONG)
}

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
        }}
      >
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#5637DD",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  drawerHeaderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  drawerImage: {
    margin: 10,
    height: 60,
    width: 60,
  },
  stackIcon: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 24,
  },
});
export default connect(null, mapDispatchToProps)(Main); //since we do not have mapStateToProps, the argument is null. 
