import React from 'react'
import { View } from 'react-native'
import AddButton from './AddButton'
import EditCancelButton from './EditCancelButton'

export default function DoubleButtons (props) {
  return (
    <>
      <View style={[{ flexDirection: 'row', justifyContent: props.width > 450 ? 'flex-end' : 'space-around' }, props.style]}>
        {
          !props.editing &&
          <AddButton
          onCreate={props.onCreate}
          name={props.name}
          />
        }
        <EditCancelButton
        editing={props.editing}
        onCancel={props.onCancel}
        onEdit={props.onEdit}
        />
      </View>
    </>
  )
}
