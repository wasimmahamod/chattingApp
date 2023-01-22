import React, { useState,useEffect } from 'react'
import { getDatabase, ref, set ,push,onValue} from "firebase/database";
import { useSelector } from 'react-redux';

const JoinGroup = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [groupModal, setGroupModal] = useState(false)
  let [groupName, setGroupName] = useState('')
  let [groupTag, setGroupTag] = useState('')
  let [groupNameerr, setGroupNameerr] = useState('')
  let [groupTagerr, setGroupTagerr] = useState('')
  let [groupList, setGroupList] = useState([])
  let [groupJoinRequest, setGroupJoinRequest] = useState([])
  let [groupJoinAccept, setGroupJoinAccept] = useState([])

  let handleGroupModal = () => {
    setGroupModal(!groupModal)
  }
  let handleGroupName=(e)=>{
    setGroupName(e.target.value)
    setGroupNameerr('')
  }
  let handleGroupTag=(e)=>{
    setGroupTag(e.target.value)
    setGroupTagerr('')
  }
  let handleGroupSubmit=(e)=>{
    if(!groupName){
      setGroupNameerr('Your Group Name Is Required')
    }
    if(!groupTag){
      setGroupTagerr('Your Group Tag Is Required')
    }
    if(groupName && groupTag){
      set(push(ref(db, 'Group/')), {
        groupname:groupName,
        grouptag:groupTag,
        admin:data.displayName,
        adminid:data.uid
      }).then(()=>{
        setGroupModal(false)
      })
    }
  }

  useEffect(()=>{
    const myGroupRef = ref(db, 'Group/');
    onValue(myGroupRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid!=item.val().adminid){
          arr.push({...item.val(),id:item.key})
        }
      })
      setGroupList(arr)
    });
  },[])
  // ===groupjoin request 
  useEffect(()=>{
    const groupJoinRequestRef = ref(db, 'grouprequest/');
    onValue(groupJoinRequestRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().joinrequestid+item.val().groupid)
      })
      setGroupJoinRequest(arr)
    });
  },[])
  // group request accept 
  useEffect(()=>{
    const groupJoinRequestRef = ref(db, 'groupAccept/');
    onValue(groupJoinRequestRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().joinrequestid+item.val().groupid)
      })
      setGroupJoinAccept(arr)
    });
  },[])


  let handleGroupJoin=(item)=>{
    console.log(item)
    set(push(ref(db, 'grouprequest/')), {
      admin:item.admin,
      adminid:item.adminid,
      groupname:item.groupname,
      grouptag:item.grouptag,
      groupid:item.id,
      joinrequest:data.displayName,
      joinrequestid:data.uid,
    });
  }
  return (
    <div className='mt-5 relative h-[300px] shadow-lg	w-full overflow-y-scroll p-5	'>
      <button onClick={handleGroupModal} className='font-ub font-semibold bg-primary text-white px-3 py-1.5 text-xl mb-4 absolute top-3  right-3 rounded-br-lg drop-shadow-md'>{groupModal ? "Back" :'Create Group'}</button>
      <h2 className='font-ub font-semibold text-xl mb-4'>Group List </h2>
      {groupModal
        ?
        <div>
          <div className='relative w-full  mt-10'>
            <input onChange={handleGroupName} className='w-full p-4 border border-solid border-primary rounded-md' placeholder='Enter Your Group Name '  />
            {groupNameerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{groupNameerr}</p>
            }
            <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'>Your Group Name</h3>
          </div>
          <div className='relative w-full  mt-5'>
            <input onChange={handleGroupTag} className='w-full p-4 border border-solid border-primary rounded-md' placeholder='Enter Your Group Tag '  />
            {groupTagerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{groupTagerr}</p>
            }
            <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'>Your Group Tag</h3>
          </div>
          <button onClick={handleGroupSubmit} className='w-full p-4 text-white bg-primary mt-3 font-ub text-lg rounded-br-lg font-semibold'>Create</button>
        </div>
        :
        groupList.map((item)=>(
          <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
          <div className='w-[70px] h-[70px] '>
            <img src="images/profile.png" alt="" />
          </div>
          <div className='w-[50%]'>
            <h2 className='font-poppins font-semibold text-xl'>{item.groupname}</h2>
            <h2 className='font-poppins font-normal text-sm'>{item.grouptag}</h2>
          </div>
          <div >
            {groupJoinAccept.includes(data.uid+item.id)||groupJoinAccept.includes(item.id+data.uid)
            ?
            <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Added</button>
            :
            groupJoinRequest.includes(data.uid+item.id)||groupJoinRequest.includes(item.id+data.uid)
            ?
            <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>P</button>
            :
            <button onClick={()=>handleGroupJoin(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Join</button>
            }
           
         
          </div>

        </div>
        ))
       
      }


    </div>
  )
}

export default JoinGroup