/** Deck Component */

import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

//exceeding this means you swiped right/left it
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

//time in ms
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    
    constructor(props) {
        
        super(props);

        const position = new Animated.ValueXY(); //no assumption made for intial location
        
        //used to check what are we touching, what component handles touching and how is the gesture changing?
        const panResponder = PanResponder.create({

            //executed when user taps on a screen
            //true means we want this (const panResponder) entire panresponder instance to be responsible for 
            //handling this gesture
            onStartShouldSetPanResponder: () => true,

            //anytime user starts to drag on the screen
            //event: works like in react, gives us info
            //gesture: has info about the user's finger
            onPanResponderMove: (event, gesture) => {
                position.setValue({x: gesture.dx, y: gesture.dy})// this where the gesture and animation module get tied by us
            },

            //anytime user presses down, drags or not, and then lets go
            onPanResponderRelease: (event, gesture) => {
                if(gesture.dx > SWIPE_THRESHOLD){
                    this.forceSwipe('right');
                }
                else if (gesture.dx < -SWIPE_THRESHOLD){
                    this.forceSwipe('left');
                }
                else{
                    this.resetPosition();
                }
            }
        });

        // we will never call setState with PanResponder nor position
        // assigning panResponder, position to state object
        this.state = { panResponder, position, index:0 };
    }

    //called whenever component is about to be rerendered with a new list of props
    componentWillReceiveProps(nextProps) {

        //is this the exact same array
        if(nextProps.data !== this.props.data){
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {

        //android specific line
        //says if setLayoutAnimationEnabledExperimental exists, then call it with a value of true
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring(); //tells rn to animate changes that are made to component itself upon rerendering 
    }

    //moves card off of the screen
    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH: -SCREEN_WIDTH;
        //same effect as spring but differs in how the animation goes out
        //have to specify duration
        Animated.timing(this.state.position, {
            toValue: {x, y: 0 },
            duration: SWIPE_OUT_DURATION //milliseconds
        }).start(() => this.onSwipeComplete(direction)); //callback that is executed after animation has been completed
    }

    onSwipeComplete(direction) {

        const {data } = this.props;
        const item = data[this.state.index];

        //this is documentation recommendation
        this.state.position.setValue({ x: 0, y: 0}); //have to reset posiiton manually
        this.setState({ index: this.state.index + 1});
    }

    //snap back to initial position
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start(); //have to explicitly start
    }

    //for styling
    getCardStyle() {

        //direct access to position property
        const { position } = this.state;

        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5 , 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return { 
            //... is spread operator remember. so all props from getLayout get added to the object we are returning
            // and we added one additional custom property 
            ...position.getLayout(),
            transform: [{rotate}] 
        }
    }
    
    renderCards() {

        if (this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards();
        }

        //i here is inside the DATA
        //this.state.index is current card we are considering.
        return this.props.data.map((item, i) => {

            //already rendered
            if(i < this.state.index) { return null; }

            //animate the one selected
            //applied style to active card
            if(i === this.state.index){
                return (
                    <Animated.View 
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers} //involving panresponder so it responds
                    >
                    {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            //applied style to other cards
            return (
                <Animated.View 
                    key={item.id} 
                    style={[styles.cardStyle, {top: 10 * (i-this.state.index)}]} //pushed down except top card. this way it also pushes card up after a swipe. 10 * number of spaces the card is away from become the top card in the deck
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }).reverse();// reversing the list, otherwise when we stack, last element comes on top
    }
    
    render() {
        return (
            <View>
                { this.renderCards() }
            </View>
        );
    }
}

//for styling as well
const styles = {
    cardStyle: {
        position: 'absolute', //will cause all the cards to stack up at the top of the application. side effect, it shrinks to minimum length required to display that element and all items stack up
        width: SCREEN_WIDTH
    }
};

export default Deck;