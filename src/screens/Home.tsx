import React,{ useContext ,useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import Webcam from "react-webcam";
import Switch from '../components/Switch';
import { MainContext } from '../context/MainContext';
import FaceBlink from '../images/eye_blink.svg';
import FaceColorBlink from '../images/eye_blink_color.svg';
import FaceDetectColor from '../images/face_color_icon.png';
import FaceDetect from '../images/face_icon.png';
import Logo from '../images/Logo.png';
import '../styles/main.css';
import { InfinitySpin } from  'react-loader-spinner'
import tensorStore from '../lib/tensorStore';
import Preprocessor from '../lib/preprocessor';
import Posprocessor from '../lib/posprocessor';
import { browser, cumsum, dispose, image, reshape, tidy } from '@tensorflow/tfjs';
import Fili from 'fili';

const postprocessor = new Posprocessor(tensorStore);
const preprocessor = new Preprocessor(tensorStore, postprocessor);


function Home() {
    const intervalId = React.useRef<NodeJS.Timeout>();
    const coutdownIntervalId = React.useRef<NodeJS.Timeout>();
    const [isRecording, setRecording] = useState(false);
    const refCountDown = React.useRef(10);
  const [countDown, setCountDown] = useState(10);
    const { cameraRef,isLoading, eyeAndSimle,setIsStart,isEyeBlink,onCheck,isStart,onStart,onCheckTemperature, checkTemperature, onEyeAndSimle, canvas, isFaceDetect} = useContext(MainContext);
    useEffect(
        () => () => {
          if (intervalId.current) {
            clearInterval(intervalId.current);
          }
    
          if (coutdownIntervalId.current) {
            clearInterval(coutdownIntervalId.current);
          }
        },
        []
      );
    
      useEffect(
        () => () => {
          preprocessor.stopProcess();
          // postprocessor.stopProcess();
          tensorStore.reset();
        },
        []
      );


      const startRecording = async () => {
        var isLoad=  await postprocessor.loadModel();
         if(isLoad){
           intervalId.current = setInterval(capture, 10);
           coutdownIntervalId.current = setInterval(() => {
             setCountDown(prevCount => prevCount - 1);
             refCountDown.current -= 1;
             if (refCountDown.current === 0) {
               plotGraph();
               stopRecording();
             }
           }, 1000);
           setRecording(true);
           preprocessor.startProcess();
         }else{
           console.log("hhh")
         }
       };


       const stopRecording = () => {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
        if (coutdownIntervalId.current) {
          clearInterval(coutdownIntervalId.current);
        }
        preprocessor.stopProcess();
        tensorStore.reset();
        setCountDown(10);
        refCountDown.current = 10;
        setRecording(false);
      };
    
      const capture = React.useCallback(() => {
        if (cameraRef.current !== null) {
          const imageSrc = cameraRef.current.getScreenshot();
          if (imageSrc === null) return;
          const img = new Image(480, 640);
    
          img.src = imageSrc;
          img.onload = () => {
            //  console.log("slow")
            const origVExpand: any = tidy(() =>
              browser.fromPixels(img).expandDims(0)
            );
            const crop = image.cropAndResize(
              origVExpand,
              [[0.1, 0.3, 0.56, 0.7]],
              [0],
              [36, 36],
              'bilinear'
            );
            dispose(origVExpand);
            const origV: any = crop.reshape([36, 36, 3]);
            // console.log(origV)
            tensorStore.addRawTensor(origV);
            // console.log("hdhdh")
          };
        }
      }, [cameraRef]);
    


      const plotGraph = () => {
        const pltData = tensorStore.rppgPltData;
        const iirCalculator = new Fili.CalcCascades();
        const iirFilterCoeffs = iirCalculator.bandpass({
          order: 1, // cascade 3 biquad filters (max: 12)
          characteristic: 'butterworth',
          Fs: 30, // sampling frequency
          Fc: 1.375, // (2.5-0.75) / 2 + 0.75, 2.5 --> 150/60, 0.75 --> 45/60 # 1.625
          BW: 1.25, // 2.5 - 0.75 = 1.75
          gain: 0, // gain for peak, lowshelf and highshelf
          preGain: false // adds one constant multiplication for highpass and lowpass
        });
        const iirFilter = new Fili.IirFilter(iirFilterCoeffs);
        if (pltData) {
          const rppgCumsum = cumsum(reshape(pltData, [-1, 1]), 0).dataSync();
          const result = iirFilter
            .filtfilt(rppgCumsum)
            .slice(0, rppgCumsum.length - 60);
          const labels = Array.from(pltData.keys())
            .map(i => i.toString())
            .slice(0, rppgCumsum.length - 60);
            console.log(result);
            const image = cameraRef.current?.getScreenshot();
                onCheck(image);
            // onCheck()

        }
      };








    return (
        <div className='main'>
            <div className='col-left'>
                <div className='header'>
                    <img alt='Logo' src={Logo} />
                </div>
                <div className='text-box'>
                    <p>Digitising <span> Check-ins </span>
                        through <span> Cloud based </span> Face
                        Recognition solution</p>
                </div>
                <div className='btn-row'>
                    <Link to={"/create-account"} className='btn'>Create Account</Link>
                    <div className='space-horizontal'></div>
                    <Link to={''} className='btn'>Learn more </Link>

                </div>


                <div className='liveness-box'>
                    <div>
                        <h3>Liveness Detection</h3>
                    </div>
                    <Switch isOn={eyeAndSimle} onToggle={onEyeAndSimle} title='Level 1' content='(Face Challenge, Eye Blink Challenge)' />
                    <div className='space-vertical'></div>
                    <Switch isOn={checkTemperature} onToggle={onCheckTemperature} title='Level 2' content='( HR Vitals Measurement - Temperature, Pulse, Blood Flow)' />
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>

                    <div className='space-vertical'></div>

                    <div className='space-vertical'></div>

                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>
                    <div className='space-vertical'></div>

                    {/* <Switch isOn={false} title='Level 3' content='(Vitals Measurement - Temperature, Pulse, Blood Flow)' /> */}
                </div>


                <div className='footer'>
                    <p>Copyright Ⓒ 2022 | EmplAi All Right Reserved</p>
                </div>
            </div>
            <div className='col-right'>
                <div className='bg'></div>
                <div className='header-right'>
                    <h1>Face Recognition</h1>
                </div>
                <div className='face-box'>
                 <div className='cameraBox'>
                   {isStart?   isLoading?
                            <InfinitySpin 
                        width='50'
                        
                        color="red"
                      />
                            : <Webcam
                        ref={cameraRef}
                        screenshotFormat="image/jpeg"
                        mirrored={true}/>:
                        <button className='btn' onClick={()=>{
                            
                            if(checkTemperature){
                                setIsStart(true);
                              startRecording();
                            }else{
                            onStart()}}}>{
                           
                            "Check In"}</button>
                    }
                    </div>
                    <canvas ref={canvas} style={{
                        position: "absolute",
                        margin: "auto",
                        textAlign: "center",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 999
                    }}></canvas>
                    {/* <div className='loaderBox' style={{zIndex:isLoading?2:-3}}>
                    
                    </div> */}

                </div>
                <div>
                    {isStart?
                    <>
                    {checkTemperature?
                    <h1 style={{textAlign:"center",color:"#fff"}}>{countDown}</h1>
                    :
                        <>
                        {!eyeAndSimle ?
                            <div className="face-box-row">
                                <div className="face-box">
                                    <span className={`fa ${isFaceDetect?"fa-check":"fa-times"} icon`} style={{color:isFaceDetect?"#77C514":"#777"}} />
        
                                    <img alt="face-detect" src={ isFaceDetect?FaceDetectColor: FaceDetect} />
                                </div></div>
                            : <div className="face-box-row">
                                <div className="face-box">
                                    <span className={`fa ${isFaceDetect?"fa-check":"fa-times"} icon`}  style={{color:isFaceDetect?"#77C514":"#777"}}/>
        
                                    <img alt="face-detect" src={ isFaceDetect?FaceDetectColor: FaceDetect} />
                                </div>
                                {/* <div className="face-box">
                                    <span className='fa fa-check icon' />
        
                                    <img alt="face-detect" src={FaceSmile} />
        
                                </div> */}
                                <div className="face-box">
                                    <span className={`fa ${isEyeBlink?"fa-check":"fa-times"} icon`} style={{color:isEyeBlink?"#77C514":"#777"}}/>
        
                                    <img alt="face-detect" src={isEyeBlink?FaceColorBlink : FaceBlink} />
        
                                </div>
                            </div>}</>
                    }
                    </>
                    :null
                    }
                </div>

            </div>
        </div>
    )
}

export default Home