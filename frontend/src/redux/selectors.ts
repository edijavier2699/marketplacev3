// selectors.ts

import { createSelector } from 'reselect';
import { RootState } from './store'; // Asegúrate de importar el tipo RootState de tu store

// Selector base para obtener el estado de la propiedad "asset" desde Redux
const selectAssetState = (state: RootState) => state.investAsset;

// Selector memoizado para obtener el título del método de inversión
export const selectInvestMethodTitle = createSelector(
  [selectAssetState], // Dependemos del estado de asset
  (assetState) => assetState.investMethodTitle // Calculamos y devolvemos el título del método de inversión
);

// Selector memoizado para obtener la dirección del pool de activos
export const selectAssetPoolAddress = createSelector(
  [selectAssetState], // Dependemos del estado de asset
  (assetState) => assetState.assetPoolAddress // Calculamos y devolvemos la dirección del pool de activos
);
