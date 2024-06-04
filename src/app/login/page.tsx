'use client'

import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {login} from "../../../lib/login";
import {useRouter} from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt")

    if (!jwt) return;

    router.push("/")
  }, [router])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const jwt = await login(email, password);
      sessionStorage.setItem("jwt", jwt)
    } catch (e) {
      console.error(e)
    }

    router.push("/")
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input type="email" className="form-control" id="email" value={email} aria-describedby="emailHelp"
               placeholder="Enter email" onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value)
        }}/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" className="form-control" id="password" value={password} placeholder="Password"
               onChange={(e: ChangeEvent<HTMLInputElement>) => {
                 setPassword(e.target.value)
               }}/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}