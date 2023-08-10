/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 08/08/2023.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

/*
 * The KeyboardAvoidingView is only used on ios
 */
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Reanimated, {
    KeyboardState,
    useAnimatedKeyboard,
    useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const KeyboardAvoidingView = ({behavior, style, children}) => {
    const keyboard = useAnimatedKeyboard();
    const insets = useSafeAreaInsets();

    // similar to using `global` in worklet but it's just a local object
    const [ctx] = useState({});

    const animatedStyle = useAnimatedStyle(() => {
        let value = keyboard.height.value;

        // this whole section helps to avoid flickering when keyboard is closing and modal is opening
        // if (
        //   keyboard.state.value === KeyboardState.CLOSING ||
        //   keyboard.state.value === KeyboardState.OPENING
        // ) {
        //   value = keyboard.height.value;
        // } else if (
        //   keyboard.state.value === KeyboardState.OPEN &&
        //   keyboard.height.value === 0
        // ) {
        //   // when we open modal keyboard is closed without animation and the height is 0
        //   // but when we close modal - it opens it again but for one frame the height is still 0
        //   value = ctx.keyboardLastValue;
        // } else if (keyboard.state.value === KeyboardState.CLOSED) {
        //   value = 0;
        // } else {
        //   ctx.keyboardLastValue = keyboard.height.value;
        //   value = keyboard.height.value;
        // }

        value = Math.max(0, value - insets.bottom);

        console.log('value', value);

        if (behavior === 'height') {
            return {
                height: value,
            };
        }

        if (behavior === 'padding') {
            return {
                paddingBottom: value,
            };
        }

        if (behavior === 'position') {
            return {
                bottom: value,
            };
        }

        return {};
    });

    const additionalStyle = behavior === 'height' ? {flex: 0} : {};

    return (
        <Reanimated.View
            style={[additionalStyle, StyleSheet.flatten(style), animatedStyle]}>
            {children}
        </Reanimated.View>
    );
};

KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';

export default KeyboardAvoidingView;