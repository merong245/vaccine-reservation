import React from 'react';
import palette from '../../lib/styles/palette';
import styled, { css } from 'styled-components';
import Button from '../common/Button';
import { ItemBlock } from '../common/Contents';

/**
 * 병원명/지역/백신/운영시간
 */
const HospitalItem = styled.div`
  border: 1px solid #ffffff;
  outline: none;
  padding: 1rem;
  text-align: center;
  width: 20%;
  background-color: ${palette.gray[3]};

  ${(props) =>
    props.even &&
    css`
      background-color: ${palette.gray[1]}; // 홀짝 색 다르게
    `}
  ${(props) =>
    props.endLeft &&
    css`
      border-bottom-left-radius: 4px;
    `}
  ${(props) =>
    props.endRight &&
    css`
      border-bottom-right-radius: 4px;
    `}
    ${(props) =>
    props.location &&
    css`
      width: 40%;
    `}
`;

/**
 * 병원명/지역/백신/운영시간
 */
const HospitalTag = styled.div`
  background-color: ${palette.gray[7]};
  font-weight: bold;
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 1rem;
  align-items: center;
  text-align: center;
  width: 20%;

  ${(props) =>
    props.right &&
    css`
      border-top-right-radius: 4px;
    `}
  ${(props) =>
    props.left &&
    css`
      border-top-left-radius: 4px;
    `}
    ${(props) =>
    props.location &&
    css`
      width: 40%;
    `}
`;

const ReserveButton = styled(Button)`
  text-align: center;
  &:hover {
    color: #ffffff;
  }
`;

const HospitalList = ({ type }) => {
  return (
    <>
      <ItemBlock>
        <HospitalTag left>병원명</HospitalTag>
        <HospitalTag location>지역</HospitalTag>
        <HospitalTag>백신</HospitalTag>
        <HospitalTag right>운영시간</HospitalTag>
      </ItemBlock>
      <ItemBlock>
        <HospitalItem>희망병원</HospitalItem>
        <HospitalItem location>
          매우 긴 주소가 들어오면 어떻게 되나
        </HospitalItem>
        <HospitalItem>모더나</HospitalItem>
        <HospitalItem>0900~1500</HospitalItem>
      </ItemBlock>
      <ItemBlock>
        <HospitalItem even endLeft>
          희망병원
        </HospitalItem>
        <HospitalItem location even>
          경기도 안양시 덕양구
        </HospitalItem>
        <HospitalItem even>모더나</HospitalItem>
        <HospitalItem even endRight>
          0900~1500
        </HospitalItem>
      </ItemBlock>
      {/* 접종 완료자의 경우 안보이게 */}
      <ItemBlock style={{ marginTop: '1rem' }}>
        {type === 'reservation' ? (
          <ReserveButton fullwidth="true">백신 예약</ReserveButton>
        ) : (
          <ReserveButton to="/reservation" fullwidth="true">
            백신 예약하러 가기
          </ReserveButton>
        )}
      </ItemBlock>
    </>
  );
};

export default HospitalList;
