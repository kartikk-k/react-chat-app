import '../styles/globals.css'
import '../styles/components/sidebar.css'
import { AuthProvider } from '../context/AuthContext'
import { ChatProvider } from '../context/ChatContext'


export default function App({ Component, pageProps }) {

  return (
    <AuthProvider>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </AuthProvider>
  )
}
