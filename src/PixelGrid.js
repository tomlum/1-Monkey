import React from "react";
import { View } from "react-native";
import Alea from "./../util/alea.min";
import Pixel from "./../src/Pixel";
import cs from "./../src/configs";

function PixelGrid(props) {
  let rand = new Alea(props.seed1);
  rand = new Alea(props.seed2 + rand());
  const pixelCol = [];
  for (let i = 0; i < cs.dim * 1.3; i++) {
    const pixelRow = [];
    for (let j = 0; j < cs.dim; j++) {
      let r = rand() * 255;
      let g = rand() * 255;
      let b = rand() * 255;

      if (!props.colorMode) {
        const gray = (r + g + b) / 3;
        r = gray;
        g = gray;
        b = gray;
      }
      pixelRow[j] = <Pixel key={`${j}`} r={`${r}`} g={`${g}`} b={`${b}`} />;
    }
    pixelCol[i] = (
      <View key={`${i}`} style={{ flexDirection: "row" }}>
        {pixelRow}
      </View>
    );
  }
  return <View>{pixelCol}</View>;
}

export default PixelGrid;
