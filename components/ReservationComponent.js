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

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campers: 1,
      hikeIn: false,
      date: new Date(),
      showCalendar: false,
    //   showModal: false,
    };
  }

  static navigationOptions = {
    title: "Reserve Campsite",
  };

//   toggleModal() {
//     this.setState({ showModal: !this.state.showModal });
//   }

  //This echos back the input with the console.log and resets the state of the form
  handleReservation() {
    console.log(JSON.stringify(this.state));
    // this.toggleModal();
  }

  resetForm() {
    this.setState({
      campers: 1,
      hikeIn: false,
      date: new Date(),
      showCalendar: false,
    //   showModal: false,
    });
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
              // style={styles.formItem}
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
                      onPress: () => this.resetForm(),
                    },
                  ],
                  { cancelable: false } // They cannot exit alert box by tapping outside. They have to press delete or cancel
               )
            }

            />
          </View>
        </Animatable.View>
        {/* <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal} //If show modal is false then visible will be set to false if it is true than it will be set to true
          onRequestClose={() => this.toggleModal} //Will close the Modal if the back button is pressed
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Search Campsite Reservations</Text>
            <Text style={styles.modalText}>
              Number of Campers: {this.state.campers}
            </Text>
            <Text style={styles.modalText}>
              Hike-In?: {this.state.hikeIn ? "Yes" : "No"}
            </Text>
            <Text style={styles.modalText}>
              Date: {this.state.date.toLocaleDateString("en-US")}
            </Text>
            <Button
              onPress={() => {
                this.toggleModal();
                this.resetForm();
              }}
              color="#5637DD"
              title="Close"
            />
          </View>
        </Modal> */}
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
//   modal: {
//     justifyContent: "center",
//     margin: 20,
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     backgroundColor: "#5637DD",
//     textAlign: "center",
//     color: "#fff",
//     marginBottom: 20,
//   },
//   modalText: {
//     fontSize: 18,
//     margin: 10,
//   },
});

export default Reservation;
