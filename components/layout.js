import Head from "next/head";

const Layout = ({ children }) => (
  <>
    <Head>
      <link rel="icon" href="img/favicon.png" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      {/* Social sharing tags */}
      <meta property="og:site_name" content="Oracy" />
      <meta property="og:title" content="Oracy" />
      <meta
        property="og:description"
        content="10K public domain audiobooks, completely free and without ads"
      />
      <meta property="og:image" content="https://oracy.app/img/social.jpg" />
      <meta property="og:url" content="https://oracy.app" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@damirkotoric" />
      {/* PWA tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Oracy" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="apple-touch-icon" href="img/touch_icon.png" />
      <title>
        Oracy — 10K public domain audiobooks, completely free and without ads
      </title>
    </Head>
    <div className="main">
      <div className="mainHeader">
        <h1>
          <img
            className="mainHeaderLogo -light"
            src="/img/logo_wordmark.svg"
            alt="Oracy"
          />
          <img
            className="mainHeaderLogo -dark"
            src="/img/logo_wordmark_white.svg"
            alt="Oracy"
          />
        </h1>
        <div>
          Enjoy public domain audiobooks, completely free and without ads.
        </div>
      </div>
      <div className="mainContent">{children}</div>
    </div>
    <div className="mainFooter">
      Built by{" "}
      <a href="https://twitter.com/damirkotoric" target="_blank">
        @damirkotoric
      </a>{" "}
      &{" "}
      <a href="https://twitter.com/ciprianofreitas" target="_blank">
        @ciprianofreitas
      </a>
    </div>
  </>
);

export default Layout;
