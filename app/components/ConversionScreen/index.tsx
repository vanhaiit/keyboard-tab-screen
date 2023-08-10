import React, {useEffect, useState} from 'react';
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard, ScrollView,
    Modal,
    Pressable,
    SafeAreaView,
    TouchableOpacity,
    InputAccessoryView,
    Image,
    FlatList,
     Animated
} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useAnimatedKeyboard, useAnimatedStyle} from 'react-native-reanimated'
import {useRef} from "react/index";
import KeyBoardInput from '../../base/components/KeyBoardInput'

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

const KeyboardAvoidingComponent = () => {
    const keyboard = useAnimatedKeyboard();
    const insets = useSafeAreaInsets();
    const [animatedHeight] = useState(new Animated.Value(0));
    const [heightKeyBoard, setHeightKeyBoard] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [inputText, setInputText] = useState('');
    const isFocusRef = useRef(false);
    const [chatData, setChatData] = useState([]);

    // Todo: Đăng kí lắng nghe sự kiện thay đổi height KeyBoard
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    //
    useEffect(() => {
        async function getHeightKeyBoard() {
            const _heightKeyBoard = await AsyncStorage.getItem('heightKeyBoard') || 300;
            setHeightKeyBoard(parseInt(_heightKeyBoard));
        }
        getHeightKeyBoard().then()
    }, []);

    const onSetHeightShowKeyBoard = () => {
        const toValue = 0;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 320, // Set the animation duration in milliseconds
            useNativeDriver: false, // Make sure to set this to false for View height animations
        }).start();
    }

    const onSetHeightHideKeyBoard = () => {
        const toValue = 0;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 320, // Set the animation duration in milliseconds
            useNativeDriver: false, // Make sure to set this to false for View height animations
        }).start();
    }

    const handleSendPress = () => {
        if (inputText.trim() !== '') {
            setChatData((prevChatData) => [{ id: Date.now(), message: inputText.trim() }, ...prevChatData]);
            setInputText('');
        }
    };

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

    const onKeyboardDidShow = (e) => {
        setHeightKeyBoard(e.endCoordinates.height);
        AsyncStorage.setItem('heightKeyBoard', e.endCoordinates.height.toString()).then();
        if(isFocusRef.current) {
            const toValue = e.endCoordinates.height - insets.bottom;
            Animated.timing(animatedHeight, {
                toValue,
                duration: 200, // Set the animation duration in milliseconds
                useNativeDriver: false, // Make sure to set this to false for View height animations
            }).start();
        }
    }

    const onKeyboardDidHide = (e) => {
        // setShowKeyboard(false)
    }

    const onSubmit= (e) => {
        const toValue = heightKeyBoard - insets.bottom;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 200, // Set the animation duration in milliseconds
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

    const onMessage = () => {
        onSetHeightHideKeyBoard()
        Keyboard.dismiss();
        setShowImage(false)
    }



    const renderChatItem = ({ item }) => (
        <TouchableOpacity style={styles.messageContainer}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Trò chuyện</Text>
            <TouchableWithoutFeedback onPress={onMessage} style={{flex: 1, backgroundColor: 'red'}}>
                <FlatList
                    data={chatData}
                    renderItem={renderChatItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.chatContainer}
                    keyboardDismissMode={'on-drag'}
                    inverted // To display the chat messages from bottom to top
                />
            </TouchableWithoutFeedback>

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

            <View style={{height: animatedHeight}}>
                {showImage && <ImageList />}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
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
        backgroundColor: '#fff'
    },

    inner: {
        height: 56,
        flexDirection: 'row',
    },
    header: {
        fontSize: 36,
        fontWeight: "500",
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
        height: 300
        // marginTop: 22,
    },

    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 16,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sendIcon: {
        width: 24,
        height: 24,
    },
});

export default KeyboardAvoidingComponent;