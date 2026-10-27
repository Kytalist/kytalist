"use client";

import { createContext, useContext } from "react";

export type AdminViewerRole = "admin" | "staff";

const AdminRoleContext = createContext<AdminViewerRole>("admin");

export const AdminRoleProvider = AdminRoleContext.Provider;

export function useAdminRole(): AdminViewerRole {
  return useContext(AdminRoleContext);
}
