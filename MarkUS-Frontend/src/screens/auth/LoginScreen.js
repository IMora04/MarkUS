import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, Text, TextInput } from 'react-native'
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import InputItem from '../../components/InputItem'

export default function LoginScreen ({ navigation }) {
  const { signIn, signInGoogle } = useContext(AuthorizationContext)
  const [backendErrors, setBackendErrors] = useState()
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(3, ({ min }) => `Password must be at least ${min} characters`)
      .matches(/^\S*$/, 'No spaces are allowed')
      .required('Password is required')
  })

  const login = (values) => {
    setBackendErrors([])
    signIn(values,
      (loggedInUser) => {
        showMessage({
          message: `Welcome back ${loggedInUser.firstName}.`,
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
        navigation.navigate('MainStack')
      },
      (error) => {
        setBackendErrors(error.errors)
      })
  }

  const loginGoogle = (response) => {
    setBackendErrors([])
    signInGoogle(response,
      (loggedInUser) => {
        showMessage({
          message: `Welcome back ${loggedInUser.firstName}.`,
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
        navigation.navigate('MainStack')
      },
      (error) => {
        setBackendErrors(error.errors)
      })
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: 'customer1@customer.com', password: 'secret' }}
      onSubmit={login}>
      {({ handleSubmit }) => (
        <View style={{ alignItems: 'center' }}>
          <View style={styles.container}>
            <InputItem
              name='email'
              label='email:'
              placeholder='customer1@customer.com'
              textContentType='emailAddress'
            />

            <InputItem
              name='password'
              label='password:'
              placeholder='secret'
              textContentType='password'
              secureTextEntry={true}
            />

            {backendErrors &&
              backendErrors.map((error, index) => <Text key={index}>{error.param}-{error.msg}</Text>)
            }

            <Pressable
              onPress={handleSubmit}
              >
              <Text textStyle={styles.text}>
                Sign in
              </Text>
            </Pressable>

            <Text textStyle={{ textAlign: 'center' }}>Not a member?</Text>
            <Pressable
              onPress={() => navigation.navigate('Register')
              }
              >
              <Text textStyle={styles.text}>
                Create account
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '60%'
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 50,
    margin: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  }
})
