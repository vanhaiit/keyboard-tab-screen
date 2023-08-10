/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
    Button,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import KeyboardAvoidingView from './KeyboardAvoidingView';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

function Input() {
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            style={{
                marginBottom: insets.bottom,
            }}
            behavior="padding">
            <TextInput style={styles.textInput} />
        </KeyboardAvoidingView>
    );
}

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <ScrollView
                    // keyboardShouldPersistTaps="always"
                    // keyboardDismissMode="on-drag"
                    style={[backgroundStyle]}>
                    <Header />
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        }}>
                        <Button title="Dismiss keyboard" onPress={Keyboard.dismiss} />
                    </View>
                    <Section title="Dummy section">
                        <Text style={styles.sectionDescription}>
                            This is a dummy section to test the keyboard avoiding view.
                        </Text>
                    </Section>
                    <Section title="Dummy section">
                        <Text style={styles.sectionDescription}>
                            This is a dummy section to test the keyboard avoiding view.
                        </Text>
                    </Section>
                    <Section title="Dummy section">
                        <Text style={styles.sectionDescription}>
                            This is a dummy section to test the keyboard avoiding view.
                        </Text>
                    </Section>
                    <Section title="Dummy section">
                        <Text style={styles.sectionDescription}>
                            This is a dummy section to test the keyboard avoiding view.
                        </Text>
                    </Section>
                    <Section title="Dummy section">
                        <Text style={styles.sectionDescription}>
                            This is a dummy section to test the keyboard avoiding view.
                        </Text>
                    </Section>
                </ScrollView>

                <Input />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;