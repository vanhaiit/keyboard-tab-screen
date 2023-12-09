import { Icons } from '@/assets';
import { H4, H5 } from '@/components/Typography';
import debounce from '@/utils/debounce';
import replaceArrayElementByIndex from '@/utils/replaceArrayElementByIndex';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useVoteMutation } from '../../slice/api';
import { IPoll } from '../Poll';

const Header = styled.View(({ theme: { space } }) => ({
  gap: space[3],
}));
const Body = styled.View(({ theme: { space } }) => ({
  gap: space[2],
  paddingVertical: space[3],
}));

const HeaderItem = styled.View(() => ({
  justifyContent: 'space-between',
  flexDirection: 'row',
}));
const Row = styled.View<{
  gap?: number;
}>(({ theme: { horizontalSpace }, gap }) => ({
  flexDirection: 'row',
  gap: gap ? gap : horizontalSpace[2],
}));

const VoteButtonContainer = styled.TouchableOpacity<{
  isVoted: boolean;
}>(({ theme: { colors, space, horizontalSpace }, isVoted }) => ({
  borderWidth: 1,
  borderColor: isVoted ? colors.lightGreen : 'transparent',
  borderStyle: 'solid',
  borderRadius: 8,
  paddingVertical: space[3],
  paddingHorizontal: horizontalSpace[4],
  backgroundColor: isVoted ? colors.greenTransparent : colors.black[0],
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const EmptyCircle = styled.View<{}>(
  ({ theme: { horizontalSpace, colors } }) => ({
    borderWidth: 1,
    borderColor: colors.grey[1],
    borderStyle: 'solid',
    borderRadius: 100,
    width: horizontalSpace[6],
    height: horizontalSpace[6],
  }),
);

const CheckedCircleContainer = styled.View(
  ({ theme: { horizontalSpace, space } }) => ({
    width: horizontalSpace[6],
    height: space[6],
    overflow: 'hidden',
    borderRadius: 100,
  }),
);

const CheckedCircle = ({ checked = true }: { checked: boolean }) => {
  return (
    <>
      {checked ? (
        <CheckedCircleContainer>
          <Icons.CheckedCircle />
        </CheckedCircleContainer>
      ) : (
        <EmptyCircle />
      )}
    </>
  );
};

const VoteProgressBarContainer = styled.View(
  ({ theme: { colors, space } }) => ({
    borderWidth: 1,
    borderColor: colors.lightGreen,
    borderRadius: 8,
    height: space[12],
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  }),
);

const VoteProgressBarFill = styled.View<{
  width: string;
}>(({ theme: { colors }, width }) => ({
  width: width,
  backgroundColor: colors.darkYellow,
  height: '100%',
}));

const ProgressRight = styled.View(({ theme: { horizontalSpace } }) => ({
  position: 'absolute',
  justifyContent: 'space-between',
  height: '100%',
  alignItems: 'center',
  flexDirection: 'row',
  left: 0,
  width: '100%',
  gap: horizontalSpace[5],
  paddingHorizontal: horizontalSpace[5],
}));

const VoteButtonProgressBar = ({
  title,
  totalVotes,
  voteCount,
}: {
  title?: string;
  totalVotes: number;
  voteCount: number;
}) => {
  const { colors } = useTheme();

  return (
    <VoteProgressBarContainer>
      <VoteProgressBarFill width={`${(voteCount / totalVotes) * 100}%`} />
      <ProgressRight>
        <H4 numberOfLines={1} fontWeight="medium">
          {title}
        </H4>
        <H4 color={colors.lightGreen} fontWeight="medium">
          {voteCount}/{totalVotes}
        </H4>
      </ProgressRight>
    </VoteProgressBarContainer>
  );
};

interface VoteButtonProps {
  isVoted: boolean;
  title?: string;
  totalVotes: number;
  voteCount: number;
  onPress: () => void;
}

const VoteButton = ({
  isVoted,
  title,
  totalVotes,
  voteCount,
  onPress,
}: VoteButtonProps) => {
  const { colors } = useTheme();
  return (
    <VoteButtonContainer onPress={onPress} isVoted={isVoted}>
      <Row>
        <CheckedCircle checked={isVoted} />
        <H4 numberOfLines={1} fontWeight="medium">
          {title}
        </H4>
      </Row>
      <H4 color={colors.lightGreen} fontWeight="medium">
        {voteCount}/{totalVotes}
      </H4>
    </VoteButtonContainer>
  );
};

interface Props {
  data: IPoll;
  votedOption?: number;
}

const debouncingTime = 2000;

const Votes = ({ data, votedOption }: Props) => {
  const { colors, horizontalSpace } = useTheme();
  const [options, setOptions] = useState(data?.data?.options);
  const [votedIndex, setVotedIndex] = useState(votedOption);
  const [totalVotes, setTotalVotes] = useState(data.totalVotes || 0);
  const [vote] = useVoteMutation();
  const endTime = dayjs(data.data.startTime)
    .add(data.data.durationTime.days, 'd')
    .add(data.data.durationTime.hours, 'h')
    .add(data.data.durationTime.minutes, 'm');

  const handleVoteOption = useCallback(
    (optionIndex: number) => {
      vote({
        pollId: data.id!,
        voteOption: optionIndex,
      });
    },
    [data.id, vote],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandler = useCallback(
    debounce(handleVoteOption, debouncingTime),
    [handleVoteOption],
  );

  const handleButtonPress = useCallback(
    (optionIndex: number) => {
      if (!votedIndex && votedIndex !== 0) {
        setTotalVotes(data.totalVotes! + 1);
        const newOptions = replaceArrayElementByIndex(
          options,
          [optionIndex],
          [
            {
              ...options[optionIndex],
              count: options[optionIndex].count! + 1,
            },
          ],
        );
        setOptions(newOptions);
      }
      if (votedIndex !== optionIndex && typeof votedIndex === 'number') {
        const newOptions = replaceArrayElementByIndex(
          options,
          [optionIndex, votedIndex],
          [
            {
              ...options[optionIndex],
              count: options[optionIndex].count! + 1,
            },
            {
              ...options[votedIndex],
              count: options[votedIndex].count! - 1,
            },
          ],
        );
        setOptions(newOptions);
      }
      debouncedHandler(optionIndex);
      setVotedIndex(optionIndex);
    },
    [data.totalVotes, debouncedHandler, options, votedIndex],
  );
  return (
    <View>
      <Header>
        <HeaderItem>
          <H5 fontWeight="medium">Vote</H5>
          <Row>
            <H5 fontWeight="medium" color={colors.grey[1]}>
              Total
            </H5>
            <H5 fontWeight="medium">{totalVotes}</H5>
          </Row>
        </HeaderItem>
        <HeaderItem>
          {data?.data?.startTime && (
            <Row gap={horizontalSpace[1]}>
              <H5 fontWeight="medium" color={colors.grey[1]}>
                Start
              </H5>
              <H5 numberOfLines={1} fontWeight="medium">
                {dayjs(data?.data?.startTime).format('MMM DD, HH:mm:ss')}
              </H5>
            </Row>
          )}
          <Row gap={horizontalSpace[1]}>
            <H5 fontWeight="medium" color={colors.grey[1]}>
              End
            </H5>
            <H5 numberOfLines={1} fontWeight="medium">
              {dayjs(endTime).format('MMM DD, HH:mm:ss')}
            </H5>
          </Row>
        </HeaderItem>
      </Header>
      <Body>
        {options &&
          options?.map(item => {
            const isEnd1 = dayjs(endTime).diff(dayjs(), 'd', true) <= 0;
            return (
              <View key={item.index}>
                {isEnd1 ? (
                  <VoteButtonProgressBar
                    totalVotes={totalVotes}
                    voteCount={item.count || 0}
                    title={item.title}
                  />
                ) : (
                  <VoteButton
                    onPress={() => {
                      const isEnd2 =
                        dayjs(endTime).diff(dayjs(), 'd', true) <= 0;

                      if (!isEnd2) {
                        handleButtonPress(item.index);
                      }
                    }}
                    isVoted={item.index === votedIndex}
                    title={item.title}
                    totalVotes={totalVotes}
                    voteCount={item.count!}
                  />
                )}
              </View>
            );
          })}
      </Body>
    </View>
  );
};

export default Votes;
