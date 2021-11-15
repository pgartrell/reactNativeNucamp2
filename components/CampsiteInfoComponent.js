import React, {Component} from "react";
import {Text, View, ScrollView, FlatList} from 'react-native'
import { Card, Icon } from "react-native-elements";
import {CAMPSITES} from "../shared/campsites"
import {COMMENTS} from '../shared/comments'


//Using props instead of the destructured {campsite} like before bc now we have multiple props to pass
//if true/ if it is a campsite return the card if not return the View
function RenderCampsite(props) {

    const {campsite} = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={require('./images/react-lake.jpg')}
            >
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <Icon 
                    name= {props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.favorite ? 
                        console.log('Already set as a favorite') : props.markFavorite()} //If already a favorite then just console log it, if not, mark as favorite
                />
            </Card>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style = {{margin:10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{`--${item.author}, ${item.date}`}</Text>
            </View>
        )
    }

    return (
        <Card title='Comments'> 
            <FlatList //Use Flatlist since it expects an array and the comments are in the form of an array. This comments list comes from the below comments that have been filtered.
                data={comments} //give data the comments array for its prop
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()} //set keyExtracotr to use the comments id for the unique key
            />
        </Card>
    )
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES,
            comments: COMMENTS,
            favorite: false
        };
    }

    markFavorite() {
        this.setState({favorite: true})
    }//toggles the favorite property from true to false

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.state.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.state.comments.filter(comment => comment.campsiteId === campsiteId) //filtering out the comments for the particular campsite we want
                                                                                                // to render using the campsite id into a new array called comments
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite} 
                    favorite={this.state.favorite}
                    markFavorite={() => this.markFavorite()}
                />
                <RenderComments comments ={comments} /> 
            </ScrollView>
            //Passed the above filtered comments array into the RenderComments component
        )
    }
}

export default CampsiteInfo;