/* eslint-disable react-hooks/exhaustive-deps */
import { Icons } from '@/assets';
import BottomSheet from '@/components/BottomSheet';
import { Box } from '@/components/Box';
import BtnAddDashed from '@/components/BtnAddDashed';
import BtnSubmit from '@/components/BtnSubmit';
import ButtonChip from '@/components/ButtonChip';
import InputField from '@/components/InputField';
import { H4, H5, Label, SmallBody } from '@/components/Typography';
import { Profile } from '@/features/auth/types';
import { ISheet } from '@/features/post/types';
import { useUpdateEffect } from '@/hooks/useUpdateEffect';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { INIT_SNS } from '../../../post/constants';
import { useLazyGetUserProfileQuery } from '../../../post/slice/api';
import { timezones } from '../../constants';
import { useGetDaoCategoryQuery } from '../../slice/api';
import { DAOCategory, ICreateDAOState } from '../../types';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useAppSelector } from '@/store/type';

interface Props {
  onNext?: (value: any) => void;
  payload: ICreateDAOState;
}

const initSheet: ISheet = {
  title: '',
  content: () => <></>,
};

const { height: heightContent } = Dimensions.get('window');

const DetailsStep = ({ onNext, payload }: Props, ref: any) => {
  let timer: any = null;
  const { colors, borderRadius, space } = useTheme();
  const user = useAppSelector(getUserInfo);
  const [tags, setTags] = useState<string[]>(payload?.tags || []);
  const [description, setDescription] = useState<string>(
    payload?.description || '',
  );
  const [touchable, setTouchable] = useState<boolean>(false);
  const [valid, setValid] = useState<any>({
    description: true,
    tag: true,
  });
  const [sns, setSNS] = useState<Array<{ id: number; value?: string }>>(
    payload?.sns || INIT_SNS,
  );
  const [contributors, setContributors] = useState<
    Array<{ id: number; value?: string; userInfo?: Profile; err?: string }>
  >(
    payload?.ctr || [
      { id: 1, value: '', userInfo: undefined, err: '' },
      { id: 2, value: '', userInfo: undefined, err: '' },
    ],
  );

  const [region, setRegion] = useState({
    value: 'Asia/Saigon',
    index: 304,
  });

  const [sheet, setSheet] = useState<ISheet>(initSheet);

  const regionRef = useRef(null);

  const { data: tagCategory, isLoading } = useGetDaoCategoryQuery({
    _limit: -1,
  });

  const [getProfile, { data: userSearch }] = useLazyGetUserProfileQuery();

  const onSelected = (value: string, type: 0 | 1) => {
    if (type === 0) {
      setTags(pre => pre.concat(value));
    } else {
      setTags(pres => pres.filter(e => e !== value));
    }
  };

  const onChangeValueSNS = (value: string, index: number) => {
    const temp = [...sns];
    temp[index].value = value;
    setSNS(temp);
  };

  const addNewOptionSNS = () => {
    setSNS(pre => [...pre, { id: pre[pre.length - 1].id + 1, value: '' }]);
  };

  const addNewOptionContributors = () => {
    setContributors(pre => [
      ...pre,
      { id: pre[pre.length - 1].id + 1, value: '', userInfo: undefined },
    ]);
  };

  const onSearchUser = (value: string, index: number) => {
    const temp = [...contributors];
    const check = temp.some(e => e.value === value);
    if (check) {
      temp[index].err = 'User is already a DAO member';
    } else if (value === user?.profile?.walletAddress) {
      temp[index].err = 'Creator cannot be added as contributor';
    } else {
      temp[index].err = undefined;
      clearTimeout(timer);
      timer = setTimeout(() => {
        getProfile({ walletAddress: value });
      }, 500);
    }
    temp[index].value = value;
    setContributors([...temp]);
  };

  useEffect(() => {
    if (userSearch) {
      const index = contributors.findIndex(
        x => x.value === userSearch?.walletAddress,
      );
      if (index > -1) {
        const temp = [...contributors];
        temp[index].userInfo = userSearch;
        setContributors(temp);
      }
    }
  }, [userSearch]);

  const handleNextStep = () => {
    handleChangeInput();
    setTouchable(true);
    if (onNext && description && tags.length > 0) {
      const temp: ICreateDAOState = {
        ...payload,
        tags,
        sns,
        ctr: contributors,
        description,
        region: region?.value,
      };
      onNext(temp);
    }
  };

  useImperativeHandle(ref, () => ({
    handleNextStep,
  }));

  const handleChangeInput = () => {
    setValid((pre: any) => ({
      ...pre,
      description: !!description,
      tag: tags.length > 2 && tags.length < 6,
    }));
  };

  useUpdateEffect(() => {
    if (touchable) {
      handleChangeInput();
    }
  }, [description, tags]);

  const onCloseBottomSheet = () => {
    setSheet(initSheet);
  };

  const renderContentRegion = () => {
    return (
      <RegionSheetContent>
        <FlashList
          data={timezones || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
          ref={regionRef}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <RegionItem
              active={item === region?.value}
              activeOpacity={0.2}
              onPress={() => {
                setSheet(initSheet);
                setRegion({
                  value: item,
                  index,
                });
              }}>
              <SmallBody
                color={item === region?.value ? colors.black[0] : colors.white}
                fontWeight="medium">
                {item}
              </SmallBody>
            </RegionItem>
          )}
        />
      </RegionSheetContent>
    );
  };

  return (
    <Container>
      <InputField
        multiline
        label="Description of DAO"
        placeholder="Explain DAO"
        require
        bg={colors.black[2]}
        onChangeText={setDescription}
        errorMg={!valid.description ? 'This field is required' : ''}
        value={description}
      />
      <Title fontWeight="bold">
        Tag of DAO <MgEr>*</MgEr>{' '}
        {!valid.tag && (
          <MgEr>
            {tags.length > 0
              ? 'Please select between 03 and 05 tags'
              : 'Please select DAO tag'}
          </MgEr>
        )}
      </Title>
      <Description>
        Select the category you want, and click again if you want to cancel it.
      </Description>
      <Tag>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          tagCategory &&
          tagCategory?.map((e: DAOCategory, index: number) => (
            <BtnChipContainer
              onPress={() => onSelected(e.id, tags.includes(e.id) ? 1 : 0)}
              key={index}
              imageSrc={{ uri: e?.icon?.url }}
              label={e.name}
              style={{
                backgroundColor: tags.includes(e.id)
                  ? colors.blackYellow
                  : colors.black[2],
                height: space[10],
              }}
              styleImage={{ borderRadius: borderRadius.full }}
            />
          ))
        )}
      </Tag>
      <Title fontWeight="bold">SNS of DAO</Title>
      <Description>
        Even if you do not enter it, it will be created as the default type
        board. It can be modified later.
      </Description>

      <Box>
        {sns.map((e: any, index: number) => (
          <InputField
            key={index}
            value={e.value}
            onChangeText={value => onChangeValueSNS(value, index)}
            placeholder={'SNS Link ' + (index + 1)}
            onDelete={() =>
              sns.length > 1 && setSNS(pre => pre.filter(i => i.id !== e.id))
            }
          />
        ))}
        <BtnAddDashed label="Add Link" onPress={addNewOptionSNS} />
      </Box>
      <Title fontWeight="bold">Region</Title>
      <BoxRegion
        onPress={() => {
          setSheet({
            title: 'Region',
            content: renderContentRegion,
          });
        }}>
        <H4 color={colors.white}>{region?.value}</H4>
        <Icons.ArrowDown color={colors.white} />
      </BoxRegion>
      <Title fontWeight="bold">Dao contributor</Title>
      <Description>
        Even if you do not enter it, it can be modified later.
      </Description>
      <Box>
        {contributors.map((e, index: number) => (
          <View key={index}>
            {!e.userInfo ? (
              <InputField
                onChangeText={value => onSearchUser(value, index)}
                placeholder="User wallet address"
                onDelete={() =>
                  contributors.length > 1 &&
                  setContributors(pre => pre.filter(i => i.id !== e.id))
                }
                style={{ paddingRight: space[10] }}
                value={e.value}
                errorMg={e.err}
              />
            ) : (
              <Contributor>
                <Chip>
                  <ButtonChip
                    imageSrc={require('@/assets/images/nft.png')}
                    label={e.userInfo.username}
                    style={{ backgroundColor: colors.black[2] }}
                    styleImage={{ borderRadius: borderRadius.full }}
                  />
                </Chip>
                <InputField
                  onDelete={() =>
                    contributors.length > 1 &&
                    setContributors(pre => pre.filter(i => i.id !== e.id))
                  }
                />
              </Contributor>
            )}
          </View>
        ))}
        <BtnAddDashed
          onPress={addNewOptionContributors}
          label="Add contributor"
        />
      </Box>
      <BtnSubmit
        onPress={handleNextStep}
        iconSuffix={<Icons.NextArrow />}
        label="Next"
      />
      <BottomSheet
        isVisible={!!sheet.title}
        title={sheet?.title || ''}
        description={sheet?.description}
        closeModal={onCloseBottomSheet}
        renderContent={sheet?.content}
        renderFooter={() => <></>}
      />
    </Container>
  );
};

