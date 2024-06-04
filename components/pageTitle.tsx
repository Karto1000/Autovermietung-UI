import styles from "../styles/components/pageTitle.module.scss";

type Props = {
  title: string
}

export default function PageTitle(props: Props) {
  return (
    <div className={styles.pageTitle}>
      <h1>{props.title}</h1>
      <hr/>
    </div>
  )
}