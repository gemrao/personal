import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Habbit {
    count: Number;
    loading: Boolean;
    error: Boolean;
}


const initialState: Habbit = {
    count: 0,
    loading: false,
    error: false
}

export const fetchData = createAsyncThunk('fetch', async () => {
    await new Promise((resolve, reject) =>
        setTimeout(resolve, 1000)
    )
    console.log('here')
    return 13
})
const habbitSlice = createSlice({
    name: 'habit',
    initialState: initialState,
    reducers: {
        increment: (state, actions) => {
            console.log('state', state)
            console.log('action', actions)
            if (actions.payload) {
                state.count = state.count + actions.payload
            }
            else
                state.count = state.count + 1

        }
    },
    extraReducers: ((builder) => {
        builder.addCase(fetchData.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.loading = false
            state.count = action.payload
        })
        builder.addCase(fetchData.rejected, (state) => {
            state.loading = false
            state.error = true
        })

    })
})

export const { increment } = habbitSlice.actions
export default habbitSlice.reducer