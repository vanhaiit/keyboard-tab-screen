import Carousel from '@/components/Carousel';
import VideoPlayer from '@/components/VideoPlayer';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PostContentType } from '../../types/Post';
import { Icons } from '@/assets';
import ImageViewing from 'react-native-image-viewing';
import { ViewProps } from 'react-native';

const Container = styled(View)<{
  mode: 'normal' | 'carousel';
}>(({ theme: { space }, mode }) => ({
  gap: space[4],
  marginTop: space[3],
  width: '100%',
  height: mode === 'normal' ? space[40] : space[60],
}));

interface MediaType {
  type: PostContentType;
  url: string;
}

interface Props extends ViewProps {
  data: {
    type: PostContentType;
    url: string;
  }[];
  mode?: 'normal' | 'carousel';
  onDeleteItem?: (item: MediaType, index?: number) => void;
}

const Attachments = ({
  data,
  mode = 'carousel',
  onDeleteItem,
  style,
}: Props) => {
  const { space } = useTheme();
  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showImageFullscreen = (index: number) => () => {
    setImageViewVisible(true);
    setCurrentImageIndex(index);
  };

  const images = useMemo(() => {
    return data
      .filter(media => media.type.includes('image'))
      .map(image => ({ uri: image.url }));
  }, [data]);

  const renderData = useCallback(
    (attachments: { type: PostContentType; url: string }) => {
      return attachments.type.includes('image') ? (
        <ImageView
          key={attachments?.url}
          source={{
            uri: attachments?.url,
          }}
          resizeMode={'cover'}
          style={{
            height: space[38],
          }}
        />
      ) : (
        <VideoPlayer
          style={{
            height: space[38],
          }}
          url={attachments.url}
        />
      );
    },
    [space],
  );

  return (
    <Container mode={mode}>
      {mode === 'carousel' ? (
        <>
          <Carousel<MediaType>
            keyExtractor={item => item.url}
            data={data}
            renderItem={({ item, index }) => {
              if (item?.type.includes('image')) {
                return (
                  <Box onPress={showImageFullscreen(index)} style={style}>
                    <ImageView
                      key={item?.url}
                      source={{
                        uri: item?.url,
                      }}
                      resizeMode={'cover'}
                    />
                    {onDeleteItem && (
                      <BtnDelete onPress={() => onDeleteItem(item, index)}>
                        <Icons.CloseCircle />
                      </BtnDelete>
                    )}
                  </Box>
                );
              }
              return (
                <Box style={style}>
                  <VideoPlayer
                    url={item?.url}
                    key={index}
                    style={{
                      height: space[55],
                    }}
                  />
                  {onDeleteItem && (
                    <BtnDelete>
                      <Icons.CloseCircle />
                    </BtnDelete>
                  )}
                </Box>
              );
            }}
          />

          <ImageViewing
            images={images}
            keyExtractor={(item, index) => index.toString()}
            imageIndex={currentImageIndex}
            visible={imageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />
        </>
      ) : (
        renderData(data[0])
      )}
    </Container>
  );
};

export default Attachments;

const BtnDelete = styled.TouchableOpacity(
  ({ theme: { space, horizontalSpace } }) => ({
    position: 'absolute',
    zIndex: 2,
    padding: space[2],
    right: horizontalSpace[2],
  }),
);

const ImageView = styled(FastImage)(() => ({
  width: '100%',
  height: '100%',
}));

const Box = styled.Pressable(({ theme: { space } }) => ({
  width: '100%',
  height: space[55],
}));
