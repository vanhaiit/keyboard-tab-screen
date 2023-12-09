import { Icons } from '@/assets';
import { Label } from '@/components/Typography';
import { colors } from '@/theme/colors';
import styled from '@emotion/native';
import { TouchableOpacity, View } from 'react-native';
import { Category } from '../../types/Post';

const stars = [...Array(5).keys()];
const Container = styled(View)(({ theme: { space } }) => ({
  gap: space[3],
  marginBottom: space[4],
}));

const Wrapper = styled(View)(({ theme: { space } }) => ({
  flexDirection: 'row',
  gap: space[2],
}));

const CategoryItem = styled(View)(({ theme: { colors, space } }) => ({
  flexDirection: 'row',
  backgroundColor: colors.palette.black[3],
  paddingVertical: space[1],
  paddingHorizontal: space[2],
  borderRadius: 30,
}));

const CategoryContent = styled(Label)(({ theme: { colors } }) => ({
  color: colors.palette.black[1],
}));

const IconBox = styled(View)(({ theme: { space } }) => ({
  width: space[4],
  height: space[4],
}));

interface Props {
  voteCategory: Category[];
  voteScore: number;
  onPressCategoryFilter?: (categoryId: string) => void;
}

const renderVoteStars = (voteScore: number) => {
  return stars.map((_, index) => {
    return (
      <IconBox key={index}>
        <Icons.Star
          color={index <= voteScore - 1 ? colors.lightGreen : colors.black[1]}
        />
      </IconBox>
    );
  });
};

const VoteStars = ({
  voteCategory,
  voteScore,
  onPressCategoryFilter,
}: Props) => {
  return (
    <Container>
      <Wrapper>
        {voteCategory.map(item => {
          return (
            <TouchableOpacity
              onPress={() => {
                onPressCategoryFilter?.(item.id);
              }}>
              <CategoryItem key={item.id}>
                <CategoryContent>{item.name}</CategoryContent>
              </CategoryItem>
            </TouchableOpacity>
          );
        })}
      </Wrapper>
      <Wrapper>{renderVoteStars(voteScore)}</Wrapper>
    </Container>
  );
};

export default VoteStars;
