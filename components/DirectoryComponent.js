import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

//Recieves the state as a prop and returns a partner data from the state. We just need the partners data from the state
const mapStateToProps = state => {
    return {
        campsites: state.campsites
    };
};

class Directory extends Component {

    //Sets the text for header title 
    static navigationOptions = {
        title: 'Directory'
    }

render(){
        const {navigate} = this.props.navigation //inherent props that come with navigation library 
        const renderDirectoryItem = ({item}) => {
            return (
                <Tile
                    title= {item.name}
                    caption= {item.description}
                    featured
                    onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})} //says the name of the screen to navigate to, finds the campite id when pressed
                    leftAvatar={{ source: require('./images/react-lake.jpg')}}
                    imageSrc={{uri: baseUrl + item.image}}
                />

            )
        }

        if(this.props.campsites.isLoading) {
            return <Loading />
        }
        if(this.props.campsites.errMess){
            return(
                <View>
                    <Text>{props.campsites.errMess}</Text>
                </View>
            )
        }

        return (
            <FlatList 
                data={this.props.campsites.campsites}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        )
    }
}

export default connect(mapStateToProps)(Directory)