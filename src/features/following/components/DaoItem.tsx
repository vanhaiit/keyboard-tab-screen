import { H4, Label } from '@/components/Typography';
import styled from '@emotion/native';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { DAOData } from '../types';

const DAOContainer = styled.TouchableOpacity(
  ({ theme: { space, horizontalSpace, colors, borderRadius } }) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    paddingVertical: space[3],
    paddingHorizontal: horizontalSpace[4],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.small,
  }),
);

const Title = styled(H4)(({ theme: {} }) => ({
  flex: 1,
}));

const FastImageStyle = styled(FastImage)(
  ({ theme: { space, borderRadius } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    marginRight: space[2],
  }),
);

const Info = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  display: 'flex',
}));

const Follow = styled(Label)(({ theme: { space } }) => ({
  marginRight: space[2],
}));

interface IProp {
  data: DAOData;
}

const DAOItem = ({ data }: IProp) => {
  return (
    <DAOContainer>
      <FastImageStyle
        source={
          data?.dao?.avatar?.url
            ? {
                uri: data?.dao?.avatar?.url,
              }
            : require('@/assets/images/gray-logo.png')
        }
      />
      <View>
        <Title fontWeight="bold">{data?.dao?.name}</Title>
        <Info>
          <Follow>{data?.dao?.totalFollowers} Followers</Follow>
          <Label>{data?.dao?.totalPosts} Posts</Label>
        </Info>
      </View>
    </DAOContainer>
  );
};

export default DAOItem;
