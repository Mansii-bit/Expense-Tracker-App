import { Button, Card, Form, Input } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Homelayout from "../../../layout/HomeLayout";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const { Item } = Form;

const Signup = () => {
  const [signupForm] = Form.useForm();
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSignup = async (values) => {
    try {
      if (Number(values.otp) !== Number(otp)) {
        return toast.error("OTP Mismatched");
      }
      setLoading(true);
      await axios.post("/api/user/login", formData);
      toast.success("Signup Successfull");
      setOtp(null);
      setFormData(null);
      signupForm.resetFields();
    } catch (err) {
      setLoading(false);
      toast.error(err.response ? err.response.data.messsage : err.messsage);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/send-mail", values);
      setOtp(data.otp);
      setFormData(values);
    } catch (err) {
      setOtp(null);
      setFormData(null);
      toast.error(err.response ? err.response.data.messsage : err.messsage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homelayout>
      <div className="flex">
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img src="/front.jpg" alt="Bank" className="w-4/5 object-contain" />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
          <Card className="w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-[#5379f5] text-2xl text-center mb-6">
              Register to Track you Expense
            </h2>
            {otp ? (
              <Form name="otp-form" layout="vertical" onFinish={onSignup}>
                <Item name="otp" label="OTP" rules={[{ required: true }]}>
                  <Input.OTP
                    prefix={<UserOutlined />}
                    placeholder="Enter your Fullname"
                  />
                </Item>
                <Item>
                  <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    block
                    className="!bg-[#5379f5] !text-white !font-bold"
                  >
                    Verify Now
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form
                name="signup-form"
                layout="vertical"
                onFinish={onFinish}
                form={signupForm}
              >
                <Item
                  name="fullname"
                  label="Fullname"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your Fullname"
                  />
                </Item>
                <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter your Mobile number"
                  />
                </Item>
                <Item
                  name="email"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
                  />
                </Item>
                <Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your Password"
                  />
                </Item>
                <Item>
                  <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    block
                    className="!bg-[#5379f5] !text-white !font-bold"
                  >
                    Signup
                  </Button>
                </Item>
              </Form>
            )}
            <div className="flex items-center justify-center">
              <Link
                style={{ textDecoration: "underline" }}
                to="/"
                className="!text-[#5379f5] !font-bold"
              >
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
