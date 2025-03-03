import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssetState {
  investMethodTitle: string;
  assetPoolAddress: string;
  assetTokenPrice: number;
  tokensAvailable: number;
}

const initialState: AssetState = {
  investMethodTitle: "",  
  assetPoolAddress: "",
  assetTokenPrice: 0,
  tokensAvailable: 0,
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setInvestMethodTitle: (state, action: PayloadAction<string>) => {
      state.investMethodTitle = action.payload;
    },
    setAssetPoolAddress: (state, action: PayloadAction<string>) => {
      state.assetPoolAddress = action.payload;
    },
    setAssetTokenPrice: (state, action: PayloadAction<number>) => {
      state.assetTokenPrice = action.payload;
    },
    setTokensAvailable: (state, action: PayloadAction<number>) => {
      state.tokensAvailable = action.payload;
    },
    resetAsset: (state) => {
      state.investMethodTitle = "";
      state.assetPoolAddress = "";
      state.assetTokenPrice = 0;
      state.tokensAvailable = 0;
    },
  },
});

export const { 
  setInvestMethodTitle, 
  setAssetPoolAddress, 
  setAssetTokenPrice, 
  setTokensAvailable, 
  resetAsset 
} = assetSlice.actions;

export default assetSlice.reducer;
