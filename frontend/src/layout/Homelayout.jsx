import { Layout, Tooltip } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {
  return (
    <Layout className="min-h-screen !bg-slate-50 flex flex-col">
      {/* ================= HEADER ================= */}
      <Header
        style={{
          background:
            "linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,0) 35%, rgba(248,250,252,0.85) 80%, #f8fafc 100%), linear-gradient(90deg, rgba(65,105,225,0.6) 0%, rgba(96,165,250,0.35) 18%, #ffffff 35%, #ffffff 65%, rgba(96,165,250,0.35) 82%, rgba(65,105,225,0.6) 100%)",
        }}
        className="
          !h-auto
          !py-6
          !px-6
          md:!px-10
          relative
          overflow-hidden
          !border-0
          flex
          items-center
          justify-center
          !shadow-none
        "
      >
        {/* Subtle decorative glow at left and right ends */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-[#4169e1]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-[#4169e1]/25 rounded-full blur-2xl pointer-events-none" />

        {/* Bottom edge fade seamlessly blending into page background */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
          <span className="w-10 sm:w-16 md:w-24 h-[2px] bg-[#4169e1] rounded-full inline-block" />
          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-bold
              tracking-normal
              m-0
              select-none
              flex
              items-center
              gap-2
              sm:gap-3
            "
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            <span className="text-[#041b4c]">Expense</span>
            <span className="text-[#0052ff]">Tracker</span>
          </h1>
          <span className="w-10 sm:w-16 md:w-24 h-[2px] bg-[#4169e1] rounded-full inline-block" />
        </div>
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
