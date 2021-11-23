import React, {Component} from 'react';
import {View, Text, Animated} from 'react-native'
import {Card} from 'react-native-elements'
import {connect} from 'react-redux'
import bootstrapIMG from "./images/bootstrap-logo.png";
import {baseUrl} from '../shared/baseUrl'
import Loading from './LoadingComponent';

//Recieves the state as a prop and returns a partner data from the state. We just need the partners data from the state
const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    }
}

function RenderItem (props) {
    const {item} = props

    if(props.isLoading) {
        return <Loading />
    }
    if(props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }

    if (item) {
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}>
                <Text
                    style={{margin:10}}>
                    {item.description}
                </Text>
            </Card>
        )
    }
    return <View />
}

class Home extends Component {
    //For animated componenets you have to store the state value in the components state.
    //Note: you do not have to use the names "scaleValue" or "animate". Those are custom names use to be descriptive
    constructor(props) {
        super(props)
        this.state={
            scaleValue: new Animated.Value(0)
        }
    }

    //First argument is what we want changed over time. Second is an object that contains 3 properties
    animate() {
        Animated.timing(
           this.state.scaleValue,
           {
               toValue:1,
               duration: 1500,
               useNativeDriver: true
           }
        ).start()
    }

    //When the component mounts it will automatically start this animation
    componentDidMount(){
        this.animate()
    }

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
         <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}}>
                <RenderItem //filters through the data arrays and looks for the first index featured item in the array
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                />
                <RenderItem
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess}
                />
                <RenderItem
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    isLoading={this.props.partners.isLoading}
                    errMess={this.props.partners.errMess}
                />
         </Animated.ScrollView>
        )
    }
}

export default connect(mapStateToProps)(Home)