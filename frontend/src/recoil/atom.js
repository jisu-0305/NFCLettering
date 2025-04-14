//전역 상태관리 > recoil
//대문자 카멜케이스 네이밍
//관리하는게 상태일 경우 ~State로 네이밍밍

import { atom } from 'recoil';

//유저 아이디
const UserId = atom({
  key: 'userid',
  default: 1,
});

// 업로드한 이미지 미리보기
const PostcardImage = atom({
  key: 'postcardImage',
  default: null,
});

// 엽서 쓰기 API 시 이미지 파일
const PostcardImageFile = atom({
  key: 'postcardImageFile',
  default: null,
});

// 엽서 쓰기 API 시 내용
const PostcardText = atom({
  key: 'postcardText',
  default: '',
});

// 전송 대상 선택 시 (키링id)
const SelectedKeyringId = atom({
  key: 'selectedKeyringId',
  default: 'null',
});

// 이미지 리스트 (file과 url 함께 저장)
const LetterImageList = atom({
  key: 'LetterImageList',
  default: [],
});

// 편지 텍스트
const LetterText = atom({
  key: 'LetterText',
  default: '',
});

const LetterTextList = atom({
  key: 'LetterTextList',
  default: [],
});

// 유저 닉네임
const UserNickname = atom({
  key: 'userNickname',
  default: '',
});

// 유저 폰트
const UserFont = atom({
  key: 'userFont',
  default: 'GOMSIN1',
});

// 유저 키링 리스트
const UserKeyringList = atom({
  key: 'userKeyringlist',
  default: [],
});

// 결제 금액
const TotalPrice = atom({
  key: 'totalPrice',
  default: 0,
});

// 결제 키링 수
const TotalQuantity = atom({
  key: 'totalQuantity',
  default: 1,
});

const RedisMessageKey = atom({
  key: 'RedisMessageKey',
  default: '',
});

const OrderNumber = atom({
  key: 'orderNumber',
  default: 0,
});

const KeyringCustomList = atom({
  key: 'KeyringCustomList',
  default: [],
});

const SelectedFilterState = atom({
  key: 'SelectedFilterState',
  default: 0,
});

const ActiveIndexState = atom({
  key: 'ActiveIndexState',
  default: 0,
});

export {
  ActiveIndexState,
  KeyringCustomList,
  LetterImageList,
  LetterText,
  LetterTextList,
  OrderNumber,
  PostcardImage,
  PostcardImageFile,
  PostcardText,
  RedisMessageKey,
  SelectedFilterState,
  SelectedKeyringId,
  TotalPrice,
  TotalQuantity,
  UserFont,
  UserId,
  UserKeyringList,
  UserNickname,
};
