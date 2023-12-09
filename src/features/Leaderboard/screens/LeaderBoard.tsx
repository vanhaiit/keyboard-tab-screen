import Header from '@/components/Header';
import CustomTabs from '@/features/nft/components/TabsBarCustom';
import styled from '@emotion/native';
import { useCallback, useState } from 'react';
import LeaderBoardList from '../components/LeaderBoardList';

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const Wrapper = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  flex: 1,
}));

const LeaderBoard = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>(1);
  const handleTabChange = useCallback((value: number | string) => {
    setSelectedTab(value);
  }, []);

  return (
    <Container>
      <Header title="Leaderboard" hideHeaderLeft={false} />
      <Wrapper>
        <CustomTabs
          marginTop={8}
          isFilter={false}
          clickFilter={() => {}}
          tabActive={selectedTab}
          onChangeTab={handleTabChange}
          data={[
            {
              label: 'Most Earned',
              content: <LeaderBoardList type="Earned" />,
            },
            {
              label: 'Most followed',
              content: <LeaderBoardList type="Followed" />,
            },
            {
              label: 'DAOs',
              content: <LeaderBoardList type="DAOs" />,
            },
          ]}
        />
      </Wrapper>
    </Container>
  );
};

export default LeaderBoard;
