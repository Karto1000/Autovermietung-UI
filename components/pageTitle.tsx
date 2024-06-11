import styles from "../styles/components/pageTitle.module.scss";
import React from "react";

type Props = {
  title: string,
  children?: React.JSX.Element[] | React.JSX.Element
}

export default function PageTitle(props: Props) {
  return (
    <div className={styles.pageTitle}>
      <h1>{props.title}</h1>
      <div>{props.children}</div>
      <hr/>
    </div>
  )
}