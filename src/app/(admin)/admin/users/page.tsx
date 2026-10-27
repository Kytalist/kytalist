"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminSetUserPassword,
  adminUpdateUser,
} from "@/lib/api/adminApi";
import type { AdminUser, AdminUserRole } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";
import { deriveInitials, deriveLogoStyle } from "@/lib/visual";

const limit = 25;
const MIN_PASSWORD = 8;

const emptyForm = {
  email: "",
  name: "",
  password: "",
  role: "staff" as AdminUserRole,
};

const roleBadge: Record<AdminUserRole, string> = {
  admin: "bg-[#0B4650] text-white",
  staff: "bg-[#A3E4D7] text-[#0B4650]",
  user: "bg-[#0B4650]/8 text-[#0B4650]/75",
};

const roleFilters: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "user", label: "Users" },
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admins" },
];

const inputClass =
  "rounded-xl border border-[#0B4650]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[#0B4650] outline-none transition-colors placeholder:text-[#0B4650]/35 focus:border-[#0B4650]/35 focus:ring-4 focus:ring-[#0B4650]/5";

const pillInputClass =
  "min-w-[180px] flex-1 rounded-full border border-[#0B4650]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#0B4650] outline-none transition-colors placeholder:text-[#0B4650]/35 focus:border-[#0B4650]/35 focus:ring-4 focus:ring-[#0B4650]/5";

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [offset, setOffset] = useState(0);
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const [passwordFor, setPasswordFor] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [editFor, setEditFor] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const [res, all, admins, staff, users] = await Promise.all([
        adminListUsers(token, {
          ...(role ? { role } : {}),
          ...(q.trim() ? { q: q.trim() } : {}),
          limit,
          offset,
        }),
        adminListUsers(token, { limit: 1 }),
        adminListUsers(token, { role: "admin", limit: 1 }),
        adminListUsers(token, { role: "staff", limit: 1 }),
        adminListUsers(token, { role: "user", limit: 1 }),
      ]);
      setRows(res.data);
      setTotal(res.meta.total);
      setCounts({
        all: all.meta.total,
        admin: admins.meta.total,
        staff: staff.meta.total,
        user: users.meta.total,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [role, q, offset]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setQ(qDraft);
  }

  async function saveRole(id: string, nextRole: AdminUserRole) {
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminUpdateUser(token, id, { role: nextRole });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(id: string, email: string) {
    if (
      !globalThis.confirm(
        `Permanently delete user ${email}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminDeleteUser(token, id);
      setNotice(`Deleted ${email}.`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const name = form.name.trim();
      const created = await adminCreateUser(token, {
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        ...(name ? { name } : {}),
      });
      setNotice(`Created ${created.data.email} as ${created.data.role}.`);
      setForm(emptyForm);
      setShowCreate(false);
      setShowCreatePassword(false);
      setOffset(0);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create user");
    } finally {
      setCreating(false);
    }
  }

  async function onEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editFor) return;
    setSavingEdit(true);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const name = editForm.name.trim();
      await adminUpdateUser(token, editFor.id, {
        name: name || null,
        email: editForm.email.trim(),
      });
      setNotice(`Updated ${editForm.email.trim()}.`);
      setEditFor(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save changes");
    } finally {
      setSavingEdit(false);
    }
  }

  async function onSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordFor) return;
    setSavingPassword(true);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminSetUserPassword(token, passwordFor.id, newPassword);
      setNotice(`Password updated for ${passwordFor.email}.`);
      setPasswordFor(null);
      setNewPassword("");
      setShowNewPassword(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update password",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const stats = [
    {
      label: "Total users",
      value: counts["all"],
      icon: Users,
      tile: "bg-[#0B4650] text-white",
    },
    {
      label: "Admins",
      value: counts["admin"],
      icon: ShieldCheck,
      tile: "bg-[#F28F6B]/20 text-[#B4532A]",
    },
    {
      label: "Staff",
      value: counts["staff"],
      icon: BadgeCheck,
      tile: "bg-[#A3E4D7]/50 text-[#0B4650]",
    },
    {
      label: "Users",
      value: counts["user"],
      icon: Users,
      tile: "bg-[#0B4650]/8 text-[#0B4650]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">
            Team
          </p>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Users
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#0B4650]/65">
            Add staff, set passwords, and manage roles. Staff can only manage
            listings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            setShowCreatePassword(false);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#062E35]"
        >
          {showCreate ? (
            <X className="h-4 w-4" aria-hidden />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden />
          )}
          {showCreate ? "Close" : "Add user"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tile }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B4650]/8"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tile}`}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#0B4650]/55">{label}</p>
              <p className="font-display text-xl font-bold text-[#0B4650]">
                {value ?? "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showCreate ? (
        <form
          onSubmit={onCreate}
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B4650]/8 md:p-6"
        >
          <h2 className="font-display text-base font-bold text-[#0B4650]">
            New user
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
              Name <span className="font-medium text-[#0B4650]/45">(optional)</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-user-password"
                className="text-xs font-semibold text-[#0B4650]/70"
              >
                Password
              </label>
              <span className="relative block">
                <input
                  id="new-user-password"
                  type={showCreatePassword ? "text" : "password"}
                  required
                  minLength={MIN_PASSWORD}
                  autoComplete="new-password"
                  placeholder={`At least ${MIN_PASSWORD} characters`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`${inputClass} w-full pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword((v) => !v)}
                  aria-label={
                    showCreatePassword ? "Hide password" : "Show password"
                  }
                  title={showCreatePassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#0B4650]/45 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
                >
                  {showCreatePassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </span>
            </div>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
              Role
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as AdminUserRole })
                }
                className={inputClass}
              >
                <option value="staff">Staff (listings only)</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <form
          onSubmit={onSearch}
          className="relative flex min-w-[220px] flex-1 items-center"
        >
          <Search
            className="pointer-events-none absolute left-4 h-4 w-4 text-[#0B4650]/40"
            aria-hidden
          />
          <input
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            placeholder="Search by email or name"
            aria-label="Search users"
            className={`${pillInputClass} pl-11`}
          />
        </form>
        <div
          role="group"
          aria-label="Filter by role"
          className="flex items-center gap-1 rounded-full bg-white/80 p-1 ring-1 ring-[#0B4650]/10"
        >
          {roleFilters.map((f) => {
            const active = role === f.value;
            return (
              <button
                key={f.label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setOffset(0);
                  setRole(f.value);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#0B4650] text-white shadow-sm"
                    : "text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {notice ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl bg-[#A3E4D7]/35 px-4 py-3 text-sm font-semibold text-[#0B4650]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B8A6B]" aria-hidden />
          {notice}
        </div>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-2xl bg-[#FFE4C4]/70 px-4 py-3 text-sm font-semibold text-[#8C3F24]"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#0B4650]/8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/8 bg-[#F9F8F6]/70 text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b border-[#0B4650]/5">
                      <td colSpan={4} className="px-5 py-3">
                        <div className="h-9 animate-pulse rounded-xl bg-[#0B4650]/5" />
                      </td>
                    </tr>
                  ))
                : null}

              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center">
                    <Users
                      className="mx-auto h-8 w-8 text-[#0B4650]/25"
                      aria-hidden
                    />
                    <p className="mt-3 text-sm font-semibold text-[#0B4650]/70">
                      No users match these filters.
                    </p>
                  </td>
                </tr>
              ) : null}

              {!loading
                ? rows.map((row) => {
                    const logo = deriveLogoStyle(row.id);
                    const busy = busyId === row.id;
                    return (
                      <Fragment key={row.id}>
                        <tr className="border-b border-[#0B4650]/5 transition-colors hover:bg-[#F9F8F6]/60">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span
                                aria-hidden
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${logo.tint} ${logo.text}`}
                              >
                                {deriveInitials(row.name || row.email, 2)}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-[#0B4650]">
                                  {row.name ?? "No name"}
                                </p>
                                <p className="truncate text-xs text-[#0B4650]/60">
                                  {row.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <label className="sr-only" htmlFor={`role-${row.id}`}>
                              Role for {row.email}
                            </label>
                            <select
                              id={`role-${row.id}`}
                              value={row.role}
                              disabled={busy}
                              onChange={(e) =>
                                saveRole(row.id, e.target.value as AdminUserRole)
                              }
                              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold capitalize outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#0B4650]/30 disabled:opacity-50 ${roleBadge[row.role]}`}
                            >
                              <option value="user">User</option>
                              <option value="staff">Staff</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-[#0B4650]/60">
                            {formatJoined(row.createdAt)}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                  setEditFor(row);
                                  setEditForm({
                                    name: row.name ?? "",
                                    email: row.email,
                                  });
                                  setPasswordFor(null);
                                  setError(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B4650]/75 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] disabled:opacity-50"
                              >
                                <Pencil className="h-3.5 w-3.5" aria-hidden />
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                  setPasswordFor(row);
                                  setNewPassword("");
                                  setShowNewPassword(false);
                                  setEditFor(null);
                                  setError(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B4650]/75 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] disabled:opacity-50"
                              >
                                <KeyRound className="h-3.5 w-3.5" aria-hidden />
                                Password
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => removeUser(row.id, row.email)}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#B4532A] transition-colors hover:bg-[#F28F6B]/15 disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>

                        {editFor?.id === row.id ? (
                          <tr className="border-b border-[#0B4650]/5 bg-[#F9F8F6]/70">
                            <td colSpan={4} className="px-5 py-4">
                              <form
                                onSubmit={onEdit}
                                className="flex flex-wrap items-center gap-3"
                              >
                                <label className="sr-only" htmlFor={`name-${row.id}`}>
                                  Name for {row.email}
                                </label>
                                <input
                                  id={`name-${row.id}`}
                                  placeholder="Name"
                                  maxLength={120}
                                  value={editForm.name}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                  }
                                  className={pillInputClass}
                                />
                                <label className="sr-only" htmlFor={`email-${row.id}`}>
                                  Email for {row.email}
                                </label>
                                <input
                                  id={`email-${row.id}`}
                                  type="email"
                                  required
                                  placeholder="Email"
                                  value={editForm.email}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, email: e.target.value })
                                  }
                                  className={pillInputClass}
                                />
                                <button
                                  type="submit"
                                  disabled={savingEdit}
                                  className="rounded-full bg-[#0B4650] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-60"
                                >
                                  {savingEdit ? "Saving…" : "Save changes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditFor(null)}
                                  className="rounded-full px-3 py-2 text-xs font-semibold text-[#0B4650]/70 hover:bg-[#0B4650]/8"
                                >
                                  Cancel
                                </button>
                              </form>
                            </td>
                          </tr>
                        ) : null}

                        {passwordFor?.id === row.id ? (
                          <tr className="border-b border-[#0B4650]/5 bg-[#F9F8F6]/70">
                            <td colSpan={4} className="px-5 py-4">
                              <form
                                onSubmit={onSetPassword}
                                className="flex flex-wrap items-center gap-3"
                              >
                                <label className="sr-only" htmlFor={`pw-${row.id}`}>
                                  New password for {row.email}
                                </label>
                                <div className="relative min-w-[220px] flex-1">
                                  <input
                                    id={`pw-${row.id}`}
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    minLength={MIN_PASSWORD}
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder={`New password (at least ${MIN_PASSWORD} characters)`}
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                    className={`${pillInputClass} w-full pr-11`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword((v) => !v)}
                                    aria-label={
                                      showNewPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                    title={
                                      showNewPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#0B4650]/45 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
                                  >
                                    {showNewPassword ? (
                                      <EyeOff
                                        className="h-4 w-4"
                                        aria-hidden
                                      />
                                    ) : (
                                      <Eye className="h-4 w-4" aria-hidden />
                                    )}
                                  </button>
                                </div>
                                <button
                                  type="submit"
                                  disabled={savingPassword}
                                  className="rounded-full bg-[#0B4650] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-60"
                                >
                                  {savingPassword ? "Saving…" : "Save password"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPasswordFor(null);
                                    setNewPassword("");
                                    setShowNewPassword(false);
                                  }}
                                  className="rounded-full px-3 py-2 text-xs font-semibold text-[#0B4650]/70 hover:bg-[#0B4650]/8"
                                >
                                  Cancel
                                </button>
                              </form>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {total > limit ? (
        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0B4650]">
          <button
            type="button"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#0B4650]/10 transition-colors hover:bg-[#F9F8F6] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous
          </button>
          <span className="text-xs text-[#0B4650]/60">
            {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
          <button
            type="button"
            disabled={offset + limit >= total}
            onClick={() => setOffset((o) => o + limit)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#0B4650]/10 transition-colors hover:bg-[#F9F8F6] disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
