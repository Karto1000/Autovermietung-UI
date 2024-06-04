import {JSX} from "react";
import Navbar from "./navbar";
import styles from "../styles/pages/layout.module.scss";

type Props = {
  children: JSX.Element[] | JSX.Element
}

export default function Layout(props: Props) {
  return (
    <div>
      <Navbar/>
      <div className={styles.body}>
        {props.children}
      </div>
    </div>
  )
}