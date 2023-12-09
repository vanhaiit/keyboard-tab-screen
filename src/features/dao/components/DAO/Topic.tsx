import { Icons } from '@/assets';
import BtnSubmit from '@/components/BtnSubmit';
import { H3, H5 } from '@/components/Typography';
import TabsBar from '@/features/nft/components/TabsBarCustom/TapBar';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';

interface IProps {
  onSort?: () => void;
  emptyData?: boolean;
  selectedTab: number | string;
  handleTabChange: (value: number) => void;
  disableHiddenToolbar?: boolean;
}

export default function Topic({
  onSort,
  emptyData,
  selectedTab,
  handleTabChange,
  disableHiddenToolbar,
}: IProps) {
  const { space, borderRadius, colors } = useTheme();

  const ToolBar = useMemo(() => {
    return (
      <>
        <Title fontWeight="bold">All topic</Title>
        <ActionBar>
          <Left>
            <TabsBar
              value={selectedTab}
              onChange={handleTabChange}
              data={[
                {
                  label: 'All topic',
                },
                {
                  label: 'Like',
                },
              ].map(item => item.label)}
            />
          </Left>
          <Right>
            <BtnSubmit
              style={{
                height: space[10],
                borderRadius: borderRadius.large,
              }}
              onPress={onSort && onSort}
              bg={colors.black[2]}
              // eslint-disable-next-line react-native/no-inline-styles
              styleLabel={{ color: colors.white, fontWeight: 'normal' }}
              label="Latest"
              iconSuffix={<Icons.ArrowDown color={colors.white} />}
            />
          </Right>
        </ActionBar>
      </>
    );
  }, [borderRadius, colors, handleTabChange, onSort, selectedTab, space]);

  return (
    <Container>
      {disableHiddenToolbar ? ToolBar : !emptyData ? ToolBar : null}
      {emptyData && (
        <NoData>
          <Icons.NoData />
          <Text fontWeight="bold">Hi Thinker :)</Text>
          <SubText fontWeight="bold">Write a new idea in a new space!</SubText>
          <Description>
            There are no posts yet for this Dao. If a member of Dao writes, it
            will appear here.
          </Description>
        </NoData>
      )}
    </Container>
  );
}

const Left = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[26],
  flexDirection: 'row',
}));

const Right = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[25],
}));

const ActionBar = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: space[12],
  marginTop: space[2],
}));

const Title = styled(H3)(({ theme: { colors } }) => ({
  color: colors.lightGreen,
}));

const Container = styled.View(({ theme: { space } }) => ({
  height: space[20],
}));

const NoData = styled.View(({ theme: { space } }) => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  top: space[8],
}));

const Text = styled(H3)(({ theme: { colors, space } }) => ({
  color: colors.lightGreen,
  paddingTop: space[4],
}));

const SubText = styled(H3)(({ theme: { colors } }) => ({
  color: colors.white,
  textAlign: 'center',
}));

const Description = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
  textAlign: 'center',
}));
