import { Button, Card, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const { Item } = Form;

const Login = () => {

    const navigate=useNavigate();
    const [loginForm]= Form.useForm();
    const [loading, setLoading] = useState(false);
    

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/login", values);
      console.log(data);
      const {role}=data;
      if(role==="admin")
        return toast.success("Admin tried to login");
     if(role==="user")
        return navigate("/app/user");
    } catch (err) {
      setOtp(null);
      setFormData(null);
      toast.error(err.response ? err.response.data.messsage : err.messsage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 hidden md:flex items-center justify-center">
        <img src="/front.jpg" alt="Bank" className="w-4/5 object-contain" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="font-bold text-[#5379f5] text-2xl text-center mb-6">
            Track you Expense
          </h2>
          <Form 
            name="login-form" 
            layout="vertical"
            onFinish={onFinish}
            form={loginForm}
            >
            <Item name="email" label="Username" rules={[{ required: true }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your Password"
              />
            </Item>
            <Item>
              <Button
                type="text"
                htmlType="submit"
                block
                className="!bg-[#5379f5] !text-white !font-bold"
                loading={loading}
              >
                Login
              </Button>
            </Item>
          </Form>
          <div className="flex items-center justify-between">
            <Link
              style={{ textDecoration: "underline" }}
              to="#"
              className="!text-[#5379f5] !font-bold"
            >
              Forgot Password
            </Link>
            <Link
              style={{ textDecoration: "underline" }}
              to="/signup"
              className="!text-[#5379f5] !font-bold"
            >
              Don't have an account?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Login;
