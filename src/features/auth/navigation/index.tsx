import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParams } from './types';
import Login from '../screens/Login';

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'Login'}>
      <AuthStack.Screen name={'Login'} component={Login} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
