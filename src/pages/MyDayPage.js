import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography } from 'antd';

export const MyDayPage = () => {
  return (
    <div>
      <Typography.Title>My Day</Typography.Title>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyDayPage);
