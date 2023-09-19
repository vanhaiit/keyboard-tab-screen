/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TabScreenKeyboard from 'react-native-tabs-screen-keyboard';
import {View} from 'react-native';

const _prefix = [
  {
    key: 1,
    component: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'red',
        }}
      />
    ),
  },
  {
    key: 2,
    component: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'green',
        }}
      />
    ),
  },
  {
    key: 3,
    component: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'blue',
        }}
      />
    ),
  },
];
const _suffix = [
  {
    key: 1,
    component: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'orange',
        }}
      />
    ),
  },
];
const _screens = [
  {
    key: 1,
    component: <View style={{flex: 1, backgroundColor: 'red'}} />,
  },
  {
    key: 2,
    component: <View style={{flex: 1, backgroundColor: 'blue'}} />,
  },
  {
    key: 3,
    component: <View style={{flex: 1, backgroundColor: 'green'}} />,
  },
];

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <TabScreenKeyboard screens={_screens} suffix={_suffix} prefix={_prefix} />
    </SafeAreaProvider>
  );
}
export default App;
