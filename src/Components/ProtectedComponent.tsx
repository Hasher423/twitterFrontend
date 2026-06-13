import { Navigate, Outlet } from "react-router-dom";

type Props = {
  accessToken: string;
};

export default function ProtectedRoute({
  accessToken,
}: Props) {
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}