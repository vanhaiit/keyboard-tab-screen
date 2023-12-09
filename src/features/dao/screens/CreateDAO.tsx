import { Icons } from '@/assets';
import BtnSubmit from '@/components/BtnSubmit';
import CustomModal from '@/components/Modal';
import { H1, H2, H5, Label } from '@/components/Typography';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { uploadMedia } from '@/services/client';
import { useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ConfigurationStep from '../components/DAO/ConfigurationStep';
import DetailsStep from '../components/DAO/DetailsStep';
import InformationStep from '../components/DAO/InformationStep';
import {
  useCheckDuplicateDAONameMutation,
  useCreateDAOMutation,
  useUpdateDaoMutation,
} from '../slice/api';
import { CREATE_FAQ, ICreateDAO, ICreateDAOState, RULE } from '../types';
import { keyAccept } from '../constants';

type RootStackParamList = {
  CreateDAO: any;
  DetailDAO: any;
};
type Props = NativeStackScreenProps<RootStackParamList, 'CreateDAO'>;

const CreateDAO = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<number>(0);
  const [idDao, setIdDao] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { colors, space } = useTheme();
  const [payload, setPayload] = useState<ICreateDAOState>();
  const user = useAppSelector(getUserInfo);
  const scrollViewRef = useRef<any>(null);
  const infoRef = useRef<any>(null);
  const detailRef = useRef<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [onCheckName] = useCheckDuplicateDAONameMutation();
  const [onCreateDAO] = useCreateDAOMutation();
  const [onUpdateDAO] = useUpdateDaoMutation();
  const isUpdate = !!route?.params?.data;
  const handleNextStep = (
    value: ICreateDAOState,
    completed: boolean = false,
  ) => {
    setStep(pre => (pre + 1 > 2 ? pre : pre + 1));
    setPayload(pre => ({ ...pre, ...value }));
    if (completed) {
      const temp = { ...value };
      let { sns, menus, ctr, tags, rules, faqs, ...dataReq } = temp;

      if (sns && sns.length > 0) {
        dataReq.snsLink = sns?.filter(e => !!e.value)?.map(e => e.value || '');
      }
      /**
       * convert data contributor follow sever
       */
      if (ctr && ctr.length > 0) {
        dataReq.contributors = ctr
          ?.filter(e => !!e.userInfo)
          ?.map(e => e.userInfo?.id || '');
      }
      /**
       * convert data MENU follow sever
       */
      if (menus && menus?.length > 0) {
        dataReq.menu = menus
          ?.filter(e => !!e.title)
          ?.map(e => ({ ...e, menuInput: e.title }));
      }
      /**
       * convert data TAG follow sever
       */
      if (tags && tags.length > 0) {
        dataReq.categories = tags;
      }
      /**
       * convert data RULE follow sever
       */
      if (rules && rules.length > 0) {
        dataReq.rule = rules
          ?.filter(e => !!e.title)
          ?.map(e => ({
            title: e.title || '',
            detail: e.detail || '',
          })) as Array<RULE>;
      }
      /**
       * convert data FQA follow sever
       */
      if (faqs && faqs.length > 0) {
        dataReq.faq = faqs
          ?.filter(e => !!e.title)
          ?.map(e => ({
            title: e.title || '',
            detail: e.detail || '',
          })) as Array<CREATE_FAQ>;
      }
      /**
       * TODO: add location add more
       */
      dataReq.region = 'Asia/Saigon';
      if (route?.params?.data) {
        // @ts-ignore
        dataReq.daoId = route.params.data.id;
        Object.keys(dataReq).forEach(e => {
          if (!keyAccept.includes(e)) {
            // @ts-ignore
            delete dataReq[e] as any;
          }
        });
      }

      onSubmitPushServer(dataReq);
    }
  };

  const onSubmitPushServer = async (data: ICreateDAOState) => {
    try {
      setLoading(true);
      const reqCheck: any = route?.params?.data
        ? { data: false }
        : await onCheckName({ name: data?.name! });
      let avatar: string = '';
      if (data.media) {
        const formData = new FormData();
        formData.append('files', {
          uri: data.media.uri,
          type: data.media.type,
          name: data.media.fileName,
        });

        /**
         * upload file to server
         */
        const resMedia = await uploadMedia(formData);
        console.log(
          '🚀 ~ file: CreateDAO.tsx:115 ~ onSubmitPushServer ~ resMedia:',
          JSON.stringify(resMedia, null, '\t'),
        );
        if (resMedia[0]) {
          avatar = resMedia[0]?.id;
        }
      }
      if (reqCheck?.data === false) {
        const dataReq: ICreateDAO = { ...data, avatar };
        const res: any = route?.params?.data
          ? await onUpdateDAO(dataReq)
          : await onCreateDAO(dataReq);
        if (res?.data?.id) {
          setIdDao(res?.data?.id);
          if (!isUpdate) {
            return setShowModal(true);
          } else {
            Toast.show({
              type: '_success',
              text1: 'Success',
              text2: 'Update DAO successfully',
              position: 'bottom',
            });
            return navigation.navigate('DetailDAO', { id: idDao });
          }
        }
        return Toast.show({
          type: '_error',
          text1: 'Error',
          text2: res?.error?.data?.message || 'Error',
          position: 'bottom',
        });
      } else {
        return Toast.show({
          type: '_error',
          text1: 'Error',
          text2: "DAO's name already exist",
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: CreateDAO.tsx:183 ~ onSubmitPushServer ~ error:',
        error,
      );
      Toast.show({
        type: '_error',
        text1: 'Error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route?.params?.data) {
      const data = { ...route.params.data };
      const tab = route.params.tab;
      data.tags = data?.categories?.map((e: any) => e.id);
      data.sns = data?.snsLink?.list?.map((e: string, index: number) => ({
        id: index,
        value: e,
      }));
      data.menus = data?.menu?.list?.map((e: any) => ({
        id: e.id,
        title: e.title,
        menuInput: e.title,
      }));
      data.rules = data?.rule?.list?.map((e: any, index: number) => ({
        id: index,
        title: e.title,
        detail: e.detail,
      }));
      data.faqs = data?.faq?.list?.map((e: any, index: number) => ({
        id: index,
        title: e.title,
        detail: e.detail,
      }));
      data.ctr = data?.contributors?.map((e: any, index: number) => ({
        id: index,
        value: e.walletAddress,
        userInfo: { ...e },
      }));
      setPayload(data);
      if (tab) {
        setStep(tab);
      }
    } else if (user?.profile) {
      setPayload({
        walletAddress: user?.profile?.walletAddress,
        username: user?.profile?.email,
        classification: 'public',
      });
    }
    return () => setPayload(undefined);
  }, [user, route?.params]);

  useEffect(() => {
    if (scrollViewRef) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [step]);

  const handleChangeStep = (value: number) => {
    if (value > step) {
      switch (value) {
        case 1:
          infoRef.current?.handleNextStep();
          break;
        case 2:
          detailRef.current?.handleNextStep();
          break;
        default:
          break;
      }
    } else {
      setStep(value);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaViewContainer edges={['bottom']}>
        <Container style={{ paddingTop: insets.top }}>
          <Header>
            <HeaderLeft>
              <BtnBack
                onPress={() => navigation.dispatch(CommonActions.goBack())}>
                <Icons.ArrowLeft />
              </BtnBack>
              <Title fontWeight="bold">
                {!route?.params?.data ? 'Create' : 'Setting'} your DAO
              </Title>
            </HeaderLeft>
          </Header>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'none'}
            nestedScrollEnabled={true}
            scrollEventThrottle={10}
            ref={scrollViewRef}>
            <Step>
              <StepContainer>
                <ItemStep onPress={() => handleChangeStep(0)}>
                  <ItemStepIcon active={step >= 0}>
                    <Icons.UserIcon
                      width={space[7]}
                      height={space[7]}
                      color={colors.lightGreen}
                    />
                  </ItemStepIcon>
                </ItemStep>
                <Divider active={step >= 1} />
                <ItemStep onPress={() => handleChangeStep(1)}>
                  <ItemStepIcon active={step >= 1}>
                    <Icons.Detail
                      width={space[6]}
                      height={space[6]}
                      color={colors.lightGreen}
                    />
                  </ItemStepIcon>
                </ItemStep>
                <Divider active={step >= 2} />
                <ItemStep onPress={() => handleChangeStep(2)}>
                  <ItemStepIcon active={step >= 2}>
                    <Icons.Setting
                      width={space[6]}
                      height={space[6]}
                      color={colors.lightGreen}
                    />
                  </ItemStepIcon>
                </ItemStep>
              </StepContainer>
            </Step>
            <Step>
              <StepContainerText>
                <SubItemStep>
                  <ItemStepTitle active={step >= 0}>Information</ItemStepTitle>
                </SubItemStep>
                <SubItemStep>
                  <ItemStepTitle active={step >= 1}>Details</ItemStepTitle>
                </SubItemStep>
                <SubItemStep>
                  <ItemStepTitle active={step >= 2}>
                    Configuration
                  </ItemStepTitle>
                </SubItemStep>
              </StepContainerText>
            </Step>

            {step === 0 && payload && (
              <InformationStep
                ref={infoRef}
                payload={payload}
                onNext={handleNextStep}
              />
            )}
            {step === 1 && payload && (
              <DetailsStep
                ref={detailRef}
                payload={payload}
                onNext={handleNextStep}
              />
            )}
            {step === 2 && payload && (
              <ConfigurationStep
                loading={loading}
                payload={payload}
                onNext={value => handleNextStep(value, true)}
                update={!!route.params?.data}
              />
            )}
          </ScrollView>
          <CustomModal
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'}
            isVisible={showModal}
            headerContent={<HeaderModal />}
            bodyContent={
              <BodyContainer>
                <Item>
                  <Icon>
                    <Icons.UserCircle />
                  </Icon>
                  <TitleItem>
                    <TitleDescription fontWeight="bold">
                      Depending on settings, The availability of posts in Dao is
                      different.
                    </TitleDescription>
                    <SubDescription>
                      Private is visible only to authorized users, and public is
                      visible to all users.
                    </SubDescription>
                  </TitleItem>
                </Item>
                <Item>
                  <Icon>
                    <Icons.DocumentCircle />
                  </Icon>
                  <TitleItem>
                    <TitleDescription fontWeight="bold">
                      Settings can be modified at any time in the admin tool.
                    </TitleDescription>
                    <SubDescription>
                      Easy to use if you want to change settings! go to admin
                      tool page
                    </SubDescription>
                  </TitleItem>
                </Item>
                <BtnSubmit
                  bg={colors.black[0]}
                  styleLabel={{ color: colors.white }}
                  label="I got it"
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate('DetailDAO', { id: idDao });
                  }}
                />
              </BodyContainer>
            }
          />
        </Container>
      </SafeAreaViewContainer>
    </KeyboardAvoidingView>
  );
};

export const HeaderModal = () => {
  const theme = useTheme();
  return (
    <CustomGradientBg
      colors={[
        '#6D89F6',
        '#73ACD6',
        '#7BD5B2',
        '#7EE5A2',
        '#80F394',
        '#81F88F',
        '#9CF884',
        theme.colors.palette.lightGreen,
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0, 0.1, 0.22, 0.29, 0.38, 0.45, 0.64, 1]}>
      <HeaderText>Your Dao is open!</HeaderText>
      <HeaderTextDescription>
        Your entries can be modified at any time in the DAO admin tool.
      </HeaderTextDescription>
    </CustomGradientBg>
  );
};

export default CreateDAO;

const Item = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  marginBottom: space[4],
}));

