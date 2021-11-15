import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';

class Directory extends Component {
    constructor(props){
        super(props)
        this.state = {
            campsites: CAMPSITES
        }
    }

    //Sets the text for header title 
    static navigationOptions = {
        title: 'Directory'
    }

render(){
        const {navigate} = this.props.navigation //inherent props that come with navigation library 
        const renderDirectoryItem = ({item}) => {
            return (
                <ListItem
                    title= {item.name}
                    subtitle= {item.description}
                    onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})} //says the name of the screen to navigate to, finds the campite id when pressed
                    leftAvatar={{ source: require('./images/react-lake.jpg')}}
                />

            )
        }
        return (
            <FlatList 
                data={this.state.campsites}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        )
    }
}

export default Directory