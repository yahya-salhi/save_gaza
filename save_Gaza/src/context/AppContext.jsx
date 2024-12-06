/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

// Define initial state
const initialState = {
  sidebarOpen: false,
  isLoading: false,
  data: [],
  error: null,
  selectedDate: null,
};

// Define action types
export const ActionTypes = {
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_LOADING: "SET_LOADING",
  SET_DATA: "SET_DATA",
  SET_ERROR: "SET_ERROR",
  SET_SELECTED_DATE: "SET_SELECTED_DATE",
};

// Create reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_DATA:
      return { ...state, data: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Create provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
