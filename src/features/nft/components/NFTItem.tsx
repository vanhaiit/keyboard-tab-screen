import styled from '@emotion/native';
import { scale } from '@/theme/helper';
import { Label } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import FastImage from 'react-native-fast-image';
import Row from '@/components/Row';
import { DecoratedPopos, WearableNFTResponse } from '../types';
import { Icons } from '@/assets';

interface Props {
  data: DecoratedPopos | WearableNFTResponse;
  isWearable?: boolean;
  index: number;
}

const Card = styled.Pressable<{ index: number }>(
  ({ theme: { colors, space, borderRadius, styles }, index }) => ({
    ...styles.center,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.primary,
    padding: space[2],
    minHeight: space[45],
    marginBottom: space[2],
    flex: 1,
    marginRight: index % 2 === 0 ? space[1] : space[0],
    marginLeft: index % 2 !== 0 ? space[1] : space[0],
  }),
);

const LabelContainer = styled.View<{ color: string }>(
  ({ theme: { space, borderRadius, styles }, color }) => ({
    ...styles.center,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: color,
    paddingHorizontal: space[4],
    paddingVertical: scale(6),
    minHeight: scale(30),

    position: 'absolute',
    left: space[2],
    top: space[2],
  }),
);

const StatContainer = styled(Row)(
  ({ theme: { colors, space, borderRadius } }) => ({
    borderRadius: borderRadius.full,
    backgroundColor: colors.black[3],
    paddingHorizontal: space[2],
    paddingVertical: scale(6),
    width: '100%',
    marginTop: space[4],
    position: 'absolute',
    bottom: space[2],
    justifyContent: 'space-between',
  }),
);

const ImageView = styled.View(({ theme: {} }) => ({
  width: scale(120),
  height: scale(120),
}));

const BoxImage = styled.View(({ theme: {} }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}));

const FastImageStyle = styled(FastImage)(({ theme: {} }) => ({
  width: scale(120),
  height: scale(120),
}));

const IconLink = styled.View(({ theme: { space } }) => ({
  position: 'absolute',
  right: space[2],
  top: space[4],
}));

const RenderImage = ({ data }: { data: DecoratedPopos }) => {
  return (
    <ImageView>
      {data?.data?.background_accessory?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.background_accessory?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}
      {data?.data?.body?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.body?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}

      {data?.data?.bottom?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.bottom?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}

      {data?.data?.hair_accessory?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.hair_accessory?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}
      {data?.data?.face_accessory?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.face_accessory?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}

      {data?.data?.prop_accessory?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.prop_accessory?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}
      {data?.data?.top?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.top?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}

      {data?.data?.shoe?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: data?.data?.shoe?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}
    </ImageView>
  );
};

const RenderImageWearable = ({ item }: { item: WearableNFTResponse }) => {
  return (
    <ImageView>
      <BoxImage>
        <FastImageStyle
          source={require('@/assets/images/bodyNFT.png')}
          resizeMode="contain"
        />
      </BoxImage>
      {item?.nft_gallery?.image?.url && (
        <BoxImage>
          <FastImageStyle
            source={{
              uri: item?.nft_gallery?.image?.url,
            }}
            resizeMode="contain"
          />
        </BoxImage>
      )}
    </ImageView>
  );
};

const NFTItem = ({ data, isWearable, index }: Props) => {
  const { colors } = useTheme();

  const color = (type: string) => {
    switch (type) {
      case 'top':
        return colors.royalBlue;
      case 'bottom':
        return colors.red;
      case 'prop_accessory':
        return colors.purple[0];
      case 'hair_accessory':
        return colors.lightGreen;
      default:
        return colors.grey[1];
    }
  };

  return (
    <Card onPress={() => {}} index={index}>
      <LabelContainer color={color(data?.type || '')}>
        <Label fontWeight="bold" color={color(data?.type || '')}>
          #{isWearable ? data?.assetId : data?.popo_nft?.assetId}
        </Label>
      </LabelContainer>
      {data?.attached && (
        <IconLink>
          <Icons.PaperChipIcon />
        </IconLink>
      )}
      {isWearable ? (
        <RenderImageWearable item={data as WearableNFTResponse} />
      ) : (
        <RenderImage data={data} />
      )}
      {!isWearable && false && (
        <>
          <StatContainer>
            <Row>
              <Label fontWeight="bold">E</Label>
              <Label
                fontWeight="bold"
                color={colors.lightGreen}
                style={{ paddingLeft: scale(2) }}>
                0
              </Label>
            </Row>

            <Row>
              <Label fontWeight="bold">A</Label>
              <Label
                fontWeight="bold"
                color={colors.lightGreen}
                style={{ paddingLeft: scale(2) }}>
                0
              </Label>
            </Row>
            <Row>
              <Label fontWeight="bold">R</Label>
              <Label
                fontWeight="bold"
                color={colors.lightGreen}
                style={{ paddingLeft: scale(2) }}>
                0
              </Label>
            </Row>
            <Row>
              <Label fontWeight="bold">N</Label>
              <Label
                fontWeight="bold"
                color={colors.lightGreen}
                style={{ paddingLeft: scale(2) }}>
                0
              </Label>
            </Row>
          </StatContainer>
        </>
      )}
    </Card>
  );
};

export default NFTItem;
