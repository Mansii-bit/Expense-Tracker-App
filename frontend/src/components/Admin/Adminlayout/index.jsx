import {
  AppstoreAddOutlined,
  MenuOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Image, Menu, Button, ConfigProvider } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../utils/http";

const { Sider, Header, Content } = Layout;

const items = [
  {
    key: "/app/admin/dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
  },
  {
    key: "/app/admin/users",
    label: "Users",
    icon: <UserOutlined />,
  },
];

const Adminlayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNavigate = (menu) => {
    navigate(menu.key);
  };

  const siderStyle = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    backgroundColor: "#071228",
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 10,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #f1f5f9",
    height: "64px",
  };

  const logout = async () => {
    try {
      setLoading(true);
      await http.get("/api/user/logout");
      sessionStorage.removeItem("userInfo");
      navigate("/");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Layout className="!min-h-screen !bg-slate-50">
      <Sider
        style={siderStyle}
        collapsible
        collapsed={open}
        trigger={null}
        width={220}
        className="!bg-[#071228]"
      >
        <div className="flex items-center justify-center my-6">
          <div className="w-14 h-14 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
            <Image
              src="/front.jpg"
              width={48}
              height={48}
              preview={false}
              alt="logo"
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "#2563eb",
                darkItemSelectedColor: "#ffffff",
                darkItemBg: "transparent",
                darkItemColor: "#94a3b8",
                darkItemHoverColor: "#ffffff",
                itemBorderRadius: 10,
                itemMarginInline: 12,
                itemHeight: 44,
              },
            },
          }}
        >
          <Menu
            selectedKeys={[pathname.startsWith("/app/admin/users") ? "/app/admin/users" : "/app/admin/dashboard"]}
            theme="dark"
            items={items}
            onClick={handleNavigate}
            className="!border-none !bg-transparent font-medium"
          />
        </ConfigProvider>
      </Sider>

      <Layout className="!bg-slate-50">
        <Header style={headerStyle} className="flex items-center justify-between shadow-xs">
          <Button
            type="text"
            onClick={() => setOpen(!open)}
            icon={<MenuOutlined className="text-gray-600" />}
            className="!border !border-gray-200 !rounded-lg"
          />
          <Button
            shape="circle"
            type="text"
            icon={<PoweroffOutlined className="text-gray-600" />}
            onClick={logout}
            loading={loading}
            className="!border !border-gray-200 hover:!border-rose-300 hover:!text-rose-500"
          />
        </Header>
        <Content className="p-4 sm:p-6 md:p-8 !bg-slate-50 min-h-[calc(100vh-64px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Adminlayout;
