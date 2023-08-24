/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Main from './app/index';

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}
export default App;
