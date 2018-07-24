import React from 'react';
import { SectionList, StyleSheet, Text, ScrollView } from 'react-native';
import { Header, SafeAreaView } from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { TempUnitToggle } from '../TempUnitToggle';

const LocationSelectScreen = 'LocationSelectScreen';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  handleLocationSelect = () => {
    this.props.navigation.push(LocationSelectScreen);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <List containerStyle={styles.settingsList}>
            <ListItem
              leftIcon={{
                type: 'entypo',
                name: 'location-pin',
                size: 25,
                color: 'black'
              }}
              key='location'
              title='Location'
              containerStyle={styles.listItem}
              onPress={this.handleLocationSelect}
            />
            <ListItem
              leftIcon={{
                type: 'entypo',
                name: 'notification',
                size: 25,
                color: 'black'
              }}
              key='notifications'
              title='Notifications'
              containerStyle={styles.listItem}
              hideChevron={true}
            />
            <ListItem
              key='unit'
              title='Temperature unit'
              containerStyle={styles.listItem}
              onPress={this.props.screenProps.onCelciusToggle}
              rightIcon={
                this.props.screenProps.isCelcius ? {
                  type: 'material-community',
                  name: 'temperature-celsius',
                  size: 20,
                  color: 'black'
                } : {
                  type: 'material-community',
                  name: 'temperature-fahrenheit',
                  size: 20,
                  color: 'black'
                }
            }
            />
          </List>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  scrollView: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'stretch'
  },
  settingsList: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginTop: Header.HEIGHT
  },
  listItem: {
    height: 48,
    justifyContent: 'center'
  }
});