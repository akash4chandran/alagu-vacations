"use client";

import { useActionState } from "react";
import { signIn } from "@/actions/admin";
import { SubmitButton, adminInput, adminLabel } from "@/components/admin/forms";

export function LoginForm() {
  const [state, action] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className={adminLabel}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className={adminInput} />
      </div>
      <div>
        <label htmlFor="password" className={adminLabel}>Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={adminInput} />
      </div>
      {state && !state.ok && <p role="alert" className="text-sm text-red-700">{state.message}</p>}
      <SubmitButton className="w-full py-3">Sign in</SubmitButton>
    </form>
  );
}
