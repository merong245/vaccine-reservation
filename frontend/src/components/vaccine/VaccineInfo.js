import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import { ContentsBlock } from '../common/Contents';
import { complete } from '../../modules/info';

const InfoBlock = styled.div`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  & + & {
    margin-top: 3rem;
  }
`;

const InfoText = styled.div`
  font-size: 1.2rem;
  border-radius: 4px;
  border: 2px solid ${palette.cyan[7]};
  outline: none;
  padding: 1rem;
  width: 100%;
  align-items: center;
  text-align: center;
`;

const InfoTag = styled.div`
  background-color: ${palette.gray[7]};
  color: #ffffff;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid ${palette.gray[7]};
  width: 40%;
  padding: 1rem;
  align-items: center;
  text-align: center;
`;

const InfoContent = styled.div`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid ${palette.gray[7]};
  width: 60%;
  padding: 1rem;
  align-items: center;
  text-align: center;
`;

const ButtonBlock = styled.div`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
`;

const InfoButton = styled(Button)`
  text-align: center;
  &:hover {
    color: #ffffff;
  }
  & + & {
    margin-left: 3rem;
  }
`;

const VaccineInfo = ({ info, loading, error, user }) => {
  return (
    <ContentsBlock>
      {error ? (
        <InfoBlock>
          <InfoText>
            {error} : 사용자 정보를 불러오는데 실패하였습니다.
          </InfoText>
        </InfoBlock>
      ) : !loading && user ? (
        <>
          <InfoBlock>
            <InfoText>{user.name}님은 1차 접종을 완료하셨습니다.</InfoText>
          </InfoBlock>
          <InfoBlock>
            <InfoTag>{info.vaccination_number}차 접종 예약 날짜</InfoTag>
            <InfoContent>{2021}년 12월 3일 11:00</InfoContent>
          </InfoBlock>
          <InfoBlock>
            <InfoTag>n차 접종 예약 장소</InfoTag>
            <InfoContent>광운대학병원</InfoContent>
          </InfoBlock>
          <InfoBlock>
            <InfoTag>n차 접종 백신 종류</InfoTag>
            <InfoContent>화이자</InfoContent>
          </InfoBlock>
          <ButtonBlock>
            <InfoButton fullwidth="true">접종완료</InfoButton>
            <InfoButton fullwidth="true" to="/reservation">
              예약변경
            </InfoButton>
          </ButtonBlock>
        </>
      ) : (
        <InfoBlock>
          <InfoText>로딩중입니다...</InfoText>
        </InfoBlock>
      )}
    </ContentsBlock>
  );
};

export default VaccineInfo;
