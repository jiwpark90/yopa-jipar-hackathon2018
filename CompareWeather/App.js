import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

// import WeatherPanel from './components/weather-panel';

import WeatherDataLoader from './clients/weather-data-loader';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }

  componentDidMount() {
    var weatherDataLoader = new WeatherDataLoader();
    weatherDataLoader.getWeatherData();
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
  },
  weatherLeft: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'powderblue',
    justifyContent: 'center',
  },
  weatherRight: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'steelblue',
    justifyContent: 'center',
  }
});
