import styles from "../styles/components/navbar.module.scss"
import useAuth from "../hooks/useAuth";
import {useLayoutEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

type Mapping = {
  [key: string]: {
    label: string,
    link: string
  }
}

const BUTTON_MAPPING: Mapping = {
  "rent:car": {
    label: "Rentals",
    link: "/rentals"
  },
  "create:car": {
    label: "Cars",
    link: "/cars"
  },
}

export default function Navbar() {
  const claims = useAuth();
  const router = useRouter();
  const pathname = usePathname()

  const switchPage = (link: string) => {
    router.push(link)
  }

  return claims && (
    <nav className={`navbar ${styles.navbar}`}>
      <form className={`${styles.buttons}`}>
        <button className={`btn btn-outline-success ${pathname === "/" ? styles.active : ''}`} type="button" onClick={() => switchPage("/")}>
          Home
        </button>
        {
          claims.permissions.map(p => {
            const mapping = BUTTON_MAPPING[p]

            if (!mapping) return

            return (
              <button key={p} className={`btn btn-outline-success ${pathname === mapping.link ? styles.active : ''}`}
                      type="button" onClick={() => switchPage(mapping.link)}>
                {mapping.label}
              </button>
            )
          })
        }
      </form>
    </nav>
  )
}