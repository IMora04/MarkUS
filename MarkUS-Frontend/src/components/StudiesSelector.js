import React from 'react'
import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function StudiesSelector (props) {
  const { open, value, items, setOpen, onSelectItem, setItems } = props
  return (
    <View style={{ marginHorizontal: '2%', flex: 1 }}>
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      onSelectItem={onSelectItem}
      setItems={setItems}
      placeholder="Select studies"
      containerStyle={{ height: 40, marginTop: 20 }}
      style={{ backgroundColor: GlobalStyles.brandBackground }}
      dropDownStyle={{ backgroundColor: '#fafafa' }}
    />
  </View>
  )
}
