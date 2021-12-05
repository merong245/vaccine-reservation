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
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: ${palette.gray[3]};

  ${(props) =>
    props.index % 2 === 1 &&
    css`
      background-color: ${palette.gray[1]}; // 홀짝 색 다르게
    `}
  ${(props) =>
    props.vaccine &&
    css`
      width: 22%;
    `}
  ${(props) =>
    props.left &&
    css`
      width: 30%;
    `}
  ${(props) =>
    props.right &&
    css`
      width: 20%;
    `}
  ${(props) =>
    props.location &&
    css`
      width: 18%;
    `}
  ${(props) =>
    props.quantity &&
    css`
      width: 10%;
    `}
`;

const SelectableItemBlock = styled(ItemBlock)`
  &:hover {
    ${HospitalItem} {
      background-color: ${palette.cyan[0]};
    }
  }
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
  display: flex;
  justify-content: center;

  ${(props) =>
    props.vaccine &&
    css`
      width: 22%;
    `}
  ${(props) =>
    props.right &&
    css`
      border-top-right-radius: 4px;
      width: 20%;
    `}
  ${(props) =>
    props.left &&
    css`
      border-top-left-radius: 4px;
      width: 30%;
    `}
    ${(props) =>
    props.location &&
    css`
      width: 18%;
    `}
    ${(props) =>
    props.quantity &&
    css`
      width: 10%;
    `}
`;

const ReserveButton = styled(Button)`
  text-align: center;
  &:hover {
    color: #ffffff;
  }
`;

const TableContainer = styled.div`
  overflow: scroll;
  height: 350px;
  --ms-overflow-style: none; // ie, edge
  scrollbar-width: none; // firefox
  &::-webkit-scrollbar {
    display: none; // chrome, safari, opera
  }
`;

const HospitalList = ({
  type,
  list,
  error,
  loading,
  user,
  hospitalName,
  setSelectedHospital,
}) => {
  return (
    <>
      <br />
      <ItemBlock>
        <HospitalTag left>병원명</HospitalTag>
        <HospitalTag location>지역</HospitalTag>
        <HospitalTag vaccine>백신</HospitalTag>
        <HospitalTag quantity>잔량</HospitalTag>
        <HospitalTag right>운영시간</HospitalTag>
      </ItemBlock>
      <TableContainer>
        {!loading && list && (
          <>
            {list.map((hospital, index) => (
              <SelectableItemBlock
                key={index}
                onClick={
                  setSelectedHospital
                    ? setSelectedHospital(hospital.fk_hospital_name)
                    : (e) => e
                }
              >
                <HospitalItem left index={index}>
                  {hospital.fk_hospital_name}
                </HospitalItem>
                <HospitalItem location index={index}>
                  {hospital.district
                    ? hospital.province +
                      ' ' +
                      hospital.city +
                      ' ' +
                      hospital.district
                    : hospital.province + ' ' + hospital.city}
                </HospitalItem>
                <HospitalItem vaccine index={index}>
                  {hospital.vaccine_type}
                </HospitalItem>
                <HospitalItem quantity index={index}>
                  {hospital.quantity}
                </HospitalItem>
                <HospitalItem right index={index}>
                  {hospital.opening_time.substr(0, 5)}~
                  {hospital.closing_time.substr(0, 5)}
                </HospitalItem>
              </SelectableItemBlock>
            ))}
          </>
        )}
      </TableContainer>
      {/* 접종 완료자의 경우 안보이게 */}
      <ItemBlock style={{ marginTop: '1rem' }}>
        {type === 'reservation' ? (
          <ReserveButton fullwidth="true" cyan>
            백신 예약
          </ReserveButton>
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
