import Homepage from "./components/Home";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Signup from "./components/Home/signup";
import {ToastContainer} from "react-toastify";
import PageNotFound from "./components/PageNotFound";
import Userlayout from "./components/User/Userlayout";

const App= ()=>{
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/app/user" element={<Userlayout/>}></Route>
      <Route path="/*" element={<PageNotFound/>}/>
    </Routes>

    <ToastContainer/>
    </BrowserRouter>
    
  )
}
export default App;