import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Context from "../context";
import Head from "next/head";
import '@fortawesome/fontawesome-svg-core/styles.css'

//* root component of application
export default function App({ Component, pageProps }: AppProps, { ...rest }) {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
      </Head>
      <Context>
        <Component {...pageProps} />
      </Context>
    </div>
  );
}
