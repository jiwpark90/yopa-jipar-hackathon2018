import React from 'react';
import {Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default class ExpandableListItem extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            title       : props.title,
            expanded    : false,
            animation   : new Animated.Value(),
            initHeightSet: false
        };
    }

    toggle = () => {
        let initialValue = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
        let finalValue = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
          expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    setMinHeight = (e) => {
      if (!this.state.initHeightSet) {
        this.setState({
          initHeightSet: true,
          minHeight: e.nativeEvent.layout.height
        });
        this.state.animation.setValue(e.nativeEvent.layout.height);
      } else {
        this.setState({
          minHeight: e.nativeEvent.layout.height
        });
      }
    }

    setMaxHeight = (e) => {
      this.setState({
        maxHeight: e.nativeEvent.layout.height
      });
    }

    render() {
        return ( 
            <Animated.View 
              style={[styles.container, {height: this.state.animation}]} >
                <View style={styles.titleContainer} onLayout={this.setMinHeight}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle}
                        underlayColor="#f1f1f1">
                        {
                          this.state.expanded ?
                            (<Entypo name="triangle-down" size={32} color="black" />) :
                            (<Entypo name="triangle-up" size={32} color="black" />)
                        }
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this.setMaxHeight}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
  container   : {
      backgroundColor: 'white',
      margin:10,
      overflow:'hidden'
  },
  titleContainer : {
      flexDirection: 'row'
  },
  title       : {
      flex    : 1,
      padding : 10,
      color   :'#2a2f43',
      fontWeight:'bold'
  },
  button      : {

  },
  buttonImage : {
      width   : 30,
      height  : 25
  },
  body        : {
      padding     : 10,
      paddingTop  : 0
  }
});