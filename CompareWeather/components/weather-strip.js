import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

import WeatherPanel from './weather-panel';

export default class WeatherStrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }

  render() {
    return (
        <View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
