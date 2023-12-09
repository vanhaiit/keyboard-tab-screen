import styled from '@emotion/native';
import { useEffect, useRef } from 'react';
import { Animated, PanResponder, Platform } from 'react-native';

const MAX_SHEET_HEIGHT = 300;

const DRAG_THRESHOLD = MAX_SHEET_HEIGHT * 0.3;

const Container = styled(Animated.View)({
  position: 'absolute',
  height: MAX_SHEET_HEIGHT,
  bottom: 0,
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderTopRightRadius: 32,
  borderTopLeftRadius: 32,
  ...Platform.select({
    android: { elevation: 3 },
    ios: {
      shadowColor: '#a8bed2',
      shadowOpacity: 1,
      shadowRadius: 6,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
  }),
});

const DraggableContainer = styled.View({
  width: 150,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
});

const DragHandler = styled.View({
  width: 100,
  height: 6,
  backgroundColor: '#d3d3d3',
  borderRadius: 10,
});

const ChildrenBox = styled.View({
  justifyContent: 'center',
  flex: 1,
});

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
}

const DraggableBottomSheet: React.FC<Props> = ({ children, open, onClose }) => {
  const animatedValue = useRef(
    new Animated.Value(open ? 0 : MAX_SHEET_HEIGHT),
  ).current;
  const lastGestureDy = useRef(open ? 0 : MAX_SHEET_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
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
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up');
          } else {
            springAnimation('down');
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down');
          } else {
            springAnimation('up');
          }
        }
      },
    }),
  ).current;

  const springAnimation = (d: 'up' | 'down') => {
    lastGestureDy.current = d === 'up' ? 0 : MAX_SHEET_HEIGHT;
    if (d === 'down') {
      onClose && onClose();
    }
    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (open && lastGestureDy.current !== 0) {
      lastGestureDy.current = 0;
      Animated.spring(animatedValue, {
        toValue: lastGestureDy.current,
        useNativeDriver: true,
      }).start();
    }
  }, [open, animatedValue]);

  return (
    <Container
      style={{
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, MAX_SHEET_HEIGHT],
              outputRange: [0, MAX_SHEET_HEIGHT],
              extrapolate: 'clamp',
            }),
          },
        ],
      }}>
      <DraggableContainer {...panResponder.panHandlers}>
        <DragHandler />
      </DraggableContainer>
      <ChildrenBox>{children}</ChildrenBox>
    </Container>
  );
};

export default DraggableBottomSheet;
