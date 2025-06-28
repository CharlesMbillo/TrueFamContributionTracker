// src/context/AppContext.tsx
import React, { createContext, useReducer, useContext } from 'react';
import { Transaction, Settings } from '../types';

type AppState = {
  transactions: Transaction[];
  settings: Settings;
  selectedTransactions: string[];
  whatsappGroupId?: string;
};

type Action =
  | { type: 'ADD_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'TOGGLE_SELECTED'; payload: string }
  | { type: 'SET_WHATSAPP_GROUP'; payload: string };

const initialState: AppState = {
  transactions: [],
  settings: {
    sheetUrl: '',
    monitorSMS: true,
    monitorEmail: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isConfigured: false,
  },
  selectedTransactions: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload],
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'TOGGLE_SELECTED':
      return {
        ...state,
        selectedTransactions: state.selectedTransactions.includes(action.payload)
          ? state.selectedTransactions.filter(id => id !== action.payload)
          : [...state.selectedTransactions, action.payload],
      };
    case 'SET_WHATSAPP_GROUP':
      return { ...state, whatsappGroupId: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);