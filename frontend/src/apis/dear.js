import client from './axios';

export const getUnreadMessage = async () => {
  try {
    const response = await client.get('/messages/unread');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getHighImage = async (messageId) => {
  try {
    const response = await client.get('/messages/highimage', {
      params: { messageId },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const terminateKeyring = async () => {
  try {
    const { data } = await client.delete('/keyrings/delete');
  } catch (error) {
    console.error('키링 영구 삭제 실패', error);
  }
};

//키링 커스텀 메세지 조회
export const getCustomMessage = async () => {
  try {
    const { data } = await client.get('/keyrings/custom-message');
    return data;
  } catch (error) {
    console.error(error);
  }
};

//키링 세션 설정
export const postDeviceInfo = async () => {
  try {
    const res = await client.post('/keyrings/nfc-access', {
      id: 17,
      deviceId: '22eb13c76a1d38d1',
    });
    return res;
  } catch (error) {
    console.error('키링 영구 삭제 실패', error);
  }
};

//퀴즈 정보
export const getQuizInfo = async (messageId) => {
  try {
    const res = await client.get(`/messages/dear/quiz/${messageId}`);
    return res.data;
  } catch (error) {
    console.error('퀴즈 정보 조회 실패', error);
    return null;
  }
};
