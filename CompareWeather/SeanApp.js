// Sample code - not part of the app
// component renders a parent component that renders a menu that slides

import React from 'react';
import { Platform, AppState, AsyncStorage, Alert, Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import Expo, { Font, Camera, Permissions, ScreenOrientation, DangerZone, takeSnapshotAsync } from 'expo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from './lib/colors';
import _ from 'lodash';
import coinTemplate from './lib/coins.json';
import BigNumber from 'bignumber.js';

import CoinList from './components/coins.js';
import Menu from './components/Menu.js';
import CoinModal from './components/CoinModal.js';
import AuthModal from './components/AuthModal.js';
import EditLineModal from './components/EditLineModal.js';
import RankingComp from './components/RankingComp.js';
import GameRoomComp from './components/GameRoomComp.js';
// import LoadingSvg from './components/LoadingSvg.js';

import ordinal from 'ordinal';

// const BASE_URL = 'https://api.projectionist.xyz';
const BASE_URL = 'http://5dda795a.ngrok.io';

export default class App extends React.Component {
  constructor() {
    super();
    this.saveUserData = _.debounce(this.saveUserData, 1000);
  }

  state = {
    coin: null,
    userId: '',
    lineId: null,
    currentLine: {
      balance: 0,
      name: 'loading',
    },
    flash: '',
    lines: [],
    evaluations: [],
    loading: true,
    fontLoaded: false,
    isShowingRoom: true,
    isShowingRanking: false,
    isCoinModalOpen: false,
    isAuthModalOpen: false,
    isEditLineModalOpen: false,
    isMenuOpen: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
      'Roboto-BlackItalic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-BoldItalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
      'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
      'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      'Roboto-LightItalic': require('./assets/fonts/Roboto-LightItalic.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-MediumItalic': require('./assets/fonts/Roboto-MediumItalic.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
      'Roboto-ThinItalic': require('./assets/fonts/Roboto-ThinItalic.ttf'),
    });
    this.setState({ fontLoaded: true });
    this.getCoins();

    // await AsyncStorage.removeItem('@Projectionist:data');

    let data = await AsyncStorage.getItem("@Projectionist:data");
    // console.log('data: ', typeof data, data);

    if (data) {
      let parsed = JSON.parse(data);
      console.log('data exists: ', parsed);
      this.setState({
        userId: parsed.userId,
        lineId: parsed.lineId,
        jwtToken: parsed.jwtToken,
      });
    } else {
      const newUser = await this.createUser();
      const packet = {
        userId: newUser._id,
        lineId: _.get(newUser, 'lines[0]'),
      };
      await AsyncStorage.setItem("@Projectionist:data", JSON.stringify(packet));
      this.setState(packet);
    }

    const user = await this.getUser(this.state.userId);
    console.log('user: ', user);
    if(user) {
      this.setUserData(user);
      return this.setState({
        loading: false,
      });
    } else {
      // Invalid user
      await this.deleteUserData();
      await this.componentDidMount();
    }
    // this.openSignupModal();
  }

  postSignup(email, password, confirmPassword) {
    const url = `${BASE_URL}/signup/${this.state.userId}`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({ 
        email, password, confirmPassword,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(async (res) => {
      const text = await res.text();
      const packet = {};
      packet.jwtToken = text;
      if (res.status > 200) {
        packet.err = text;
        delete packet.jwtToken;
      }

      return packet;
    });
  }

  async logout() {
    this.setState({
      email: '',
      userId: '',
      lineId: '',
      currentLine: {
        balance: 0,
        name: 'loading',
      },
    });
    this.closeModal();
    this.flash('Successfully logged out');
    await this.deleteUserData();
    await this.componentDidMount();
  }

  postLogin(email, password) {
    const url = `${BASE_URL}/login`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({ 
        email, password,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(async (res) => {
      const text = await res.text();
      const packet = {};
      packet.res = text;
      if (res.status > 200) {
        packet.err = text;
        delete packet.res;
      }

      return packet;
    });
  }

  flash(message) {
    this.setState({
      flash: message,
    });
    setTimeout(() => {
      this.setState({
        flash: '',
      });
    }, 5000);
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  async signup(email, password, confirmPassword) {
    let { err, jwtToken } = await this.postSignup(email, password, confirmPassword);
    if (err) {
      return this.flash(err);
    }

    this.flash('Successfully signed in!');
    this.setState({
      email,
      jwtToken,
      isAuthModalOpen: false,
      isMenuOpen: true,
    });
    this.saveUserData();
  }

  async login(email, password) {
    const { err, res } = await this.postLogin(email, password);
    if (err) {
      return this.flash(err);
    }

    const { token, userId } = JSON.parse(res);

    this.flash('Successfully logged in!');
    this.setState({
      email,
      jwtToken: token,
      userId: userId,
      isAuthModalOpen: false,
      isMenuOpen: true,
    });
    const user = await this.getUser(userId);
    // Set the selected line to the first one
    this.setState({
      lineId: _.get(user, 'lines[0]._id'),
    });
    const evaluations = await this.getEvaluation();
    this.setState({
      evaluations: evaluations,
    });
    this.setUserData(user);
    this.saveUserData();
  }

  openSignupModal() {
    this.setState({
      isAuthModalOpen: true,
    });
  }

  setUserData(user) {
    const currentLineId = this.state.lineId;
    // console.log('currentLineId: ', currentLineId);
    const currentLine = _.find(user.lines, line => line._id === currentLineId);
    // console.log('currentLine: ', currentLine);
    this.setState({
      email: user.email,
      currentLine,
      lines: user.lines,
    });
  }

  clearData() {
    this.setState({
    });
  }

  async deleteUserData() {
    await AsyncStorage.removeItem("@Projectionist:data");
  }

  async saveUserData() {
    const packet = {
      userId: this.state.userId,
      lineId: this.state.lineId,
      jwtToken: this.state.jwtToken,
    }
    console.log('lineId ', this.state.lineId);
    await AsyncStorage.setItem("@Projectionist:data", JSON.stringify(packet));
  }

  jsonify(response) {
    // console.log('response: ', response);
    if (response.status >= 400) {
      // check if there is a message
      const errorMessage = response._bodyText;
      this.flash(errorMessage);
      return null;
    }
    return response.json();
  }

  getUser(userId) {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`
    } : undefined;
    return fetch(`${BASE_URL}/user/${userId}`, { headers })
    // .then(async (res) => {
    //   if (res.status > 200) {
    //     const errorText = await res.text();
    //     return JSON.stringify({
    //       err: errorText,
    //     });
    //   } 
    //   return res;
    // })
    .then(this.jsonify.bind(this));
  }

  getEvaluation() {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`
    } : undefined;
    return fetch(`${BASE_URL}/evaluations/${this.state.userId}`, { headers })
    .then(this.jsonify.bind(this));
  }

  buyCoin(coinName, quantity, askingPrice) {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
    return fetch(`${BASE_URL}/buy/${this.state.userId}/${this.state.lineId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        coinName,
        quantity,
        askingPrice,
      }),
      headers,
    })
    .then(this.jsonify.bind(this));
  }

  sellCoin(coinName, quantity, askingPrice) {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
    return fetch(`${BASE_URL}/sell/${this.state.userId}/${this.state.lineId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        coinName,
        quantity,
        askingPrice,
      }),
      headers,
    })
    .then(this.jsonify.bind(this));
  }

  createUser() {
    return fetch(`${BASE_URL}/user`, {
      method: 'POST',
    })
    .then(this.jsonify.bind(this))
    .then((user) => {
      // console.log('created user: ', user);
      return user;
    });
  }

  editLine(name) {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
    return fetch(`${BASE_URL}/line/${this.state.userId}/${this.state.lineId}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
      headers,
    })
    .then(this.jsonify.bind(this))
    .then((line) => {
      return line;
    });
  }

  newLine() {
    const headers = this.state.jwtToken ? {
      'Authorization': `Bearer ${this.state.jwtToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
    return fetch(`${BASE_URL}/line/${this.state.userId}`, {
      method: 'POST',
      headers,
    })
    .then(this.jsonify.bind(this))
    .then(async (line) => {
      return line;
    });
  }

  getCoins() {
    const url = `${BASE_URL}/data`;
    fetch(url)
    .then(this.jsonify.bind(this))
    .then((body) => {
      this.setState({
        coins: this.washCoins(body)
      });
    });
  }

  async createNewLine() {
    this.setState({
      loading: true,
    });
    const line = await this.newLine();
    const evaluations = await this.getEvaluation();
    this.setState({
      loading: false,
      evaluations: evaluations,
    });
  }

  selectLine(line) {
    console.log('selectLine: ', line);
    this.setState({ 
      isShowingRanking: false,
      lineId: line._id,
      currentLine: line,
    });
    this.closeModal();
    this.saveUserData();
  }

  async changeLineName(name) {
    this.setState({ 
      loading: true,
    });
    await this.editLine(name);
    const user = await this.getUser(this.state.userId);
    this.setUserData(user);
    this.closeModal();
    this.flash('Successfully changed line name!');
    this.setState({ 
      loading: false,
    });
  }

  washCoins(coins) {
    const obj = _.merge(_.cloneDeep(coinTemplate), coins);
    const result = {};
    _.each(obj, (value, key) => {
      if(value.USD && value.image && value.fullName) {
        result[key] = value;
      }
    });
    return result;
  }

  closeModal() {
    this.setState({
      isCoinModalOpen: false,
      isAuthModalOpen: false,
      isMenuOpen: false,
      isEditLineModalOpen: false,
    });
  }

  async openMenu() {
    this.setState({
      loading: true,
    });
    const evaluations = await this.getEvaluation();
    console.log('evaluations: ', evaluations);
    this.setState({
      isMenuOpen: true,
      loading: false,
      evaluations,
    });
  }

  openCoinModal(coin) {
    console.log('coin: ', coin);
    this.setState({
      coin: coin,
      isCoinModalOpen: true,
    });
  }

  viewRanking() {
    this.setState({
      isShowingRanking: true,
    });
    this.closeModal();
  }

  openLineEditModal() {
    this.setState({
      isEditLineModalOpen: true,
    });
  }

  refresh() {
    this.getCoins();
  }

  getRankSet(start) {
    const url = `${BASE_URL}/ranking?start=${start}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(async (res) => {
      const json = await res.json();
      const packet = {};
      packet.result = json;
      if (res.status > 200) {
        packet.err = json;
        this.flash(`Error getting rank: ${packet.err}`);
        delete packet.result;
      }

      return packet;
    });
  }

  async buy(coin, quantity) {
    this.setState({
      loading: true,
    });
    const resp = await this.buyCoin(coin.shortName, quantity, coin.USD);
    if (resp) {
      this.closeModal();
      const user = await this.getUser(this.state.userId);
      this.setUserData(user);
      this.saveUserData();
      this.flash(`Bought ${quantity} ${coin.shortName}!`);
    }
    this.setState({
      loading: false,
    });
  }

  async sell(coin, quantity) {
    this.setState({
      loading: true,
    });
    const resp = await this.sellCoin(coin.shortName, quantity, coin.USD);
    if (resp) {
      this.closeModal();
      const user = await this.getUser(this.state.userId);
      this.setUserData(user);
      this.saveUserData();
      this.flash(`Sold ${quantity} ${coin.shortName}!`);
    }
    this.setState({
      loading: false,
    });
  }

  render() {
    const { 
      fontLoaded, 
      isMenuOpen, 
      isCoinModalOpen, 
      isAuthModalOpen, 
      isEditLineModalOpen,
      evaluations,
      coins, 
      coin, 
      loading, 
      userId, 
      isShowingRanking,
      isShowingRoom,
      currentLine,
      lines,
      flash,
    } = this.state;

    const flashMessageComponent = flash ? (
      <View style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        bottom: 0,
        backgroundColor: COLORS.YELLOW,
      }}>
        <View style={{
          width: '80%',
          padding: 20,
        }}>
          <Text style={{
            fontFamily: MediumItalic,
            fontSize: 16,
            color: COLORS.WHITE,
            textAlign: 'center',
          }}>{flash}</Text>
        </View>
      </View>
    ) : null;

    const BlackItalic = fontLoaded ? 'Roboto-BlackItalic' : undefined;
    const Medium = fontLoaded ? 'Roboto-Medium' : undefined;
    const MediumItalic = fontLoaded ? 'Roboto-MediumItalic' : undefined;

    const overlay = isCoinModalOpen || isEditLineModalOpen ? (
      <TouchableOpacity style={{
        position: 'absolute',
        width: '100%', 
        height: '100%', 
        backgroundColor: '#464646',
        opacity: .4,
      }} onPress={this.closeModal.bind(this)}>
      </TouchableOpacity>
    ) : null;

    const menuComponent = isMenuOpen ? (
      <Menu fontLoaded={fontLoaded}
            userId={userId}
            loading={loading}
            evaluations={evaluations}
            email={this.state.email}
            logout={this.logout.bind(this)}
            exit={this.closeModal.bind(this)}
            openSignupModal={this.openSignupModal.bind(this)}
            createNewLine={this.createNewLine.bind(this)}
            viewRanking={this.viewRanking.bind(this)}
            selectLine={this.selectLine.bind(this)}/> 
    ) : null;

    const coinModalComponent = isCoinModalOpen ? (
      <CoinModal fontLoaded={fontLoaded} 
                 coin={coin} 
                 balance={currentLine.balance} 
                 buy={this.buy.bind(this)}
                 sell={this.sell.bind(this)}
                 exit={this.closeModal.bind(this)}/>
    ) : null;

    const authModalComponent = isAuthModalOpen ? (
      <AuthModal fontLoaded={fontLoaded} 
                 signup={this.signup.bind(this)}
                 login={this.login.bind(this)}
                 exit={this.closeModal.bind(this)}/>
    ) : null;

    const editLineModalComponent = isEditLineModalOpen ? (
      <EditLineModal fontLoaded={fontLoaded} line={currentLine} exit={this.closeModal.bind(this)} done={this.changeLineName.bind(this)}/>
    ) : null;

    let mainView;
    if (isShowingRanking) {
      mainView = (
        <RankingComp fontLoaded={fontLoaded} 
                     setLoading={this.setLoading.bind(this)}
                     getRankSet={this.getRankSet.bind(this)} />
      );
    } else if (isShowingRoom) {
      mainView = (
        <GameRoomComp fontLoaded={fontLoaded} 
                      isOwner={true}
                      setLoading={this.setLoading.bind(this)}/>
      );
    } else {
      mainView = CoinList(coins, this.openCoinModal.bind(this), this.refresh.bind(this), this.state);
    }

    return (
      <View style={{
        backgroundColor: COLORS.BLACK,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
      }}>
        {/*header*/}
        <View style={{
          top: 20,
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'space-evenly',
          alignItems: 'center',
          alignContent: 'center',
          height: 100,
          width: '100%',
          backgroundColor: COLORS.YELLOW,
        }}>
          {/*left*/}
          <View style={{
            marginLeft: 20,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            alignSelf: 'flex-start'
          }}>
            <TouchableOpacity style={{
              opacity: .5,
            }} onPress={this.openMenu.bind(this)}>
              <MaterialIcons name="menu" size={50} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
          {/*right*/}
          <View style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            // height: '100%',
            alignSelf: 'flex-end',
            // width: 75,
            height: '100%',
            position: 'absolute',
            marginRight: 20,
            right: 0,
          }}>
            <View>
              <TouchableOpacity onPress={this.openLineEditModal.bind(this)}>
                <Text style={{
                  fontFamily: BlackItalic,
                  fontSize: 24,
                  color: COLORS.WHITE,
                  opacity: .58,
                  textAlign: 'right',
                }}>{ currentLine.name }</Text>
              </TouchableOpacity>

            </View>
            <View>
              <Text style={{
                fontFamily: MediumItalic,
                fontSize: 24,
                color: COLORS.WHITE,
                textAlign: 'right',
              }}>{ (new BigNumber(currentLine.balance)).toFormat(2)}</Text>
            </View>
          </View>
        </View>

        {/*body*/}
        <View style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingBottom: 140,
        }}>

          { mainView }

        </View>
        {/*footer*/}
        <View style={{
          position: 'absolute',
          bottom: 0,
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
                source={require('./assets/loading.gif')} />
              ) : (
                <Image source={require('./assets/logo.png')} style={{
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
            <View>
              <Text style={{
                color: COLORS.WHITE,
                textAlign: 'right',
                opacity: .52,
                fontSize: 10,
              }}>
                Candid Code <MaterialIcons name="copyright" size={5}/>
              </Text>
            </View>
            <View>
              <Text style={{
                color: COLORS.WHITE,
                textAlign: 'right',
                opacity: .52,
                fontSize: 10,
              }}>
                Prices are pulled from cryptocompare.com*
              </Text>
            </View>
          </View>
        </View>
        {overlay}
        {menuComponent}
        {coinModalComponent}
        {authModalComponent}
        {editLineModalComponent}
        {flashMessageComponent}
      </View>
    );
  }
}