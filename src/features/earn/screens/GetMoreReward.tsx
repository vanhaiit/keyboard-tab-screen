import { Icons } from '@/assets';
import Header from '@/components/Header';
import { H2, H4, H5, Label } from '@/components/Typography';
import { horizontalScale } from '@/theme/helper';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const ListItem = styled.View(({ theme: { space } }) => ({
  gap: space[2],
}));
const Container = styled.View(({ theme: { colors } }) => ({
  flex: 1,
  backgroundColor: colors.black[3],
  width: '100%',
}));
const Body = styled.ScrollView(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
}));
const Item = styled.View(({ theme: { space, colors, horizontalSpace } }) => ({
  flexDirection: 'row',
  paddingVertical: space[2],
  paddingHorizontal: horizontalScale(10),
  backgroundColor: colors.black[0],
  borderRadius: 10,
  gap: horizontalSpace[2],
}));
const ItemRight = styled.View(({ theme: { space } }) => ({
  gap: space[1],
  flex: 1,
}));
const IconBox = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[6],
  height: horizontalSpace[6],
}));
const GetMoreReward = () => {
  const { colors, space } = useTheme();
  return (
    <Container>
      <Header title="Get more reward" />
      <Body
        contentContainerStyle={{
          gap: space[3],
        }}>
        <H2 color={colors.lightGreen} fontWeight="bold">
          By interacting on the platform, thinkin members can get rewarded
        </H2>
        <H5 color={colors.black[1]}>
          Share your daily life or thoughts. Your ideas and experiences are what
          make up the Thinkin platform.It's not challenging. Your ideas become a
          work of art when you bring them all together.Let's build Thinkin what
          you imagine and what everyone dreamed about.
        </H5>
        <ListItem>
          <Item>
            <Icons.PostIcon />
            <ItemRight>
              <H4 fontWeight="bold">POSTING</H4>
              <Label color={colors.black[1]}>
                Share your daily life or thoughts with others.
              </Label>
            </ItemRight>
          </Item>
          <Item>
            <IconBox>
              <Icons.CommentsIcon2 color={colors.white} />
            </IconBox>
            <ItemRight>
              <H4 fontWeight="bold">COMMENT</H4>
              <Label color={colors.black[1]}>
                Experience the pleasure of communicating with other users.
              </Label>
            </ItemRight>
          </Item>
          <Item>
            <Icons.LikesIcon2 />
            <ItemRight>
              <H4 fontWeight="bold">LIKE</H4>
              <Label color={colors.black[1]}>
                Like other users' thoughts and experiences. Who else knows if
                something good will happen?
              </Label>
            </ItemRight>
          </Item>
        </ListItem>
      </Body>
    </Container>
  );
};

export default GetMoreReward;
