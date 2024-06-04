'use client';

import {useEffect, useLayoutEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";

export type Claims = {
  iss: string,
  email: string,
  permissions: string[]
}

const decodeJWT = (jwt: string): Claims => {
  const decoded = jwtDecode(jwt)

  return <Claims>{
    iss: decoded.iss,
    //@ts-ignore
    email: decoded.email,
    //@ts-ignore
    permissions: decoded.permissions
  }
}

export default function useAuth(): Claims | undefined {
  const [claims, setClaims] = useState<Claims>()
  const router = useRouter()

  useLayoutEffect(() => {
    const jwt = sessionStorage.getItem("jwt")

    if (jwt) setClaims(decodeJWT(jwt))
    else router.push("/login")
  }, [router]);

  return claims
}