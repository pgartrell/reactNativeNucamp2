import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
  PanResponder,
  Alert,
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

//Recieves the state as a prop and returns a partner data from the state. We just need the partners data from the state
const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
  postComment: (campsiteId, rating, author, text) =>
    postComment(campsiteId, rating, author, text),
};

//Using props instead of the destructured {campsite} like before bc now we have multiple props to pass
//if true/ if it is a campsite return the card if not return the View
function RenderCampsite(props) {
  const { campsite } = props;

  const view = React.createRef();

  //dx is a gesture across the x axis. Returns true if the value is less than -200 and false if it is not
  const recognizeDrag = ({ dx }) => (dx < -200 ? true : false);

//e is for event. Required to get to the second Paramenter. Second parameter an object ,gestureState, holds information about the gesture that ended
//if statement for the gesture to go if it was less than 200px
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      view.current.rubberBand(1000)
      .then(endState => console.log(endState.finished ? 'finished' : 'canceled'))
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + campsite.name + " to favorites?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log("Cancel Pressed"),
            },

            //Check if it is a favorite and console.log if a favorite. If not, calls the mark favorite even handler
            {
              text: "OK",
              onPress: () =>
                props.favorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite(),
            },
          ],
          { cancelable: false } //So the user cannot tap outside of the alert box to close it
        );
      }
      return true;
    },
  });

  if (campsite) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={view}
        {...panResponder.panHandlers} //Connects panhandler to the component.  Question: why do we need to spread it out
      >
        <Card
          featuredTitle={campsite.name}
          image={{ uri: baseUrl + campsite.image }}
        >
          <Text style={{ margin: 10 }}>{campsite.description}</Text>
          <View style={styles.cardRow}>
            <Icon
              name={props.favorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              raised
              reverse
              onPress={() =>
                props.favorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite()
              }
            />

            <Icon
              name="pencil"
              type="font-awesome"
              color="#5637DD"
              raised
              reverse
              onPress={() => props.onShowModal()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          startingValue={5}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
          read-only
        />
        <Text style={{ fontSize: 12 }}>{`--${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList //Use Flatlist since it expects an array and the comments are in the form of an array. This comments list comes from the below comments that have been filtered.
          data={comments} //give data the comments array for its prop
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()} //set keyExtracotr to use the comments id for the unique key
        />
      </Card>
    </Animatable.View>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId, rating, author, text) {
    this.props.postComment(campsiteId, rating, author, text);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    });
  }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  } //toggles the favorite property from true to false

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter(
      (campsite) => campsite.id === campsiteId
    )[0];
    const comments = this.props.comments.comments.filter(
      (comment) => comment.campsiteId === campsiteId
    ); //filtering out the comments for the particular campsite we want
    // to render using the campsite id into a new array called comments
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          //includes returns boolean true or false, so you can use it to see if the campsite being rendered exists in the favorits array
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal} //If show modal is false then visible will be set to false if it is true than it will be set to true
          onRequestClose={() => this.toggleModal} //Will close the Modal if the back button is pressed
        >
          <View style={styles.modal}>
            <Rating
              type="star"
              showRating
              startingValue={5}
              imageSize={40}
              onFinishRating={(rating) => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(author) => this.setState({ author: author })}
              value={this.state.author}
            />

            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(comment) => this.setState({ comment: comment })}
              value={this.state.comment}
            />

            <View>
              <Button
                onPress={() => {
                  this.handleComment(
                    campsiteId,
                    this.state.rating,
                    this.state.author,
                    this.state.text
                  );
                }}
                color="#5637DD"
                title="Submit"
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#808080"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
      //Passed the above filtered comments array into the RenderComments component
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo); //This is so the About component now recieves the partners props from the redux store
