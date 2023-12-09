/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationRouter } from '@/navigations'
import { persistor, store } from '@/store'
import { theme } from '@/theme'
import { ThemeProvider } from '@emotion/react'
import { StyleSheet, View } from 'react-native'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

function App(): JSX.Element {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <NavigationRouter />
                    <View />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
