import React, { Component } from "react";
import { FlatList, View, Text, StyleSheet, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { SwipeRow } from "react-native-swipe-list-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { deleteFavorite } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  deleteFavorite: (campsiteId) => deleteFavorite(campsiteId),
};

class Favorites extends Component {
  //Since we know we are adding a stack navigator, we can add static navigationOptions
  static navigationOptions = {
    title: "My Favorites",
  };

  render() {
    const { navigate } = this.props.navigation;

    //Destructure current item from array. Return ListItem component
    //On firtst view style Swiping at least 100px will cause the options to show*
    //Second view is the default view, so we put the ListItem
    const renderFavoriteItem = ({ item }) => {
      return (
        <SwipeRow rightOpenValue={-100} style={styles.swipeRow}>
          <View style={styles.deleteView}>
            <TouchableOpacity
              style={styles.deleteTouchable}
              onPress={() =>
                Alert.alert(
                  "Delete Favorite?",
                  "Are you sure you wish to delete the favorite campsite " +
                    item.name +
                    "?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log(item.name + "Not Deleted"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => this.props.deleteFavorite(item.id),
                    },
                  ],
                  { cancelable: false } // They cannot exit alert box by tapping outside. They have to press delete or cancel
                )
              }
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <View>
            <ListItem
              title={item.name}
              subtitle={item.description}
              leftAvatar={{ source: { uri: baseUrl + item.image } }}
              onPress={() => navigate("CampsiteInfo", { campsiteId: item.id })}
            />
          </View>
        </SwipeRow>
      );
    };

    //This checks if campsites data is still loading and if so, return Loading component
    if (this.props.campsites.isLoading) {
      return <Loading />;
    }
    //This checks if campsites has error message and if so, return the error message in a view component with text around the error
    if (this.props.campsites.errMess) {
      return (
        <View>
          <Text>{this.props.campsites.errMess}</Text>
        </View>
      );
    }
    //Whent this point of the code is reached that means there is no error message and the isLoading is false
    return (
      <Animatable.View animation="fadeInRightBig" duration={2000}>
        <FlatList
          //Trying to match the id of the array of campsites with the id of the array of favorites
          data={this.props.campsites.campsites.filter((campsite) =>
            this.props.favorites.includes(campsite.id)
          )}
          renderItem={renderFavoriteItem}
          //This passes each item into a function and extracts the id from it as a string to use as the unique key for each item
          keyExtractor={(item) => item.id.toString()}
        />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  deleteView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  deleteTouchable: {
    backgroundColor: "red",
    height: "100%",
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    width: 100,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
