import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Platform, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { TinyLabel } from './Typography';
import { scale } from '@/theme/helper';
import { useState } from 'react';
import FloatingActionMenu from './FloatingActionMenu';

const Container = styled(View)({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});
const CustomButton = styled.Pressable(({ theme: { space, styles } }) => ({
  position: 'absolute',
  top: -space[3],
  ...styles.center,
}));
const CircleBox = styled.View(
  ({ theme: { colors, space, borderRadius, styles } }) => ({
    backgroundColor: colors.lightGreen,
    height: space[15],
    width: space[15],
    borderRadius: borderRadius.full,
    ...styles.center,
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        shadowOffset: {
          width: 0,
          height: 4,
        },
      },
    }),
    shadowColor: colors.lightGreen,
  }),
);

export const TabLabel = styled(TinyLabel)<{
  active?: boolean;
}>(({ theme: { colors }, active }) => ({
  color: active ? colors.lightGreen : colors.grey[1],
  marginTop: scale(6),
}));

interface Props {
  label: string;
  focused: boolean;
  icon: React.FC<SvgProps>;
  isCreate?: boolean;
}

const TabIcon: React.FC<Props> = ({ label, isCreate, icon: Icon, focused }) => {
  const { colors, space } = useTheme();
  const [isActionMenuVisible, setActionMenuVisible] = useState(false);

  return (
    <Container>
      {isCreate ? (
        <CustomButton
          onPress={() => {
            setActionMenuVisible(true);
          }}>
          <CircleBox>
            <Icon color={colors.black[0]} width={space[6]} height={space[6]} />
          </CircleBox>
        </CustomButton>
      ) : (
        <Icon
          color={focused ? colors.palette.lightGreen : colors.palette.grey[1]}
          width={space[6]}
          height={space[6]}
        />
      )}

      <TabLabel active={focused}>{label}</TabLabel>

      <FloatingActionMenu
        isVisible={isActionMenuVisible}
        close={() => setActionMenuVisible(false)}
      />
    </Container>
  );
};

export default TabIcon;
