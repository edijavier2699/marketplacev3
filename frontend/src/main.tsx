import React from 'react';
import ReactDOM from 'react-dom/client';
import '@rainbow-me/rainbowkit/styles.css';
import {  RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';
import Layout from './layouts/layout';
import { Buffer } from 'buffer';
import process from 'process';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ModalProvider } from './context/modalContext';
import { persistor } from './redux/store';
import { config } from './wagmi';

// Asignar Buffer y process a window (esto es necesario para ciertas dependencias)
window.Buffer = Buffer;
window.process = process;

// Configuración de Wagmi (para conectarse a Ethereum, Polygon, etc.)
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2l2jjwfm5ekzae3u.us.auth0.com"
      clientId="RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://my-endpoints/users',
        scope: 'openid profile email read:users write:users',
      }}
    >
      <Provider store={store}>
        <ModalProvider>
          <PersistGate loading={null} persistor={persistor}>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                  <Layout />
                </RainbowKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </PersistGate>
        </ModalProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
