import React from "react";
import { View } from "react-native";
import cs from "../src/configs";

function Pixel(props) {
  const pixelSize = props.size || cs.defaultPixelSize;
  return (
    <View
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundColor: `rgb(${props.r},${props.g},${props.b})`
      }}
    />
  );
}

export default Pixel;
