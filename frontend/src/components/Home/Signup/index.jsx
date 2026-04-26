import { Button, Card, Form ,Input} from "antd";
import {UserOutlined,LockOutlined, PhoneOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import Homelayout from "../../../layout/HomeLayout";
import axios from "axios";
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

const {Item} = Form;

const Signup = () => {

    const onFinish=async (values)=>{
        try{
            const {data} =await axios.post("/api/user/send-mail",values);
            console.log(data);
        }catch(error){
            console.log(error);
        }
    }

  return (
    <Homelayout>
        <div className="flex">
      <div className="w-1/2 hidden md:flex items-center justify-center">
            <img
                src="/front.jpg"
                alt="Bank"
                className="w-4/5 object-contain"
            />
            
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="font-bold text-[#5379f5] text-2xl text-center mb-6">
            Register to Track you Expense
          </h2>
            <Form name="login-form" layout="vertical" onFinish={onFinish}>
                   <Item
                    name="fullname"
                    label="Fullname"
                    rules={[{required:true}]}
                >
                    <Input
                        prefix={<UserOutlined/>}
                        placeholder="Enter your Fullname"
                    />
                </Item>
                   <Item
                    name="mobile"
                    label="Mobile"
                    rules={[{required:true}]}
                >
                    <Input
                        prefix={<PhoneOutlined/>}
                        placeholder="Enter your Mobile number"
                    />
                </Item>
                <Item
                    name="email"
                    label="Username"
                    rules={[{required:true}]}
                >
                    <Input
                        prefix={<UserOutlined/>}
                        placeholder="Enter your username"
                    />
                </Item>
                <Item
                    name="password"
                    label="Password"
                    rules={[{required:true}]}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        placeholder="Enter your Password"
                    />
                </Item>
                <Item>
                    <Button
                        type="text"
                        htmlType="submit"
                        block
                        className="!bg-[#5379f5] !text-white !font-bold"
                    >
                            Signup
                    </Button>
                </Item>
            </Form>
            <div className="flex items-center justify-center">
                
                 <Link
                style={{textDecoration:"underline"}}
                    to="/"
                    className="!text-[#5379f5] !font-bold">
                        Already have an account?
                </Link>
            </div>
        </Card>
      </div>
    </div>
    </Homelayout>
  );
};
export default Signup;
