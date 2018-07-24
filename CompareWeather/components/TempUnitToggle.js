import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class TempUnitToggle extends React.Component {
  render() {
    if (this.props.isCelsius) {
      return (
        <Text>Celsius bitch</Text>
      );
    } else {
      return (
        <Text>Fahrenheit bitch</Text>
      );
    }
  }
}