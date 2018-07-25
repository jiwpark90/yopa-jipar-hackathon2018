import React from 'react';
import WeatherDataLoader from './clients/weather-data-loader';
// import WeatherPanel from './components/weather-panel';
import { StyleSheet } from 'react-native';
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

  componentDidMount() {
    var weatherDataLoader = new WeatherDataLoader();
    weatherDataLoader.getWeatherData();
  }

  render() {
    return (
      <RootStack
        screenProps={{
          onCelciusToggle: this.handleCelciusToggle,
          isCelcius: this.state.isCelcius
        }} 
      />
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