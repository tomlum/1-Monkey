import React from "react";
import {
  AppRegistry,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from "react-native";
import Alea from "./util/alea.min";
import PixelGrid from "./src/PixelGrid";
import cs from "./src/configs";

let _ = require("lodash");

AppRegistry.registerComponent("1Monkey", () => App);

// Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

let tickTimeout;
let toggleTick = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstTime: 2,
      seed: "1 Monkey",
      seedText: "1 Monkey",
      colorMode: true,
      playMode: false,
      seedNumber1: 0,
      seedNumber2: 0,
      history: []
    };
    _.throttle(this.toggleColor.bind(this), 200);
  }

  componentDidMount() {
    this.genSeedNumber("1 Monkey");
  }

  componentDidUpdate() {
    if (this.state.playMode && toggleTick) {
      toggleTick = false;
      this.playTick();
    }
  }

  setHistory = (s1, s2, seed) => {
    if (!this.state.firstTime) {
      let newHistory = this.state.history.concat([[s1, s2, seed]]);
      if (newHistory.length > cs.maxHistory) {
        newHistory = newHistory.slice(
          newHistory.length - cs.maxHistory,
          newHistory.length
        );
      }
      this.setState({
        history: newHistory
      });
    } else {
      this.setState({ firstTime: this.state.firstTime - 1 });
    }
  };

  getHistory = () => {
    this.togglePlay(false);
    if (this.state.history.length > 0) {
      const seeds = this.state.history.pop();
      this.setState({
        seedNumber1: seeds[0],
        seedNumber2: seeds[1],
        seed: seeds[2],
        seedText: seeds[2]
      });
    }
  };

  randomize = () => {
    let newSeed = "";
    let rand;
    if (!this.state.firstTime) {
      rand = new Alea(this.state.seed);
    } else {
      rand = new Alea(Math.random());
    }
    const newSeedLength = Math.floor(rand() * cs.seedLength) + 1;
    for (let i = 0; i < Math.min(newSeedLength, cs.seedLength); i++) {
      newSeed += cs.chars.charAt(Math.floor(rand() * cs.chars.length));
    }
    this.genSeedNumber(newSeed, this.state.seed);
  };

  genSeedNumber = (seed, oldSeed) => {
    this.setHistory(this.state.seedNumber1, this.state.seedNumber2, oldSeed);
    let seedNumber1 = -2147483647;
    let seedNumber2 = 0;
    for (let i = 0; i < Math.min(seed.length, 8); i++) {
      seedNumber1 += seed.charCodeAt(i) * cs.chars.length ** i;
    }

    for (let i = 8; i < seed.length; i++) {
      seedNumber2 += seed.charCodeAt(i) * cs.chars.length ** (i - 8);
    }
    this.setState({
      seedNumber1,
      seedNumber2,
      seed,
      seedText: seed
    });
  };

  toggleColor = () => {
    this.setState({ colorMode: !this.state.colorMode });
  };

  togglePlay = set => {
    if (this.state.playMode) {
      clearTimeout(tickTimeout);
    }
    typeof set === "boolean"
      ? this.setState({ playMode: set })
      : this.setState({ playMode: !this.state.playMode });
  };

  playTick = () => {
    clearTimeout(tickTimeout);
    tickTimeout = setTimeout(() => {
      this.randomize();
      toggleTick = true;
      this.playTick();
    }, 1000);
  };

  render() {
    const buttonStyle = {};

    const buttonOpacStyle = {
      paddingLeft: 30,
      paddingRight: 30
    };

    let colorButton = this.state.colorMode ? (
      <Image
        source={require("./assets/im/colorIcon.png")}
        style={buttonStyle}
      />
    ) : (
      <Image source={require("./assets/im/grayIcon.png")} style={buttonStyle} />
    );

    let playButton = this.state.playMode ? (
      <Image
        source={require("./assets/im/playIconOn.png")}
        style={buttonStyle}
      />
    ) : (
      <Image
        source={require("./assets/im/playIconOff.png")}
        style={buttonStyle}
      />
    );

    let backButton = (
      <Image source={require("./assets/im/backIcon.png")} style={buttonStyle} />
    );

    const stretchDis =
      3 / 9 * cs.buttonSize * (this.state.history.length / cs.maxHistory);

    const backButtonEnd = (
      <Image
        source={require("./assets/im/backIconEnd.png")}
        style={[
          buttonStyle,
          {
            position: "absolute",
            left: -stretchDis + 30
          }
        ]}
      />
    );

    const backButtonStretch = (
      <View
        style={{
          height: 1 / 9 * cs.buttonSize,
          width: 2 / 9 * cs.buttonSize + stretchDis + 1,
          top: 7 / 9 * cs.buttonSize,
          left: 5 / 9 * cs.buttonSize - stretchDis + 29,
          position: "absolute",
          backgroundColor: "#fff"
        }}
      />
    );

    colorButton = (
      <TouchableOpacity onPress={this.toggleColor} style={buttonOpacStyle}>
        {colorButton}
      </TouchableOpacity>
    );
    backButton = (
      <TouchableOpacity onPress={this.getHistory} style={buttonOpacStyle}>
        {backButton}
        {backButtonEnd}
        {backButtonStretch}
      </TouchableOpacity>
    );
    playButton = (
      <TouchableOpacity onPress={this.togglePlay} style={buttonOpacStyle}>
        {playButton}
      </TouchableOpacity>
    );

    const pixelGrid = (
      <TouchableOpacity
        onPress={() => {
          this.randomize();
          this.togglePlay(false);
        }}
      >
        <PixelGrid
          seed1={this.state.seedNumber1}
          seed2={this.state.seedNumber2}
          colorMode={this.state.colorMode}
        />
      </TouchableOpacity>
    );

    return (
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <StatusBar hidden />
        <TextInput
          placeholder="Enter Seed"
          style={{
            alignItems: "center",
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "Futura",
            color: "#fff",
            paddingBottom: 20
          }}
          maxLength={cs.seedLength}
          width={2000}
          onChangeText={text => {
            this.togglePlay(false);
            this.setState({
              seedText: text
            });
          }}
          onSubmitEditing={event => {
            this.genSeedNumber(event.nativeEvent.text, this.state.seed);
          }}
          value={this.state.seedText}
        />
        {pixelGrid}
        <View
          style={{
            flexDirection: "row",
            paddingTop: 20
          }}
        >
          {backButton}
          {colorButton}
          {playButton}
        </View>
      </ScrollView>
    );
  }
}
