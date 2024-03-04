// TODO: Flex grow and other not working as expected. NEED TO FINALIZE

export default function LoginPage() {
  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-4 px-8 text-white">
      {/* TODO: Replace this with logo */}
      <div className="top-8 flex flex-grow items-center text-center text-4xl">
        Rap or Crap?
      </div>
      {/* TODO: Replace this with React Hook Form  */}
      <form action="submit" className="flex w-full flex-grow flex-col">
        <input
          className="border-grey-500 mb-4 h-12 rounded-sm border-[2px] bg-gray-500 opacity-20"
          type="text"
          name=""
          id=""
        />
        <input
          className="border-grey-500 mb-4 h-12 rounded-sm border-[2px] bg-gray-500 opacity-20"
          type="text"
          name=""
          id=""
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <input type="checkbox" name="" id="" />
            <label>Remember me</label>
          </div>
          <button className="text-green-700">Forgot password</button>
        </div>
        <button className="mt-10 rounded-sm bg-green-700 py-3" type="submit">
          LOG IN
        </button>
      </form>
      <p className="absolute bottom-8 flex-grow">
        Don't have an account? <span className="text-green-700">Sign up</span>
      </p>
    </div>
  );
}
