// UnauthenticatedView.tsx
import { Navigate, Outlet } from "react-router-dom"

export default function UnauthenticatedView() {
  return (
    <div className="container flex h-full w-full items-center justify-center relative z-1">
      <Navigate to="/auth/signin" replace />
      <Outlet />
    </div>
  )
}
