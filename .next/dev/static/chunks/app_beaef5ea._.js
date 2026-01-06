(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/ToastProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ToastProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
function ToastProvider() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        position: "top-center",
        reverseOrder: false,
        gutter: 8,
        toastOptions: {
            // Default options
            duration: 4000,
            style: {
                background: '#fff',
                color: '#1e293b',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                fontWeight: '500'
            },
            // Success toast style
            success: {
                duration: 3000,
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff'
                },
                style: {
                    border: '1px solid #d1fae5'
                }
            },
            // Error toast style
            error: {
                duration: 5000,
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff'
                },
                style: {
                    border: '1px solid #fee2e2'
                }
            },
            // Loading toast style
            loading: {
                iconTheme: {
                    primary: '#6366f1',
                    secondary: '#fff'
                }
            }
        }
    }, void 0, false, {
        fileName: "[project]/app/components/ToastProvider.tsx",
        lineNumber: 7,
        columnNumber: 9
    }, this);
}
_c = ToastProvider;
var _c;
__turbopack_context__.k.register(_c, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/store/slices/websiteSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearWebsite",
    ()=>clearWebsite,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchCurrentWebsite",
    ()=>fetchCurrentWebsite,
    "setThemeColor",
    ()=>setThemeColor,
    "setWebsite",
    ()=>setWebsite,
    "setWebsiteName",
    ()=>setWebsiteName,
    "updateWebsite",
    ()=>updateWebsite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    id: null,
    name: null,
    themeColor: null,
    loading: false,
    error: null
};
const fetchCurrentWebsite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('website/fetchCurrent', async (_, { rejectWithValue })=>{
    try {
        const response = await fetch('/api/websites/current');
        if (!response.ok) {
            throw new Error('Failed to fetch website');
        }
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const updateWebsite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('website/update', async (data, { rejectWithValue })=>{
    try {
        const response = await fetch(`/api/websites/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to update website');
        }
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const websiteSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'website',
    initialState,
    reducers: {
        setWebsite: (state, action)=>{
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.themeColor = action.payload.themeColor;
        },
        setWebsiteName: (state, action)=>{
            state.name = action.payload;
        },
        setThemeColor: (state, action)=>{
            state.themeColor = action.payload;
        },
        clearWebsite: (state)=>{
            state.id = null;
            state.name = null;
            state.themeColor = null;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch website
        .addCase(fetchCurrentWebsite.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchCurrentWebsite.fulfilled, (state, action)=>{
            state.loading = false;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.themeColor = action.payload.themeColor;
        }).addCase(fetchCurrentWebsite.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })// Update website
        .addCase(updateWebsite.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(updateWebsite.fulfilled, (state, action)=>{
            state.loading = false;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.themeColor = action.payload.themeColor;
        }).addCase(updateWebsite.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    }
});
const { setWebsite, setWebsiteName, setThemeColor, clearWebsite } = websiteSlice.actions;
const __TURBOPACK__default__export__ = websiteSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/store/slices/userSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearUser",
    ()=>clearUser,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchCurrentUser",
    ()=>fetchCurrentUser,
    "logoutUser",
    ()=>logoutUser,
    "setUser",
    ()=>setUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    id: null,
    name: null,
    email: null,
    loading: false,
    error: null,
    isAuthenticated: false
};
const fetchCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('user/fetchCurrent', async (_, { rejectWithValue })=>{
    try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const logoutUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('user/logout', async (_, { rejectWithValue })=>{
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        return true;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const userSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action)=>{
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        clearUser: (state)=>{
            state.id = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch user
        .addCase(fetchCurrentUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchCurrentUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        }).addCase(fetchCurrentUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })// Logout
        .addCase(logoutUser.pending, (state)=>{
            state.loading = true;
        }).addCase(logoutUser.fulfilled, (state)=>{
            state.loading = false;
            state.id = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        }).addCase(logoutUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    }
});
const { setUser, clearUser } = userSlice.actions;
const __TURBOPACK__default__export__ = userSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$websiteSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/slices/websiteSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$userSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/slices/userSlice.ts [app-client] (ecmascript)");
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        website: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$websiteSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        user: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$userSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    },
    devTools: ("TURBOPACK compile-time value", "development") !== 'production'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ReduxProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReduxProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$websiteSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/slices/websiteSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$userSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/slices/userSlice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function StoreInitializer() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreInitializer.useEffect": ()=>{
            // Fetch initial data when app loads
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"].dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$websiteSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentWebsite"])());
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"].dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$userSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentUser"])());
            // Set up polling for real-time updates (every 10 seconds)
            const intervalId = setInterval({
                "StoreInitializer.useEffect.intervalId": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"].dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$slices$2f$websiteSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentWebsite"])());
                }
            }["StoreInitializer.useEffect.intervalId"], 10000);
            return ({
                "StoreInitializer.useEffect": ()=>clearInterval(intervalId)
            })["StoreInitializer.useEffect"];
        }
    }["StoreInitializer.useEffect"], []);
    return null;
}
_s(StoreInitializer, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = StoreInitializer;
function ReduxProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StoreInitializer, {}, void 0, false, {
                fileName: "[project]/app/components/ReduxProvider.tsx",
                lineNumber: 33,
                columnNumber: 13
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ReduxProvider.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, this);
}
_c1 = ReduxProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "StoreInitializer");
__turbopack_context__.k.register(_c1, "ReduxProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_beaef5ea._.js.map