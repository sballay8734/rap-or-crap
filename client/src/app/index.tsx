import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom"
import { RootState } from "./redux/store"
import ConfirmModal from "./components/confirmModal"
import ResponseModal from "./components/responseModal"
import ResultModal from "./components/resultModal"
import LoadingModal from "./components/reusable/LoadingModal"

function App(): JSX.Element {
  // TODO: Need to use React Router. This is just a temporary solution
  const user = useSelector((state: RootState) => state.user.user)

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
    (state: RootState) => state.confirmModal.isVisible
  )
  const resultModalIsShown = useSelector(
    (state: RootState) => state.resultModal.isVisible
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
      <LoadingModal />
    </div>
  )
}

export default App
