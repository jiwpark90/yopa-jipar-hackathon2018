import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);
    console.log('in Settings constructor');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Settings</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'steelblue',
    alignItems: 'center',
    justifyContent: 'center',
  }
});