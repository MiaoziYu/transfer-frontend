import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editTargetId: undefined,
  deleteTargetId: undefined,
  isAddModalVisible: false
}

// reducers
const statusSlice = createSlice({
  name: 'transferStatus',
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes.
    // don't try to mutate any data outside of createSlice
    setEditTargetId(state, action) {
      state.editTargetId = action.payload;
    },
    setDeleteTargetId(state, action) {
      state.deleteTargetId = action.payload;
    },
    setAddModalVisibility(state, action) {
      state.isAddModalVisible = action.payload;
    },
  }
})

// actions
export const {
  setEditTargetId,
  setDeleteTargetId,
  setAddModalVisibility,
} = statusSlice.actions;

export default statusSlice.reducer;