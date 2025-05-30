import client from './axios';

//보낸 편지함에서 목록 조회
export const getSenderMessages = async (page, keyringId) => {
  try {
    const queryParams = new URLSearchParams({ page });

    // keyringId가 존재하고, 'ALL'이 아닌 경우에만 쿼리에 추가
    if (keyringId && keyringId !== 'ALL') {
      queryParams.append('keyringId', keyringId);
    }

    const { data } = await client.get(`/messages/sender?${queryParams.toString()}`);
    return data;
  } catch (error) {
    console.error('보낸 편지함 목록 조회 실패:', error);
  }
};

//보낸 편지함에서 필터 목록 조회
export const getFilterInfo = async () => {
  try {
    const { data } = await client.get(`/messages/filter`);
    return data;
  } catch (error) {
    console.error('보낸 편지함 필터 조회 실패:', error);
  }
};

//받은 편지함에서 목록 조회
export const getDearMessages = async (page) => {
  try {
    const { data } = await client.get(`/messages/dear?page=${page}`);
    return data;
  } catch (error) {
    console.error('받은 편지함 목록 조회 실패1:', error);
  }
};

//받은 편지함에서 즐겨찾기 조회
export const setFavorites = async (messageId) => {
  try {
    const { data } = await client.patch(`/messages/favorite/${messageId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};

//받은 편지함에서 읽음/안읽음 조회
export const getReadStates = async () => {
  try {
    const { data } = await client.get(`/messages/dear/readcount`);
    return data;
  } catch (error) {
    console.error('보낸 편지함 필터 조회 실패:', error);
  }
};