export default forwardRef(DetailsStep);

const BtnChipContainer = styled(ButtonChip)(({ theme: { space } }) => ({
  marginBottom: space[2],
}));

const MgEr = styled(Label)(({ theme: { colors } }) => ({
  color: colors.alertRed,
}));

const Tag = styled.View(() => ({
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const Chip = styled.View(({ theme: { space, borderRadius } }) => ({
  height: space[8],
  position: 'absolute',
  zIndex: 1,
  top: space[3],
  left: space[2],
  borderRadius: borderRadius.small,
}));

const Contributor = styled.View(({ theme: {} }) => ({}));

const Container = styled.View(({ theme: { space } }) => ({
  paddingLeft: space[4],
  paddingRight: space[4],
  paddingTop: space[6],
}));

const Title = styled(H5)(({ theme: { space } }) => ({
  marginTop: space[6],
  marginBottom: space[2],
}));

const Description = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  marginBottom: space[4],
}));

const BoxRegion = styled.TouchableOpacity(
  ({ theme: { colors, space, horizontalSpace, borderRadius } }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[3],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.medium,
  }),
);

const RegionSheetContent = styled.View(({ theme: {} }) => ({
  height: heightContent / 1.5,
}));

const RegionItem = styled.TouchableOpacity<{ active: boolean }>(
  ({ theme: { horizontalSpace, space, colors, borderRadius }, active }) => ({
    paddingHorizontal: horizontalSpace[4],
    justifyContent: 'center',
    backgroundColor: active ? colors.lightGreen : colors.grey[3],
    marginBottom: space[2],
    borderRadius: borderRadius.medium,
    height: space[10],
  }),
);
