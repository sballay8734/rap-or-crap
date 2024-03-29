import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSigninMutation } from "../../redux/auth/authApi";
import {
  CreatedUser,
  ModApiResponse,
  ModErrorResponse,
} from "../../../types/responsesFromServer";
import { setResponseMessage } from "../../redux/serverResponseSlice";
import { setUser } from "../../redux/UserSlice";
import { ImSpinner2 } from "react-icons/im";
import { isModErrorResponse } from "../../helpers/errorReform";
import { useLazyFetchActiveGameQuery } from "../../redux/GameHandling/gameHandlingApi";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SigninPage() {
  const [trigger, { isLoading }] = useSigninMutation();
  const [fetchActiveGame, { isError }] = useLazyFetchActiveGameQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (signinData: FormData) => {
    const res: ModApiResponse<CreatedUser> = await trigger(signinData);

    // * If failed signin
    if (isModErrorResponse(res)) {
      console.log("ERROR");
      dispatch(
        setResponseMessage({
          successResult: res.error.data.success,
          message: res.error.data.message,
        }),
      );
      return;
    }

    // * If successful signin
    dispatch(setUser(res.data.payload));
    dispatch(
      setResponseMessage({
        successResult: res.data.success,
        message: res.data.message,
      }),
    );

    // await fetchActiveGame();
    navigate("/home");
  };

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-4 px-8 text-white">
      {/* TODO: Replace this with logo */}
      <div className="top-8 flex h-1/5 items-center text-center text-4xl">
        Rap or Crap?
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-2/5 w-full flex-col"
      >
        <div className="mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600">
          <MdOutlineMail size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Email"
            type="email"
            autoComplete="off"
            {...register("email", { required: "Email is required" })}
          />
        </div>
        <div className="mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600">
          <CiLock size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        <div className="flex justify-between">
          <label className="flex cursor-pointer items-center gap-2 font-light text-gray-500">
            <input
              className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-green-600 accent-green-600 opacity-20 checked:opacity-100"
              type="checkbox"
              {...register("rememberMe")}
            />
            Remember me
          </label>
          <button type="button" className="font-light text-green-700">
            Forgot password
          </button>
        </div>
        {/* ERRORS */}
        <div className="flex h-8 flex-col items-start gap-1 py-4 text-xs text-red-500">
          {errors.email && (
            <span className="flex items-center">
              <IoIosClose size={16} /> {errors.email.message?.toString()}
            </span>
          )}
          {errors.password && (
            <span className="flex items-center">
              <IoIosClose size={16} /> {errors.password.message?.toString()}
            </span>
          )}
        </div>
        <button
          className="mt-10 flex items-center justify-center rounded-sm bg-green-700 py-3"
          type="submit"
        >
          {isLoading ? <ImSpinner2 className="animate-spin" /> : "LOG IN"}
        </button>
      </form>
      <Link to="/signup" className="absolute bottom-8 flex-grow">
        Don't have an account? <span className="text-green-700">Sign up</span>
      </Link>
    </div>
  );
}
