import React, {useEffect, useState} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Animated
} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useRef} from "react/index";

const ImageList = () => {
    // Mô phỏng danh sách các ảnh
    const imageList = [
        { id: '1', source: 'https://example.com/image1.jpg' },
        { id: '2', source: 'https://example.com/image2.jpg' },
        { id: '3', source: 'https://example.com/image2.jpg' },
        { id: '4', source: 'https://example.com/image2.jpg' },
        { id: '5', source: 'https://example.com/image2.jpg' },
        { id: '6', source: 'https://example.com/image2.jpg' },
        // Thêm các ảnh khác vào đây...
    ];

    return (
        <View style={styles.imageListContainer}>
            {imageList.map((image) => (
                <TouchableOpacity key={image.id} style={styles.imageItem}>
                    {/* Hiển thị ảnh tại đây */}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const KeyboardAvoidingComponent = ({handleSendPress}) => {
    const insets = useSafeAreaInsets();
    const [animatedHeight] = useState(new Animated.Value(0));
    const [heightKeyBoard, setHeightKeyBoard] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [inputText, setInputText] = useState('');
    const isFocusRef = useRef(false);

    const handleEmojiPickerPress = () => {
        // Implement the logic to open the emoji picker here
        // You can use libraries like 'react-native-emoji-picker' for this purpose
        onSubmit()
    };

    const handleImagePickerPress = () => {
        // Implement the logic to open the image picker here
        // You can use libraries like 'react-native-image-picker' for this purpose
        setShowImage(true);
        onSubmit()
    };

    useEffect(() => {
        async function getHeightKeyBoard() {
            const _heightKeyBoard = await AsyncStorage.getItem('heightKeyBoard') || 0;
            setHeightKeyBoard(parseInt(_heightKeyBoard));
        }
        getHeightKeyBoard().then()

        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const onKeyboardDidShow = (e) => {
        if(isFocusRef.current) {
            const toValue = e.endCoordinates.height - insets.bottom;
            Animated.timing(animatedHeight, {
                toValue,
                duration: 320, // Set the animation duration in milliseconds
                useNativeDriver: false, // Make sure to set this to false for View height animations
            }).start();
        }
        setHeightKeyBoard(e.endCoordinates.height);
        AsyncStorage.setItem('heightKeyBoard', e.endCoordinates.height.toString()).then();
    }

    const onKeyboardDidHide = (e) => {
        // setShowKeyboard(false)
    }

    const onSubmit= (e) => {
        const toValue = heightKeyBoard - insets.bottom;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 320, // Set the animation duration in milliseconds
            useNativeDriver: false, // Make sure to set this to false for View height animations
        }).start();
        Keyboard.dismiss()
    }

    const onFocus = () => {
        isFocusRef.current = true
        const toValue = heightKeyBoard - insets.bottom;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 300, // Set the animation duration in milliseconds
            useNativeDriver: false, // Make sure to set this to false for View height animations
        }).start();
    }

    const onBlur = () => {
        isFocusRef.current = false
    }

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                }}
            >
                <TouchableOpacity onPress={handleEmojiPickerPress} style={{marginRight: 12}}>
                    {/*<Image source={require('./path_to_emoji_icon.png')} style={{ width: 24, height: 24 }} />*/}
                    <View style={{ width: 24, height: 24, backgroundColor: 'red', borderRadius: 12 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePickerPress}>
                    <View style={{ width: 24, height: 24, backgroundColor: 'green', borderRadius: 12 }} />
                    {/*<Image source={require('./path_to_image_icon.png')} style={{ width: 24, height: 24 }} />*/}
                </TouchableOpacity>
                <TextInput
                    style={{ flex: 1, marginHorizontal: 10, padding: 8, backgroundColor: '#fff' }}
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <TouchableOpacity onPress={handleSendPress}>
                    <View style={{ width: 24, height: 24, backgroundColor: 'blue', borderRadius: 12 }} />
                    {/*<Image source={require('./path_to_send_icon.png')} style={{ width: 24, height: 24 }} />*/}
                </TouchableOpacity>
            </View>

            <Animated.View style={{height: animatedHeight}}>
                {showImage && <ImageList />}
            </Animated.View>
        </View>

    );
};

const styles = StyleSheet.create({
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
});

export default KeyboardAvoidingComponent;