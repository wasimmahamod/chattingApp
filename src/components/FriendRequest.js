import React,{useEffect,useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref,set, onValue,push, remove} from "firebase/database";
import { useSelector } from 'react-redux';

const FriendRequest = () => {
  const db = getDatabase();
  let [friendRequestList,setFriendRequestList]=useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)

  useEffect(()=>{
    const friendRequestRef = ref(db, 'friendRequest/');
    onValue(friendRequestRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().reciverid){

          arr.push({...item.val(),id:item.key})
        }
      })
      setFriendRequestList(arr)
    });
  },[])

  let handleFirend=(item)=>{
    set(push(ref(db, 'friend/')), {
        ...item
    }).then(()=>{
      remove(ref(db, 'friendRequest/'+item.id))
    })
  }

  return (
    <div className='mt-5 relative h-[300px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>Friend Request List </h2>
    {friendRequestList.map((item)=>(

      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
          <img src={item.senderimg} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-poppins font-semibold text-xl'>{item.sendername}</h2>
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        <button onClick={()=>handleFirend(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Accept</button>
        </div>
     
    </div>
    ))}

    </div>
  )
}

export default FriendRequest