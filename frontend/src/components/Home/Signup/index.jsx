import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import { useState } from "react";
import { toast } from "react-toastify";
import http from "../../../utils/http.js";
import frontImg from "../../../assets/front.png";

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
      await http.post("/api/user", formData);
      toast.success("Signup Successful! Please sign in.");
      setOtp(null);
      setFormData(null);
      signupForm.resetFields();
    } catch (err) {
      setLoading(false);
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await http.post("/api/user/send-mail", values);
      setOtp(data.otp);
      setFormData(values);
      toast.info("Verification code sent to your email!");
    } catch (err) {
      setOtp(null);
      setFormData(null);
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
              Start Your Financial <br /> Journey With Us
            </h1>
            <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-sm">
              Create your account to organize your transactions, manage your spending with ease, and stay in control of your budget.
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
                {otp ? "Verify Your Email" : "Create an Account"}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                {otp
                  ? "Enter the 6-digit code sent to your email address."
                  : "Sign up today to start managing your expenses."}
              </p>
            </div>

            {otp ? (
              <Form name="otp-form" layout="vertical" onFinish={onSignup} requiredMark={false}>
                <Item
                  name="otp"
                  label={<span className="text-xs font-semibold text-slate-700">Verification Code (OTP)</span>}
                  rules={[{ required: true, message: "Please enter your OTP" }]}
                >
                  <Input.OTP
                    length={6}
                    size="large"
                    className="!w-full justify-between"
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
                    Verify & Create Account
                  </Button>
                </Item>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtp(null)}
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 transition"
                  >
                    ← Change registration details
                  </button>
                </div>
              </Form>
            ) : (
              <Form
                name="signup-form"
                layout="vertical"
                onFinish={onFinish}
                form={signupForm}
                requiredMark={false}
              >
                <Item
                  name="fullname"
                  label={<span className="text-xs font-semibold text-slate-700">Full Name</span>}
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="e.g. Mansi Singh"
                    className="!h-10 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item
                  name="mobile"
                  label={<span className="text-xs font-semibold text-slate-700">Mobile Number</span>}
                  rules={[{ required: true, message: "Please enter your mobile number" }]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="e.g. 9876543210"
                    className="!h-10 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

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
                    className="!h-10 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item
                  name="password"
                  label={<span className="text-xs font-semibold text-slate-700">Password</span>}
                  rules={[
                    { required: true, message: "Please enter a password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500 mr-1.5" />}
                    placeholder="Create a secure password"
                    className="!h-10 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
                  />
                </Item>

                <Item className="mt-5 mb-4">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    block
                    className="!h-11 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-bold !rounded-xl !shadow-md !shadow-blue-500/25 !border-0 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Sign Up
                    <ArrowRightOutlined className="text-xs" />
                  </Button>
                </Item>
              </Form>
            )}

            {/* Bottom Link */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Homelayout>
  );
};

export default Signup;
