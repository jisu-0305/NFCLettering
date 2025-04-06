import React, { useEffect } from 'react';
import styled from 'styled-components';

const AddressSearch = ({ setZipcode, setAddress }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete(data) {
        let fullAddress = data.roadAddress;
        let extraAddress = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        if (extraAddress !== '') {
          fullAddress += ` (${extraAddress})`;
        }

        setZipcode(data.zonecode); // ✅ 우편번호 전달
        setAddress(fullAddress); // ✅ 도로명 주소 전달

        window.history.replaceState({}, '', window.location.pathname);
      },
    }).open();
  };

  return (
    <ZipCodeButton onClick={openPostcode} type="button">
      주소검색
    </ZipCodeButton>
  );
};

export default AddressSearch;

const ZipCodeButton = styled.button`
  /* position: absolute;
  right: 0; */

  width: 8rem;
  height: 3.5rem;
  border-radius: 0.625rem;

  background-color: ${({ theme }) => theme.colors.Red2};
  ${({ theme }) => theme.fonts.Title5}
  color: ${({ theme }) => theme.colors.White}
`;
