import BtnAddDashed from '@/components/BtnAddDashed';
import InputField from '@/components/InputField';
import { H4 } from '@/components/Typography';
import { useUpdateEffect } from '@/hooks/useUpdateEffect';
import styled from '@emotion/native';
import { memo, useEffect, useState } from 'react';

interface Props {
  onChange?: (value: any) => void;
  onClose?: () => void;
  touchable?: boolean;
  dataEdit?: any;
}

export interface IPoll {
  endDate?: string;
  data: Data;
  totalVotes?: number;
  id?: string;
}

interface Data {
  options: Option[];
  durationTime: DurationTime;
  startTime: string;
}

export interface DurationTime {
  days: number;
  hours: number;
  minutes: number;
}

interface Option {
  index: number;
  title?: string;
  count?: number;
}

function Poll({ onChange, onClose, touchable, dataEdit }: Props) {
  const [options, setOptions] = useState<Array<Option>>([
    { index: 1, title: '' },
    { index: 2, title: '' },
  ]);
  const [days, setDays] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [valid, setValid] = useState<any>({
    days: true,
    hours: true,
    minutes: true,
  });

  const handleInputChange = (
    type: 'days' | 'hours' | 'minutes',
    value: string,
  ) => {
    try {
      const regex = /^\d*$/;
      if (!regex.test(value)) {
        return;
      }
      switch (type) {
        case 'days':
          new Date(
            new Date().getTime() +
              ((type === 'days' && +value) || 0) * 24 * 60 * 60000,
          ).toISOString();
          setDays(value);
          break;
        case 'hours':
          new Date(
            new Date().getTime() +
              ((type === 'hours' && +value) || 0) * 60 * 60000,
          ).toISOString();
          setHours(value);

          break;
        case 'minutes':
          new Date(
            new Date().getTime() +
              ((type === 'minutes' && +value) || 0) * 60000,
          ).toISOString();
          setMinutes(value);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('🚀 ~ file: Poll.tsx:73 ~ Poll ~ error:', error);
    }
  };

  const handleValidInput = () => {
    setValid((pre: any) => ({
      ...pre,
      hours: !!hours,
      days: !!days,
      minutes: !!minutes,
    }));
  };

  useEffect(() => {
    if (dataEdit) {
      setOptions(dataEdit.options);
      setDays(dataEdit.durationTime.days.toString());
      setHours(dataEdit.durationTime.hours.toString());
      setMinutes(dataEdit.durationTime.minutes.toString());
    }
  }, [dataEdit]);

  useUpdateEffect(() => {
    if (touchable) {
      handleValidInput();
    }
  }, [touchable, days, hours, minutes]);

  useUpdateEffect(() => {
    try {
      if (onChange) {
        const data: IPoll = {
          data: {
            options: options.map((e: Option, index: number) => ({
              index,
              title: e.title,
            })),
            durationTime: {
              days: days ? +days : 0,
              hours: hours ? +hours : 0,
              minutes: minutes ? +minutes : 0,
            },
            startTime: new Date().toISOString(),
          },
        };
        const startTimeDate = new Date(data.data.startTime);
        onChange({
          ...data,
          endTime: new Date(
            startTimeDate.getTime() +
              (data.data.durationTime.days * 24 * 60 +
                data.data.durationTime.hours * 60 +
                data.data.durationTime.minutes) *
                60000,
          ).toISOString(),
        });
      }
    } catch (error) {
      console.log('🚀 ~ file: Poll.tsx:109 ~ useUpdateEffect ~ error:', error);
    }
  }, [options, days, hours, minutes]);
  /**
   * add new item option
   */
  const addNewOption = () => {
    setOptions(pre => [
      ...pre,
      { index: pre[pre.length - 1].index + 1, title: '' },
    ]);
  };
  /**
   * remove option
   * @param index
   * @returns
   */
  const removeOption = (index: number) => {
    if (options.length <= 1) {
      return;
    }
    setOptions(pre => pre.filter(e => e.index !== index));
  };
  /**
   * change value option poll
   * @param value
   * @param index
   */
  const onChangeValueOption = (value: string, index: number) => {
    const data = [...options];
    data[index].title = value;
    setOptions(data);
  };

  return (
    <Container>
      <Header>
        <Title>
          <TitleText>Poll</TitleText>
        </Title>
        {onClose && (
          <Remove>
            <RemoveText onPress={onClose}>Remove</RemoveText>
          </Remove>
        )}
      </Header>
      {options.map((e: Option, index: number) => (
        <InputField
          key={index}
          editable={!dataEdit}
          onChangeText={value => onChangeValueOption(value, index)}
          placeholder={`Option ${index + 1}`}
          value={e.title}
          onDelete={
            dataEdit || options?.length <= 2
              ? undefined
              : () => removeOption(e.index)
          }
          errorMg={!e.title && touchable ? 'Option is empty' : ''}
        />
      ))}
      {!dataEdit && <BtnAddDashed label="Add Option" onPress={addNewOption} />}
      <PollLengthContainer>
        <PollLength>Poll length</PollLength>
      </PollLengthContainer>
      <InputField
        label="Day"
        require
        editable={!dataEdit}
        onChangeText={value => handleInputChange('days', value)}
        keyboardType="numeric"
        placeholder="Enter day"
        value={days}
        errorMg={!valid.days ? 'This field is required' : ''}
      />
      <InputField
        label="Hours"
        require
        editable={!dataEdit}
        onChangeText={value => +value < 24 && handleInputChange('hours', value)}
        keyboardType="numeric"
        placeholder="Enter hours"
        value={hours}
        errorMg={!valid.hours ? 'This field is required' : ''}
      />
      <InputField
        label="Minutes"
        require
        editable={!dataEdit}
        onChangeText={value =>
          +value < 60 && handleInputChange('minutes', value)
        }
        keyboardType="numeric"
        placeholder="Enter minutes"
        value={minutes}
        errorMg={!valid.minutes ? 'This field is required' : ''}
      />
    </Container>
  );
}
export default memo(Poll);

const Container = styled.View(({ theme: { borderRadius, colors, space } }) => ({
  margin: space[4],
  borderRadius: borderRadius.small,
  padding: space[4],
  backgroundColor: colors.black[2],
}));

const Header = styled.View(({ theme: { space } }) => ({
  height: space[12],
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const Title = styled.View(({ theme: { space } }) => ({
  height: space[12],
  width: '50%',
}));
const TitleText = styled.Text(({ theme: { colors } }) => ({
  color: colors.white,
}));

const Remove = styled.TouchableOpacity(({ theme: { space } }) => ({
  height: space[12],
  width: '50%',
}));

const RemoveText = styled.Text(({ theme: { colors } }) => ({
  color: colors.alertRed,
  textAlign: 'right',
}));

const Option = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  height: space[12],
  marginBottom: space[4],
}));

const PollLengthContainer = styled.View(({ theme: { colors, space } }) => ({
  borderTopWidth: 0.5,
  borderColor: colors.grey[2],
  marginTop: space[4],
}));

const PollLength = styled(H4)(({ theme: { colors, space } }) => ({
  paddingTop: space[4],
  paddingBottom: space[4],
  color: colors.white,
  fontWeight: '400',
  borderColor: colors.white,
}));
