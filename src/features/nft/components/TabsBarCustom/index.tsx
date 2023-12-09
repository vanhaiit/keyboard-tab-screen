import { Icons } from '@/assets';
import styled from '@emotion/native';
import { useMemo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import TabsBar from './TapBar';

const Container = styled(View)<{
  marginTop?: number;
}>(({ theme: { space }, marginTop }) => ({
  flex: 1,
  marginTop: marginTop || space[6],
}));
const Header = styled(View)(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: space[2],
  width: '100%',
}));

const Body = styled(View)({
  flex: 1,
});

interface Props {
  data: {
    content: React.ReactNode;
    label: string;
  }[];
  clickFilter?: () => void;
  customStyle?: StyleProp<ViewStyle>;
  tabActive: number | string;
  onChangeTab: (tab: string | number) => void;
  isFilter?: boolean;
  marginTop?: number;
}

const CustomTabs = ({
  data,
  customStyle,
  tabActive,
  isFilter,
  onChangeTab,
  clickFilter,
  marginTop,
}: Props) => {
  const tabContent = useMemo(() => {
    return data.find((_, index) => index + 1 === tabActive);
  }, [data, tabActive]);

  return (
    <Container marginTop={marginTop}>
      <Header>
        <TabsBar
          value={tabActive}
          onChange={onChangeTab}
          data={data.map(item => item.label)}
          customStyle={customStyle}
        />
        {isFilter && tabActive === 2 && (
          <TouchableOpacity onPress={clickFilter}>
            <Icons.FilterIcon />
          </TouchableOpacity>
        )}
      </Header>
      <Body>{tabContent?.content}</Body>
    </Container>
  );
};
export default CustomTabs;
