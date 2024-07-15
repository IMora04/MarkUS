import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, ScrollView, Switch, Image, Dimensions } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { FlatList } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import CreateStudiesModal from '../components/CreateModal'
import { ErrorMessage, Formik } from 'formik'
import InputItem from '../components/InputItem'
import * as yup from 'yup'
import * as ExpoImagePicker from 'expo-image-picker'

export default function StudiesScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [studies, setStudies] = useState([])
  const isFocused = useIsFocused()
  const [showModal, setShowModal] = useState(false)

  const initialValues = { name: null, credits: null, description: null, logo: null, hasTrimesters: null, status: null, years: null }
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required'),
    credits: yup
      .number()
      .positive('The number of credits must be positive')
      .integer('The number of credits must be integer')
      .required('The number of credits is required'),
    description: yup
      .string()
      .nullable()
      .max(255, 'Description is too long'),
    logo: yup
      .string()
      .nullable(),
    hasTrimesters: yup
      .boolean(),
    status: yup
      .string()
      .oneOf(['studying', 'finished'])
      .required('The status is required'),
    years: yup
      .number()
      .positive('The number of years must be positive')
      .integer('The number of years must be integer')
      .required('The number of years is required')
  })

  const windowDimensions = Dimensions.get('window')
  const screenDimensions = Dimensions.get('screen')

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen })
      }
    )
    return () => subscription?.remove()
  })

  useEffect(() => {
    async function fetchStudies () {
      if (!isFocused) {
        return
      }
      if (!loggedInUser) {
        setStudies([])
        return
      }
      try {
        const fetchedStudies = await getAll()
        setStudies(fetchedStudies)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving studies. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchStudies()
  }, [isFocused, loggedInUser])

  const renderStudies = ({ item }) => {
    return (
      <View style={styles.studiesCard}>
        <Pressable
        style={{ margin: 10 }}
        onPress={() => { navigation.navigate('Studies info', { id: item.id }) }}>
          <Text>{item.name}</Text>
          <Text>{item.credits} credits</Text>
          <Text>Currently {item.status}</Text>
        </Pressable>
      </View>
    )
  }

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  return (
    <View style={{ margin: 20 }}>
      {
        loggedInUser
          ? <>
            <Text>SELECT YOUR STUDIES</Text>
            <FlatList
            style={{ marginVertical: 10 }}
            data = {studies}
            renderItem={renderStudies}
            keyExtractor={item => item.id.toString()}
            />
            <Pressable
            onPress={() => { setShowModal(true) }}>
              <Text>Add studies</Text>
            </Pressable>
            <CreateStudiesModal
              isVisible={showModal}
              onCancel={() => setShowModal(false)}
              onConfirm={() => {}}
            >
              <ScrollView style={{ maxHeight: dimensions.window.width < 450 ? 400 : 650, width: '100%' }}>
                <Text style={{ fontSize: 15, textAlign: 'center' }}>Please add new studies info</Text>

                <Formik
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  onSubmit={() => {}}>
                  {({ handleSubmit, setFieldValue, values }) => (
                    <ScrollView>
                      <View>
                        <InputItem
                          name='name'
                          label='Name:'
                        />
                        <InputItem
                          name='credits'
                          label='Number of credits:'
                        />
                        <InputItem
                          name='description'
                          label='Description:'
                        />
                        <InputItem
                          name='years'
                          label='Duration (in years):'
                        />

                        <Text style={{ marginLeft: 13, marginTop: 10 }}>It uses:</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 5, marginBottom: 5, alignItems: 'center', alignSelf: 'center' }}>
                          <Text>Quadrimesters</Text>
                          <Switch
                            trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                            thumbColor={values.hasTrimesters ? GlobalStyles.brandSecondary : '#f4f3f4'}
                            value={values.hasTrimesters}
                            style={{ marginHorizontal: 5 }}
                            onValueChange={value =>
                              setFieldValue('hasTrimesters', value)
                            }
                          />
                          <ErrorMessage name={'hasTrimesters'} render={msg => <Text>{msg}</Text> }/>
                          <Text>Trimesters</Text>
                        </View>

                        <Pressable onPress={() =>
                          pickImage(
                            async result => {
                              await setFieldValue('logo', result)
                            }
                          )
                        }
                          style={{ marginTop: 10, alignItems: 'center', alignSelf: 'center' }}
                        >
                          <Text>Click to browse logo: </Text>
                          <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : null} />
                        </Pressable>

                        <Pressable
                          style={{ alignSelf: 'center', margin: 5, borderWidth: 1, borderRadius: 5, padding: 5, backgroundColor: GlobalStyles.brandBackground }}
                          onPress={() => { setFieldValue('logo', null) }}
                        >
                          <Text>Delete logo</Text>
                        </Pressable>

                      </View>
                    </ScrollView>
                  )}
                </Formik>
              </ScrollView>

            </CreateStudiesModal>
          </>
          : <Text>You are not logged in</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  studiesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
