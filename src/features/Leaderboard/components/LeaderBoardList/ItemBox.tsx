import { Icons } from '@/assets';
import Avatar from '@/components/Avatar';
import ButtonChip from '@/components/ButtonChip';
import Row from '@/components/Row';
import { H4, H5, Label, TinyLabel } from '@/components/Typography';
import { Category } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { LeaderBoardTypes } from '.';

const Container = styled.View(({ theme: { colors, space } }) => ({
  backgroundColor: colors.black[2],
  paddingVertical: space[4],
  paddingHorizontal: space[4],
  borderRadius: 10,
}));

const Header = styled.View(() => ({
  flexDirection: 'row',
  gap: 8,
  justifyContent: 'space-between',
}));

const InfoBox = styled.View(() => ({
  flex: 1,
}));
const LeftInfo = styled(Row)(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  flex: 1,
}));

const IconBox = styled.View(({ theme: { horizontalSpace, colors } }) => ({
  width: horizontalSpace[6],
  height: horizontalSpace[6],
  backgroundColor: colors.lightGreen,
  borderRadius: 100,
  justifyContent: 'center',
}));

const StyledText = styled(Label)(() => ({
  textAlign: 'center',
}));

const Body = styled.View(({ theme: { space } }) => ({
  marginTop: space[4],
  gap: space[2],
}));

const StyledRow = styled(Row)(({ theme: { horizontalSpace } }) => ({
  flex: 1,
  justifyContent: 'space-between',
  gap: horizontalSpace[5],
  alignItems: 'flex-start',
}));
const TotalEarn = styled.View(() => ({
  alignItems: 'flex-end',
}));
const BadgeWrapper = styled.View(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  flexDirection: 'row',
  flexWrap: 'wrap',
  flex: 1,
  justifyContent: 'flex-end',
}));
interface Props {
  data: any;
  position: number;
  type: LeaderBoardTypes;
}

const LeaderItem = ({ data, position, type }: Props) => {
  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'LeaderBoard'>>();
  const { colors, horizontalSpace } = useTheme();

  const styles = useMemo(() => {
    return {
      marginRight: 0,
    };
  }, []);

  const renderIcon = useMemo(() => {
    if (position === 1) {
      return <Icons.Top1Icon />;
    } else if (position === 2) {
      return <Icons.Top2Icon />;
    } else if (position === 3) {
      return <Icons.Top3Icon />;
    }
    return (
      <IconBox>
        <StyledText color="black" fontWeight="bold">
          {position}
        </StyledText>
      </IconBox>
    );
  }, [position]);

  const handleAvatarClick = useCallback(() => {
    if (type === 'DAOs') {
      navigate('DetailDAO', {
        id: data.id,
      });
    } else {
      navigate('ProfileDetail', {
        profileId: data.id,
      });
    }
  }, [data.id, navigate, type]);

  return (
    <Container>
      <Header>
        <LeftInfo>
          <Pressable onPress={handleAvatarClick}>
            <Avatar
              size={horizontalSpace[10]}
              url={data.avatar?.url}
              defaultSource={require('@/assets/images/gray-logo.png')}
            />
          </Pressable>
          <InfoBox>
            <H4 numberOfLines={1} fontWeight="bold">
              {type === 'DAOs' ? data.name : data.username}
            </H4>
            <Label numberOfLines={1} color={colors.grey[1]} fontWeight="medium">
              {type !== 'DAOs' ? `@${data.unique_id}` : ''}
            </Label>
          </InfoBox>
        </LeftInfo>
        {renderIcon}
      </Header>
      <Body>
        <StyledRow>
          <H5 color={colors.grey[1]}>Post</H5>
          <H5 fontWeight="medium">{formatLargeNumber(data.totalPosts, 1)}</H5>
        </StyledRow>
        {type === 'Earned' && (
          <>
            <StyledRow>
              <H5 color={colors.grey[1]}>Comment</H5>
              <H5 fontWeight="medium">
                {formatLargeNumber(data.totalComments, 1)}
              </H5>
            </StyledRow>
            <StyledRow>
              <H5 color={colors.grey[1]}>Upvoted</H5>
              <H5 fontWeight="medium">
                {formatLargeNumber(data.totalLikes, 1)}
              </H5>
            </StyledRow>
            <StyledRow>
              <H5 color={colors.grey[1]}>Earned</H5>
              <H5 color={colors.lightGreen} fontWeight="medium">
                +{formatLargeNumber(data.reward, 2, 0.01)} THINK
              </H5>
            </StyledRow>
          </>
        )}

        {type === 'Followed' && (
          <>
            <StyledRow>
              <H5 color={colors.grey[1]}>Follower</H5>
              <H5 fontWeight="medium">
                {formatLargeNumber(data.totalFollow, 1)}
              </H5>
            </StyledRow>
          </>
        )}

        {type === 'DAOs' && (
          <>
            <StyledRow>
              <H5 color={colors.grey[1]}>Region</H5>
              <H5 fontWeight="medium">{data.region}</H5>
            </StyledRow>
            <StyledRow>
              <H5 color={colors.grey[1]}>Follower</H5>
              <H5 fontWeight="medium">
                {formatLargeNumber(data.totalFollowers, 1)}
              </H5>
            </StyledRow>
            <StyledRow>
              <H5 color={colors.grey[1]}>Badge</H5>
              <BadgeWrapper>
                {(data.categories || []).slice(0, 3).map((item: Category) => (
                  <ButtonChip
                    key={item.id}
                    style={styles}
                    imageSrc={{
                      uri: item.icon?.url,
                    }}
                    label={item.name}
                  />
                ))}
              </BadgeWrapper>
            </StyledRow>
          </>
        )}
        {type === 'Earned' && (
          <TotalEarn>
            <TinyLabel color={colors.grey[1]}>
              Total {formatLargeNumber(data.totalReward, 2)} THINK
            </TinyLabel>
          </TotalEarn>
        )}
      </Body>
    </Container>
  );
};

export default LeaderItem;
