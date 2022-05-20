import React from 'react';
import './app.less';
import { Button } from 'antd';
export default () => {
  return (
    <div className='div-container'>
      <p>hello world</p>
      <Button type='primary'>test</Button>
      <div className='div-btn'>跳转</div>
    </div>
  );
};
