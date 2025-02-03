import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    userDetails: [],
    tempDetails: [],
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
    error: null,
    response: null,
    darkMode: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading';
        },
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        stuffAdded: (state, action) => {
            state.status = 'added';
            state.response = null;
            state.error = null;
            state.tempDetails = action.payload;
        },
        authSuccess: (state, action) => {
            state.status = 'success';
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.response = null;
            state.error = null;
        },
        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
        },
        authError: (state, action) => {
            // state.status = 'error';
            // state.error = action.payload;
            state.status = 'error';
            state.error = action.payload?.message || "Something went wrong";
        },
        authLogout: (state) => {
            localStorage.removeItem('user');
            state.currentUser = null;
            state.status = 'idle';
            state.error = null;
            state.currentRole = null
        },

        doneSuccess: (state, action) => {
            state.userDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getDeleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getRequest: (state) => {
            state.loading = true;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            // state.loading = false;
            // state.error = action.payload;
            state.loading = false;
            state.error = action.payload?.message || "Network Error";
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        forgotPasswordRequest: (state) => {
            state.loading = true;
            state.response = null;
            state.error = null;
        },
        forgotPasswordSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        },
        forgotPasswordError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
        },
        resetPasswordRequest: (state) => {
            state.loading = true;
            state.response = null;
            state.error = null;
        },
        resetPasswordSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        },
        resetPasswordError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
        }

    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    toggleDarkMode,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordError
} = userSlice.actions;

export const userReducer = userSlice.reducer;
