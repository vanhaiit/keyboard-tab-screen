import { Icons } from '@/assets';
import styled from '@emotion/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import TopNavBar from './TopNavBar';

const Container = styled.View(({ theme: { colors, space } }) => ({
  flex: 1,
  backgroundColor: colors.black[3],
  marginTop: space[2],
}));
const Header = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Body = styled(View)({
  flex: 1,
});

interface ContentProps {
  bottomSheetOpen: boolean;
  onTabChange?: (val: number) => void;
  onCloseBottomSheet: () => void;
}
interface Props {
  data: {
    content: (data: ContentProps) => JSX.Element;
    label: string;
  }[];
  showLeftFilterIndexes?: number[];
  itemWidth: number;
  headerStyle?: StyleProp<ViewStyle>;
}

const CustomTabs = ({
  data,
  showLeftFilterIndexes = [],
  itemWidth,
  headerStyle,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const handleTabChange = useCallback((value: number) => {
    setSelectedTab(value);
  }, []);

  const TabContent = useMemo(() => {
    const tab = data.find((_, index) => index + 1 === selectedTab);
    return tab ? tab.content : Body;
  }, [data, selectedTab]);

  const handleOpenBottomSheet = useCallback(() => {
    setBottomSheetOpen(true);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setBottomSheetOpen(false);
  }, []);

  return (
    <Container>
      <Header style={headerStyle}>
        <TopNavBar
          value={selectedTab}
          onChange={handleTabChange}
          itemWidth={itemWidth}
          data={data.map(item => item.label)}
        />
        {showLeftFilterIndexes.includes(selectedTab) && (
          <Pressable onPress={handleOpenBottomSheet}>
            <Icons.FilterIcon />
          </Pressable>
        )}
      </Header>
      <Body>
        <TabContent
          onTabChange={handleTabChange}
          bottomSheetOpen={bottomSheetOpen}
          onCloseBottomSheet={handleCloseBottomSheet}
        />
      </Body>
    </Container>
  );
};
export default CustomTabs;
