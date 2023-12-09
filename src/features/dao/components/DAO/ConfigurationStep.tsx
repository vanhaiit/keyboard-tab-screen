import { Box } from '@/components/Box';
import BtnAddDashed from '@/components/BtnAddDashed';
import BtnSubmit from '@/components/BtnSubmit';
import CheckBox from '@/components/CheckBox';
import InputField from '@/components/InputField';
import { H4, H5 } from '@/components/Typography';
import styled from '@emotion/native';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { INIT_FAQS, INIT_MENUS, INIT_RULES } from '../../../post/constants';
import { ICreateDAOState, Menu } from '../../types';

interface Props {
  onNext?: (value: any) => void;
  payload: ICreateDAOState;
  loading?: boolean;
  update?: boolean;
}

const ConfigurationStep = ({ onNext, payload, loading, update }: Props) => {
  const [menus, setMenus] = useState<Array<Menu>>(payload?.menus || INIT_MENUS);
  const [rules, setRules] = useState<
    Array<{ id: number; title?: string; detail?: string }>
  >(payload?.rules || INIT_RULES);
  const [faqs, setFaqs] = useState<
    Array<{ id: number; title?: string; detail?: string }>
  >(payload?.faqs || INIT_FAQS);
  const [confirm, setConfirm] = useState<boolean>(false || !!update);
  const addItem = (key: 'menu' | 'rule' | 'faq') => {
    switch (key) {
      case 'menu':
        setMenus(pre => [
          ...pre,
          { id: pre[pre.length - 1].id! + 1, value: '' },
        ]);
        break;
      case 'rule':
        setRules(pre => [
          ...pre,
          { id: pre[pre.length - 1].id + 1, value: '', detail: '' },
        ]);
        break;
      case 'faq':
        setFaqs(pre => [
          ...pre,
          { id: pre[pre.length - 1].id + 1, value: '', detail: '' },
        ]);
        break;

      default:
        break;
    }
  };

  const onChangeValue = (
    value: string,
    index: number,
    type: 'menu' | 'rule' | 'faq',
    key: 'value' | 'detail' | 'title',
  ) => {
    switch (type) {
      case 'menu':
        const tempM: any = [...menus];
        tempM[index][key] = value;
        setMenus(tempM);
        break;
      case 'rule':
        const tempR: any = [...rules];
        tempR[index][key] = value;
        setRules(tempR);
        break;
      case 'faq':
        const tempF: any = [...faqs];
        tempF[index][key] = value;
        setFaqs(tempF);
        break;

      default:
        break;
    }
  };

  const handleNextStep = () => {
    if (onNext) {
      const temp: ICreateDAOState = {
        ...payload,
        menus,
        faqs,
        rules,
      };
      onNext(temp);
    }
  };

  const handleOpenLink = () => {
    Linking.openURL('https://thinkin-users.sotatek.works/term.pdf');
  };

  return (
    <Container>
      <Title fontWeight="bold">Main menu</Title>
      <Description>
        Even if you do not enter it, it will be created as the default type
        board. It can be modified later.
      </Description>
      <Box>
        {menus.map((e, index: number) => (
          <InputField
            key={index}
            placeholder={'Menu name ' + (index + 1)}
            onDelete={() =>
              menus.length > 1 &&
              setMenus(pre => pre.filter(i => i.id !== e.id))
            }
            onChangeText={value => onChangeValue(value, index, 'menu', 'title')}
            value={e.title}
          />
        ))}
        <BtnAddDashed label="Add menu" onPress={() => addItem('menu')} />
      </Box>
      <Title fontWeight="bold">Rules of DAO</Title>
      <Description>
        Even if you do not enter it, it can be modified later.
      </Description>
      <Box>
        {rules.map((e, index: number) => (
          <View key={index}>
            <InputField
              placeholder={'Rule name ' + (index + 1)}
              onDelete={() =>
                rules.length > 1 &&
                setRules(pre => pre.filter(i => i.id !== e.id))
              }
              onChangeText={value =>
                onChangeValue(value, index, 'rule', 'title')
              }
              value={e.title}
            />
            <InputField
              placeholder="Detail"
              onChangeText={value =>
                onChangeValue(value, index, 'rule', 'detail')
              }
              value={e.detail}
              multiline
            />
          </View>
        ))}
        <BtnAddDashed label="Add Rule" onPress={() => addItem('rule')} />
      </Box>
      <Title fontWeight="bold">FAQ</Title>
      <Description>
        Even if you do not enter it, it can be modified later.
      </Description>
      <Box>
        {faqs.map((e, index: number) => (
          <View key={index}>
            <InputField
              placeholder={'FAQ name ' + (index + 1)}
              onDelete={() =>
                faqs.length > 1 &&
                setFaqs(pre => pre.filter(i => i.id !== e.id))
              }
              onChangeText={value =>
                onChangeValue(value, index, 'faq', 'title')
              }
              value={e.title}
            />
            <InputField
              placeholder="Detail"
              onChangeText={value =>
                onChangeValue(value, index, 'faq', 'detail')
              }
              value={e.detail}
              multiline
            />
          </View>
        ))}
        <BtnAddDashed label="Add FAQ" onPress={() => addItem('faq')} />
      </Box>
      <Confirm>
        <CheckBox
          checked={confirm}
          onPress={() => setConfirm(pre => !pre)}
          isCircle
        />
        <ConfirmText>
          * Important: please read our{' '}
          <Link onPress={handleOpenLink}>Selection Criteria </Link>
          before applying
        </ConfirmText>
      </Confirm>
      <BtnSubmit
        disable={!confirm}
        onPress={handleNextStep}
        label={loading ? 'Loading...' : update ? 'Update DAO' : 'Create DAO'}
      />
    </Container>
  );
};

export default ConfigurationStep;

const Link = styled(H4)(({ theme: { colors } }) => ({
  color: colors.lightGreen,
}));

const ConfirmText = styled(H4)(({ theme: { colors } }) => ({
  color: colors.white,
  flex: 1,
  flexWrap: 'wrap',
}));

const Confirm = styled.View(({ theme: { space } }) => ({
  paddingTop: space[6],
  paddingBottom: space[6],
  flexDirection: 'row',
}));

const Container = styled.View(({ theme: { space } }) => ({
  paddingLeft: space[4],
  paddingRight: space[4],
}));

const Title = styled(H5)(({ theme: { space } }) => ({
  marginTop: space[6],
  marginBottom: space[2],
}));

const Description = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  marginBottom: space[4],
}));
