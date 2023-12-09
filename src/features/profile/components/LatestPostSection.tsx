import { Icons } from '@/assets';
import Row from '@/components/Row';
import { Label } from '@/components/Typography';
import Post from '@/features/post/components/Post';
import styled from '@emotion/native';
import Empty from '@/components/Empty';
import { useTheme } from '@emotion/react';
import { IPost } from '@/features/post/types/Post';

type Props = {
  data: IPost[];
  onClickViewAll: () => void;
};

const Container = styled.View(({ theme: { space } }) => ({
  paddingHorizontal: space[4],
  paddingTop: space[6],
}));

const PostWrapper = styled.View(({ theme: { space } }) => ({
  marginTop: space[3],
}));

const ViewActivityButton = styled.TouchableOpacity(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const LatestPostSection = ({ data, onClickViewAll }: Props) => {
  const { colors, space } = useTheme();
  return (
    <Container>
      <Row style={{ justifyContent: 'space-between' }}>
        <Label fontWeight="bold" color={colors.lightGreen}>
          Latest post
        </Label>
        {data && (
          <ViewActivityButton onPress={onClickViewAll}>
            <Icons.PlusIc
              width={space[3]}
              height={space[3]}
              color={colors.white}
            />
            <Label
              fontWeight="bold"
              color={colors.white}
              style={{ paddingLeft: space[2] }}>
              View all activity
            </Label>
          </ViewActivityButton>
        )}
      </Row>

      <PostWrapper>
        {data && data?.length > 0 ? (
          data?.map((el: IPost) => (
            <Post
              postData={el}
              key={el.id}
              style={{ marginBottom: space[3] }}
            />
          ))
        ) : (
          <Empty />
        )}
      </PostWrapper>
    </Container>
  );
};

export default LatestPostSection;
