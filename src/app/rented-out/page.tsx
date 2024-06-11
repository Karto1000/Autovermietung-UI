'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import styles from "../../../styles/pages/rented-out/page.module.scss"
import {useEffect, useState} from "react";
import {Rental, search} from "../../../lib/rentals";
import moment from "moment";

export default function RentedOut() {
  const [rentals, setRentals] = useState<Rental[]>([])

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentals = await search({
          start: 0,
          end: Math.floor(new Date().getTime() / 1000),
          carModel: ""
        })

        setRentals(rentals)
      } catch (e) {
        console.error(e)
        return
      }
    }

    fetchRentals()
  }, []);

  return (
    <Layout>
      <PageTitle title={"Rented out Cars"}>
        <button type={"button"} className={"btn btn-outline-success"}>Rent out a new Car</button>
      </PageTitle>
      <div className={styles.content}>
        <table className="table table-striped">
          <thead>
          <tr>
            <th scope="col">Car</th>
            <th scope="col">PPH (CHF)</th>
            <th scope="col">Total (CHF)</th>
            <th scope="col">Until</th>
            <th scope="col">By</th>
          </tr>
          </thead>
          <tbody>
          {
            rentals.map(rental => {
              const totalPrice = Math.floor((rental.end - rental.start) / 60 / 60) * rental.car.pricePerHour
              return (
                <tr>
                  <td>{rental.car.model}</td>
                  <td>{rental.car.pricePerHour}</td>
                  <td>{totalPrice}</td>
                  <td>{moment(rental.end * 1000).format("HH:mm DD.MM.YYYY")} ({Math.floor((rental.end - rental.start) / 86400)} Days)</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </Layout>
  )
}