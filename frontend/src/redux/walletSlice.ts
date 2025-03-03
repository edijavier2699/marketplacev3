import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import { persistReducer } from 'redux-persist';

interface WalletState {
  address: string | null;
}

const initialState: WalletState = {
  address: null,
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
  },
});

export const { setWalletAddress } = walletSlice.actions;

// Persistence configuration for the wallet slice
const walletPersistConfig = {
  key: 'wallet', // Key for the wallet slice in the localStorage
  storage, // Use localStorage to persist
};

export const persistedWalletReducer = persistReducer(walletPersistConfig, walletSlice.reducer);

export default walletSlice.reducer;
