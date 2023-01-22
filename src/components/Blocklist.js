import React,{useState,useEffect} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref,set, onValue,push, remove} from "firebase/database";
import { useSelector } from 'react-redux';



const Blocklist = () => {
  const db = getDatabase();
  let [blockList,setBlockList]=useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)

  useEffect(()=>{
    const blockListRef = ref(db, 'block/');
    onValue(blockListRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().blockbyid){
          arr.push({
            block:item.val().block,
            blockid:item.val().blockid,
            blockimg:item.val().blockimg,
            id:item.key,
          })
        }else if(data.uid==item.val().blockid){
          arr.push({
            blockby:item.val().blockby,
            blockbyid:item.val().blockbyid,
            blockbyimg:item.val().blockbyimg,
            id:item.key,
          })
        }
      })
      setBlockList(arr)
    });
  },[])

  let handleUnblock=(item)=>{
    set(push(ref(db, 'friend/')), {
      sendername:data.displayName,
      senderid:data.uid,
      senderimg:data.photoURL,
      recivername:item.block,
      reciverid:item.blockid,
      reciverimg:item.blockimg,

    }).then(()=>{
      remove(ref(db, 'block/'+item.id))
    })
  }
  return (
    <div className='mt-5 relative h-[300px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>Block List </h2>
    {blockList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        {item.blockid
        ?
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full'>
        <img src={item.blockimg} alt="" />
        </div>
        :
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full'>
          <img src={item.blockbyimg} alt="" />
        </div>
        }
       
        
      <div className='w-[50%]'>
      <h2 className='font-poppins font-semibold text-xl'>{item.block}</h2>
      <h2 className='font-poppins font-semibold text-xl'>{item.blockby}</h2>
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
      {item.blockid
      &&
      <div >
      <button onClick={()=>handleUnblock(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Unblock</button>
      </div>
      }

     
    </div>
    ))}

    </div>
  )
}

export default Blocklist