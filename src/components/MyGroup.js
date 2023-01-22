import React,{useState,useEffect} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref,set, onValue,push, remove} from "firebase/database";
import { useSelector } from 'react-redux';

const MyGroup = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [myGroupList,setMyGroupList]=useState([])
  let [groupRequestList,setGroupRequestList]=useState([])
  let [groupInfoList,setGroupInfoList]=useState([])
  let [groupReqeustShow,setGroupReqeustShow]=useState(false)
  let [groupInfoShow,setGroupInfoShow]=useState(false)

  useEffect(()=>{
    const myGroupRef = ref(db, 'Group/');
    onValue(myGroupRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().adminid){
          arr.push({...item.val(),id:item.key})
        }
      })
      setMyGroupList(arr)
    });
  },[])


  let handleGrequestShow=(Gitem)=>{
    setGroupReqeustShow(!groupReqeustShow)

    const groupRequestRef = ref(db, 'grouprequest/');
    onValue(groupRequestRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().adminid && item.val().groupid==Gitem.id){
          arr.push({...item.val(),id:item.key})
        }
      })
      setGroupRequestList(arr)
    });
  }
  let handleGinfoShow=(Gitem)=>{
    setGroupInfoShow(!groupInfoShow)
    const groupInfoRef = ref(db, 'groupAccept/');
    onValue(groupInfoRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().adminid&&item.val().groupid==Gitem.id){

          arr.push({...item.val(),id:item.key})
        }
      })
      setGroupInfoList(arr)
    });

  }

  let handleGroupRequestAccept=(item)=>{
    set(push(ref(db, 'groupAccept/')), {
      ...item
    }).then(()=>{
      remove(ref(db, 'grouprequest/'+item.id))
    })
  }
  return (
    <div className='mt-5 relative h-[300px] shadow-lg	w-full overflow-y-scroll p-5	'>
    {groupInfoShow 
    ?
    <button onClick={()=>setGroupInfoShow(false)} className='absolute top-2 right-3 rounded-br-xl font-ub font-semibold bg-primary text-white px-3 py-1.5 text-xl '>Back</button>
    :
    groupReqeustShow 
    ?
    <button onClick={()=>setGroupReqeustShow(false)} className='absolute top-2 right-3 rounded-br-xl font-ub font-semibold bg-primary text-white px-3 py-1.5 text-xl '>Back</button>
    :
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    }

    <h2 className='font-poppins font-semibold text-xl mb-4'>Group List </h2>
    {groupInfoShow 
    ?
    groupInfoList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
      <div className='w-[70px] h-[70px] '>
        <img src="images/profile.png" alt="" />
      </div>
    <div className='w-[50%]'>
    <h2 className='font-poppins font-semibold text-xl'>{item.joinrequest}</h2>
    <h2 className='font-poppins font-normal text-sm'>{item.grouptag}</h2>
    </div>

   
  </div>
    ))
    :
    groupReqeustShow 
    ?
    groupRequestList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
      <div className='w-[70px] h-[70px] '>
        <img src="images/profile.png" alt="" />
      </div>
    <div className='w-[50%]'>
    <h2 className='font-poppins font-semibold text-xl'>{item.joinrequest}</h2>
    <h2 className='font-poppins font-normal text-sm'>{item.grouptag}</h2>
    </div>
      <div >
      <button onClick={()=>handleGroupRequestAccept(item)}  className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	,mt-3'>Accept</button>
      </div>
   
  </div>
    ))
    :
    myGroupList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
      <div className='w-[70px] h-[70px] '>
        <img src="images/profile.png" alt="" />
      </div>
    <div className='w-[50%]'>
    <h2 className='font-poppins font-semibold text-xl'>{item.groupname}</h2>
    <h2 className='font-poppins font-normal text-sm'>{item.grouptag}</h2>
    </div>
      <div >
      <button onClick={()=>handleGrequestShow(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	,mt-3'>Request</button>
      <button onClick={()=>handleGinfoShow(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	mt-3'>Info</button>
      </div>
   
  </div>
    ))
    }


  

    </div>
  )
}

export default MyGroup