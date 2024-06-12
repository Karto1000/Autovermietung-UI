import '../../styles/globals.scss';
import "bootstrap/dist/css/bootstrap.min.css"
import {Inter} from 'next/font/google'
import React from "react";
import {Toaster} from "react-hot-toast";
import 'react-confirm-alert/src/react-confirm-alert.css';

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Autovermietung',
  description: 'Autovermietung',
}

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <Toaster
      position={"top-right"}
      />
    {children}
    </body>
    </html>
  )
}
