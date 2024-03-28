import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  FLUSH,
  PAUSE,
  PERSIST,
  REGISTER,
  PURGE
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { setupListeners } from "@reduxjs/toolkit/query"

import confirmModalReducer from "./ConfirmModalSlice"
// TODO: Change to "requestModalReducer" (should handle err AND success)
import serverResponseReducer from "./serverResponseSlice"
import userSliceReducer from "./UserSlice"
import resultModalSliceReducer from "./ResultModalSlice"
import { gameHandlingApi } from "./GameHandling/gameHandlingApi"
import { authApi } from "./auth/authApi"

const rootReducer = combineReducers({
  confirmModal: confirmModalReducer,
  serverResponseSlice: serverResponseReducer,
  userSlice: userSliceReducer,
  resultModalSlice: resultModalSliceReducer,
  [gameHandlingApi.reducerPath]: gameHandlingApi.reducer,
  [authApi.reducerPath]: authApi.reducer
})

const persistConfig = {
  key: "root",
  version: 1,
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(gameHandlingApi.middleware, authApi.middleware)
  }
})

setupListeners(store.dispatch)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
