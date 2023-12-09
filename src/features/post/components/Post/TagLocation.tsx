import { Icons } from '@/assets';
import { H5, Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Location } from '../../types/Post';

const Container = styled.View(({ theme }) => ({
  marginTop: theme.space[2],
}));

const TagPinContainer = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  flexDirection: 'row',
  gap: horizontalSpace[1],
  alignContent: 'center',
}));

const CustomText = styled(H5)(() => ({
  flex: 1,
}));

const IconWrapper = styled.View(({ theme: { styles } }) => ({
  ...styles.center,
}));

const CustomImage = styled(FastImage)(({ theme: { space } }) => ({
  width: '100%',
  height: space[40],
}));

const LocationContainer = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[3],
  paddingVertical: horizontalSpace[3],
}));

interface Props {
  location: Location;
  mapUrl?: string;
  showMap?: boolean;
}
const TagLocation = ({ location, mapUrl, showMap }: Props) => {
  const { colors } = useTheme();
  return (
    <Container>
      {showMap && mapUrl ? (
        <View>
          <CustomImage resizeMode="cover" source={{ uri: mapUrl }} />
          <LocationContainer>
            <H5 numberOfLines={1} fontWeight="bold">
              {location.mainText}
            </H5>
            <Label color={colors.grey[1]} numberOfLines={1}>
              {location.secondaryText}
            </Label>
          </LocationContainer>
        </View>
      ) : (
        <TagPinContainer>
          <IconWrapper>
            <Icons.MapPinIcon />
          </IconWrapper>
          <CustomText fontWeight="medium" color={colors.lightGreen}>
            {location.mainText + ', ' + location.secondaryText}
          </CustomText>
        </TagPinContainer>
      )}
    </Container>
  );
};

export default TagLocation;
