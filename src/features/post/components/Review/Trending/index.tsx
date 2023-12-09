import { Icons } from '@/assets';
import { Label } from '@/components/Typography';
import { IPost } from '@/features/post/types/Post';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import EmptyPostList from '../../EmptyPostList';
import Post from '../../Post';
import TrendingSkeleton from './TrendingSkeleton';

const Container = styled(View)(({ theme: { space } }) => ({
  marginTop: space[9],
}));

const PostItem = styled(View)(({ theme: { horizontalSpace, window } }) => ({
  height: window.height * 0.51,
  width: window.width - horizontalSpace[18],
}));

const TitleWrapper = styled(View)(({ theme: { horizontalSpace, space } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: horizontalSpace[4],
  alignItems: 'center',
  marginBottom: space[4],
}));

const Title = styled(Label)(({ theme: { colors } }) => ({
  color: colors.lightGreen,
}));

const EmptyContainer = styled(View)(
  ({ theme: { space, horizontalSpace } }) => ({
    marginHorizontal: horizontalSpace[4],
    height: space[45],
  }),
);

const StyledPressable = styled.TouchableOpacity(
  ({ theme: { horizontalSpace } }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalSpace[1],
  }),
);

interface Props {
  data: IPost[];
  loading: boolean;
  title?: string;
  onSeeMore?: () => void;
}

const Trending = ({ data, loading, title = 'Trending', onSeeMore }: Props) => {
  const { space, colors, styles } = useTheme();

  const containerStyles = useMemo(
    () => ({
      gap: space[4],
      marginLeft: space[4],
      paddingRight: space[10],
    }),
    [space],
  );

  return (
    <Container>
      <TitleWrapper>
        <Title fontWeight="bold">{title}</Title>
        {onSeeMore && (
          <StyledPressable onPress={onSeeMore}>
            <Icons.PlusIc color={colors.white} />
            <Label fontWeight="bold">See more</Label>
          </StyledPressable>
        )}
      </TitleWrapper>

      {loading ? (
        <TrendingSkeleton />
      ) : data.length > 0 ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={containerStyles}
          horizontal={true}>
          {data.length > 0 &&
            data.map(item => {
              return (
                <PostItem key={item.id}>
                  <Post postData={item} mode={'Trending'} style={styles.fill} />
                </PostItem>
              );
            })}
        </ScrollView>
      ) : (
        <EmptyContainer>
          <EmptyPostList />
        </EmptyContainer>
      )}
    </Container>
  );
};

export default Trending;