const Icon = styled.View(() => ({
  flexDirection: 'row',
  width: '25%',
  justifyContent: 'center',
}));

const TitleItem = styled.View(({ theme: { space } }) => ({
  width: '75%',
  paddingLeft: space[4],
}));

const TitleDescription = styled(H5)(({ theme: { colors } }) => ({
  color: colors.black[0],
}));

const SubDescription = styled(Label)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const HeaderTextDescription = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.black[0],
  textAlign: 'center',
  paddingBottom: space[4],
  paddingTop: space[1],
}));

const BodyContainer = styled.View(({ theme: { colors, space } }) => ({
  backgroundColor: colors.white,
  width: '100%',
  borderBottomLeftRadius: space[2],
  borderBottomRightRadius: space[2],
  paddingTop: space[6],
  paddingLeft: space[4],
  paddingRight: space[4],
}));

const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { space, sizes } }) => ({
    height: space[28],
    borderTopLeftRadius: sizes[3],
    borderTopRightRadius: sizes[3],
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const HeaderText = styled(H2)(({ theme: { colors, space } }) => ({
  color: colors.palette.black[3],
  fontWeight: 'bold',
  paddingTop: space[5],
}));

const ScrollView = styled.ScrollView(({ theme: { space } }) => ({
  paddingTop: space[4],
}));

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
}));

