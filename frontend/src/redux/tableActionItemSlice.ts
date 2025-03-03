// redux/slices/tableActionItemSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir el estado inicial
interface TableActionItemState {
  itemId: string | null; // Guardará el ID del item seleccionado, por defecto null
}

const initialState: TableActionItemState = {
  itemId: null,
};

const tableActionItemSlice = createSlice({
  name: 'tableActionItem',
  initialState,
  reducers: {
    // Acción para actualizar el itemId
    setItemId: (state, action: PayloadAction<string | null>) => {
      state.itemId = action.payload;
    },
  },
});

// Exportar las acciones y el reducer
export const { setItemId } = tableActionItemSlice.actions;
export default tableActionItemSlice.reducer;