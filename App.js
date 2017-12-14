import React from "react";
import Alea from "alea";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";

const dim = 30;
const size = 10;
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const seedLength = 10;

function Pixel(props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: `rgb(${props.r},${props.g},${props.b})`
      }}
    />
  );
}

function PixelGrid(props) {
  const rand = new Alea(props.seed);
  const pixelCol = [];
  for (let i = 0; i < dim; i++) {
    const pixelRow = [];
    for (let j = 0; j < dim; j++) {
      pixelRow.push(
        <Pixel
          key={`${j}`}
          r={rand() * 255}
          g={rand() * 255}
          b={rand() * 255}
        />
      );
    }
    pixelCol.push(
      <View key={`${i}`} style={{ flexDirection: "row" }}>
        {pixelRow}
      </View>
    );
  }
  return <View>{pixelCol}</View>;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: "1 Monkey"
    };
  }

  randomize = () => {
    let newSeed = "";
    const newSeedLength = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < Math.min(newSeedLength, seedLength); i++) {
      newSeed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.setState({ seed: newSeed });
  };

  render() {
    let seedNumber = 0;
    const { seed } = this.state;

    for (let i = 0; i < seed.length; i++) {
      seedNumber += seed.charCodeAt(i);
    }

    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter Seed"
          style={{
            alignItems: "center",
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold"
          }}
          maxLength={seedLength}
          width={10000}
          onChangeText={text => this.setState({ seed: text })}
          value={seed}
        />
        <TouchableOpacity onPress={this.randomize}>
          <PixelGrid seed={seedNumber} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
