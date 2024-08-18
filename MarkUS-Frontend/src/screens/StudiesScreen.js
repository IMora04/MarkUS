import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, ScrollView, Switch, Image, Dimensions, ActivityIndicator } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, create, update, remove } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { FlatList } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import CreateModal from '../components/CreateModal'
import { ErrorMessage, Formik } from 'formik'
import InputItem from '../components/InputItem'
import * as yup from 'yup'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ExpoImagePicker from 'expo-image-picker'
import StudiesCard from '../components/StudiesCard'
import DeleteModal from '../components/DeleteModal'
import DoubleButtons from '../components/DoubleButtons'

export default function StudiesScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [studies, setStudies] = useState([])
  const isFocused = useIsFocused()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [backendErrors, setBackendErrors] = useState()
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const editing = editingId !== null

  const [initialValues, setInitialValues] = useState({ name: null, credits: null, description: null, logo: null, hasTrimesters: false, years: null })
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

  async function fetchStudies () {
    if (!isFocused) {
      return
    }
    if (!loggedInUser) {
      navigation.navigate('My studies')
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

  useEffect(() => {
    setLoading(true)
    fetchStudies()
    setLoading(false)
  }, [isFocused, loggedInUser])

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

  const createStudies = async (values) => {
    setBackendErrors([])
    try {
      const createdStudies = await create(values)
      showMessage({
        message: `Studies ${createdStudies.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      setShowCreateModal(false)
      navigation.navigate('Studies info', { id: createdStudies.id })
    } catch (error) {
      setBackendErrors(error.errors)
    }
  }

  const updateStudies = async (values) => {
    setBackendErrors([])
    try {
      const updatedStudies = await update(editingId, values)
      showMessage({
        message: `Studies ${updatedStudies.name} succesfully updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      setShowCreateModal(false)
      fetchStudies()
      setInitialValues({ name: null, credits: null, description: null, logo: null, hasTrimesters: false, years: null })
      setEditingId(null)
    } catch (error) {
      setBackendErrors(error.errors)
    }
  }

  const removeStudies = async (id) => {
    try {
      await remove(id)
      setShowDeleteModal(false)
      fetchStudies()
      setEditingId(null)
      showMessage({
        message: 'Studies succesfully removed',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      showMessage({
        message: 'Studies could not be removed.',
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHomeButtons = () => {
    return (
      <DoubleButtons
        width={dimensions.window.width}
        editing={editing}
        name='studies'
        onCreate={() => { setShowCreateModal(true) }}
        onEdit={() => {
          setEditingId(0)
        }}
        onCancel={() => {
          setInitialValues({ name: null, credits: null, description: null, logo: null, hasTrimesters: false, years: null })
          setEditingId(null)
        }}
      />
    )
  }

  return (
    loading
      ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator />
      </View>
      : <View style={{ margin: 20, marginTop: 10 }}>
      {
        loggedInUser
          ? <>
            {
              dimensions.window.width > 450 &&
              <View style={{ height: 40 }}>
                {
                  renderHomeButtons()
                }
              </View>
            }

            <FlatList
              style={{ marginVertical: 10 }}
              data = {studies}
              renderItem={({ item }) => <StudiesCard
              onPress={
                editing
                  ? () => {
                      setInitialValues({ name: item.name, credits: item.credits, description: item.description, logo: item.logo, hasTrimesters: item.hasTrimesters, years: item.years })
                      setShowCreateModal(true)
                      setEditingId(item.id)
                    }
                  : () => { navigation.navigate('Studies info', { id: item.id }) }
              }
              onDelete={() => {
                setShowDeleteModal(true)
                setEditingId(item.id)
              }}
              item={item}
              editing={editing}/>
              }
              keyExtractor={item => item.id.toString()}
            />

            {
              dimensions.window.width <= 450 &&
              renderHomeButtons()
            }

            <CreateModal
              isVisible={showCreateModal}
              onCancel={() => setShowCreateModal(false)}
            >
              <View style={{ maxHeight: dimensions.window.width < 450 ? 500 : 680, width: '90%' }}>
                <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5 }}>Introduce new studies details</Text>

                <Formik
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  onSubmit={createStudies}>
                  {({ handleSubmit, setFieldValue, values }) => (
                    <>
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
                        <View style={{ flexDirection: 'row', marginVertical: 5, marginBottom: 5, alignItems: 'center', alignSelf: dimensions.window.width < 450 ? 'center' : 'flex-start' }}>
                          <Text>Semesters</Text>
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
                          <MaterialCommunityIcons name='delete' color={'black'} size={20}/>
                        </Pressable>

                        {backendErrors &&
                          backendErrors.map((error, index) => <Text key={index} style={{ color: 'red' }}>{error.param}-{error.msg}</Text>)
                        }

                      </View>
                    </ScrollView>

                    <Pressable
                      onPress={() => setShowCreateModal(false)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed
                            ? GlobalStyles.brandPrimary
                            : GlobalStyles.brandPrimaryTap
                        },
                        styles.actionButton]}
                    >
                      <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                        <MaterialCommunityIcons name='close' color={'white'} size={20}/>
                        <Text style={styles.text}>
                          Cancel
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={editing ? async () => { await updateStudies(values) } : async () => { await createStudies(values) } }
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed
                            ? GlobalStyles.brandSuccessTap
                            : GlobalStyles.brandSuccess
                        },
                        styles.actionButton]}
                      >
                      <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                        <MaterialCommunityIcons name={editing ? 'content-save' : 'check'} color={'white'} size={20}/>
                        <Text style={styles.text}>
                          {editing ? 'Confirm' : 'Create'}
                        </Text>
                      </View>
                    </Pressable>

                    </>
                  )}
                </Formik>
              </View>

            </CreateModal>
            <DeleteModal
              isVisible={showDeleteModal}
              onCancel={() => setShowDeleteModal(false)}
              onConfirm={() => removeStudies(editingId)}
            />
          </>
          : <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            <Text style={{ fontSize: 15 }}>You are not logged in!</Text>
            <Pressable
              style={{ padding: 10, backgroundColor: 'white', borderRadius: 10, margin: 10 }}
              onPress={() => { navigation.navigate('AuthStack') }}
            >
              <Text style={{ fontSize: 20 }}>Log In</Text>
            </Pressable>
          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    margin: 8,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})
