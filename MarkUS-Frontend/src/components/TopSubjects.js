import React from 'react'
import { View, Text } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function TopSubjects (props) {
  return (
    <View style={[{ marginLeft: props.width > 450 ? 50 : 0, alignSelf: 'center' }, props.style]}>
      <Text style={{ textAlign: 'center', fontSize: 15 }}>Top 5 subjects</Text>
      <BarChart
        frontColor={GlobalStyles.appPurple}
        barWidth={30}
        data={props.topSubjects}
        stepHeight={20}
        barBorderTopLeftRadius={5}
        barBorderTopRightRadius={5}
      />
    </View>
  )
}
