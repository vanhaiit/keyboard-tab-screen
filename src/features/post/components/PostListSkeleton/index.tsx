import styled from '@emotion/native';
import { useCallback } from 'react';
import { View, FlatList } from 'react-native/';
import PostSkeleton from './PostSkeleton';
const Separator = styled(View)(({ theme: { space } }) => ({
  height: space[5],
}));

const data = [1, 2, 3, 4, 5, 6, 7, 8];

const PostListSkeleton = () => {
  const renderSeparator = useCallback(() => <Separator />, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      data={data}
      keyExtractor={item => item.toString()}
      renderItem={() => {
        return <PostSkeleton mode="Post" />;
      }}
    />
  );
};
export default PostListSkeleton;
