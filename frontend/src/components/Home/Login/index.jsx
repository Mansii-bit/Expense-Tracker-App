import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import http from "../../../utils/http.js";
import frontImg from "../../../assets/front.png";

const { Item } = Form;

const Login = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await http.post("/api/user/login", values);
      const { role } = data;
      if (role === "admin") return navigate("/app/admin/dashboard");
      if (role === "user") return navigate("/app/user/dashboard");
    } catch (err) {
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      {/* Left Section: Gradient of shades of blue */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#071228] via-[#1d4ed8] to-[#3b82f6] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Take Control of <br /> Your Spending
          </h1>
          <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-sm">
            Keep track of your spending with ease, organize your transactions, and take control of your finances.
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

      {/* Right Section: Login Form in shades of blue */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* Header without hand wave emoji */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Please enter your credentials to access your account.
            </p>
          </div>

          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            form={loginForm}
            requiredMark={false}
          >
            <Item
              name="email"
              label={<span className="text-xs font-semibold text-slate-700">Email</span>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-blue-500 mr-1.5" />}
                placeholder="Enter your email"
                className="!h-11 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
              />
            </Item>

            <Item
              name="password"
              label={<span className="text-xs font-semibold text-slate-700">Password</span>}
              rules={[{ required: true, message: "Please enter your password" }]}
              className="!mb-2"
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500 mr-1.5" />}
                placeholder="Enter your password"
                className="!h-11 !rounded-xl !border-slate-200 hover:!border-blue-400 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-100 text-sm"
              />
            </Item>

            <div className="flex justify-end mb-5">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Item className="mt-6 mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="!h-11 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-bold !rounded-xl !shadow-md !shadow-blue-500/25 !border-0 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign In
                <ArrowRightOutlined className="text-xs" />
              </Button>
            </Item>
          </Form>

          {/* Bottom Link */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
