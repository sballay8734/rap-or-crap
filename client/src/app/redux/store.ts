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
import userReducer from "./features/user/userSlice"
import resultModalReducer from "./features/modals/resultModalSlice"
import loadingModalReducer from "./features/modals/loadingModalSlice"
import notifyModalsReducer from "./features/modals/handleModalsSlice"
import gameReducer from "./features/game/gameSlice"
import scoreboardReducer from "./features/modals/scoreboardModalSlice"
import cacheModalReducer from "./features/modals/clearCacheModalSlice"
import howToPlayReducer from "./features/modals/howToPlayModalSlice"
import { gameApi } from "./features/game/gameApi"
import { authApi } from "./features/auth/authApi"

const rootReducer = combineReducers({
  confirmModal: confirmModalReducer,
  user: userReducer,
  resultModal: resultModalReducer,
  loadingModal: loadingModalReducer,
  notifyModals: notifyModalsReducer,
  game: gameReducer,
  scoreboard: scoreboardReducer,
  cacheModal: cacheModalReducer,
  howToPlayModal: howToPlayReducer,
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
