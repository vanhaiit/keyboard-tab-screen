import { Icons } from '@/assets';
import Row from '@/components/Row';
import { Label, SmallBody } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { TopLink } from '../types';
import { scale } from '@/theme/helper';
import Empty from '@/components/Empty';

const TopLinkSection = ({ data }: { data: TopLink[] }) => {
  const { space, colors, borderRadius, styles } = useTheme();

  const openLink = (link: string) => async () => {
    try {
      await Linking.openURL(link);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ paddingHorizontal: space[4], paddingTop: space[6] }}>
      <Label fontWeight="bold" color={colors.lightGreen}>
        Top Links
      </Label>

      {Array.isArray(data) && data.length ? (
        data.map(item => (
          <Row
            key={item?.id}
            style={{ marginTop: space[2], justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ flex: 6, marginRight: space[2] }}
              onPress={openLink(item.link)}>
              <Row
                style={{
                  paddingHorizontal: space[4],
                  paddingVertical: scale(10),
                  borderRadius: borderRadius.small,
                  backgroundColor: colors.primary,
                }}>
                <Icons.Link
                  color={colors.lightGreen}
                  width={space[5]}
                  height={space[5]}
                />

                <SmallBody
                  fontWeight="medium"
                  style={{ paddingHorizontal: scale(10) }}
                  numberOfLines={1}>
                  {item?.link}
                </SmallBody>
              </Row>
            </TouchableOpacity>
            <Row
              style={{
                flex: 1,
                borderRadius: borderRadius.small,
                backgroundColor: colors.primary,
                paddingHorizontal: space[3],
                paddingVertical: scale(10),
              }}>
              <Icons.Eye
                color={colors.lightGreen}
                width={space[5]}
                height={space[5]}
                style={styles.fill}
              />
              <SmallBody fontWeight="medium" style={{ paddingLeft: space[2] }}>
                {item?.views}
              </SmallBody>
            </Row>
          </Row>
        ))
      ) : (
        <Empty style={{ marginVertical: space[2] }} />
      )}
    </View>
  );
};

export default TopLinkSection;
