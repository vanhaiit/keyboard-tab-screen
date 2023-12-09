import {
  View,
  FlatList,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { scale } from '@/theme/helper';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

type Props<T> = {
  data: any[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
};

const DotContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

function Carousel<T>({
  data,
  renderItem,
  keyExtractor: keyExtractorProp,
}: Props<T>) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);

  indexRef.current = index;
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const currentIndex = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(currentIndex);

      const distance = Math.abs(roundIndex - currentIndex);

      // Prevent one pixel triggering setIndex in the middle
      // of the transition. With this we have to scroll a bit
      // more to trigger the index change.
      const isNoMansLand = distance > 0.4;

      if (roundIndex !== indexRef.current && !isNoMansLand) {
        setIndex(roundIndex);
      }
    },
    [],
  );

  const { space, colors } = useTheme();

  const defaultKeyExtractor = (_: T, index: number) => index.toString();

  const keyExtractor = keyExtractorProp || defaultKeyExtractor;

  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        onScroll={onScroll}
        maxToRenderPerBatch={2}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        data={data}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <DotContainer>
        {data.length > 1 &&
          data.map((val, idx) => (
            <View
              key={idx}
              style={[
                idx === index
                  ? { width: scale(6), height: scale(6), borderRadius: 6 / 2 }
                  : { width: scale(4), height: scale(4), borderRadius: 4 / 2 },
                {
                  backgroundColor:
                    idx === index ? colors.white : colors.grey[1],
                },
                { marginVertical: space[1], marginHorizontal: space[1] },
                ,
              ]}
            />
          ))}
      </DotContainer>
    </>
  );
}

export default Carousel;
