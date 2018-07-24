import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SettingsScreen from './components/screens/SettingsScreen';
import LocationSelectScreen from './components/screens/LocationSelectScreen';
import WeatherScreen from './components/screens/WeatherScreen';

export default class App extends React.Component {
  state = {
    isCelcius: false
  };

  handleCelciusToggle = () => {
    this.setState({
      isCelcius: !this.state.isCelcius
    });
  }

  render() {
    return (
      <RootStack
        screenProps={{
          onCelciusToggle: this.handleCelciusToggle,
          isCelcius: this.state.isCelcius
        }} />
    );
  }
}

const RootStack = createStackNavigator(
  {
    WeatherScreen,
    SettingsScreen,
    LocationSelectScreen
  },
  {
    initialRouteName: 'WeatherScreen',
    navigationOptions: {
      headerTintColor: 'black',
      headerTransparent: true,
    }
  }
);