import React, { useEffect, useState } from "react";

import { Alert, Dimensions, Text, View } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { VictoryLabel, VictoryPie } from "victory-native";

export const { width, height } = Dimensions.get('window')
var chartData = [
	{ x: 1, y: 3, label: "5%",value:"AED 100" },
	{ x: 2, y: 4, label: "10%",value:"AED 150" },
	{ x: 3, y: 5, label: "20%",value:"AED 30" },
	{ x: 5, y: 8, label: "30%",value:"AED 10" },
	{ x: 8, y: 13, label: "35%",value:"AED 600" },
]


const App = () => {
	const[selectedCategory,setselectedCategory] = useState(null);
	const[selectedAED,setselectedAED] = useState(null);
	const[locationX,setlocationX] = useState(null)
	const[locationY,setlocationY] = useState(null)


useEffect(() => {
	FingerprintScanner.isSensorAvailable()
.then((biometryType) => {
  console.log(biometryType)
  if(biometryType=='Face ID')
  {
	// Alert.alert('Scan your Face on the device to continue')
	

  }
  else
  {
	// Alert.alert('Scan your Fingerprint on the device scanner to continue')
  }
  if(biometryType!==null && biometryType!==undefined )
    {
    FingerprintScanner.authenticate({
      description: "Authentication!!"
    })
      .then(() => {
		Alert.alert("Success");
        //you can write your logic here to what will happen on successful authentication
      })
      .catch((error) => {
        console.log('Authentication error is => ', error);
		Alert.alert(error)
      });
    }
    else
    {
    console.log('biometric authentication is not available');
    }

})
.catch((error) => Alert.alert(error));
}, []);


	return (
		<View style={{flex:1,justifyContent:'center'}}>
			<View style={{flexDirection:'row'}}>
			
			<View style={{flex:1,left:Dimensions.get('window').width-200}}>
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
					onPress :(evt) => {
						return [{
							target : "labels",
							mutation : (props) => {
								if(chartData[props.index].label != selectedCategory){
									console.log(chartData[props.index])
									setlocationX(evt.nativeEvent.locationX)
									setlocationY(evt.nativeEvent.locationY)
									setselectedCategory(chartData[props.index].label)
									setselectedAED(chartData[props.index].value)
								}
								
							}
						}]
					}
				}
			}
			
			
		]}
			/>
			</View>
			
			</View>
			<Text style = {{ top: parseFloat( locationY - 400 ), left: parseFloat( locationX + 110),backgroundColor:'white',width:70,padding:4,borderRadius:10}}>{selectedAED}</Text>
		</View>
	);
};

export default App;
