import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Settings from './Settings';

class WeatherViewer extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      headerRight: (
        <Button
          onPress={navigation.getParam('showSettings')}
          title='Settings'
          color='#fff'
          />
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ showSettings: this._showSettings });
  }

  _showSettings = () => {
    this.props.navigation.push('Settings');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Weather viewer</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const RootStack = createStackNavigator(
  {
    WeatherViewer,
    Settings
  },
  {
    initialRouteName: 'WeatherViewer',
    navigationOptions: {
      headerTintColor: '#fff',
      headerTransparent: true,
    }
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}