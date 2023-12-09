/* eslint-disable react/no-unstable-nested-components */
import AuthStackNavigator from '@/features/auth/navigation'
import { getAccessToken, getUserInfo } from '@/features/auth/slice/selectors'
import Home from '@/features/post/screens/Home'
import { useAppSelector } from '@/store/type'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { memo, useMemo } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppStackParams, AppTabParams } from './types'

import { Icons } from '@/assets'
import TabIcon from '@/components/TabIcon'
import CreatePost from '@/features/post/screens/CreatePost'

import { useTheme } from '@emotion/react'

import { BOTTOM_TAB_HEIGHT } from '@/theme/helper'
import { StatusBar } from 'react-native'

import MyProfile from '@/features/profile/screens/MyProfile'

import MyInfoTab from './MyInfoTab'

const { Navigator: TabNavigator, Screen: TabScreen } =
    createBottomTabNavigator<AppTabParams>()

const { Navigator: NavigatorStack, Screen: ScreenStack } =
    createNativeStackNavigator<AppStackParams>()

const AppTabNavigator = memo(() => {
    const { colors } = useTheme()

    return (
        <TabNavigator
            initialRouteName="Dashboard"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: BOTTOM_TAB_HEIGHT,
                    backgroundColor: colors.palette.black[0],
                    borderTopColor: 'rgba(105, 107, 124, 0.3)',
                },
                headerShown: false,
            }}>
            <TabScreen
                name={'Dashboard'}
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            label={'Dashboard'}
                            focused={focused}
                            icon={Icons.DashboardIc}
                        />
                    ),
                }}
            />
            <TabScreen
                name={'Profile'}
                component={MyProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MyInfoTab focused={focused} />
                    ),
                }}
            />
        </TabNavigator>
    )
})

const AppStackNavigator = () => {
    return (
        <NavigatorStack
            initialRouteName={'Tab'}
            screenOptions={{
                headerShown: false,
            }}>
            <ScreenStack name={'Tab'} component={AppTabNavigator} />
            <ScreenStack
                name={'CreatePost'}
                options={{ gestureEnabled: false }}
                component={CreatePost}
            />
        </NavigatorStack>
    )
}

export const NavigationRouter = () => {
    const accessToken = useAppSelector(getAccessToken)
    const userInfo = useAppSelector(getUserInfo)

    const isLoggedIn = useMemo(
        () => !!accessToken && !!userInfo?.profile,
        [accessToken, userInfo]
    )

    const { colors } = useTheme()

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar
                    backgroundColor={colors.primary}
                    barStyle={'light-content'}
                />
                {!isLoggedIn ? <AppStackNavigator /> : <AuthStackNavigator />}
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
