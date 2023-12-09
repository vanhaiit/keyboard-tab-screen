import { Label, TinyLabel } from '@/components/Typography';
import { UserProfile } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import LeaderAvatar from './LeaderAvatar';

const Container = styled.View(({ theme: { horizontalSpace, space } }) => ({
  gap: horizontalSpace[3],
  justifyContent: 'flex-end',
  height: space[39],
}));

const Item = styled.Pressable<{
  alignSelf: 'center' | 'flex-start' | 'flex-end';
}>(({ theme: { space }, alignSelf }) => ({
  gap: space[4],
  position: 'absolute',
  alignSelf,
}));

const Detail = styled.View(() => ({
  alignItems: 'center',
}));

interface Props {
  data: UserProfile[];
}

const TopPositions = ({ data }: Props) => {
  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Dashboard'>>();

  const { colors } = useTheme();

  return (
    <Container>
      {data[1] && (
        <Item
          alignSelf="flex-start"
          onPress={() =>
            navigate('ProfileDetail', {
              profileId: data[1].id,
            })
          }>
          <LeaderAvatar url={data[1].avatar?.url} position="2nd" />
          <Detail>
            <TinyLabel fontWeight="medium" color={colors.black[1]}>
              {data[1].username}
            </TinyLabel>
            <Label fontWeight="bold" color={colors.white}>
              +{formatLargeNumber((data[1].reward || 0).toString(), 2)} THINK
            </Label>
          </Detail>
        </Item>
      )}
      {data[0] && (
        <Item
          alignSelf="center"
          onPress={() =>
            navigate('ProfileDetail', {
              profileId: data[0].id,
            })
          }>
          <LeaderAvatar url={data[0].avatar?.url} position="1st" />
          <Detail>
            <TinyLabel fontWeight="medium" color={colors.white}>
              {data[0].username}
            </TinyLabel>
            <Label fontWeight="bold" color={colors.lightGreen}>
              +{formatLargeNumber((data[0].reward || 0).toString(), 2)} THINK
            </Label>
          </Detail>
        </Item>
      )}
      {data[2] && (
        <Item
          alignSelf="flex-end"
          onPress={() =>
            navigate('ProfileDetail', {
              profileId: data[2].id,
            })
          }>
          <LeaderAvatar url={data[2].avatar?.url} position="3rd" />
          <Detail>
            <TinyLabel fontWeight="medium" color={colors.black[1]}>
              {data[2].username}
            </TinyLabel>
            <Label fontWeight="bold" color={colors.white}>
              +{formatLargeNumber((data[2].reward || 0).toString(), 2)} THINK
            </Label>
          </Detail>
        </Item>
      )}
    </Container>
  );
};

export default TopPositions;
