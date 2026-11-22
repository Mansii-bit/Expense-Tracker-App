import { Layout, Tooltip } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {
  return (
    <Layout className="min-h-screen !bg-slate-50 flex flex-col">
      {/* ================= HEADER ================= */}
      <Header
        className="
          !h-[76px]
          !px-6
          md:!px-10
          !bg-[#0d2942]
          !border-0
          flex
          items-center
          justify-center
          sticky
          top-0
          z-50
          shadow-sm
        "
      >
        <h1
          className="
            text-white
            text-xl
            md:text-3xl
            font-bold
            text-center
            tracking-tight
            m-0
          "
        >
          Expense Tracker App
        </h1>
      </Header>

      {/* ================= CONTENT ================= */}
      <Content
        className="
          !bg-slate-50
          px-4
          sm:px-6
          lg:px-8
          py-8
          md:py-12
          flex-1
          flex
          items-center
          justify-center
        "
      >
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </Content>

      {/* ================= FOOTER ================= */}
      <Footer className="!bg-[#0d2942] !px-6 !py-8 !m-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* App Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <img
                  src="/favicon.png"
                  alt="Expense Tracker"
                  className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-blue-500/20"
                />
                <h2 className="text-2xl font-bold text-white">
                  Expense Tracker
                </h2>
              </div>
              <p className="text-gray-400 text-sm leading-6 max-w-md">
                Keep track of your spending with ease.
                Organize your transactions, understand your habits,
                and take control of your finances.
              </p>
            </div>

            {/* Contact */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-medium">
                Get in touch
              </p>
              <Tooltip title="Send an email to expense.tracker.app.99@gmail.com" placement="top">
                <a
                  href="mailto:expense.tracker.app.99@gmail.com"
                  aria-label="Contact via email"
                  className="
                    inline-flex items-center justify-center
                    w-10 h-10
                    rounded-xl
                    bg-blue-600/20
                    border border-blue-500/30
                    text-blue-400
                    hover:bg-blue-600
                    hover:text-white
                    hover:border-blue-500
                    transition-all duration-200
                    shadow-lg shadow-blue-500/10
                    group
                  "
                >
                  <MailOutlined className="text-lg group-hover:scale-110 transition-transform" />
                </a>
              </Tooltip>
              <p className="text-gray-500 text-xs mt-2">
                We'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-6 pt-4 text-center">
            <p className="text-gray-500 text-xs">
              © 2026 Expense Tracker · Spend wisely, live better.
            </p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Homelayout;
