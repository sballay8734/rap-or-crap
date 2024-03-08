import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

import { RootState } from "../../redux/store";
import { clearError } from "../../redux/ErrorModalSlice";
import { IoIosClose } from "react-icons/io";

export default function ErrorModal() {
  const dispatch = useDispatch();
  const errorMessage = useSelector(
    (state: RootState) => state.errorModal.message,
  );

  useEffect(() => {
    if (errorMessage) {
      const modalShowDuration =
        errorMessage.length > 50
          ? 4000
          : errorMessage.length > 100
            ? 5000
            : 3000;
      const timeoutId = setTimeout(() => {
        dispatch(clearError());
      }, modalShowDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage, dispatch]);

  function handleCloseErrorModal() {
    dispatch(clearError());
  }

  // if no error, show nothing
  if (!errorMessage) return null;

  console.log("SHOWING ERROR!");

  const children = (
    <div
      onClick={handleCloseErrorModal}
      className="modal-background absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black/95 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-60 min-w-full flex-col overflow-hidden rounded-3xl bg-white"
      >
        <div
          className="modal-header relative w-full flex-[2_0_33%] bg-red-700"
          style={{
            backgroundImage: "url('error.png')",
            backgroundPosition: "center",
            backgroundSize: "50px 50px",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between py-4">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="rounded-md bg-red-200 px-3 py-1 text-center text-sm font-bold text-red-500 opacity-90">
            {errorMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleCloseErrorModal}
              className="flex items-center rounded-md border-[1px] bg-red-500 px-4 py-2 align-middle text-white"
            >
              <div className="flex items-center justify-center">
                <IoIosClose size={20} className="mt-[2px]" />
                <span className="">Close</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!;

  // Render it only if modalIsShown === true
  return errorMessage && createPortal(children, modalContainer);
}
