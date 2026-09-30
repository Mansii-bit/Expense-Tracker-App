// import {Spin} from "antd";

// const Loader = ()=>{
//     return (
//         <div className="flex !text-white h-screen items-center justify-center bg-black">
//             <Spin tip="loading" size="large"/>
//         </div>
//     )
// }

// export default Loader;  



const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
      <div className="flex items-end gap-2 h-20">
        <div className="w-4 bg-blue-500 rounded animate-bounce h-10"></div>
        <div
          className="w-4 bg-green-500 rounded animate-bounce h-16"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-4 bg-yellow-500 rounded animate-bounce h-12"
          style={{ animationDelay: "0.4s" }}
        ></div>
        <div
          className="w-4 bg-purple-500 rounded animate-bounce h-20"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-white">
        Loading Expenses...
      </h2>

      <p className="text-slate-400 mt-2">
        Analyzing your spending patterns
      </p>
    </div>
  );
};

export default Loader;