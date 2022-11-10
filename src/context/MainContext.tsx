import * as faceMesh from "@mediapipe/face_mesh";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import React, { ChangeEventHandler, createContext, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { calculateDistance, DataURIToBlob, dataURLtoFile, drawBox } from "../helper/app.helper";
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import { BASEAPIURL } from "../constant";
export const MainContext = createContext<any | null>(null);
interface Context {
  children: React.ReactNode
}

export const MainContextProvider = ({ children }: Context) => {
  const cameraRef = useRef<Webcam>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [maxLeft, setMaxLeft] = useState<number>(0);
  const [maxRight, setMaxRight] = useState<number>(0);
  const [eyeAndSimle, setEyeAndSimle] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isFaceDetect, setIsFaceDetect] = useState<boolean>(false);
  const [isEyeBlink, setIsEyeBlink] = useState<boolean>(false);
  const [checkTemperature, setCheckTemperature] = useState<boolean>(false);
  const [countDown, setCountDown] = useState(10);
  const [takeImage, setTakeImage] = useState(false);
  const [imageNew, setImageNew] = useState<string>('');
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  const [isLoading,setIsLoading] = useState(false);
  // const history = useNavigate ();

  const onStart = () => {
    setIsStart(true);
    if (checkTemperature) {

    } else {
      loadModel();
    }
  }

  const loadModel = async () => {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "mediapipe", // or 'tfjs'
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
      maxFaces: 1,
    } as any;
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

    if (window.location.pathname === "/create-account") {
      registerFace(detector);
    } else {

      detect(detector);
    }
    console.log(window.location.pathname);
  }



  const registerFace = async (detector: any) => {
    try {
      if (cameraRef.current && canvas.current && detector) {
        const webcamCurrent = cameraRef.current as any;
        const videoWidth = webcamCurrent.video.videoWidth;
        const videoHeight = webcamCurrent.video.videoHeight;
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        if (webcamCurrent.video.readyState === 4) {
          const video = webcamCurrent.video;
          const predictions = await detector.estimateFaces(video);
          requestAnimationFrame(() => {
            if (predictions?.length > 0) {
              // draw(predictions);
              setIsFaceDetect(true);
              const img = cameraRef.current?.getScreenshot({width:512,height:512,});
              // console.log(img);
              setImageNew(img!);
              setTakeImage(true);
            }
          });
          setTimeout(() => {
            registerFace(detector);
          }, 250);
        } else {
          setTimeout(() => {
            registerFace(detector);
          }, 250);
        }
      }
    } catch (error) {
      setTimeout(() => {
        registerFace(detector);
      }, 250);
    }

  }



  const onUserNameChange: any = (event: any) => {
    if (event.target.value.length > 3) {
      setBtnEnabled(true);
      setUsername(event.target.value)
    } else {
      setUsername('');
      setBtnEnabled(false);
    }
  }

  const onEmailChange:any =(event:any)=>{
    setEmail(event.target.value)
  }
  const onNumberChange:any =(event:any)=>{
    setNumber(event.target.value)
  }

  const onCreate = async () => {
    setIsLoading(true);
    try {
      // console.log(imageNew);
      const file = DataURIToBlob(imageNew);
      console.log(file);
      const formData = new FormData();
      formData.append('file', file,"new.jpeg")
      formData.append('name', username)
      formData.append('contact', number)
      formData.append('email', email);


      const response = await axios.post(`${BASEAPIURL}/create_user`, formData, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data`,
        }
      });
      // console.log(response);
      if(response.status===200  && response.data['data']==1){
        window.location.replace("/")
        //  ("/", { replace: true })
      }
      setIsLoading(false);
    
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      //  if(error){
      //     alert("Error Please Try again");
      //  }
    }
  }



 const  onCheck =async(image:any)=>{
  setIsLoading(true);
  try {
    const file = DataURIToBlob(image)
    const formData = new FormData();
    formData.append('file', file,"my.jpg");
    // formData.append('username', username)
    const response = await axios.post(`${BASEAPIURL}/validate_face`, formData, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data`,
      }
    });
    console.log(response.data);
    canvas.current?.remove();
    setIsFaceDetect(false);
    setIsEyeBlink(false);
    alert("face validated")

    // if(response.status===200){

    //   window.location.replace("/")
    // }
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
     if(error){
        alert("Error Please Try again");
     }
  }   
 }



  const detect = async (detector: any) => {
    try {
      if (cameraRef.current && canvas.current && detector) {
        const webcamCurrent = cameraRef.current as any;
        const videoWidth = webcamCurrent.video.videoWidth;
        const videoHeight = webcamCurrent.video.videoHeight;
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        if (webcamCurrent.video.readyState === 4) {
          const video = webcamCurrent.video;
          const predictions = await detector.estimateFaces(video);
          requestAnimationFrame(() => {
            if (eyeAndSimle) {
              if (predictions?.length > 0) {
                draw(predictions);
                setIsFaceDetect(true);
                const eyepoints = predictions[0].keypoints;
                // if (
                detectorBlink(eyepoints)
                // ) {
                // console.log("blink")
                // setIsEyeBlink(true);
                // }
              }
            } else {
              if (predictions?.length > 0) {
                draw(predictions);
                setIsFaceDetect(true);
                const image = cameraRef.current?.getScreenshot();
                onCheck(image);
                setIsStart(false);
              }
            }
          });
          setTimeout(() => {
            detect(detector);
          }, 250);
        } else {
          setTimeout(() => {
            detect(detector);
          }, 250);
        }
      }
    } catch (error) {
      setTimeout(() => {
        detect(detector);
      }, 250);
    }
  };




  const onEyeAndSimle: ChangeEventHandler = (value) => {
    setEyeAndSimle(!eyeAndSimle)
  }

  const onCheckTemperature: ChangeEventHandler = (value) => {
    setCheckTemperature(!checkTemperature)
  }




  const detectorBlink = (eyepoints: any) => {
    const leftEye_left = 263;
    const leftEye_right = 362;
    const leftEye_top = 386;
    const leftEye_bottom = 374;
    const rightEye_left = 133;
    const rightEye_right = 33;
    const rightEye_top = 159;
    const rightEye_bottom = 145;
    const leftVertical = calculateDistance(eyepoints[leftEye_top].x, eyepoints[leftEye_top].y, eyepoints[leftEye_bottom].x, eyepoints[leftEye_bottom].y);
    const leftHorizontal = calculateDistance(eyepoints[leftEye_left].x, eyepoints[leftEye_left].y, eyepoints[leftEye_right].x, eyepoints[leftEye_right].y);
    const eyeLeft = leftVertical / (2 * leftHorizontal);
    const rightVertical = calculateDistance(eyepoints[rightEye_top].x, eyepoints[rightEye_top].y, eyepoints[rightEye_bottom].x, eyepoints[rightEye_bottom].y);
    const rightHorizontal = calculateDistance(eyepoints[rightEye_left].x, eyepoints[rightEye_left].y, eyepoints[rightEye_right].x, eyepoints[rightEye_right].y);
    const eyeRight = rightVertical / (2 * rightHorizontal);
    const baseCloseEye = 0.1
    // const limitOpenEye = 0.14
    if (maxLeft < eyeLeft) {
      setMaxLeft(eyeLeft);
    }
    if (maxRight < eyeRight) {
      setMaxRight(eyeRight);
    }
    // console.log((eyeLeft < baseCloseEye) && (eyeRight < baseCloseEye));
    // let result = false
    // if ((maxLeft > limitOpenEye) && (eyeRight > limitOpenEye)) {
    if ((eyeLeft < baseCloseEye) && (eyeRight < baseCloseEye)) {
      // result = true
      // console.log("blink")
      setIsEyeBlink(true);
      const image = cameraRef.current?.getScreenshot();
      onCheck(image);
      setIsStart(false);
      // }
    }
    // console.log(eyeLeft > limitOpenEye );
    // return result
  }



  const draw = (predictions: any) => {
    try {
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        if (ctx) {
          predictions.forEach((prediction: any) => {
            drawBox(ctx, prediction);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };





  return (
    <MainContext.Provider
      value={{
        cameraRef,
        isFaceDetect,
        isEyeBlink,
        canvas,
        eyeAndSimle,
        setEyeAndSimle,
        checkTemperature,
        setCheckTemperature,
        onEyeAndSimle, isStart,
        onStart,
        onCheckTemperature,
        countDown,
        loadModel,
        takeImage,
        imageNew,
        onUserNameChange,
        btnEnabled,
        onCreate,
        isLoading,
        setIsStart,
        onCheck,
        onEmailChange,
        onNumberChange
      }}
    >
      {children}
    </MainContext.Provider>
  );

}



