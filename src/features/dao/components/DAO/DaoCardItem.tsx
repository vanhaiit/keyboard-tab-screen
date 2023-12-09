import { Icons } from '@/assets';
import Avatar from '@/components/Avatar';
import Row from '@/components/Row';
import { H4, Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { TouchableOpacity, View } from 'react-native';
import { DAO } from '../../types';
import { AppStackParams } from '@/navigations/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Container = styled(Row)(
  ({ theme: { space, horizontalSpace, colors, borderRadius } }) => ({
    gap: space[2],
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[2],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.medium,
    marginBottom: space[2],
  }),
);

const CustomRow = styled(Row)(({ theme: { space } }) => ({
  gap: space[4],
  flex: 1,
}));

const LeftContainer = styled(Row)(({ theme: { space } }) => ({
  gap: space[4],
  justifyContent: 'space-between',
  flex: 1,
}));

const LockButton = styled.View<{
  mode: 'lock' | 'unlock';
}>(({ theme: { colors, space, styles, horizontalSpace }, mode }) => ({
  backgroundColor: mode === 'unlock' ? colors.darkYellow : colors.lightRed,
  width: horizontalSpace[21],
  height: space[8],
  flexDirection: 'row',
  borderRadius: 8,
  ...styles.center,
}));

const IconBox = styled.View(({ theme: { space, horizontalSpace } }) => ({
  height: space[5],
  width: horizontalSpace[5],
}));

interface Props {
  item: DAO;
}

const DaoCardItem = ({ item }: Props) => {
  const { colors, space } = useTheme();
  const { navigate } = useNavigation<NavigationProp<AppStackParams>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigate('DetailDAO', { id: item.id });
      }}>
      <Container>
        <Avatar
          size={space[10]}
          url={item.avatar?.url}
          defaultSource={require('@/assets/images/gray-logo.png')}
        />
        <LeftContainer>
          <View>
            <H4 numberOfLines={1} fontWeight="bold">
              {item.name}
            </H4>
            <CustomRow>
              <Label color={colors.grey[1]}>
                {item.totalFollowers} Followers
              </Label>
              <Label color={colors.grey[1]}>{item.totalPosts} Posts</Label>
            </CustomRow>
          </View>
          <LockButton
            mode={item.classification === 'private' ? 'lock' : 'unlock'}>
            {item.classification === 'private' ? (
              <IconBox>
                <Icons.LockIcon color={colors.alertRed} />
              </IconBox>
            ) : (
              <IconBox>
                <Icons.UnlockIcon color={colors.lightGreen} />
              </IconBox>
            )}
            {item.classification === 'private' ? (
              <Label color={colors.alertRed} fontWeight="bold">
                Private
              </Label>
            ) : (
              <Label color={colors.lightGreen} fontWeight="bold">
                Public
              </Label>
            )}
          </LockButton>
        </LeftContainer>
      </Container>
    </TouchableOpacity>
  );
};

export default DaoCardItem;
