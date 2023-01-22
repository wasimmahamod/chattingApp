import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword,updateProfile,GoogleAuthProvider  ,signInWithPopup} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import {userLoginInfo} from '../../slices/userSlice'
import { getDatabase, ref, set,push } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const db = getDatabase();
  const provider = new GoogleAuthProvider();
  let dispatch=useDispatch()
  let navigate=useNavigate()
  const auth = getAuth();
  let [email,setEmail]=useState('')
  let [password,setPassword]=useState('')
  let [emailerr,setEmailerr]=useState('')
  let [passworderr,setPassworderr]=useState('')
  let [show,setShow]=useState(false)
  let[loader,setLoader]=useState(false)
  let handleEmail=(e)=>{
    setEmail(e.target.value)
    setEmailerr('')
}
let handlePassword=(e)=>{
    setPassword(e.target.value)
    setPassworderr('')
}
let handleSubmit=()=>{
  if(!email){
   setEmailerr('Your Email Is Required')
  }
  if(!password){
   setPassworderr('Your Password Is Required')
  }
   if(email&&  password&& /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ){
    signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      toast.success("Login Successful");
      console.log(user)
        dispatch(userLoginInfo(user.user))
        localStorage.setItem('userInfo',JSON.stringify(user.user))
        setLoader(true)
        setTimeout(() => {
          navigate('/home')
        }, 2000);
      }).catch((error) => {
        console.log(error.code)
        if(error.code.includes('auth/user-not-found')){
          setEmailerr('Email Not Found')
        }
        if(error.code.includes('auth/wrong-password')){
          setPassworderr('Password Not Match')
        }
      })
    .catch((error) => {
      console.log(error.code)
      if(error.code.includes('auth/user-not-found')){
        setEmailerr('Email Not Found')
      }
      if(error.code.includes('auth/wrong-password')){
        setPassworderr('Password Not Match')
      }
    });
  }
}
let handleGoogleLogin=()=>{
  signInWithPopup(auth, provider)
  .then((user) => {
    console.log(user.user)
    dispatch(userLoginInfo(user.user))
    localStorage.setItem('userInfo',JSON.stringify(user.user))
    set(ref(db, 'users/'+user.user.uid), {
      username: user.user.displayName,
      email: user.user.email,
      img:user.user.photoURL
    });
    navigate('/home')
  })
}
  return (
    <div className='flex p-2.5'>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
    <div className=' md:w-2/4 h-screen'>
        <img className='hidden sm:block w-full h-full object-cover' src="images/login.jpg"/>
    </div>
    <div className=' md:w-2/4 lg:flex justify-end'>
       <div className='text-right mr-0 lg:mr-24 mt-0 lg:mt-28'>
       <h1 className='lg:w-96 font-ub text-primary text-3xl font-bold'>Welcome Back ! PokPok Family</h1>
       <p className='font-ub text-[#6f83a3] text-xl font-normal mt-5'>LogIn Hare !</p>
       <button onClick={handleGoogleLogin} className='font-ub p-3 bg-primary text-white rounded-bl-xl text-xl shadow-2xl	mt-3'>Google Login</button>

       <div className='relative w-full lg:w-96 mt-10'>
        <input onChange={handleEmail} type='email' className='w-full p-5 border border-solid border-primary rounded-md' placeholder='Enter Your Email ' />
        {emailerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{emailerr}</p>
            }
        <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'> Your Email</h3>
       </div>

       <div className='relative w-full lg:w-96 mt-10'>
            <input onChange={handlePassword} className='w-full p-5 border border-solid border-primary rounded-md' placeholder='Enter Your Password ' type={show? 'text':'password'} />
            {show ? 
            <AiFillEye onClick={()=>setShow(!show)} className='absolute top-6 right-3 text-2xl'/>
            :
            <AiFillEyeInvisible onClick={()=>setShow(!show)} className='absolute top-6 right-3 text-2xl'/>
            }
            {passworderr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{passworderr}</p>
            }
            <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'>Your Password</h3>
           </div>
       <div className='w-full lg:w-96'>
        {loader ? 
           <div className='flex justify-center'>
           <InfinitySpin 
           width='200'
           color="#4fa94d"
           />
           </div>
          :

        <button onClick={handleSubmit} className='font-ub text-white text-2xl bg-primary  w-full py-5 mt-5 rounded-bl-xl'>Login</button>
        }
     
       </div>
       <h3 className='font-ub text-lg text-red-500 cursor-pointer mt-2 '><Link to='/forgot'>Forgot Password</Link> </h3>
       <h4 className='font-ub text-lg text-primary mt-3 '>Don't Have a Account ?<Link className='ml-5 text-green-800' to='/'>Singup</Link> </h4>
       </div>
    </div>
</div>
  )
}

export default Login