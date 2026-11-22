import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import http from "../../../utils/http.js";
import frontImg from "../../../assets/front.png";
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
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      if (values.password !== values.rePassword)
        return toast.warning("Passwords do not match");
      setLoading(true);
      await http.put("/api/user/change-password", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Password updated successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homelayout>
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Left Section: Gradient of shades of blue */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#071228] via-[#1d4ed8] to-[#3b82f6] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle decorative glow circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Account Recovery <br /> & Security
            </h1>
            <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-sm">
              We'll help you securely reset your credentials and get back to managing your finances with zero hassle.
            </p>
          </div>

          {/* Center Graphic Container */}
          <div className="relative z-10 my-auto flex items-center justify-center py-4">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl max-w-xs group hover:scale-[1.02] transition-transform duration-300">
              <img
                src={frontImg}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/front.png";
                }}
                alt="Expense Tracker"
                className="w-full h-auto rounded-xl object-contain drop-shadow"
              />
            </div>
          </div>

          {/* Bottom area kept blank */}
          <div className="relative z-10" />
        </div>

        {/* Right Section: Form in shades of blue */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Header without hand wave emoji */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {token ? "Set New Password" : "Reset Password"}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                {token
                  ? "Enter and confirm your new password below."
                  : "Enter your registered email and we'll send you a reset link."}
              </p>
            </div>

            {token ? (
              <Form
                name="reset-form"
                layout="vertical"
                onFinish={onChangePassword}
                form={rePasswordForm}
                requiredMark={false}
              >
                <Item
                  name="password"
                  label={<span className="text-xs font-semibold text-slate-700">New Password</span>}
                  rules={[
                    { required: true, message: "Please enter your new password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="Enter new password"
                    className="!h-11 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item
                  name="rePassword"
                  label={<span className="text-xs font-semibold text-slate-700">Confirm Password</span>}
                  rules={[{ required: true, message: "Please confirm your new password" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="Confirm new password"
                    className="!h-11 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item className="mt-6 mb-4">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    block
                    className="!h-11 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-bold !rounded-xl !shadow-md !shadow-blue-500/25 !border-0 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircleOutlined className="text-sm" />
                    Update Password
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form
                name="forgot-form"
                layout="vertical"
                onFinish={onFinish}
                form={forgotForm}
                requiredMark={false}
              >
                <Item
                  name="email"
                  label={<span className="text-xs font-semibold text-slate-700">Email Address</span>}
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email address" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="you@example.com"
                    className="!h-11 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item className="mt-6 mb-4">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    block
                    className="!h-11 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-bold !rounded-xl !shadow-md !shadow-blue-500/25 !border-0 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Send Recovery Link
                    <ArrowRightOutlined className="text-xs" />
                  </Button>
                </Item>
              </Form>
            )}

            {/* Bottom Link */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Remember your password?{" "}
                <Link
                  to="/"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Homelayout>
  );
};

export default ForgotPassword;
