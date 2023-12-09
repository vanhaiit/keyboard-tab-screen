import { Box } from '@/components/Box';
import BtnSubmit from '@/components/BtnSubmit';
import CheckBox from '@/components/CheckBox';
import InputField from '@/components/InputField';
import { H3, H4, H5, SmallBody, TinyLabel } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Icons } from '@/assets';
import { ICreateDAOState } from '../../types';

const types = {
  public: 'public',
  private: 'private',
};

interface Props {
  onNext?: (value: any) => void;
  payload: ICreateDAOState;
}

const InformationStep = ({ onNext, payload }: Props, ref: any) => {
  const { colors } = useTheme();
  const [data, setData] = useState<ICreateDAOState>(payload);
  const [media, setMedia] = useState<any>();
  const [touchable, setTouchable] = useState<boolean>(false);
  const onChange = (value: string, key: string) => {
    setTouchable(false);
    setData(pre => ({ ...pre, [key]: value }));
  };

  /**
   * call open library device
   */
  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      quality: 0.7,
      // selectionLimit: 5,
    };
    launchImageLibrary(options, handleSelectMedia);
  };

  /**
   * select media from devices
   */
  function handleSelectMedia(params: any) {
    if (params?.assets?.length > 0) {
      setMedia(params.assets[0]);
    }
  }

  const handleNextStep = () => {
    setTouchable(true);
    if (onNext && data.name) {
      onNext({ ...data, media });
    }
  };

  useImperativeHandle(ref, () => ({
    handleNextStep,
  }));

  return (
    <Container>
      <Description>
        Fill in this form to apply for creating your DAO community on Thinkin
      </Description>
      <ContainerInput>
        <InputField
          onChangeText={value => onChange(value, 'name')}
          value={data.name}
          label="Name of DAO"
          placeholder="Community name"
          require
          errorMg={!data.name && touchable ? 'This field is required' : ''}
        />
        <InputField
          label="Creator’s Account"
          value={data?.username || ''}
          placeholder="Creator’s Account"
          editable={false}
        />
        <InputField
          label="Wallet address"
          value={data?.walletAddress || ''}
          placeholder="Wallet address"
        />
        <InputField
          label="Link of DAO"
          onChangeText={value => onChange(value, 'representativeLink')}
          placeholder="Representative link"
        />
      </ContainerInput>
      <Title fontWeight="bold">Classification</Title>
      <Box>
        <Item
          onPress={() => onChange('public', 'classification')}
          style={
            data.classification === types.public
              ? {
                  backgroundColor: `${colors.lightGreen}1A`,
                  borderColor: colors.lightGreen,
                }
              : {
                  backgroundColor: colors.black[0],
                  borderColor: colors.black[0],
                }
          }>
          <CheckBoxContainer>
            <CheckBox
              onPress={() => onChange('public', 'classification')}
              isCircle
              mode="radio"
              checked={data.classification === types.public}
            />
          </CheckBoxContainer>
          <Content>
            <Title fontWeight="bold">Public</Title>
            <SelectDescription>
              Everyone can see it even if you don't join.
            </SelectDescription>
          </Content>
        </Item>
        <Item
          onPress={() => onChange('private', 'classification')}
          style={
            data.classification === types.private
              ? {
                  backgroundColor: `${colors.lightGreen}1A`,
                  borderColor: colors.lightGreen,
                }
              : {
                  backgroundColor: colors.black[0],
                  borderColor: colors.black[0],
                }
          }>
          <CheckBoxContainer>
            <CheckBox
              onPress={() => onChange('private', 'classification')}
              mode="radio"
              checked={data.classification === types.private}
              isCircle
            />
          </CheckBoxContainer>
          <Content>
            <Title fontWeight="bold">Private</Title>
            <SelectDescription>
              Only users who have signed up can see it.
            </SelectDescription>
          </Content>
        </Item>
      </Box>
      <TitleProfile fontWeight="bold">Profile Image</TitleProfile>
      <ImageContainer>
        <ImageProfile
          source={
            media?.uri || data?.avatar?.url
              ? {
                  uri: media?.uri || data?.avatar?.url,
                }
              : require('@/assets/icons/image-ic.svg')
          }
        />
        <IconReupload />
        <Upload onPress={openImagePicker}>
          <TextUpload fontWeight="bold">Upload image</TextUpload>
        </Upload>
      </ImageContainer>
      <BtnSubmit
        label="Next"
        iconSuffix={<Icons.NextArrow />}
        onPress={handleNextStep}
      />
    </Container>
  );
};

export default forwardRef(InformationStep);

const TextUpload = styled(H3)(({ theme: { colors } }) => ({
  color: colors.white,
  zIndex: 3,
  textAlign: 'center',
}));

const Upload = styled.Pressable(({ theme: { window, space } }) => ({
  width: window.width - 2 * space[4],
  height: window.width - 2 * space[4],
  zIndex: 2,
  position: 'absolute',
  justifyContent: 'center',
}));

const IconReupload = styled.View(({ theme: { window, space, colors } }) => ({
  width: window.width - 2 * space[4],
  height: window.width - 2 * space[4],
  backgroundColor: colors.black[0],
  zIndex: 2,
  position: 'absolute',
  opacity: 0.6,
}));

const ImageProfile = styled.Image(({ theme: { window, space } }) => ({
  width: window.width - 2 * space[4],
  height: window.width - 2 * space[4],
}));

const TitleProfile = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.white,
  marginTop: space[4],
  marginBottom: space[2],
}));

const ImageContainer = styled.ScrollView(({ theme: { space } }) => ({
  width: '100%',
  height: space[80],
  marginBottom: space[6],
}));

const Container = styled.View(({ theme: { space } }) => ({
  padding: space[4],
}));

const Item = styled.Pressable(({ theme: { space, colors, borderRadius } }) => ({
  height: space[18],
  backgroundColor: colors.black[0],
  marginTop: space[3],
  marginBottom: space[2],
  borderRadius: borderRadius.small,
  flexDirection: 'row',
  borderWidth: 1,
}));
const CheckBoxContainer = styled.View(() => ({
  width: '20%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));
const Content = styled.View(() => ({
  width: '80%',
  justifyContent: 'center',
}));

const SelectDescription = styled(TinyLabel)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const Title = styled(H4)(({ theme: { space, colors } }) => ({
  color: colors.white,
  marginBottom: space[2],
}));

const ContainerInput = styled.View(() => ({}));

const Description = styled(SmallBody)(({ theme: { colors, space } }) => ({
  color: colors.white,
  paddingTop: space[6],
  paddingBottom: space[4],
}));
