import React from 'react';
import { withRouter } from 'react-router-dom';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { RiHomeLine } from 'react-icons/ri';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { FaRegCalendarTimes } from 'react-icons/fa';
import { BsTable } from 'react-icons/bs';

const SideNavigation = ({ history, location }) => {
  const items = [
    {
      title: '홈',
      itemId: '/home',
      elemBefore: () => {
        return <RiHomeLine />;
      },
    },
    {
      title: '잔여백신 현황',
      itemId: '/vaccineStatus',
      elemBefore: () => {
        return <MdOutlineLocalHospital />;
      },
    },
    {
      title: '백신 예약',
      itemId: '/reservation',
      elemBefore: () => {
        return <FaRegCalendarTimes />;
      },
    },
    {
      title: '접종결과',
      itemId: '/result',
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
      activeItemId={location.pathname}
      items={items}
    />
  );
};

export default withRouter(SideNavigation);
