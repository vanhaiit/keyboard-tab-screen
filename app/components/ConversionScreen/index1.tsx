import React, {useState, useRef, useEffect} from 'react';
import {
    ScrollView,
    TextInput,
    View,
    SafeAreaView,
    Button,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Text, FlatList, InteractionManager
} from 'react-native';
import Animated, {
    useAnimatedKeyboard,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useAnimatedStyle/

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

function App() {
    const keyboard = useAnimatedKeyboard();
    const insets = useSafeAreaInsets();
    const [showImage, setShowImage] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [inputText, setInputText] = useState('');
    const [chatData, setChatData] = useState([]);
    const [heightKeyBoard, setHeightKeyBoard] = useState(0);
    const isKeyBoardRef = useRef(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            if(isKeyBoardRef.current) {
                setShowImage(false);
                setShowEmoji(false);
            }
            setHeightKeyBoard(event.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => {

        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        async function getHeightKeyBoard() {
            const _heightKeyBoard = await AsyncStorage.getItem('heightKeyBoard') || 300;
            setHeightKeyBoard(parseInt(_heightKeyBoard));
        }
        getHeightKeyBoard().then()
    }, []);

    const handleEmojiPickerPress = () => {
        // Implement the logic to open the emoji picker here
        // You can use libraries like 'react-native-emoji-picker' for this purpose
        setShowEmoji(!showEmoji);
        setShowImage(false);
        Keyboard.dismiss()
    };

    const handleImagePickerPress = () => {
        // Implement the logic to open the image picker here
        // You can use libraries like 'react-native-image-picker' for this purpose
        // setShowImage(true);
        setShowImage(!showImage) ;
        setShowEmoji(false);
        Keyboard.dismiss()
    };

    const handleSendPress = () => {
        if (inputText.trim() !== '') {
            setChatData((prevChatData) => [{ id: Date.now(), message: inputText.trim() }, ...prevChatData]);
            setInputText('');
        }
    };

    const translateStyle = useAnimatedStyle(() => {
        console.log('translateStyle', keyboard.height.value, keyboard.state.value, showEmoji, showImage, insets.bottom, heightKeyBoard)

        if(showImage || showEmoji) {
            return {
                height: heightKeyBoard - insets.bottom,
            };
        }

        return {
            height: keyboard.height.value - insets.bottom,
        };
    });

    const onFocus = () => {
        if(!isKeyBoardRef.current) {
            setShowImage(false);
            setShowEmoji(false);
        }
        isKeyBoardRef.current = true;
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
            <FlatList
                data={chatData}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.chatContainer}
                // keyboardDismissMode={'on-drag'}
                // keyboardShouldPersistTaps={'handle'}
                inverted // To display the chat messages from bottom to top
            />
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
                    // onBlur={onBlur}
                />
                <TouchableOpacity onPress={handleSendPress}>
                    <View style={{ width: 24, height: 24, backgroundColor: 'blue', borderRadius: 12 }} />
                    {/*<Image source={require('./path_to_send_icon.png')} style={{ width: 24, height: 24 }} />*/}
                </TouchableOpacity>
            </View>
            <Animated.View style={translateStyle}>
                {
                    showImage && (<ImageList />)
                }
                {
                    showEmoji && (<View style={{flex: 1, backgroundColor: 'blue'}} />)
                }
            </Animated.View>
        </SafeAreaView>

    );
}

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
        backgroundColor: '#fff'
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


export default App;
