import { Button, Card, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import http from "../../../utils/http.js";
import Homelayout from "../../../layout/Homelayout";

const { Item } = Form;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [forgotForm] = Form.useForm();
  const [rePasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tok = params.get("token");
      console.log("Token from URL:", tok);
    if (tok) {
      checkToken(tok);
    } else setToken(null);
  }, [params]);

  const checkToken = async (tok) => {
    try {
      await http.post(
        "/api/user/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        },
      );
      setToken(tok);
    } catch (err) {
      setToken(null);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await http.post("/api/user/forgot-password", values);
      toast.success("Please check your email to change password");
    } catch (err) {
      setOtp(null);
      setFormData(null);
      toast.error(err.response ? err.response.data.messsage : err.messsage);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      if (values.password !== values.rePassword)
        return toast.warning("Password and RePassword not matched");
      setLoading(true);
      await http.put("/api/user/change-password", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Password updated successfully, please wait...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
              {token ? "Change Password" : "Forgot Password"}
            </h2>
            {token ? (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onChangePassword}
                form={rePasswordForm}
              >
                <Item
                  name="password"
                  label="New Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your Password"
                  />
                </Item>
                <Item
                  name="rePassword"
                  label="Confirm Password"
                  rules={[{ required: true }]}
                >
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
                    Change Password
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onFinish}
                form={forgotForm}
              >
                <Item name="email" label="Email" rules={[{ required: true }]}>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your Email"
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
                    Submit
                  </Button>
                </Item>
              </Form>
            )}

            <div className="flex items-center justify-between">
              <Link
                style={{ textDecoration: "underline" }}
                to="/"
                className="!text-[#5379f5] !font-bold"
              >
                Sign in
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
    </Homelayout>
  );
};
export default ForgotPassword;
