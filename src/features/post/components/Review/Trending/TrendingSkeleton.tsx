import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import PostSkeleton from '@/features/post/components/PostListSkeleton/PostSkeleton';

const PostItem = styled(View)(({ theme: { space } }) => ({
  height: space[74],
  width: space[72],
}));
const TrendingSkeleton = () => {
  const { space } = useTheme();

  const containerStyles = useMemo(
    () => ({
      gap: space[4],
      marginLeft: space[4],
    }),
    [space],
  );
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={containerStyles}
      horizontal={true}>
      <PostItem>
        <PostSkeleton mode="Trending" />
      </PostItem>
      <PostItem>
        <PostSkeleton mode="Trending" />
      </PostItem>
      <PostItem>
        <PostSkeleton mode="Trending" />
      </PostItem>
      <PostItem>
        <PostSkeleton mode="Trending" />
      </PostItem>
    </ScrollView>
  );
};

export default TrendingSkeleton;
