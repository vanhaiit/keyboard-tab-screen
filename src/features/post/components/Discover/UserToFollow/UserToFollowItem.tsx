import { Icons } from '@/assets';
import Avatar from '@/components/Avatar';
import Row from '@/components/Row';
import Skeleton from '@/components/Skeleton';
import { H2, H5, Label } from '@/components/Typography';
import { useGetPostsQuery } from '@/features/post/slice/api';
import { UserProfile } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

const Container = styled.View(({ theme: { space, horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  paddingVertical: space[4],
  gap: space[4],
}));

const Header = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[3],
  alignItems: 'center',
}));

const Item = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[1],
}));

const CustomRow = styled(Row)(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[4],
}));

const Body = styled.View(({ theme: { space } }) => ({
  gap: space[2],
}));

const PostItem = styled.TouchableOpacity(
  ({ theme: { horizontalSpace, colors, space } }) => ({
    flexDirection: 'row',
    gap: horizontalSpace[2],
    flex: 1,
    backgroundColor: colors.black[0],
    paddingHorizontal: horizontalSpace[2],
    paddingVertical: space[4],
    borderRadius: 10,
  }),
);
const ItemLeft = styled.View(() => ({
  flex: 1,
}));

const ItemRight = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const IconWrapper = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[4],
  height: horizontalSpace[4],
  transform: [
    {
      rotate: '270deg',
    },
  ],
}));
const SkeletonBar = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[2],
  width: '80%',
  backgroundColor: colors.black[1],
}));
const SkeletonWrapper = styled.View(
  ({ theme: { colors, horizontalSpace, space } }) => ({
    gap: horizontalSpace[2],
    flex: 1,
    backgroundColor: colors.black[0],
    paddingHorizontal: horizontalSpace[2],
    paddingVertical: space[4],
    borderRadius: 10,
  }),
);
const UserName = styled(H2)(() => ({
  width: '100%',
}));
interface Props {
  data: UserProfile;
}

const UserToFollowItem = ({ data }: Props) => {
  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Dashboard'>>();
  const { data: posts, isLoading } = useGetPostsQuery({
    _sort: 'topScore:desc',
    _limit: 3,
    _start: 0,
    profile: data.id,
  });
  const { horizontalSpace, colors } = useTheme();

  return (
    <Container>
      <Header>
        <Pressable
          onPress={() =>
            navigate('ProfileDetail', {
              profileId: data.id,
            })
          }>
          <Avatar url={data.avatar?.url} size={horizontalSpace[15]} />
        </Pressable>
        <ItemLeft>
          <UserName numberOfLines={1} fontWeight="bold">
            {data.username}
          </UserName>
          <CustomRow>
            <Item>
              <H5 color={colors.grey[1]}>Follower</H5>
              <H5>{formatLargeNumber(data.totalFollowers.toString(), 2)}</H5>
            </Item>
            <Item>
              <H5 color={colors.grey[1]}>Post</H5>
              <H5>{formatLargeNumber(data.totalPosts.toString(), 2)}</H5>
            </Item>
          </CustomRow>
        </ItemLeft>
      </Header>
      <Body>
        {isLoading ? (
          <>
            <SkeletonWrapper>
              <SkeletonBar />
              <SkeletonBar />
            </SkeletonWrapper>
            <SkeletonWrapper>
              <SkeletonBar />
              <SkeletonBar />
            </SkeletonWrapper>
            <SkeletonWrapper>
              <SkeletonBar />
              <SkeletonBar />
            </SkeletonWrapper>
          </>
        ) : (
          (posts || [])?.map(post => {
            const viewText = post.views > 1 ? 'Views' : 'View';
            return (
              <PostItem
                onPress={() => {
                  navigate('PostDetails', { post: post });
                }}
                key={post.id}>
                <ItemLeft>
                  <H5 fontWeight="bold" numberOfLines={1}>
                    {post.title}
                  </H5>
                  <Label
                    color={colors.grey[1]}
                    fontWeight="medium"
                    numberOfLines={1}>
                    {post.keywords}
                  </Label>
                </ItemLeft>
                <ItemRight>
                  <Label color={colors.grey[1]}>
                    {formatLargeNumber(post.views.toString(), 2)} {viewText}
                  </Label>
                  <IconWrapper>
                    <Icons.ArrowDown />
                  </IconWrapper>
                </ItemRight>
              </PostItem>
            );
          })
        )}
      </Body>
    </Container>
  );
};

export default UserToFollowItem;
