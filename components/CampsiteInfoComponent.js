import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";

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
  postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text) 
};

//Using props instead of the destructured {campsite} like before bc now we have multiple props to pass
//if true/ if it is a campsite return the card if not return the View
function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
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
            } //If already a favorite then just console log it, if not, mark as favorite
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
    <Card title="Comments">
      <FlatList //Use Flatlist since it expects an array and the comments are in the form of an array. This comments list comes from the below comments that have been filtered.
        data={comments} //give data the comments array for its prop
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()} //set keyExtracotr to use the comments id for the unique key
      />
    </Card>
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
    this.props.postComment(campsiteId, rating, author, text)
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
                  this.handleComment(campsiteId,this.state.rating,this.state.author,this.state.text);
                  
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
