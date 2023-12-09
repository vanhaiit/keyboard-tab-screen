import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParams = {
  Login: undefined;
};

export type AuthStackScreen<RouteName extends keyof AuthStackParams> = React.FC<
  NativeStackScreenProps<AuthStackParams, RouteName>
>;
