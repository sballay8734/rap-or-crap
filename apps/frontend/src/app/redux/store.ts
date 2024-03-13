import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  FLUSH,
  PAUSE,
  PERSIST,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import confirmModalReducer from "./ConfirmModalSlice";
// TODO: Change to "requestModalReducer" (should handle err AND success)
import serverResponseReducer from "./serverResponseSlice";
import userSliceReducer from "./UserSlice";
import { gameHandlingApi } from "./GameHandling/gameHandlingApi";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  confirmModal: confirmModalReducer,
  serverResponseSlice: serverResponseReducer,
  userSlice: userSliceReducer,
  [gameHandlingApi.reducerPath]: gameHandlingApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }).concat(gameHandlingApi.middleware);
  },
});

setupListeners(store.dispatch);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
