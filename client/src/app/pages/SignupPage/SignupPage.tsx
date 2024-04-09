import { SubmitHandler, useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import { MdOutlineMail } from "react-icons/md"
import { CiLock } from "react-icons/ci"
import { IoIosClose } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { FaRegUser } from "react-icons/fa"
import { useSignupMutation } from "../../redux/features/auth/authApi"

interface FormData {
  email: string
  displayName: string
  password: string
  confirmPassword: string
}

// !FIXME: Form validation is not quite working properly. It only works after form has been submitted but not initially.
export default function SignupPage() {
  const [signup] = useSignupMutation()
  const navigate = useNavigate()
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const watchPassword = watch("password", undefined)

  const onSubmit: SubmitHandler<FormData> = async (signupData: FormData) => {
    try {
      const res = await signup(signupData)
      if ("data" in res) {
        navigate("/home")
      }
    } catch (error) {
      console.error("Something went wrong.")
    }
  }

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-4 px-8 text-white">
      <div className="flex h-1/6 items-start text-center text-4xl">Sign Up</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-3/6 w-full flex-col"
      >
        {/* EMAIL */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-primary focus-within:text-primary ${
            errors.email ? "border-error" : "border-gray-800"
          }`}
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
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-primary focus-within:text-primary ${
            errors.displayName ? "border-error" : "border-gray-800"
          }`}
        >
          <FaRegUser size={16} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="What should we call you?"
            type="text"
            autoComplete="off"
            maxLength={20}
            {...register("displayName", {
              required: "Display name is required"
            })}
          />
        </div>
        {/* PASSWORD */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-primary focus-within:text-primary ${
            errors.password ? "border-error" : "border-gray-800"
          }`}
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
                message: "Password must be at least 8 characters long"
              }
            })}
          />
        </div>
        {/* CONFIRM PASSWORD */}
        <div
          className={`mb-4 flex h-12 w-full items-center gap-3 rounded-sm border-[2px] bg-gray-900/20 pl-3 text-sm font-light text-gray-700 transition-all duration-300 focus-within:border-primary focus-within:text-primary ${
            errors.confirmPassword ? "border-error" : "border-gray-800"
          }`}
        >
          <CiLock size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-700"
            placeholder="Verify Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword || "Passwords must match"
            })}
          />
        </div>
        {/* ERRORS */}
        <div className="flex h-16 flex-col items-start gap-1 text-xs text-error">
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
          className="mt-2 flex items-center justify-center rounded-sm bg-primary text-black py-3 h-12"
          type="submit"
        >
          SIGN UP
        </button>
      </form>
      <p className="absolute bottom-8 flex-grow font-light">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary">
          Sign in
        </Link>
      </p>
    </div>
  )
}
