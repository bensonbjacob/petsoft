"use client";

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(
    signUp,
    undefined
  );
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);

  return (
    <form action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" required />
      </div>
      <div className="space-y-1 mb-4 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          required
        />
      </div>
      <div className="text-right">
        <AuthFormBtn type={type} />
        {signUpError && (
          <p className="text-red-500 text-sm mt-2">
            {signUpError.message}
          </p>
        )}
        {logInError && (
          <p className="text-red-500 text-sm mt-2">
            {logInError.message}
          </p>
        )}
      </div>
    </form>
  );
}
