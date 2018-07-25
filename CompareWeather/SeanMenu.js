// Sample code - not part of the app
// component renders a hamburger menu that slides

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Platform, AppState, AsyncStorage, Alert, Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import COLORS from '../lib/colors';
import { LinearGradient } from 'expo';
import _ from 'lodash';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export default class Comp extends React.Component {
  state = {
    opacity: new Animated.Value(0),
    x: new Animated.Value(-500),
  }

  componentDidMount() {
    this.slideIn();
  }

  slideIn() {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: .4,
        easing: Easing.in(),
        duration: 300,
      }),
      Animated.timing(this.state.x, {
        toValue: 0,
        easing: Easing.in(),
        duration: 300,
      }),
    ]).start();
  }

  slideOut(done) {
    Animated.timing(this.state.x, {
      toValue: -500,
      easing: Easing.in(),
      duration: 300,
    }).start(done);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      easing: Easing.in(),
      duration: 300,
    }).start();
  }

  close() {
    this.slideOut(this.props.exit);
  }

  render() {
    const { 
      fontLoaded, 
      evaluations, 
      userId, 
      loading,
      createNewLine, 
      viewRanking, 
      openSignupModal,
      selectLine,
      logout,
      email,
    } = this.props;

    const BlackItalic = fontLoaded ? 'Roboto-BlackItalic' : undefined;
    const Medium = fontLoaded ? 'Roboto-Medium' : undefined;
    const MediumItalic = fontLoaded ? 'Roboto-MediumItalic' : undefined;

    const gradientColors = ['#218293', '#552193', '#21933E', '#090902', '#0261C2', '#EDB00E'];
    _.each(evaluations, (evaluation) => {
      evaluation.line.colors = [COLORS.WHITE, _.sample(gradientColors)];
    });

    let rankingComp = (
      <LinearGradient colors={[COLORS.WHITE, _.sample(gradientColors)]} style={{
        opacity: .38
      }}>
        <View style={{
          width: '100%',
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'space-between',
          height: 75,
        }}>
          <View style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: COLORS.WHITE,
              fontSize: 24,
              fontFamily: MediumItalic,
            }}>
              Ranking
            </Text>
          </View>
          <View style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity style={{
              opacity: 0.5,
            }} onPress={viewRanking}>
              <Entypo name="trophy" size={30} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
    // rankingComp = null;

    const addNewLine = (
      <LinearGradient colors={[COLORS.WHITE, _.sample(gradientColors)]} style={{
        opacity: .38
      }}>
        <View style={{
          width: '100%',
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'space-between',
          height: 75,
        }}>
          <View style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: COLORS.WHITE,
              fontSize: 24,
              fontFamily: MediumItalic,
            }}>
              Add new Line
            </Text>
          </View>
          <View style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity style={{
              opacity: 0.5,
            }} onPress={createNewLine}>
              <MaterialIcons name="add-circle-outline" size={50} color={COLORS.YELLOW} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );

    const lineComponents = _.map(evaluations, (evaluation) => {
      const line = evaluation.line;

      const textStyle = {
        color: COLORS.WHITE,
        fontSize: 24,
        fontFamily: MediumItalic,
      };
      const miniStyle = {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: Medium,
      };
      const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      };

      const now = new Date();
      const dateFrom = moment().subtract(7, 'd');
      const rankDate = _.get(line, 'ranking.date');
      const hasRecentRanking = rankDate ? moment(rankDate).isBetween(dateFrom, now) : false;

      const ranking = hasRecentRanking ? (
        <View key="rank" style={rowStyle}>
          <Text style={miniStyle}>
            rank
          </Text>
          <Text style={miniStyle}>
            { _.get(line, 'ranking.value') }
          </Text>
        </View>
      ) : null;

      const assets = _.map(evaluation.assets, (count, coinName) => {
        return (
          <View key={coinName} style={rowStyle}>
            <Text style={miniStyle}>
              { coinName.toLowerCase() }
            </Text>
            <Text style={miniStyle}>
              { count }
            </Text>
          </View>
        );
      });


      return (
        <LinearGradient key={line._id} colors={line.colors} style={{
          opacity: .38,
        }}>
          <TouchableOpacity style={{
            width: '100%',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }} onPress={() => {
            selectLine(line);
          }}>
            <View style={{}}>
              <Text style={textStyle}>
                {line.name}
              </Text>
            </View>
            <View style={rowStyle}>
              <Text style={miniStyle}>
                balance
              </Text>
              <Text style={miniStyle}>
                { new BigNumber(evaluation.balance).toFormat(2) }
              </Text>
            </View>
            <View style={rowStyle}>
              <Text style={miniStyle}>
                valuation
              </Text>
              <Text style={miniStyle}>
                { new BigNumber(evaluation.evaluated).toFormat(2) }
              </Text>
            </View>
            {ranking}
            {assets}
          </TouchableOpacity>
        </LinearGradient>
      );
    });

    const secureComponent = (
      <View>
        <TouchableOpacity onPress={email ? logout : openSignupModal}>
          <Text style={{
            color: COLORS.WHITE,
            textAlign: 'right',
            fontFamily: Medium,
            fontSize: 16,
          }}>
            { email ? 'Logout' : 'Secure your\naccount & Sign in' }
          </Text>
        </TouchableOpacity>
      </View>
    );

    const overlay = (
      <Animated.View style={{
        opacity: this.state.opacity,
        position: 'absolute',
        width: '100%', 
        height: '100%', 
        backgroundColor: '#464646',
      }}>
        <TouchableOpacity style={{
          position: 'absolute',
          width: '100%', 
          height: '100%', 
        }} onPress={this.close.bind(this)}>
        </TouchableOpacity>
      </Animated.View>
    );

    return (
      <View style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
        {overlay}
        <Animated.View style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: '80%',
          height: '100%',
          backgroundColor: COLORS.BLACK,
          borderRightColor: COLORS.BLACK,
          borderRightWidth: 2,
          transform: [
            {
              translateX: this.state.x,
            }
          ]
        }}>
          {/*header*/}
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: 'space-evenly',
            alignItems: 'center',
            alignContent: 'center',
            height: 100,
            width: '100%',
            backgroundColor: COLORS.YELLOW,
          }}>
            <View style={{
              marginLeft: 20,
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              height: '100%',
              alignSelf: 'flex-start',
            }}>
              <Text style={{
                color: COLORS.WHITE,
                fontSize: 24,
                fontFamily: Medium,
              }}>
                { email ? email : `${userId.substr(0, 15)}...` }
              </Text>

            </View>
          </View>

          { rankingComp }

          <View style={{
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 10,
          }}>
            <Text style={{
              fontSize: 30,
              fontFamily: Medium,
              color: COLORS.WHITE,
            }}>
              Your Lines
            </Text>
          </View>

          <ScrollView showHorizontalIndicator={false} style={{
            maxHeight: 200,
          }}>
            {lineComponents}
          </ScrollView>
          {addNewLine}

          {/*footer*/}
          <View style={{
            position: 'absolute',
            bottom: 10,
            width: '100%',
          }}>
            {/*left*/}
            <View style={{
              padding: 20
            }}>
              {
                loading ? (
                  <Image style={{
                    height: 50,
                    width: 34,
                  }}
                  source={require('../assets/loading.gif')} />
                ) : (
                  <Image source={require('../assets/logo.png')} style={{
                    height: 50,
                    width: 34,
                  }} />
                )
              }
            </View>
            {/*right*/}
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 20,
            }}>
              {secureComponent}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

Comp.propTypes = {
  evaluations: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  email: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  fontLoaded: PropTypes.bool.isRequired,
  viewRanking: PropTypes.func.isRequired,
  createNewLine: PropTypes.func.isRequired,
  openSignupModal: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired,
  selectLine: PropTypes.func.isRequired,
};