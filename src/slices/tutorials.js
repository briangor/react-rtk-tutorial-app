import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TutorialDataService from "../services/TutorialService";

const initialState = [];

export const createTutorial = createAsyncThunk(
  "tutorials/create",
  async ({ title, description }) => {
    const res = await TutorialDataService.create({ title, description });
    return res.data;
  }
);

export const retrieveTutorials = createAsyncThunk(
  "tutorials/retrieve",
  async () => {
    const res = await TutorialDataService.getAll();
    console.log(res.data); // Log the response data for debugging
    return res.data;
  }
);

export const updateTutorial = createAsyncThunk(
  "tutorials/update",
  async ({ id, data }) => {
    const res = await TutorialDataService.update(id, data);
    return res.data;
  }
);

export const deleteTutorial = createAsyncThunk(
  "tutorials/delete",
  async ({ id }) => {
    await TutorialDataService.remove(id);
    return { id };
  }
);

export const deleteAllTutorials = createAsyncThunk(
  "tutorials/deleteAll",
  async () => {
    const res = await TutorialDataService.removeAll();
    return res.data;
  }
);

export const findTutorialsByTitle = createAsyncThunk(
  "tutorials/findByTitle",
  async ({ title }) => {
    const res = await TutorialDataService.findByTitle(title);
    return res.data;
  }
);

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTutorial.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(retrieveTutorials.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          return [...action.payload];
        } else {
          console.error("Expected an array but got:", action.payload);
        //   return state; // Return the current state if the payload is not an array
          return action.payload.tutorials; //TODO: fix this
        }
      })
      .addCase(updateTutorial.fulfilled, (state, action) => {
        const index = state.findIndex(tutorial => tutorial.id === action.payload.id);
        state[index] = {
          ...state[index],
          ...action.payload,
        };
      })
      .addCase(deleteTutorial.fulfilled, (state, action) => {
        const index = state.findIndex(({ id }) => id === action.payload.id);
        state.splice(index, 1);
      })
      .addCase(deleteAllTutorials.fulfilled, (state, action) => {
        return [];
      })
      .addCase(findTutorialsByTitle.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          return [...action.payload];
        } else {
          console.error("Expected an array but got:", action.payload);
          return state; // Return the current state if the payload is not an array
        }
      });
  },
});

const { reducer } = tutorialSlice;
export default reducer;
