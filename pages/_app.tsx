import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
// import { wrapper } from '../store/main';
import { store } from '../store/store';
import Context from '../context';

//* root component of application
export default function App({ Component, pageProps }: AppProps, { ...rest}) {
  return <Context>
    <Component {...pageProps} />
  </Context>
}
