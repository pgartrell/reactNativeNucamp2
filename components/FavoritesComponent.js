import React, {Component} from 'react' 
import { FlatList, View, Text } from 'react-native'
import {ListItem} from 'react-native-elements' 
import { connect } from 'react-redux'
import {Loading} from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl'
import CampsiteInfoComponent from './CampsiteInfoComponent'

const mapStateToProps = state => {
    return{
        campsites: state.campsites,
        favorites: state.favorites
    }
}


class Favorites extends Component {
    //Since we know we are adding a stack navigator, we can add static navigationOptions
    static navigationOptions={
        title: 'My Favorites'
    }

    render(){
        const { navigate } = this.props.navigation

        //Destructure current item from array. Return ListItem component
        const renderFavoriteItem = ({item}) => {
            return(
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}}
                    onPress={() => navigate('CampsiteInfo',{campsiteId: item.id})}
                />
            )
        }

        //This checks if campsites data is still loading and if so, return Loading component
        if(this.props.campsites.isLoading) {
            return <Loading />
        }
        //This checks if campsites has error message and if so, return the error message in a view component with text around the error
        if(this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            )
        }
        //Whent this point of the code is reached that means there is no error message and the isLoading is false
        return(
            <FlatList
                //Trying to match the id of the array of campsites with the id of the array of favorites
                data={this.props.campsites.campsites.filter(
                    campsite => this.props.favorites.includes(campsite.id)
                )}
                renderItem={renderFavoriteItem}
                //This passes each item into a function and extracts the id from it as a string to use as the unique key for each item
                keyExtractor={item => item.id.toString()}
            />
        )
    }
}

export default connect(mapStateToProps)(Favorites)