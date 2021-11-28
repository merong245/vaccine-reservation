import React from 'react';
import { withRouter } from 'react-router-dom';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { RiHomeLine } from 'react-icons/ri';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { FaRegCalendarTimes } from 'react-icons/fa';
import { BsTable } from 'react-icons/bs';

const SideNavigation = ({ history }) => {
  const items = [
    {
      title: '홈',
      itemId: '/',
      elemBefore: () => {
        return <RiHomeLine />;
      },
    },
    {
      title: '병원별 잔여백신 현황',
      itemId: '/login',
      elemBefore: () => {
        return <MdOutlineLocalHospital />;
      },
    },
    {
      title: '예약가능 의료기관 조회',
      itemId: '/register',
      elemBefore: () => {
        return <FaRegCalendarTimes />;
      },
    },
    {
      title: '접종결과',
      itemId: '/home',
      elemBefore: () => {
        return <BsTable />;
      },
    },
  ];

  return (
    <Navigation
      onSelect={({ itemId }) => {
        history.push(itemId);
      }}
      items={items}
    />
  );
};

export default withRouter(SideNavigation);
