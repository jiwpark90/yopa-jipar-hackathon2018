import React from 'react';
import { SectionList, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { Header } from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { TempUnitToggle } from '../TempUnitToggle';
import ExpandableListItem from '../ExpandableListItem';

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
              subtitle={
                this.props.screenProps.currentCity ? 
                  this.props.screenProps.currentCity.name :
                  undefined
              }
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
        {/* <ScrollView style={styles.container}>
          <ExpandableListItem title="A Panel with short content text">
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
          </ExpandableListItem>
          <ExpandableListItem title="A Panel with long content text">
            <Text>Lorem ipsum...</Text>
          </ExpandableListItem>
          <ExpandableListItem title="Another Panel">
            <Text>Lorem ipsum dolor sit amet...</Text>
          </ExpandableListItem>
        </ScrollView> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    // paddingTop: Header.HEIGHT
  },
  scrollView: {
    flex: 1,
    alignItems: 'stretch'
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
  },
  panelListContainer:  {
    flex            : 1,
    backgroundColor : '#f4f7f9',
    paddingTop      : 30
  }
});