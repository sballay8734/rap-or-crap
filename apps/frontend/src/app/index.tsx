import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "./redux/store";
import ConfirmModal from "./components/ConfirmModal";

function App(): JSX.Element {
  // TODO: Need to use React Router. This is just a temporary solution
  const isUserLoggedIn = false;
  const confirmModalIsShown = useSelector(
    (state: RootState) => state.confirmModal.showConfirmModal,
  );

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
    </div>
  );
}

export default App;
