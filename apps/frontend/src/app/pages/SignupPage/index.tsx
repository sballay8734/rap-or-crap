import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { setResponseMessage } from "../../redux/serverResponseSlice";
import { setUser } from "../../redux/UserSlice";
import {
  ModApiResponse,
  ModErrorResponse,
} from "../../../types/responsesFromServer";
import { CreatedUser } from "../../../types/responsesFromServer";
import { useSignupMutation } from "../../redux/auth/authApi";
import { ImSpinner2 } from "react-icons/im";
import { isModErrorResponse } from "../../helpers/errorReform";

interface FormData {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

// !FIXME: Form validation is not quite working properly. It only works after form has been submitted but not initially.
export default function SignupPage() {
  const [trigger, { isLoading, isError }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const watchPassword = watch("password", undefined);

  const onSubmit: SubmitHandler<FormData> = async (signupData: FormData) => {
    const res: ModApiResponse<CreatedUser> = await trigger(signupData);

    // * If failed signup
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

    // * If successful signup
    dispatch(setUser(res.data.payload));
    dispatch(
      setResponseMessage({
        successResult: res.data.success,
        message: res.data.message,
      }),
    );
    navigate("/home");
  };

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-4 px-8 text-white">
      <div className="flex h-1/6 items-start text-center text-4xl">Sign Up</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-3/6 w-full flex-col"
      >
        {/* EMAIL */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600 ${errors.email && "border-red-500"}`}
        >
          <MdOutlineMail size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Email"
            type="email"
            autoComplete="off"
            {...register("email", { required: "Email is required" })}
          />
        </div>
        {/* WHAT SHOULD WE CALL YOU? */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600 ${errors.displayName && "border-red-500"}`}
        >
          <FaRegUser size={16} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="What should we call you?"
            type="text"
            autoComplete="off"
            maxLength={20}
            {...register("displayName", {
              required: "Display name is required",
            })}
          />
        </div>
        {/* PASSWORD */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600 ${errors.password && "border-red-500"}`}
        >
          <CiLock size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Password"
            type="password"
            minLength={8}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
        </div>
        {/* CONFIRM PASSWORD */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] border-gray-800 bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-green-600 focus-within:text-green-600 ${errors.confirmPassword && "border-red-500"}`}
        >
          <CiLock size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Verify Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword || "Passwords must match",
            })}
          />
        </div>
        {/* ERRORS */}
        <div className="flex h-16 flex-col items-start gap-1 text-xs text-red-500">
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
          {errors.confirmPassword && (
            <span className="flex items-center">
              <IoIosClose size={16} />{" "}
              {errors.confirmPassword.message?.toString()}
            </span>
          )}
        </div>
        <button
          className="mt-2 flex items-center justify-center rounded-sm bg-green-700 py-3"
          type="submit"
        >
          {isLoading ? <ImSpinner2 className="animate-spin" /> : "SIGN UP"}
        </button>
      </form>
      <p className="absolute bottom-8 flex-grow">
        Already have an account?{" "}
        <Link to="/signin" className="text-green-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
