import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const uploadFile = createAsyncThunk(
    "upload/uploadFile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }

            const result = await response.json();
            return result;
        } catch (err) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

const uploadSlice = createSlice({
    name: "upload",
    initialState: { status: "idle", message: "", error: null },
    reducers: {
        clearUploadState: (state) => {
            state.status = "idle";
            state.message = "";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message || "File uploaded successfully!";
                state.error = null;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "File upload failed.";
                state.message = "";
            });
    },
});

export const { clearUploadState } = uploadSlice.actions;
export const uploadReducer = uploadSlice.reducer;
