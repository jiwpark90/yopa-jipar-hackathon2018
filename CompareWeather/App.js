import React from 'react';
import { StyleSheet, Text, View, NavigatorIOS, TouchableHighlight } from 'react-native';
import WeatherViewer from './WeatherViewer';
import Settings from './Settings';

export default class App extends React.Component {
  showSettings() {
    console.log('showing settings');
    this.refs.nav.push({
      component: Settings
    });
  }

  render() {
    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{
          component: WeatherViewer,
          rightButtonTitle: 'Settings', // TODO use icon
          onRightButtonPress: () => this.showSettings()
        }}
        style={{flex: 1}}
      />
    );
  }
}

class InfiniteScene extends React.Component {
  constructor(props) {
    super(props);
    this.onForward = this.onForward.bind(this);
  }

  _handleBackPress() {
    console.log('back pressed');
  }

  onForward() {
    let nextIndex = ++this.props.index;
    this.props.navigator.push({
      component: InfiniteScene,
      title: `Scene ${nextIndex}`,
      passProps: {index:nextIndex}
    });
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'red'
      }}>
        <Text style={{flex: 1}}>Current Scene: {this.props.title}</Text>
        <TouchableHighlight style={{flex: 2}}
          onPress={this.onForward}>
          <Text>Tap me to load the next scene</Text>
        </TouchableHighlight>
        
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
  testContainer: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  firstRow: {
    flex: 2,
    backgroundColor: 'pink',
    alignSelf: 'stretch',
    textAlign: 'center'
  },
  secondRow: {
    flex: 1,
    backgroundColor: 'green',
    alignSelf: 'stretch',
    textAlign: 'center'
  }
});
