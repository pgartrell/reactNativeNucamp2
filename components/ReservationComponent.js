import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";
import * as Notifications from 'expo-notifications';

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campers: 1,
      hikeIn: false,
      date: new Date(),
      showCalendar: false,
    };
  }

  static navigationOptions = {
    title: "Reserve Campsite",
  };

  //This echos back the input with the console.log and resets the state of the form
  handleReservation() {
    console.log(JSON.stringify(this.state));
  }

  resetForm() {
    this.setState({
      campers: 1,
      hikeIn: false,
      date: new Date(),
      showCalendar: false,
    });
  }

  //This makes sure it the notification alert is shown
  async presentLocalNotification(date) {
    function sendNotification() {
      Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true
          })
      })
    
    //This is when to send notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your Campsite Reservation Search',
          body: `Search for ${date} requested` //back tick syntax to pass in the date variable passed into the present local notification function
        },
        trigger: null //Cause the notification to fire immediately (null) or give it a time value
      })
    }

    //Check if we already have notifications permissions from the device
    //If we do not, we request them and wait for permissions. If we do, send the notification.
    //If permission is not granted we do nothing
    let permissions = await Notifications.getPermissionsAsync(); 
    if(!permissions.granted) {
      permissions = await Notifications.requestPermissionsAsync();
    }
    if (permissions.granted) {
      sendNotification()
    }
  }

  render() {
    return (
      <ScrollView>
        <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Campers</Text>
            {/* The onValueChange will update the states camper property item value */}
            <Picker
              style={styles.formItem}
              selectedValue={this.state.campers}
              onValueChange={(itemValue) =>
                this.setState({ campers: itemValue })
              }
            >
              {/* When a user selects an item in the picker items it will trigger the onValueChange prop to update the components state to that 
                    items value. The selected value prop will also be updated to match the current state so the picker knows which item to 
                    display.  */}
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Hike-In</Text>
            <Switch
              style={styles.formItem}
              value={this.state.hikeIn}
              trackColor={{ true: "#5637DD", false: null }}
              onValueChange={(value) => this.setState({ hikeIn: value })}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date</Text>
            <Button
              onPress={() =>
                this.setState({ showCalendar: !this.state.showCalendar })
              }
              title={this.state.date.toLocaleDateString("en-US")}
              color="#5637DD"
              accessibilityLabel="Tap me to select a reservation date"
            />
          </View>
          {/* This says if the calendar is not showing then the DateTimePicker won't show at all. Since the 
                logical && operator does not evaluate the right side if the left side is already false. */}
          {this.state.showCalendar && (
            <DateTimePicker
              style={styles.formItem}
              value={this.state.date}
              mode={"date"}
              display="default"
              onChange={(event, selectedDate) => {
                selectedDate &&
                  this.setState({ date: selectedDate, showCalendar: false });
              }}            
            />
          )}
          <View style={styles.formRow}>
            <Button
            title="Search"
            color="#5637DD"
            accessibilityLabel="Tap me to search available campsites to reserve"
              onPress={() => 
               Alert.alert(
                "Begin Search?",
                `Number of Campers: ${this.state.campers},
                \nHike-In: ${this.state.hikeIn}
                \nDate: ${this.state.date.toLocaleDateString("en-US")}`,

                [
                    {
                      text: "Cancel",
                      onPress: () => this.resetForm(),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        this.presentLocalNotification(this.state.date.toLocaleDateString('en-US'))
                        this.resetForm()
                      }
                    },
                  ],
                  { cancelable: false } // They cannot exit alert box by tapping outside. They have to press delete or cancel
               )
            }

            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
});

export default Reservation;
