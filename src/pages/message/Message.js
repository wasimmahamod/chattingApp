import React from 'react'
import Search from '../../components/Search';
import FriendList from '../../components/FriendList'
import Sidebar from './../../components/Sidebar';
import MyGroup from '../../components/MyGroup';
import MsgGroup from '../../components/MsgGroup';
import Chat from '../../components/Chat';
import MsgFriend from '../../components/MsgFriend';

const Message = () => {
  return (
    <div className='flex justify-between'>
    <div className='w-[186px] lg:w-[150px]'>
      <Sidebar active='msg'/>
    </div>
    <div className='w-[25%]'>
    <Search/>
    <MsgGroup/>
    <MsgFriend/>
    </div>
    <div className='w-[50%]'>
    <Chat/>
    </div>

  </div>
  )
}

export default Message