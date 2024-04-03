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

import confirmModalReducer from "./features/modals/confirmModalSlice"
// TODO: Change to "requestModalReducer" (should handle err AND success)
import serverResponseReducer from "./features/serverResponse/serverResponseSlice"
import userReducer from "./features/user/userSlice"
import resultModalReducer from "./features/modals/resultModalSlice"
import loadingModalReducer from "./features/modals/loadingModalSlice"
import { gameApi } from "./features/game/gameApi"
import { authApi } from "./features/auth/authApi"

const rootReducer = combineReducers({
  confirmModal: confirmModalReducer,
  serverResponse: serverResponseReducer,
  user: userReducer,
  resultModal: resultModalReducer,
  loadingModal: loadingModalReducer,
  [gameApi.reducerPath]: gameApi.reducer,
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
    }).concat(gameApi.middleware, authApi.middleware)
  }
})

setupListeners(store.dispatch)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
