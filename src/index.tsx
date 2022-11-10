import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import  {MainContextProvider}  from './context/MainContext';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const Main =()=>{
  return(
    <MainContextProvider>
      <BrowserRouter>
      <App></App>
      </BrowserRouter>
    </MainContextProvider>
  );
}


root.render(
  <Main/>
);



