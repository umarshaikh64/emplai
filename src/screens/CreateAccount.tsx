import { useContext, useEffect } from 'react';
import Webcam from 'react-webcam';
import { MainContext } from '../context/MainContext';
import FaceDetectColor from '../images/face_color_icon.png';
import FaceDetect from '../images/face_icon.png';
import Logo from '../images/Logo.png';
import '../styles/main.css';
import { InfinitySpin } from  'react-loader-spinner'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function CreateAccount() {
    const { loadModel, cameraRef, isLoading,canvas, takeImage, isFaceDetect, imageNew, onUserNameChange, btnEnabled, onCreate ,onEmailChange,onNumberChange} = useContext(MainContext);
    useEffect(() => {
        loadModel();
    }, [])


    return (
        <div className='main'>
            <div className='col-left'>
                <div className='header'>
                    <img alt='Logo' src={Logo} />
                </div>
                <div className='text-box'>
                    <p>Create a new  Account</p>
                </div>
                <div className='form-box'>
                    <div className='form-input'>
                        <p>Full Name</p>
                        <input type={"text"} placeholder='Enter Your name' onChange={(event) => { onUserNameChange(event) }} />
                    </div>
                    <div className='form-input'>
                        <p>Email</p>
                        <input type={"email"} placeholder='Enter Your email' onChange={(event) => { onEmailChange(event) }} />
                    </div>
                    <div className='form-input'>
                        <p>Number</p>
                        <input type={"number"} placeholder='Enter Your number' onChange={(event) => { onNumberChange(event) }} />
                    </div>
                    <button className='create-account-btn' style={{
                    color:btnEnabled? "#fff":"#ccc",
                        background: btnEnabled ? 'linear-gradient(261.32deg, #CE082B 12.34%, #DE2C00 98.33%)' : "#F0F0F0"
                    }}

                        onClick={() => {
                            if (btnEnabled) {
                                onCreate();
                            }
                        }}
                    >{isLoading?
                        <InfinitySpin 
                        width='50'
                        
                        color="#fff"
                      />
                    :"Create Account"}</button>
                </div>

                <div className='footer'>
                    <p>Copyright Ⓒ 2022 | EmplAi All Right Reserved</p>
                </div>
            </div>
            <div className='col-right'>
                <div className='bg'></div>
                <div className='header-right'>
                    <h1>Recognizing...</h1>
                </div>
                <div className='face-box'>
                    <div className='cameraBox'>
                        {takeImage ?
                            <img src={imageNew} alt="new" style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                            : <Webcam
                                ref={cameraRef}
                                mirrored={true}
                                screenshotFormat="image/jpeg"

                            />
                        }         </div>
                    <canvas ref={canvas} style={{
                        position: "absolute",
                        margin: "auto",
                        textAlign: "center",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 999
                    }}></canvas>
                </div>
                <div className="face-box-row">
                    <div className="face-box">
                        {/* <span className='fa fa-check icon'  />

                     <img alt="face-detect" src={FaceDetect}/> */}
                        <span className={`fa ${isFaceDetect ? "fa-check" : "fa-times"} icon`} style={{ color: isFaceDetect ? "#77C514" : "#777" }} />

                        <img alt="face-detect" src={isFaceDetect ? FaceDetectColor : FaceDetect} />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CreateAccount