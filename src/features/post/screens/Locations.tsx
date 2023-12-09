import styled from '@emotion/native';
import { Icons } from '@/assets';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@emotion/react';
import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
} from 'react-native-google-places-autocomplete';
import {
  useGetGoogleAPIKeyQuery,
  useLazyGetPlaceImageQuery,
} from '../slice/api';
import { useEffect } from 'react';
import Header from '@/components/Header';
import { TouchableOpacity, View } from 'react-native';
import { AppRootParams } from '@/navigations/types';
import Toast from 'react-native-toast-message';
import { H5, Label } from '@/components/Typography';

export default function Locations() {
  const { colors, space, horizontalSpace, borderRadius } = useTheme();
  const { goBack } = useNavigation();
  const { data: apiKey, isError: isGetAPIKeyError } =
    useGetGoogleAPIKeyQuery(undefined);

  const [getPlaceImage, { isError: isPlaceImageError }] =
    useLazyGetPlaceImageQuery();

  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();

  const onLocationSelected = async (data: GooglePlaceData) => {
    const placeImageUri = await getPlaceImage(data.place_id).unwrap();

    if (placeImageUri) {
      navigate({
        name: 'CreatePost',
        params: { location: { placeImageUri, data } },
        merge: true,
      });
    }
  };

  useEffect(() => {
    if (isGetAPIKeyError || isPlaceImageError) {
      Toast.show({
        type: '_error',
        text1: 'Error',
        text2: 'Something went wrong',
        position: 'bottom',
      });
    }
  }, [isGetAPIKeyError, isPlaceImageError]);

  const renderHeaderLeft = () => (
    <TouchableOpacity onPress={() => goBack()}>
      <Icons.Close
        width={space[4]}
        height={space[4]}
        color={colors.lightGreen}
      />
    </TouchableOpacity>
  );

  const renderRow = (data: GooglePlaceData) => {
    return (
      <View>
        <H5 fontWeight="bold">{data.structured_formatting.main_text}</H5>
        <Label style={{ paddingTop: space[1] }}>
          {data.structured_formatting.secondary_text}
        </Label>
      </View>
    );
  };

  return (
    <Container>
      <Header title="Tagging a location" headerLeft={renderHeaderLeft} />
      <LocationAutocompleteContainer>
        <GooglePlacesAutocomplete
          placeholder="Search location"
          onPress={onLocationSelected}
          enablePoweredByContainer={false}
          minLength={2}
          debounce={300}
          query={{
            key: apiKey,
            language: 'en',
          }}
          renderLeftButton={() => (
            <Icons.SearchIcon
              width={space[4]}
              height={space[4]}
              color={colors.grey[1]}
              strokeWidth={3}
            />
          )}
          textInputProps={{
            placeholderTextColor: colors.grey[1],
            clearButtonMode: 'never',
          }}
          styles={{
            container: {
              marginTop: space[2],
            },
            textInputContainer: {
              backgroundColor: colors.black[2],
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: horizontalSpace[4],
              borderRadius: borderRadius.medium,
              height: space[10],
            },
            textInput: {
              color: colors.grey[1],
              fontSize: 15,
              backgroundColor: colors.black[2],
              fontFamily: 'Montserrat',
              lineHeight: 20,
            },
            row: {
              backgroundColor: colors.black[3],
              paddingVertical: space[3],
              flexDirection: 'row',
            },
            listView: {
              marginTop: space[2],
            },
            separator: {
              height: 1,
              backgroundColor: colors.whiteTransparent[1],
            },
            description: {
              fontSize: 15,
              fontWeight: 700,
              color: colors.white,
            },
          }}
          renderRow={renderRow}
        />
      </LocationAutocompleteContainer>
    </Container>
  );
}

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.palette.black[3],
  flex: 1,
}));

const LocationAutocompleteContainer = styled.View(
  ({ theme: { horizontalSpace } }) => ({
    flex: 1,
    paddingHorizontal: horizontalSpace[4],
  }),
);
