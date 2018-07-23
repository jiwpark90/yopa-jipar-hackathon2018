import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default class WeatherViewer extends React.Component {
  constructor(props) {
    super(props);
    console.log('in WeatherViewer constructor');
    console.log(props);
  }
  render() {
    return (
      <ScrollView>
        <View />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue'
  }
});