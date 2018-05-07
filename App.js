import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Deck from './src/Deck';
import { Card, Button} from 'react-native-elements';

//list of records to use
const DATA = [
  { id: 1, text: 'Title #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 2, text: 'Title #2', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 3, text: 'Title #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 4, text: 'Title #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  { id: 5, text: 'Title #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 6, text: 'Title #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 7, text: 'Title #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 8, text: 'Title #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
];

export default class App extends React.Component {

  state= { data: DATA };

  //called when no more cards are left and user clicks 'Reload'
  onRestoreCards = () => {
    this.setState({data: [...DATA] });
  };

  //shows inside of a card
  //called once for each element in the DATA array
  //used react-native-elements for the card styling
  renderCard(item) {
    return (
        <Card
          key={ item.id }
          image={{ uri: item.uri }}
        >
          <Text style={{ marginBottom: 10, fontWeight:'bold', fontSize: 16, color: '#777777'}}>
            {item.text}
          </Text>

          <Text style={{ marginBottom: 10}}>
            Customize Card
          </Text>
          
          <Button
            backgroundColor="#01D7FE"
            title="View"
          />
        </Card>
    );
  }

  //displayed when user has gone though all the cards
  renderNoMoreCards = () => {
    return (
      <Card title="No More"> 
        <Text style = {{ marginBottom: 10, textAlign: 'center' }}>
          Content empty
        </Text>
        <Button
          icon={{name: 'cached'}}
          onPress={this.onRestoreCards}
          backgroundColor="#FEBF01"
          title="Reload"
        />
      </Card>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck 
          data = { this.state.data } //can use axios to get stuff from server
          renderCard = {this.renderCard}
          renderNoMoreCards = {this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
  },
});
