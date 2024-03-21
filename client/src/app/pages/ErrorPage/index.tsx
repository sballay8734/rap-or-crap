import { useRouteError } from "react-router-dom";

interface IError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as IError;
  console.error(error);

  const defaultErrorMessage = "An error occurred. Please try again later.";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i className="text-red-500">
          {error?.statusText || error?.message || defaultErrorMessage}
        </i>
      </p>
    </div>
  );
}