const Container = styled.View(({ theme: { colors } }) => ({
  display: 'flex',
  backgroundColor: colors.black[3],
  height: '100%',
}));

const Header = styled.View(({ theme: { space, horizontalSpace } }) => ({
  height: space[10],
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const HeaderLeft = styled.View({
  width: '80%',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
});

const BtnBack = styled.TouchableOpacity(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[7],
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Title = styled(H1)({
  color: 'white',
});

const Step = styled.View(() => ({
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
}));

const StepContainer = styled.View(({ theme: { space, window } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: space[4],
  paddingLeft: space[4],
  alignItems: 'center',
  width: window.width - 70,
}));
const StepContainerText = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: space[4],
  paddingLeft: space[4],
  alignItems: 'center',
  width: '100%',
}));

const ItemStep = styled.Pressable(() => ({
  height: 56,
  width: 56,
  alignItems: 'center',
}));

const SubItemStep = styled.View(() => ({
  width: 120,
  alignItems: 'center',
}));

const Divider = styled.View<{ active: boolean }>(
  ({ theme: { space, colors, window }, active }) => ({
    backgroundColor: active
      ? colors.lightGreen
      : colors.palette.whiteTransparent[1],
    height: 1,
    width: (window.width - 56 * 3) / 2 - space[4] - 35,
  }),
);

const ItemStepIcon = styled.View<{ active: boolean }>(
  ({ theme: { borderRadius, colors }, active }) => ({
    height: '100%',
    backgroundColor: active ? colors.blackYellow : colors.black[2],
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  }),
);

const ItemStepTitle = styled(H5)<{ active: boolean }>(
  ({ theme: { space, colors }, active }) => ({
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    padding: space[2],
    color: active ? colors.lightGreen : colors.black[1],
  }),
);
