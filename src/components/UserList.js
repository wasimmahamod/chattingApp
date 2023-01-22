import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref,set, onValue,push} from "firebase/database";
import { useSelector } from 'react-redux';


const UserList = () => {
  const db = getDatabase();
  let [userList,setUserList]=useState([])
  let [friendRequestList,setFriendRequestList]=useState([])
  let [friendList,setFriendList]=useState([])
  let [blockList,setBlockList]=useState([])
  let [filterUserList,setFilterUserList]=useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)

  useEffect(()=>{
    const userListRef = ref(db, 'users/');
    onValue(userListRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid !=item.key){

          arr.push({...item.val(),id:item.key})
        }
      })
      setUserList(arr)
    });
  },[])
  

  let handleFriendRequest=(item)=>{
    set(push(ref(db, 'friendRequest/')), {
      senderid:data.uid,
      sendername:data.displayName,
      senderimg:data.photoURL,
      recivername:item.username,
      reciverid:item.id,
      reciverimg:item.img,

    });
  }
  useEffect(()=>{
    const userListRef = ref(db, 'friendRequest/');
    onValue(userListRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().senderid+item.val().reciverid)
      })
      setFriendRequestList(arr)
    });
  },[])
  useEffect(()=>{
    const userListRef = ref(db, 'friend/');
    onValue(userListRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().senderid+item.val().reciverid)
      })
      setFriendList(arr)
    });
  },[])
  useEffect(()=>{
    const blocklistRef = ref(db, 'block/');
    onValue(blocklistRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().blockid+item.val().blockbyid)
      })
      setBlockList(arr)
    });
  },[])

  // user search 
  let handleUserSearch=(e)=>{
    let arr=[]
    if(e.target.value.length==0){
      setFilterUserList([])
    }else{
      userList.filter((item)=>{
        if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
          arr.push(item)
        }
        setFilterUserList(arr)
      })
    }
 
  }
  return (
    <div className='mt-5 relative h-[340px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>User List </h2>
    <input onChange={handleUserSearch} className='w-full rounded-xl py-3 pl-5 placeholder:font-poppins text-base drop-shadow-lg	' type="text" placeholder='Search'/>
    {filterUserList.length > 0
    ?
    filterUserList.map((item)=>(

      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.img} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        {blockList.includes(data.uid+item.id)||blockList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>B</button>
        :
        friendList.includes(data.uid+item.id)||friendList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>F</button>
        :
        friendRequestList.includes(data.uid+item.id)||friendRequestList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>p</button>
        :
        <button onClick={()=>handleFriendRequest(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Join</button>
        }
     
        </div>
     
    </div>
    ))
    :
    userList.map((item)=>(

      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.img} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        {blockList.includes(data.uid+item.id)||blockList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>B</button>
        :
        friendList.includes(data.uid+item.id)||friendList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>F</button>
        :
        friendRequestList.includes(data.uid+item.id)||friendRequestList.includes(item.id+data.uid)
        ?
        <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>p</button>
        :
        <button onClick={()=>handleFriendRequest(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Join</button>
        }
     
        </div>
     
    </div>
    ))
    }
    {}

    </div>
  )
}

export default UserList