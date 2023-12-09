import { Icons } from '@/assets';
import { useTheme } from '@emotion/react';
import {
  HeaderOptions,
  Layout,
  Header as NavigationHeader,
} from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { H1 } from './Typography';

export interface HeaderProps extends HeaderOptions {
  onPressBackButton?: () => void;
  hideHeaderLeft?: boolean;
  modal?: boolean;
  layout?: Layout;
  title?: string;
  note?: React.ReactNode;
}

export default function Header({
  onPressBackButton,
  title,
  hideHeaderLeft,
  ...props
}: HeaderProps) {
  const { colors, space } = useTheme();

  const { goBack, canGoBack } = useNavigation();

  const handleOnLeftPress = () => {
    onPressBackButton ? onPressBackButton() : canGoBack() && goBack();
  };

  let headerLeft = props.headerLeft;
  if (!headerLeft && !hideHeaderLeft) {
    headerLeft = () => (
      <TouchableOpacity onPress={handleOnLeftPress}>
        <Icons.BackArrow
          width={space[5]}
          height={space[5]}
          color={colors.lightGreen}
        />
      </TouchableOpacity>
    );
  }

  return (
    <NavigationHeader
      headerTitle={({ children }) => <H1 fontWeight="bold">{children}</H1>}
      headerTitleStyle={{}}
      headerTitleAlign="left"
      title={title || ''}
      headerLeft={headerLeft}
      headerLeftContainerStyle={{
        paddingLeft: space[4],
      }}
      headerRightContainerStyle={{
        paddingRight: space[3],
      }}
      headerStyle={{
        backgroundColor: colors.black[3],
      }}
      {...props}
    />
  );
}
