import { Icons } from '@/assets';
import styled from '@emotion/native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { H5, Label } from './Typography';
interface Props {
  url: string;
  onDelete?: () => void;
}
export default function UrlPreview({ url, onDelete }: Props) {
  /**
   * Check exist url
   */
  if (!url) {
    return null;
  }

  /**
   * render content preview
   * @param params
   * @returns
   */
  const renderContentUrlPreview = ({ previewData }: any) => {
    return (
      <ContentUrlPreview>
        <ImageUrlPreview source={{ uri: previewData?.image?.url }} />
        <DescriptionPreviewUrl>
          <TitlePreviewUrl fontWeight="bold" numberOfLines={1}>
            {previewData?.title}
          </TitlePreviewUrl>
          <TextDescriptionPreviewUrl numberOfLines={2}>
            {previewData?.description}
          </TextDescriptionPreviewUrl>
        </DescriptionPreviewUrl>
        {!!onDelete && (
          <DeleteUrl onPress={onDelete}>
            <Icons.CloseCircle />
          </DeleteUrl>
        )}
      </ContentUrlPreview>
    );
  };

  return (
    <ContainerUrlPreview>
      <LinkPreview text={url} renderLinkPreview={renderContentUrlPreview} />
    </ContainerUrlPreview>
  );
}

const ContainerUrlPreview = styled.View(({ theme: { space } }) => ({
  flex: 1,
  display: 'flex',
  margin: space[4],
  justifyContent: 'flex-end',
}));

const ContentUrlPreview = styled.View(
  ({ theme: { borderRadius, colors } }) => ({
    borderRadius: borderRadius.small,
    backgroundColor: colors.black[2],
    width: '100%',
    flexDirection: 'row',
  }),
);

const ImageUrlPreview = styled.Image(({ theme: { space } }) => ({
  width: space[17],
  height: space[20],
  borderTopLeftRadius: space[2],
  borderBottomLeftRadius: space[2],
}));

const DescriptionPreviewUrl = styled.View(({ theme: { space } }) => ({
  padding: space[2],
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
}));

const TitlePreviewUrl = styled(H5)({
  color: 'white',
});

const TextDescriptionPreviewUrl = styled(Label)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const DeleteUrl = styled.TouchableOpacity(({ theme: { space } }) => ({
  padding: space[2],
}));
