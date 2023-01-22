import React,{useState,useEffect} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref,set, onValue,push, remove} from "firebase/database";
import { useSelector ,useDispatch} from 'react-redux';
import { chatUserInfo } from '../slices/chatSlice';


const FriendList = () => {
  let dispatch=useDispatch()
  const db = getDatabase();
  let [friendList,setFriendList]=useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)

  useEffect(()=>{
    const friendRef = ref(db, 'friend/');
    onValue(friendRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(item.val().senderid==data.uid||item.val().reciverid==data.uid){

          arr.push({...item.val(),id:item.key})
        }
      })
      setFriendList(arr)
    });
  },[])

  let handleBlock=(item)=>{
    if(data.uid==item.senderid){
      set(push(ref(db, 'block/')), {
        blockby:item.sendername,
        blockbyid:item.senderid,
        blockbyimg:item.senderimg,
        block:item.recivername,
        blockid:item.reciverid,
        blockimg:item.reciverimg
      }).then(()=>{
        remove(ref(db, 'friend/'))
      })
    }else if(data.uid==item.reciverid){
      set(push(ref(db, 'block/')), {
        blockby:item.recivername,
        blockbyid:item.reciverid,
        blockbyimg:item.reciverimg,
        block:item.sendername,
        blockid:item.senderid,
        blockimg:item.senderimg
      }).then(()=>{
        remove(ref(db, 'friend/'+item.id))
      })
    }
  }

  // let handleFriendInfo=(item)=>{
  //   if(data.uid==item.senderid){
  //     dispatch(chatUserInfo({
  //       name:item.recivername,id:item.reciverid,status:'single',img:item.reciverimg,
  //     }))
  //   }else{
  //     dispatch(chatUserInfo({
  //       name:item.sendername,id:item.senderid,status:'single',img:item.senderimg,
  //     }))
  //   }
  // }
  return (
    <div className='mt-5 relative h-[340px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>Friend List </h2>
    {friendList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        {item.senderid==data.uid
        ?
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full '>
        <img src={item.reciverimg} alt="" />
      </div>
        :
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full '>
        <img src={item.senderimg} alt="" />
      </div>
        }
    
      <div className='w-[50%]'>
      {data.uid==item.senderid
      ?
      <h2 className='font-poppins font-semibold text-xl'>{item.recivername}</h2>
      :
      <h2 className='font-poppins font-semibold text-xl'>{item.sendername}</h2>
      }
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        <button onClick={()=>handleBlock(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>block</button>
        </div>
     
    </div>
    ))}

    </div>
  )
}

export default FriendList