import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboard = () => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onShow = () => setShown(true);
    const onHide = () => setShown(false);
    const disposable = [
      Keyboard.addListener('keyboardWillShow', onShow),
      Keyboard.addListener('keyboardDidShow', onShow),
      Keyboard.addListener('keyboardWillHide', onHide),
      Keyboard.addListener('keyboardDidHide', onHide),
    ];
    return () => disposable.forEach(fn => fn.remove());
  }, []);

  return shown;
};

export default useKeyboard;
