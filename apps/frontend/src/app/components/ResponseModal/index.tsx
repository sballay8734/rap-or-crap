import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

import { RootState } from "../../redux/store";
import { clearResponseMessage } from "../../redux/serverResponseSlice";

export default function ResponseModal() {
  const dispatch = useDispatch();
  const { successResult, responseMessage } = useSelector(
    (state: RootState) => state.serverResponseSlice,
  );

  // * handle styling based on success or fail
  const bgColor = successResult === false ? "bg-red-700" : "bg-green-700";
  const status = successResult === false ? "Error" : "Success!";
  const bgImg = successResult === false ? "url(error.png)" : "url(success.png)";
  const msgColor = successResult === false ? "text-red-500" : "text-green-500";
  const messageBg = successResult === false ? "bg-red-200" : "bg-green-200";
  const closeBtnBg = successResult === false ? "bg-red-900" : "bg-gray-700";

  // ! TODO: ADD THIS BACK!! JUST REMOVED FOR SYLING AND TESTING
  // useEffect(() => {
  //   if (responseMessage) {
  //     const modalShowDuration =
  //       responseMessage.length > 50
  //         ? 4000
  //         : responseMessage.length > 100
  //           ? 5000
  //           : 3000;
  //     const timeoutId = setTimeout(() => {
  //       dispatch(clearResponseMessage());
  //     }, modalShowDuration);

  //     return () => {
  //       clearTimeout(timeoutId);
  //     };
  //   }
  // }, [responseMessage, dispatch]);

  function handleCloseResponseModal() {
    dispatch(clearResponseMessage());
  }

  // if no message, show nothing
  if (!responseMessage) return null;

  const children = (
    <div
      onClick={handleCloseResponseModal}
      className={`modal-background fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4 ${successResult !== null ? "animate-fadeIn" : "animate-fadeOut"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-60 min-w-full flex-col overflow-hidden rounded-3xl bg-white"
      >
        <div
          className={`modal-header relative w-full flex-[2_0_33%] ${bgColor}`}
          style={{
            backgroundImage: bgImg,
            backgroundPosition: "center",
            backgroundSize: "35px 35px",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between px-2 py-4">
          <h2 className="text-2xl font-bold">{status}</h2>
          <p
            className={`rounded-md ${messageBg} px-3 py-1 text-center text-sm font-bold ${msgColor} opacity-90`}
          >
            {responseMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleCloseResponseModal}
              className={`flex items-center rounded-md border-[1px] ${closeBtnBg} px-4 py-2 align-middle text-white`}
            >
              <div className="flex items-center justify-center">
                {/* <IoIosClose size={20} className="mt-[2px]" /> */}
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
  return responseMessage && createPortal(children, modalContainer);
}
