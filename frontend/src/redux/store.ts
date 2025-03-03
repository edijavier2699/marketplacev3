import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import { persistedWalletReducer } from "./walletSlice";
import tableActionItemReducer from "./tableActionItemSlice"; // Nuevo reducer
import investSelectAsset from "./investSelectAsset"

// Configuración de persistencia para el userSlice
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["role"],
};

// Reducer persistido para el userSlice
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Combina los reducers
const rootReducer = combineReducers({
  user: persistedUserReducer,
  wallet: persistedWalletReducer,
  tableActionItem: tableActionItemReducer, // Añadido
  investAsset: investSelectAsset
});

// Crea el store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Crear el persistor
export const persistor = persistStore(store);

// Exporta el tipo RootState para tipado
export type RootState = ReturnType<typeof store.getState>;
