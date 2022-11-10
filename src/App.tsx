import {Routes,Route} from 'react-router-dom';
import Home from './screens/Home';
import CreateAccount from './screens/CreateAccount';
function App() {
  


  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/create-account' element={<CreateAccount/>}/>
      </Routes>
    </div>
  );
}

export default App;
