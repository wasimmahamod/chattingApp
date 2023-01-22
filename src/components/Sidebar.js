import React, { useEffect, useState } from 'react'
import {FaHome} from 'react-icons/fa'
import {TbMessage2} from 'react-icons/tb'
import {IoMdNotifications} from 'react-icons/io'
import {MdSettingsSuggest} from 'react-icons/md'
import {BiLogOut} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import {BiDotsVertical} from 'react-icons/bi'
import { useDispatch,useSelector } from 'react-redux'
import { userLoginInfo } from '../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import {FaCloudUploadAlt} from 'react-icons/fa'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString,getDownloadURL, } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";

const Sidebar = ({active}) => {
    const auth = getAuth();
    const storage = getStorage();
    let dispatch=useDispatch()
    let navigate=useNavigate()
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("");
    const [cropper, setCropper] = useState('');

    let [modalShow,setModalShow]=useState(false)

    let handleModalShow=()=>{
        setModalShow(!modalShow)
       }
    

    let handleLogout=()=>{
        dispatch(userLoginInfo(null))
        localStorage.removeItem('userInfo')
    }


    // react cropper 
    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      };

    //   crop data
      const getCropData = () => {
        if (typeof cropper !== "undefined") {
          setCropData(cropper.getCroppedCanvas().toDataURL());
          const storageRef = ref(storage, data.uid);
          // Data URL string
            const message4 = cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                updateProfile(auth.currentUser, {
                    photoURL: downloadURL
                  }).then(()=>{
                    setModalShow(false)
                  })
              });
            });
         
        }
      };

  
  return (
    <>
    {
    modalShow ?
    <div className='flex justify-center items-center absolute top-0 left-0 w-full h-screen bg-primary z-50 '>
    <div className=' bg-white w-2/4 p-5 rounded-bl-2xl'>
        <h1 className='font-ub text-2xl text-primary font-medium '> Upload Your Profile Photo</h1>
        {image ? 
          <div className='w-[90px] h-[90px] overflow-hidden rounded-full mt-5 mb-5 mx-auto'>
          <div className="img-preview w-full h-full" />
          </div>
          :
          <div className='w-[90px] h-[90px] overflow-hidden rounded-full mt-5 mb-5 mx-auto'>
          <img src="images/profile.png"/>
          </div>
        }
      
        <div>
            {image &&
             <Cropper
             style={{ height: 400, width: "100%" }}
             zoomTo={0.5}
             initialAspectRatio={1}
             preview=".img-preview"
             src={image}
             viewMode={1}
             minCropBoxHeight={10}
             minCropBoxWidth={10}
             background={false}
             responsive={true}
             autoCropArea={1}
             checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
             onInitialized={(instance) => {
               setCropper(instance);
             }}
             guides={true}
           />
             }
        
        </div>
        <input onChange={onChange} type='file' className='font-ub text-xl text-primary font-medium mt-5 block' />
        <button onClick={getCropData}  className='font-ub text-white text-xl bg-primary p-2 mt-5 rounded-br-xl'>Upload</button>
        <button onClick={()=>setModalShow(false)}   className='font-ub text-white text-xl bg-red-500 p-2 mt-5 rounded-br-xl ml-4'>Cancel</button>
    </div>
    </div>
    :
    <div className='w-full bg-primary h-screen rounded-br-3xl '>
    <div className='p-5  text-center '>
     <div className='w-[90px] h-[90px] rounded-full overflow-hidden mx-auto relative group'>
         <img src={data.photoURL} alt=""/>
         <div onClick={handleModalShow}  className='absolute top-0 left-0 bg-[rgba(0,0,0,.4)] w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100'>
         <FaCloudUploadAlt className='text-white text-2xl '/>
       </div>
     </div>
   
     <div>
         <h2 className='font-ub text-2xl text-white font-bold mt-5'>{data.displayName}</h2>
     </div>
     <div className='  z-[50] h-0 items-center  bg-primary   top-[90px] left-0  relative gap-x-5 '>
          <div className={active=='home'?
          " relative z-[1] after:bg-white  after:w-[130px]  after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-primary before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt- 10"
          :"relative z-[1] after:bg-none after:w-[130px] after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-none before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-0 "
          }>
            <Link to='/home'>
              <FaHome className={active=='home' ?'text-4xl mx-auto text-black' :'text-4xl mx-auto text-white' }/>
            </Link>
     </div>
     <div className={active=='msg'?
          " relative z-[1] after:bg-white  after:w-[130px]  after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-primary before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-20 "
          :"relative z-[1] after:bg-none after:w-[130px] after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-none before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-20"
          }>
            <Link to='/msg'>
         <TbMessage2 className={active=='msg' ?'text-4xl mx-auto text-black' :'text-4xl mx-auto text-white' }/>
            </Link>
     </div>
     <div className=" relative z-[1] after:bg-none after:w-[130px] after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-none before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-20">
         <IoMdNotifications className='text-4xl mx-auto text-white'/>
     </div>
     <div className="relative z-[1] after:bg-none after:w-[130px] after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-none before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-20">
         <MdSettingsSuggest className='text-4xl mx-auto text-white'/>
     </div>
     <div className=" relative z-[1] after:bg-none after:w-[130px]  after:h-[80px] after:content-[''] after:rounded-tl-2xl after:absolute after:top-[-20px] after:left-0  after:z-[-1]  before:content-[''] before:absolute before:top-[-19px] before:right-[-20px] before:bg-none before:w-3 before:h-[80px] before:rounded-bl-3xl before:rounded-tl-3xl mt-20">
         <Link to='/login'>
         <BiLogOut onClick={handleLogout} className='text-4xl mx-auto text-white'/>
         </Link>
     </div>
     </div>
    

    </div>
    </div>
    }
    </>
    
  )
}

export default Sidebar