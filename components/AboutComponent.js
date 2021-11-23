import React, { Component } from 'react';
import { ScrollView, Text, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable'

//Recieves the state as a prop and returns a partner data from the state. We just need the partners data from the state
const mapStateToProps = state => {
    return {
        partners: state.partners
    };
};

function Mission() {
    return (
        <Card title='Our Mission'>
            <Text style={{margin: 10}}>
                We present a curated database of the best campsites in the vast woods and backcountry of 
                the World Wide Web Wilderness. We increase access to adventure for the public while 
                promoting safe and respectful use of resources. The expert wilderness trekkers 
                on our staff personally verify each campsite to make sure that they are up to our 
                standards. We also present a platform for campers to share reviews on campsites they have 
                visited with each other.
            </Text>
        </Card>
    );
}

class About extends Component {

    static navigationOptions = {
        title: 'About Us'
    }

    render() {
        const renderPartner = ({item}) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}}
                />
            );
        };

        //If partners.isLoading is true return the Loading function(defined in LoadingComponent.js)
        if(this.props.partners.isLoading) {
            return(
            <ScrollView>
                <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                    <Mission />
                    <Card
                        title="Community Partners">
                        <Loading />
                    </Card>
                </Animatable.View>
            </ScrollView>
            )
        }

        //If props.partners has an error message return the error message
        if(this.props.partners.errMess) {
            return (
                <ScrollView>
                <Mission />
                <Card
                    title="Community Partners">
                    <Text>{this.props.partners.errMess}</Text>
                </Card>
            </ScrollView>
            )
        }

        return (
            <ScrollView>
                <Animatable.View animation= 'fadeInDown' duration={2000} delay={1000}>
                    <Mission />
                    <Card
                        title="Community Partners">
                        <FlatList
                            data={this.props.partners.partners} //The first partners handles the partners data i.e. isLoading and errMessage propertier
                                                                //The second partners is the partners data array 
                            renderItem={renderPartner}
                            keyExtractor={item=>item.id.toString()}
                        />
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(About); //This is so the About component now recieves the partners props from the redux store 