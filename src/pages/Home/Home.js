import React,{useState,useEffect} from 'react'
import Blocklist from '../../components/Blocklist'
import FriendList from '../../components/FriendList'
import FriendRequest from '../../components/FriendRequest'
import JoinGroup from '../../components/JoinGroup'
import Search from '../../components/Search'
import Sidebar from '../../components/Sidebar'
import UserList from '../../components/UserList'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch,useSelector} from 'react-redux'
import { userLoginInfo } from '../../slices/userSlice'
import MyGroup from '../../components/MyGroup'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  let navigate=useNavigate()
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let dispatch=useDispatch()
  const auth = getAuth();
  let [verify,setVerify]=useState(false)

  useEffect(()=>{
    if(!data){
        navigate('/login')
    }
},[])

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
       setVerify(true)
      } else {
        console.log(user.user)
       dispatch(userLoginInfo(user.user))
       localStorage.setItem('userInfo',JSON.stringify(user.user))
    }
  });


  return (
    <>
      { verify ?
      <div className=' flex justify-between'>
      <div className='w-[150px]'>
        <Sidebar active='home'/>
      </div>
      <div className='w-[25%]'>
        <Search/>
        <JoinGroup/>
        <FriendRequest/>
      </div>
      <div className='w-[25%]'>
        <FriendList/>
        <MyGroup/>
      </div>
      <div className='w-[25%]'>
        <UserList/>
        <Blocklist/>
      </div>
      </div>
      
      :
      <div className='absolute top-0 left-0 bg-[#95a5a6] flex items-center justify-center w-full h-screen z-50 '>
          <h1 className='font-ub text-2xl text-white '>Please verify Your Email</h1>
      </div>
    }
    </>
  


  )
}

export default Home