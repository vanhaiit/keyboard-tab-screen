import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import FastImage from 'react-native-fast-image';
import DiscoverHeader from '../DiscoverHeader';
import TopPositions from './TopPositions';
import { UserProfile } from '@/features/profile/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { useCallback } from 'react';

const Container = styled.View(({ theme: { horizontalSpace, space } }) => ({
  paddingHorizontal: horizontalSpace[4],
  marginTop: space[4],
  gap: space[4],
}));

const Body = styled.View(({ theme: { colors, horizontalSpace, space } }) => ({
  backgroundColor: colors.black[2],
  paddingHorizontal: horizontalSpace[4],
  paddingVertical: space[4],
  borderRadius: 10,
}));

const ItemWrapper = styled.Pressable(
  ({ theme: { horizontalSpace, space, colors } }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: horizontalSpace[2],
    backgroundColor: colors.black[3],
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[2],
    borderRadius: 8,
    flex: 1,
  }),
);
const Box = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: horizontalSpace[2],
  flex: 1,
}));
const StyledImage = styled(FastImage)(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[10],
  height: horizontalSpace[10],
  borderRadius: 100,
}));

const ItemContainer = styled(FastImage)(({ theme: { space } }) => ({
  gap: space[2],
  marginTop: space[6],
}));

const CustomLabel = styled(Label)(() => ({
  flex: 1,
}));

interface Props {
  data: UserProfile[];
}

const LeaderBoard = ({ data }: Props) => {
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();

  const handleSeemorePress = useCallback(() => {
    navigate('LeaderBoard');
  }, [navigate]);

  return (
    <Container>
      <DiscoverHeader
        leftLabel="Leaderboard"
        onSeeMorePress={handleSeemorePress}
      />
      <Body>
        <TopPositions data={data.slice(0, 3)} />
        <ItemContainer>
          {data.slice(3, 6).map((user, index) => {
            return (
              <ItemWrapper
                onPress={() =>
                  navigate('ProfileDetail', {
                    profileId: user.id,
                  })
                }
                key={user.id}>
                <Box>
                  <Label fontWeight="medium">{index + 4}</Label>
                  <StyledImage
                    source={
                      user.avatar?.url
                        ? {
                            uri: user.avatar?.url,
                          }
                        : require('@/assets/images/gray-logo.png')
                    }
                  />
                  <CustomLabel numberOfLines={1} fontWeight="bold">
                    {user.username}
                  </CustomLabel>
                </Box>
                <Label fontWeight="bold">
                  +{formatLargeNumber((user.reward || 0).toString(), 2)} THINK
                </Label>
              </ItemWrapper>
            );
          })}
        </ItemContainer>
      </Body>
    </Container>
  );
};
export default LeaderBoard;
