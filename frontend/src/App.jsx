import Homepage from "./components/Home";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Signup from "./components/Home/signup";

const App= ()=>{
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}
export default App;