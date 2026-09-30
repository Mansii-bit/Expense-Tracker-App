import { Layout } from "antd";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">

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
          "
        >
          Expense Tracker App
        </h1>
      </Header>


      {/* ================= CONTENT ================= */}
      <Content
        className="
          !bg-[#f5f7fa]
          px-4
          md:px-8
          lg:px-10
          py-8
          flex-1
        "
      >
        <div
          className="
            w-full
            min-h-[calc(100vh-76px-250px)]
            bg-white
            rounded-xl
            shadow-sm
            border
            border-gray-200
            p-5
            md:p-8
          "
        >
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

          <div className="
            w-10 h-10
            rounded-xl
            bg-[#4060ca]
            flex items-center justify-center
            shadow-lg shadow-blue-500/20
          ">
            <span className="text-white text-lg font-bold">
              ₹
            </span>
          </div>

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
      <div className="text-center md:text-right">

        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
          Get in touch
        </p>

        <a
          href="mailto:expense.tracker.app.99@gmail.com"
          className="
            text-[#5379f5]
            hover:text-blue-400
            text-sm
            font-medium
            transition-colors
          "
        >
          expense.tracker.app.99@gmail.com
        </a>

        <p className="text-gray-500 text-xs mt-2">
          We'd love to hear from you.
        </p>

      </div>

    </div>


    {/* Bottom */}
    <div className="border-t border-white/10  pt-2 text-center">

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