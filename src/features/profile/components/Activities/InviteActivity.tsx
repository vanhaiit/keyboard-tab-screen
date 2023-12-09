import CustomTabs from '@/features/nft/components/TabsBarCustom';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useGetInvitesQuery } from '../../slice/api';
import { InviteData, InviteStatus } from '../../types';
import InviteList from './InviteList';

export default function InviteActivity() {
  const [selectedTab, setSelectedTab] = useState<string | number>(1);
  const [invitation, setInvitation] = useState<InviteData[]>([]);
  const [history, setHistory] = useState<InviteData[]>([]);

  const { data, isLoading } = useGetInvitesQuery(
    {
      _start: 0,
      _limit: -1,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (!data) return;

    const dataHistory = data?.data?.filter(
      (el: InviteData) => el?.status !== InviteStatus.PENDING,
    );

    const dataInvitation = data?.data?.filter(
      (el: InviteData) => el?.status === InviteStatus.PENDING,
    );

    setInvitation(dataInvitation);
    setHistory(dataHistory);
  }, [data]);

  const handleTabChange = useCallback((value: number | string) => {
    setSelectedTab(value);
  }, []);

  const handleAcceptOrReject = (id: string, type: InviteStatus) => {
    const item = invitation?.find((el: InviteData) => el?.id === id);
    const newInvitation = invitation?.filter((el: InviteData) => el?.id !== id);
    let newHistory;
    if (type === InviteStatus.ACCEPTED) {
      newHistory = [
        ...history,
        { ...item, status: InviteStatus.ACCEPTED, time: dayjs(new Date()) },
      ];
    }
    if (type === InviteStatus.REJECTED) {
      newHistory = [
        ...history,
        { ...item, status: InviteStatus.REJECTED, time: dayjs(new Date()) },
      ];
    }
    setHistory(newHistory as InviteData[]);
    setInvitation(newInvitation);
  };

  return (
    <CustomTabs
      tabActive={selectedTab}
      onChangeTab={handleTabChange}
      data={[
        {
          label: 'Invitation',
          content: (
            <InviteList
              data={invitation}
              isLoading={isLoading}
              callBackAction={handleAcceptOrReject}
            />
          ),
        },
        {
          label: 'History',
          content: (
            <InviteList
              data={history}
              isLoading={isLoading}
              callBackAction={handleAcceptOrReject}
            />
          ),
        },
      ]}
    />
  );
}
