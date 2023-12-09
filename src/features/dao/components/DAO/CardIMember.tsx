import FastImage from 'react-native-fast-image';
import styled from '@emotion/native';
import Row from '@/components/Row';
import { useTheme } from '@emotion/react';
import { LargeLabel } from '@/components/Typography';
import { useNavigation } from '@react-navigation/native';

const ProfileCard = styled.TouchableOpacity(
  ({ theme: { space, borderRadius, colors, horizontalSpace } }) => ({
    borderRadius: borderRadius.small,
    marginBottom: space[2],
    height: space[14],
    backgroundColor: colors.black[2],
    paddingHorizontal: horizontalSpace[4],
    flexDirection: 'row',
    alignItems: 'center',
  }),
);

const UsernameWrapper = styled.View(({ theme }) => ({
  flex: 1,
  marginRight: theme.space[2],
}));

export const FastImageStyle = styled(FastImage)(
  ({ theme: { space, borderRadius } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    marginRight: space[2],
  }),
);

interface ICardItem {
  avatar: string;
  userName: string;
  actionContent?: React.ReactNode;
  id: string;
}

export const CardIMember = ({
  avatar,
  userName,
  actionContent,
  id,
}: ICardItem) => {
  const { styles } = useTheme();
  const { navigate } = useNavigation() as any;

  return (
    <ProfileCard onPress={() => navigate('ProfileDetail', { profileId: id })}>
      <Row style={styles.fill}>
        <FastImageStyle
          source={
            avatar
              ? {
                  uri: avatar,
                }
              : require('@/assets/images/gray-logo.png')
          }
        />
        <UsernameWrapper>
          <LargeLabel fontWeight="bold" numberOfLines={1}>
            {userName}
          </LargeLabel>
        </UsernameWrapper>
      </Row>
      {actionContent}
    </ProfileCard>
  );
};
