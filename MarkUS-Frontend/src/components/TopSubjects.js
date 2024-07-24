import React from 'react'
import { View, Text } from 'react-native'

export default function TopSubjects (props) {
  return (
    <View style={[{ marginLeft: props.width > 450 ? 50 : 0, marginTop: props.width > 450 ? 0 : 10, alignSelf: props.width < 450 ? 'flex-start' : 'center' }, props.style]}>
      <Text>
        TOP 5 SCORES:
      </Text>
      {
        props.topSubjects && props.topSubjects.length !== 0
          ? props.topSubjects.map((s) =>
            <Text style={{ margin: -5 }} key={s}>{'\n\t'} · {s}</Text>
          )
          : <Text style={{ margin: 5 }}> No subjects found</Text>
      }
  </View>
  )
}
