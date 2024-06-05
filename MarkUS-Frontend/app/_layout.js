import React from 'react'
import AppContextProvider from '../context/AppContext'
import AuthorizationContextProvider from '../context/AuthorizationContext'
import Layout from '../components/Layout'

export default function RootLayout () {
  return (
    <>
    <AppContextProvider>
      <AuthorizationContextProvider>
        <Layout/>
      </AuthorizationContextProvider>
    </AppContextProvider>
    </>
  )
}
