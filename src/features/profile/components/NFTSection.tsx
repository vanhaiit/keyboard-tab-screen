import { Label } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import { Icons } from '@/assets';
import Row from '@/components/Row';
import styled from '@emotion/native';
import { DecoratedPopos } from '@/features/nft/types';
import NFTItem from '@/features/nft/components/NFTItem';
import SectionContainer from './SectionContainner';
import EmptyNFTList from '@/features/nft/components/EmptyNftList';
import { View } from 'react-native';

const ViewActivityButton = styled.TouchableOpacity(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const RowStyle = styled(Row)(({ theme: { space } }) => ({
  justifyContent: 'space-between',
  paddingBottom: space[2],
}));

const ContainerNft = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const NFTSection = ({
  data,
  onClickSeeMore,
}: {
  data: DecoratedPopos[];
  isLoading: boolean;
  onClickSeeMore: () => void;
}) => {
  const { colors, space } = useTheme();

  return (
    <SectionContainer>
      <RowStyle>
        <Label fontWeight="bold" color={colors.lightGreen}>
          NFT
        </Label>
        {data && data?.length > 0 && (
          <ViewActivityButton onPress={onClickSeeMore}>
            <Icons.PlusIc
              width={space[3]}
              height={space[3]}
              color={colors.white}
            />
            <Label
              fontWeight="bold"
              color={colors.white}
              style={{ paddingLeft: space[2] }}>
              See more
            </Label>
          </ViewActivityButton>
        )}
      </RowStyle>
      <ContainerNft>
        {Array.isArray(data) && data.length ? (
          data.map((el: DecoratedPopos, index: number) => {
            return (
              <View style={{ width: '50%' }}>
                <NFTItem data={el} index={index} key={index} />
              </View>
            );
          })
        ) : (
          <EmptyNFTList />
        )}
      </ContainerNft>
    </SectionContainer>
  );
};

export default NFTSection;
