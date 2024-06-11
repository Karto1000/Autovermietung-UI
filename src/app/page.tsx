'use client'

import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/navbar";
import Layout from "../../components/layout";
import PageTitle from "../../components/pageTitle";

export default function Home() {
  const claims = useAuth();

  return claims && (
    <Layout>
      <PageTitle title={"Welcome Back"}/>
    </Layout>
  )
}
