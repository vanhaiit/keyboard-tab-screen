import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, PanResponder } from 'react-native';

interface Props {
  closeModal: () => void;
  isVisible: boolean;
}

const generatePanResponder = (
  animatedValue: Animated.Value,
  lastGestureDy: React.MutableRefObject<number>,
  dragThreshold: number,
  callback: any,
  maxHeight: number,
) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      animatedValue.setOffset(lastGestureDy.current);
    },
    onPanResponderMove: (_, gesture) => {
      animatedValue.setValue(gesture.dy);
    },
    onPanResponderRelease: (_, gesture) => {
      animatedValue.flattenOffset();
      lastGestureDy.current += gesture.dy;
      if (gesture.dy > 0) {
        if (gesture.dy <= dragThreshold) {
          callback('up', maxHeight);
        } else {
          callback('down', maxHeight);
        }
      } else {
        callback('up', maxHeight);
      }
    },
  });
};

const dragThresholdPercent = 0.5;

const useBottomSheet = ({ closeModal, isVisible }: Props) => {
  const [sheetHeight, setSheetHeight] = useState(300);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const DRAG_THRESHOLD = sheetHeight * dragThresholdPercent;

  const springAnimation = useCallback(
    (d: 'up' | 'down', maxHeight: number) => {
      lastGestureDy.current = d === 'up' ? 0 : maxHeight;
      if (d === 'down') {
        closeModal();
      }
      Animated.spring(animatedValue, {
        toValue: lastGestureDy.current,
        useNativeDriver: true,
      }).start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animatedValue],
  );

  const panResponder = useRef(
    generatePanResponder(
      animatedValue,
      lastGestureDy,
      DRAG_THRESHOLD,
      springAnimation,
      sheetHeight,
    ),
  );

  useEffect(() => {
    if (isVisible && lastGestureDy.current !== 0) {
      lastGestureDy.current = 0;
      Animated.spring(animatedValue, {
        toValue: lastGestureDy.current,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, animatedValue]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      const newDragThreshold = height * dragThresholdPercent;

      panResponder.current = generatePanResponder(
        animatedValue,
        lastGestureDy,
        newDragThreshold,
        springAnimation,
        height,
      );
      setSheetHeight(height);
    },
    [animatedValue, springAnimation],
  );

  return {
    panResponder,
    onLayout,
    isVisible,
    sheetHeight,
    animatedValue,
  };
};

export default useBottomSheet;
