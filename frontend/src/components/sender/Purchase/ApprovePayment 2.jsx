import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { approvePayment } from '/src/apis/purchase.js';

import { KeyringCustomList, OrderNumber } from '../../../recoil/atom';

const ApprovePayment = () => {
  const [searchParams] = useSearchParams();
  const pgToken = searchParams.get('pg_token');
  const orderNumber = searchParams.get('orderNumber');
  const navigate = useNavigate();
  const setCustomlist = useSetRecoilState(KeyringCustomList);
  const setOrderNum = useSetRecoilState(OrderNumber);

  useEffect(() => {
    const handleApprove = async () => {
      const { keyringIds } = await approvePayment({ pgToken, orderNumber });

      const initList = keyringIds.map((id) => ({
        keyringId: id,
        nickname: '우체통이름',
        message: '새로운 편지가 도착했어요!',
      }));

      setCustomlist(initList);
      setOrderNum(orderNumber);
      navigate('/purchase/customize');
    };

    if (pgToken && orderNumber) handleApprove();
  }, [pgToken, orderNumber]);

  return <div>결제를 승인 중입니다...</div>;
};

export default ApprovePayment;
