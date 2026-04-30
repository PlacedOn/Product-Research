import { Outlet } from "react-router";
import { EmployerStoreProvider } from "../lib/employerStore";

export function EmployerLayout() {
  return (
    <EmployerStoreProvider>
      <Outlet />
    </EmployerStoreProvider>
  );
}
