import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail  } from "firebase/auth";
import { useNavigate } from 'react-router-dom';




const Forgetpassword = () => {
  let navigate=useNavigate()
  const auth = getAuth();
  let [email,setEmail]=useState('')
  let [emailerr,setEmailerr]=useState('')

  let handleEmail=(e)=>{
    setEmail(e.target.value)
    setEmailerr('')
  }
  let handlePasswordReset=()=>{
    if(!email){
      setEmailerr('Please Enter Your Email ')
    }
    sendPasswordResetEmail(auth, email).then(()=>{
      navigate('/login')
    })
    .catch((error)=>{
      console.log(error.code)
      if(error.code.includes('auth/invalid-email')){
        setEmailerr('Email Not Found')
      }
    })
  }
  return (
    <div className='w-full bg-primary h-screen flex justify-center items-center'>

    <div className='bg-white p-5 rounded-sm w-96'>
    <h3 className='font-nunito text-4xl text-primary font-bold'>Forget Passowrd</h3>
    <div className='relative mt-10'>
       <input onChange={handleEmail} className='border border-solid border-secondary w-full	py-6 rounded-lg px-2	' type="email"/>
       {emailerr && <p className='text-poppin text-white bg-red-600 w-full p-2.5'>{emailerr}</p>}
       <p className='font-nunito font-samilod text-sm text-primary absolute top-[-10px] left-[34px] bg-white px-[18px]'>Email Address</p>
       </div>
       <button onClick={handlePasswordReset} className=' bg-primary text-white rounded-sm font-nunito samibold py-5 mt-5 px-7'>Update Password</button>
       <button  className=' bg-primary text-white rounded-sm font-nunito samibold py-5 mt-5 px-5 ml-1'><Link to='/login'>Back To Login</Link></button>
    </div>
</div>
  )
}

export default Forgetpassword