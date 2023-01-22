import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import { getDatabase, ref, set,push } from "firebase/database";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Singup = () => {
    const db = getDatabase();
    const auth = getAuth();
    let[loader,setLoader]=useState(false)
    let navigate=useNavigate()
    let [name,setName]=useState('')
    let [email,setEmail]=useState('')
    let [password,setPassword]=useState('')
    let [nameerr,setNameerr]=useState('')
    let [emailerr,setEmailerr]=useState('')
    let [passworderr,setPassworderr]=useState('')
    let [show,setShow]=useState(false)

    let handleName=(e)=>{
        setName(e.target.value)
        setNameerr('')
    }
    let handleEmail=(e)=>{
        setEmail(e.target.value)
        setEmailerr('')
    }
    let handlePassword=(e)=>{
        setPassword(e.target.value)
        setPassworderr('')
    }
    let handleSubmit=()=>{
       if(!name){
        setNameerr('Your Name Is Required')
       }
       if(!email){
        setEmailerr('Your Email Is Required')
       }
       if(!password){
        setPassworderr('Your Password Is Required')

       }
        if(email&& name&& password&& /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ){
            createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: name, photoURL: "images/profile.png"
                      }).then(()=>{
                        toast.success("Registration Successful ");
                        setLoader(true)
                        setTimeout(()=>{
                            navigate('/login')
                          },2000)
                      }).then(()=>{
                        set(ref(db, 'users/'+ user.user.uid), {
                            username: user.user.displayName,
                            email: user.user.email,
                            img:user.user.photoURL
                          });
                      })
                 
                });
            })
            .catch((error) => {
                if(error.code.includes('auth/email-already-in-use')){
                    setEmailerr('Email is Already In Use')
                }
             
            });
       }
     
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
        <div className='lg:w-2/4 h-screen'>
            <img className='hidden sm:block  w-full  h-full object-cover' src="images/singup.jpg"/>
        </div>
        <div className='lg:w-2/4 flex justify-end'>
           <div className='text-right mr-0 lg:mr-24 mt-0 lg:mt-28'>
           <h1 className='font-ub text-primary text-3xl font-bold'>Welcome to PokPok Family</h1>
           <p className='font-ub text-[#6f83a3] text-xl font-normal mt-2 lg:mt-5'>Create Your Account !</p>
           <div className='relative w-full md:w-96 mt-5 lg:mt-20'>
            <input onChange={handleName} className='w-full p-5 border border-solid border-primary rounded-md' placeholder='Enter Your Name ' />
            {nameerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{nameerr}</p>
            }
            <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'>Your Name</h3>
           </div>
           <div className='relative w-full lg:w-96 mt-5 lg:mt-10'>
            <input onChange={handleEmail} type='email' className='w-full p-5 border border-solid border-primary rounded-md' placeholder='Enter Your Email ' />
            {emailerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{emailerr}</p>
            }
            <h3 className='font-ub text-xl font-medium text-primary bg-white absolute top-[-15px] left-5'> Your Email</h3>
           </div>
           <div className='relative w-full md:w-96 mt-5 lg:mt-10'>
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
           <div className='w-full md:w-96'>
            {loader ? 
                <div className='flex justify-center'>
                     <InfinitySpin 
                 width='200'
                 color="#4fa94d"
                 />
                </div>
            :
            <button onClick={handleSubmit} className='font-ub text-white text-2xl bg-primary  w-full py-5 mt-5 rounded-bl-xl'>SingUp</button>
            }
       
           </div>
           <h4  className='font-ub text-lg text-primary mt-5 '>Already A Member ?<Link className='ml-5 text-green-800' to='/login'>LogIn</Link> </h4>
           </div>
        </div>
    </div>
  )
}

export default Singup