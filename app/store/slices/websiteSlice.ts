import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// Types
export interface WebsiteState {
    id: string | null;
    name: { en?: string; ar?: string } | null;
    themeColor: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: WebsiteState = {
    id: null,
    name: null,
    themeColor: null,
    loading: false,
    error: null,
};

// Async thunk to fetch website data
export const fetchCurrentWebsite = createAsyncThunk(
    'website/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/websites/current');
            if (!response.ok) {
                throw new Error('Failed to fetch website');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Async thunk to update website
export const updateWebsite = createAsyncThunk(
    'website/update',
    async (data: { id: string; name: { en?: string; ar?: string }; themeColor?: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/websites/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update website');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const websiteSlice = createSlice({
    name: 'website',
    initialState,
    reducers: {
        setWebsite: (state, action: PayloadAction<{ id: string; name: { en?: string; ar?: string }; themeColor: string }>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.themeColor = action.payload.themeColor;
        },
        setWebsiteName: (state, action: PayloadAction<{ en?: string; ar?: string }>) => {
            state.name = action.payload;
        },
        setThemeColor: (state, action: PayloadAction<string>) => {
            state.themeColor = action.payload;
        },
        clearWebsite: (state) => {
            state.id = null;
            state.name = null;
            state.themeColor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch website
            .addCase(fetchCurrentWebsite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentWebsite.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.themeColor = action.payload.themeColor;
            })
            .addCase(fetchCurrentWebsite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update website
            .addCase(updateWebsite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWebsite.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.themeColor = action.payload.themeColor;
            })
            .addCase(updateWebsite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setWebsite, setWebsiteName, setThemeColor, clearWebsite } = websiteSlice.actions;
export default websiteSlice.reducer;
