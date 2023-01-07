import React, { useEffect, useState } from "react";

import { Dimensions, View } from "react-native";
import { VictoryPie } from "victory-native";

export const { width, height } = Dimensions.get('window')
var chartData = [
	{ x: 1, y: 3, label: "5%" },
	{ x: 2, y: 4, label: "10%" },
	{ x: 3, y: 5, label: "20%" },
	{ x: 5, y: 8, label: "30%" },
	{ x: 8, y: 13, label: "35%" },
]
const App = () => {
	const[selectedCategory,setselectedCategory] = useState(null);
	return (
		<View style={{flex:1}}>
			<VictoryPie
			 startAngle={0}
			 endAngle={-180}
			 innerRadius={80}
			 padAngle={2}
			 cornerRadius={5}
			labelPosition = {"centroid"}
			labelPlacement = {"vertical"}
			radius={({ datum }) =>  selectedCategory && selectedCategory == datum.label ? 170 : 150 }
			labelRadius={({ innerRadius }) => innerRadius + 35 }
			style={{ labels: { fill: "white", fontSize: 15, fontWeight: "bold", } }}
			data={chartData}
			events = {[{
				target:"data",
				eventHandlers: {
					onPress :() => {
						return [{
							target : "labels",
							mutation : (props) => {
								console.log(chartData[props.index])
								setselectedCategory(chartData[props.index].label)
							}
						}]
					}
				}
			}]}
			/>
		</View>
	);
};

export default App;
