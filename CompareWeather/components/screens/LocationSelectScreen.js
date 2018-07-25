import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { Header, SafeAreaView } from 'react-navigation';

export default class LocationSelectScreen extends React.Component {
  state = {
    searchText: ''
  };

  handleChangeText = (text) => {
    this.setState({
      searchText: text
    });
  }

  render() {
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
    backgroundColor: 'white'
  },
  searchInput: {
    backgroundColor: 'white'
  }
});