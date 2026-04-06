import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DynamicModalState {
    isOpen: boolean;
    dynamicId: string | null;
    snippet: any | null;
}

const initialState: DynamicModalState = {
    isOpen: false,
    dynamicId: null,
    snippet: null,
};

const dynamicModalSlice = createSlice({
    name: 'dynamicModal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{ dynamicId: string; snippet: any }>) => {
            state.isOpen = true;
            state.dynamicId = action.payload.dynamicId;
            state.snippet = action.payload.snippet;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.dynamicId = null;
            state.snippet = null;
        },
    },
});

export const { openModal, closeModal } = dynamicModalSlice.actions;
export default dynamicModalSlice.reducer;
