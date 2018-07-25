import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Picker } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

const onToSettings = 'onToSettings'
const SettingsScreen = 'SettingsScreen';

export default class WeatherScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <TouchableOpacity 
          style={{ paddingRight: 10 }} 
          onPress={navigation.getParam(onToSettings)}
        >
          <Ionicons name="ios-settings" size={35} color='black' />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ [onToSettings]: this.handleToSettings });
  }

  handleToSettings = () => {
    this.props.navigation.push(SettingsScreen);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Weather viewer. isCelcius: { this.props.screenProps.isCelcius.toString() }</Text>
      </SafeAreaView>
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