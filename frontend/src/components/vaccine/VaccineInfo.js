import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import { ContentsBlock } from '../common/Contents';

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

const VaccineInfo = ({ info, loading, error, user, handleComplete }) => {
  return (
    <ContentsBlock>
      {
        // 접종정보
        error ? (
          <InfoBlock>
            <InfoText>{error}</InfoText>
          </InfoBlock>
        ) : !user ? (
          <InfoBlock>
            <InfoText>로그인이 필요한 서비스입니다.</InfoText>
          </InfoBlock>
        ) : loading ? (
          <InfoBlock>
            <InfoText>로딩중입니다...</InfoText>
          </InfoBlock>
        ) : user && info && info.vaccination_number ? (
          <InfoBlock>
            <InfoText>
              <span style={{ color: palette.cyan[9], fontWeight: 'bold' }}>
                {user.name}
              </span>
              님은 {info.vaccination_number}차 접종을 완료하셨습니다.
            </InfoText>
          </InfoBlock>
        ) : (
          <InfoBlock>
            <InfoText>
              <span style={{ color: palette.cyan[9], fontWeight: 'bold' }}>
                {user.name}
              </span>
              님의 접종 기록이 없습니다.
            </InfoText>
          </InfoBlock>
        )
      }
      {
        // 예약정보
        user && info && info.reservation && (
          <>
            <InfoBlock>
              <InfoTag>{info.vaccination_number + 1}차 접종 예약 날짜</InfoTag>
              <InfoContent>{info.reservation.date}</InfoContent>
            </InfoBlock>
            <InfoBlock>
              <InfoTag>{info.vaccination_number + 1}차 접종 예약 장소</InfoTag>
              <InfoContent>{info.reservation.hospital_name}</InfoContent>
            </InfoBlock>
            <InfoBlock>
              <InfoTag>{info.vaccination_number + 1}차 접종 백신 종류</InfoTag>
              <InfoContent>{info.reservation.vaccine_type}</InfoContent>
            </InfoBlock>
            <ButtonBlock>
              <InfoButton onClick={handleComplete} fullwidth="true">
                접종완료
              </InfoButton>
              <InfoButton fullwidth="true" to="/reservation">
                예약변경
              </InfoButton>
            </ButtonBlock>
          </>
        )
      }
    </ContentsBlock>
  );
};

export default VaccineInfo;
