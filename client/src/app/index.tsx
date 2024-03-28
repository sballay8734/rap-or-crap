import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom"
import { RootState } from "./redux/store"
import ConfirmModal from "./components/ConfirmModal"
import ResponseModal from "./components/ResponseModal"
import ResultModal from "./components/ResultModal/ResultModal"

function App(): JSX.Element {
  // TODO: Need to use React Router. This is just a temporary solution
  const user = useSelector((state: RootState) => state.userSlice.user)

  // const location = useLocation()
  // const navigate = useNavigate()

  // useEffect(() => {
  //   // Check if the current path is "/game"
  //   if (location.pathname === "/game") {
  //     // Navigate to the "/game" route
  //     navigate("/game")
  //   }
  // }, [location.pathname, navigate])

  const isUserLoggedIn = user !== null

  const confirmModalIsShown = useSelector(
    (state: RootState) => state.confirmModal.showConfirmModal
  )
  const resultModalIsShown = useSelector(
    (state: RootState) => state.resultModalSlice.modalIsShown
  )

  return (
    <div className="container flex h-full w-full items-center justify-center">
      {isUserLoggedIn ? (
        <>
          <Navigate to="/home" replace />
          <Outlet />
        </>
      ) : (
        <>
          <Navigate to="/signin" replace />
          <Outlet />
        </>
      )}
      {confirmModalIsShown && <ConfirmModal />}
      {resultModalIsShown && <ResultModal />}
      <ResponseModal />
    </div>
  )
}

export default App
