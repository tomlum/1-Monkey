import React from "react";
import { View } from "react-native";
import Alea from "./../util/alea.min";
import Pixel from "./../src/Pixel";
import cs from "./../src/configs";

function PixelGrid(props) {
  let rand = new Alea(props.seed1);
  rand = new Alea(props.seed2 + rand());
  const pixelCol = [];
  for (let i = 0; i < cs.dim; i++) {
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

      pixelRow.push(<Pixel key={`${j}`} r={`${r}`} g={`${g}`} b={`${b}`} />);

      // if (j === 0) {
      //   pixelRow.push(
      //     <View
      //       key="-1"
      //       style={{
      //         position: "absolute",
      //         height: cs.defaultPixelSize,
      //         width: 99999,
      //         left: -99999,
      //         backgroundColor: `rgb(${r},${g},${b})`
      //       }}
      //     />
      //   );
      // } else if (j === cs.dim - 1) {
      //   pixelRow.push(
      //     <View
      //       key="-2"
      //       style={{
      //         position: "absolute",
      //         height: cs.defaultPixelSize,
      //         width: 99999,
      //         left: cs.dim * cs.defaultPixelSize,
      //         backgroundColor: `rgb(${r},${g},${b})`
      //       }}
      //     />
      //   );
      // }
    }
    pixelCol.push(
      <View key={`${i}`} style={{ flexDirection: "row" }}>
        {pixelRow}
      </View>
    );
  }
  return <View>{pixelCol}</View>;
}

export default PixelGrid;
