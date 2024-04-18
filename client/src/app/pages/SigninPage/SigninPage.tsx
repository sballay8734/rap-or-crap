import { SubmitHandler, useForm } from "react-hook-form"

import { MdOutlineMail } from "react-icons/md"
import { CiLock } from "react-icons/ci"
import { IoIosClose } from "react-icons/io"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSigninMutation } from "../../redux/features/auth/authApi"
import { useLazyFetchActiveGameQuery } from "../../redux/features/game/gameApi"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function SigninPage() {
  const [getActiveGame] = useLazyFetchActiveGameQuery()
  const [signin] = useSigninMutation()
  // const [fetchActiveGame] = useLazyFetchActiveGameQuery()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (signinData: FormData) => {
    try {
      const res = await signin(signinData)
      // * if ("data" in res) then it was successful
      if ("data" in res) {
        const activeGame = await getActiveGame("run")
        if ("data" in activeGame) {
          navigate("/home")
        }
      }
    } catch (error) {
      console.error("Something went wrong!")
    }
  }

  return (
    <div className="z-1 relative flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-white max-w-[800px] wide:py-20">
      <div className="top-8 flex h-1/5 items-center text-center text-7xl font-display tracking-wider mt-10 text-white">
        RAP OR CRAP
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-2/5 w-full flex-col max-w-[530px] wide:mb-16"
      >
        <div className="mb-4 flex h-16 w-full items-center gap-3 rounded-sm border-[2px] border-gray-700 bg-gray-900/20 pl-3 text-sm font-light text-gray-500 transition-all duration-300 focus-within:border-primary focus-within:text-primary">
          <MdOutlineMail size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-500 min-h-16"
            placeholder="Email"
            type="email"
            autoComplete="off"
            {...register("email", { required: "Email is required" })}
          />
        </div>
        <div className="mb-4 flex h-16 w-full items-center gap-3 rounded-sm border-[2px] border-gray-700 bg-gray-900/20 pl-3 text-sm font-light text-gray-500 transition-all duration-300 focus-within:border-primary focus-within:text-primary">
          <CiLock size={20} />
          <input
            className="h-full w-full bg-transparent tracking-wider placeholder:text-xs placeholder:text-gray-500 min-h-16"
            placeholder="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        <div className="flex justify-end">
          <button type="button" className="font-light text-sm text-primary">
            Forgot password
          </button>
        </div>
        {/* ERRORS */}
        <div className="flex h-8 flex-col items-start gap-1 py-4 text-xs text-error">
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
          className="mt-10 flex items-center justify-center rounded-sm bg-primary text-black py-3 h-16"
          type="submit"
        >
          SIGN IN
        </button>
      </form>
      <Link
        to="/auth/signup"
        className="absolute bottom-8 flex-grow font-light wide:bottom-16"
      >
        Don't have an account? <span className="text-primary">Sign up</span>
      </Link>
    </div>
  )
}
