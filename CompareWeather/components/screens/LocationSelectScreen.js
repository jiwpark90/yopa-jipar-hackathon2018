import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { Header, SafeAreaView } from 'react-navigation';
import { searchCity } from '../../clients/search-client';
import { List, ListItem } from 'react-native-elements';

export default class LocationSelectScreen extends React.Component {
  state = {
    searchText: '',
    searchResults: []
  };

  handleChangeText = (text) => {
    let result = searchCity(text, true, true);
    this.setState({
      searchText: text,
      searchResults: result
    });
  }

  handleCitySelect = (city) => {
    this.props.navigation.pop();
    this.props.screenProps.onCitySelect(city)
  }

  render() {
    const listItems = this.state.searchResults.map((result) => {
      return (
        <ListItem 
          key={result.id}
          title={result.name}
          containerStyle={styles.listItem}
          onPress={() => this.handleCitySelect(result)}
          hideChevron={true}
        />
      );
    });
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <SearchBar
            lightTheme
            platform="ios"
            clearIcon={true}
            containerStyle={styles.searchBar}
            onChangeText={this.handleChangeText}
            autoFocus={true}
            placeholder='Search for a city...'
            value={this.state.searchText}
            inputStyle={styles.searchInput}  />
          <ScrollView 
            style={styles.resultsScrollView}
            keyboardShouldPersistTaps='handled'
            >
            <List containerStyle={styles.resultsList}>
            {
              listItems
            }
            </List>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    marginTop: Header.HEIGHT
  },
  searchBar: {
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: 'white'
  },
  listItem: {
    height: 48,
    justifyContent: 'center'
  },
  resultsScrollView: {
  },
  resultsList: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginTop: 0,
    borderTopWidth: 0
  }
});