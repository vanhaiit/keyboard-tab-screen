import Header from '@/components/Header';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { ScrollView } from 'react-native';
import Claimable from '../components/Clamable';
import CommunityReward from '../components/CommunityReward';
import EarnChart from '../components/EarnChart';
import EarnRewardDescriptions from '../components/EarnRewardDescriptions';

const Container = styled.View(({ theme: { colors } }) => ({
  flex: 1,
  backgroundColor: colors.black[3],
  width: '100%',
}));

export default function EarnScreen() {
  const { horizontalSpace, space } = useTheme();

  return (
    <Container>
      <Header hideHeaderLeft={true} title="Earn" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalSpace[4],
          gap: space[4],
          paddingVertical: space[6],
        }}>
        <CommunityReward />
        <Claimable />
        <EarnChart />
        <EarnRewardDescriptions />
      </ScrollView>
    </Container>
  );
}
