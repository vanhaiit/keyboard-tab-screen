import Row from '@/components/Row';
import { Label } from '@/components/Typography';
import TopNavBar from '@/features/post/components/CustomTabs/TopNavBar';
import { scale } from '@/theme/helper';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useGetEarnChartDataQuery } from '../slice/api';
import { ChartData } from '../types';
import convertChartData from '../utils/convertChartData';

const Container = styled.View(({ theme: { colors, space } }) => ({
  backgroundColor: colors.black[2],
  paddingVertical: space[4],
  borderRadius: 10,
}));

const CircleBox = styled.View<{
  color: string;
}>(({ color, theme: { horizontalSpace } }) => ({
  width: horizontalSpace[3],
  height: horizontalSpace[3],
  borderRadius: 100,
  backgroundColor: color,
}));

const LineDescriptions = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  paddingHorizontal: horizontalSpace[4],
  gap: horizontalSpace[4],
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const Item = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[2],
  alignItems: 'center',
}));

const SwitchWrapper = styled.View(({ theme: { space } }) => ({
  alignItems: 'center',
  paddingTop: space[7],
}));

const StyledView = styled.View(() => ({
  width: '100%',
  justifyContent: 'center',
  flexDirection: 'row',
  height: scale(70),
  marginTop: scale(10),
}));

const Box = styled.View(() => ({
  alignItems: 'center',
}));

const StyledRow = styled(Row)(({ theme: { horizontalSpace } }) => ({
  padding: horizontalSpace[2],
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: horizontalSpace[2],
}));

const emptyData = {
  post: [],
  upvote: [],
  comment: [],
  referralAccept: [],
  referral: [],
  other: [],
};

interface Data {
  post: ChartData[];
  upvote: ChartData[];
  comment: ChartData[];
  referralAccept: ChartData[];
  referral: ChartData[];
  other: ChartData[];
}

const EarnChart = () => {
  const { colors, window, horizontalSpace } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(1);
  const [chartData, setChartData] = useState<{
    earnMonthData: Data;
    earn7DaysData: Data;
    maxValue: number;
  }>({
    earn7DaysData: emptyData,
    earnMonthData: emptyData,
    maxValue: 600,
  });
  const { data } = useGetEarnChartDataQuery({
    filter: '30d',
  });

  useEffect(() => {
    if (data) {
      const convertedData = convertChartData(data);
      setChartData(convertedData);
    }
  }, [data]);

  const postChartData = useMemo(() => {
    if (selectedOption === 1) {
      return chartData.earn7DaysData;
    } else {
      return chartData.earnMonthData;
    }
  }, [chartData, selectedOption]);

  const YAxisStyles = useMemo(
    () => ({ color: colors.grey[1], fontSize: 10 }),
    [colors.grey],
  );

  return (
    <Container>
      <LineDescriptions>
        <Item>
          <CircleBox color={colors.lightGreen} />
          <Label color={colors.grey[1]}>Posting</Label>
        </Item>
        <Item>
          <CircleBox color={colors.blue[0]} />
          <Label color={colors.grey[1]}>Comment</Label>
        </Item>
        <Item>
          <CircleBox color={colors.alertRed} />
          <Label color={colors.grey[1]}>Like</Label>
        </Item>
        <Item>
          <CircleBox color={colors.blue[1]} />
          <Label color={colors.grey[1]}>Invite</Label>
        </Item>
        <Item>
          <CircleBox color={colors.darkGreen[6]} />
          <Label color={colors.grey[1]}>Accept Invitation</Label>
        </Item>
        <Item>
          <CircleBox color={colors.purple[1]} />
          <Label color={colors.grey[1]}>Other</Label>
        </Item>
      </LineDescriptions>
      <SwitchWrapper>
        <TopNavBar
          value={selectedOption}
          onChange={val => {
            setSelectedOption(val);
            setSelectedIndex(0);
          }}
          itemWidth={100}
          data={['Last 7 days', 'Last 30 days']}
        />
      </SwitchWrapper>
      <StyledView>
        <Box>
          <Label color={colors.grey[1]}>
            {postChartData.post[selectedIndex]?.date || ''}
          </Label>
          <StyledRow>
            <Item>
              <CircleBox color={colors.lightGreen} />
              <Label color={colors.grey[1]}>
                {postChartData.post[selectedIndex]?.count || 0}
              </Label>
            </Item>
            <Item>
              <CircleBox color={colors.blue[0]} />
              <Label color={colors.grey[1]}>
                {postChartData.comment[selectedIndex]?.count || 0}
              </Label>
            </Item>
            <Item>
              <CircleBox color={colors.alertRed} />
              <Label color={colors.grey[1]}>
                {postChartData.upvote[selectedIndex]?.count || 0}
              </Label>
            </Item>
            <Item>
              <CircleBox color={colors.blue[1]} />
              <Label color={colors.grey[1]}>
                {postChartData.referral[selectedIndex]?.count || 0}
              </Label>
            </Item>
            <Item>
              <CircleBox color={colors.darkGreen[6]} />
              <Label color={colors.grey[1]}>
                {postChartData.referralAccept[selectedIndex]?.count || 0}
              </Label>
            </Item>
            <Item>
              <CircleBox color={colors.purple[1]} />
              <Label color={colors.grey[1]}>
                {postChartData.other[selectedIndex]?.count || 0}
              </Label>
            </Item>
          </StyledRow>
        </Box>
      </StyledView>
      <View>
        <LineChart
          width={window.width - horizontalSpace[24]}
          isAnimated
          thickness={2}
          color={colors.lightGreen}
          color2={colors.blue[0]}
          color3={colors.alertRed}
          color4={colors.blue[1]}
          color5={colors.darkGreen[6]}
          dataPointsColor1={colors.lightGreen}
          dataPointsColor2={colors.blue[0]}
          dataPointsColor3={colors.alertRed}
          dataPointsColor4={colors.blue[1]}
          dataPointsColor5={colors.darkGreen[6]}
          maxValue={chartData.maxValue}
          noOfSections={4}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
          yAxisTextStyle={YAxisStyles}
          adjustToWidth={true}
          data={postChartData.post as any[]}
          data2={postChartData.comment as any[]}
          data3={postChartData.upvote as any[]}
          data5={postChartData.referralAccept as any[]}
          startOpacity={0.4}
          endOpacity={0.1}
          spacing={80}
          backgroundColor={colors.black[2]}
          rulesColor={'rgba(255, 255, 255, 0.1)'}
          rulesType="dot"
          initialSpacing={30}
          yAxisColor={colors.grey[1]}
          xAxisColor={colors.grey[1]}
          curved={true}
          dataPointsHeight={6}
          textColor={colors.white}
          textFontSize={8}
          pressEnabled={true}
          showXAxisIndices={true}
          showStripOnPress={true}
          stripColor={colors.white}
          focusedDataPointColor={colors.white}
          focusedDataPointRadius={3}
          onPress={(_: any, index: number) => {
            setSelectedIndex(index);
          }}
          scrollToEnd={true}
        />
      </View>
    </Container>
  );
};

export default EarnChart;
