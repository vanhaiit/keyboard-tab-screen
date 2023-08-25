/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
let heightTab: number = 0;
function App() {
  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);
  const [tab, setTab] = useState<number | string | undefined>();
  const [inputText, setInputText] = useState('');
  const isKeyBoardRef = useRef(false);
  const translateStyle = useAnimatedStyle(() => {
    return {
      height: (offset.value || keyboard.height.value) - insets.bottom,
    };
  });

  function handleKeyBoard(e: any) {
    if (isKeyBoardRef.current) {
      setTab(undefined);
    }
    if (heightTab) {
      heightTab = e.endCoordinates.height;
    }
    AsyncStorage.setItem('heightKeyBoard', e.endCoordinates.height.toString());
  }

  function handleImagePickerPress(value: number) {
    // Implement the logic to open the image picker here
    // You can use libraries like 'react-native-image-picker' for this purpose
    console.log(1111);

    setTab(() => {
      offset.value = withTiming(heightTab, {duration: 250});
      return value;
    });
    Keyboard.dismiss();
  }

  function handleFocusMain() {
    offset.value = withTiming(0, {duration: 250});
    setTab(undefined);
    Keyboard.dismiss();
  }

  function onFocusInput() {
    if (!isKeyBoardRef.current) {
      setTab(undefined);
    }
    isKeyBoardRef.current = true;
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyBoard,
    );
    return () => keyboardDidShowListener.remove();
  }, []);

  useEffect(() => {
    (async () => {
      heightTab = Number(await AsyncStorage.getItem('heightKeyBoard'));
    })();
  }, []);

  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}>
      <Pressable style={styles.chatContainer} onPress={handleFocusMain}>
        <View />
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#f0f0f0',
        }}>
        {data.map((e, index) => (
          <Pressable onPress={() => handleImagePickerPress(e.key)} key={index}>
            {e.label}
          </Pressable>
        ))}
        <TextInput
          style={{
            flex: 1,
            marginHorizontal: 10,
            padding: 8,
            backgroundColor: '#fff',
          }}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onFocus={onFocusInput}
          // onBlur={onBlur}
        />
        <TouchableOpacity>
          <View
            style={{
              width: 24,
              height: 24,
              backgroundColor: 'blue',
              borderRadius: 12,
            }}
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={translateStyle}>
        {data.map((e, index) =>
          tab === e.key ? (
            <View style={{flex: 1}} key={index}>
              {e.children}
            </View>
          ) : null,
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },

  imageListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageItem: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: '#ccc',
  },

  body: {
    flex: 1,
    backgroundColor: '#fff',
  },

  inner: {
    height: 56,
    flexDirection: 'row',
  },
  header: {
    fontSize: 36,
    fontWeight: '500',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },

  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    // marginTop: 22,
  },

  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'pink',
  },
  messageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  messageBubble: {
    backgroundColor: '#e1e1e1',
    padding: 8,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
  },
});

export const data = [
  {
    key: 1,
    label: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'green',
          borderRadius: 12,
        }}
      />
    ),
    children: <View style={{flex: 1, backgroundColor: 'green'}} />,
  },
  {
    key: 2,
    label: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'red',
          borderRadius: 12,
        }}
      />
    ),
    children: <View style={{flex: 1, backgroundColor: 'red'}} />,
  },
  {
    key: 3,
    label: (
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'blue',
          borderRadius: 12,
        }}
      />
    ),
    children: <View style={{flex: 1, backgroundColor: 'blue'}} />,
  },
];

export default App;

// import React from 'react';
// import {Text, View, StyleSheet} from 'react-native';
// import normalize from 'react-native-normalize';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.box}>
//           <Text style={styles.text}>React Native Normalize</Text>
//         </View>
//       </View>
//     );
//   }
// }

// console.log(normalize(20));

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   box: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: normalize(180, 'height'),
//     left: normalize(40),
//     width: normalize(300),
//     height: normalize(300),
//     borderRadius: normalize(150),
//     backgroundColor: '#009fcd',
//   },
//   text: {
//     fontSize: normalize(20),
//     color: 'white',
//   },
// });
