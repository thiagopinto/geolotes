"use client";

import { AuthContext } from "@/app/providers/AuthContext";
import { useContext, useState } from "react";
import { logout } from "../../login/actions";
import { getSession, getUser } from "@/app/lib/auth";
import { IAuthResponse, IUser } from "@/app/interfaces/auth";

export default function FormProfile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [session, setSession] = useState<IAuthResponse | null>(null);
  const value = useContext(AuthContext);

  const fetchData = async () => {
    setUser(await getUser());
    setSession(await getSession())
  };

  return (
    <div className="flex-col">
      {user && <pre className="flex">{JSON.stringify(user, null, 2)}</pre>}

      {session && (
        <pre className="flex">{JSON.stringify(session, null, 2)}</pre>
      )}

      <button className="btn-primary" onClick={fetchData}>
        Fetch Data with Auth {value}
      </button>

      <form action={logout}>
        <button className="btn-primary" type="submit">
          logout
        </button>
      </form>
    </div>
  );
}
