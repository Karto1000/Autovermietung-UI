'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {cancelRental, Rental, search} from "../../../lib/rentals";
import {Button} from "react-bootstrap";
import usePermissions from "../../../hooks/usePermissions";

export default function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const hasChecked = usePermissions("rent:car")

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentals = await search({carModel: ""})
        setRentals(rentals)
      } catch (e) {
        console.error(e)
        return
      }
    }

    fetchRentals()
  }, []);

  const onCancel = async (id: number) => {
    try {
      await cancelRental(id);
      setRentals([...rentals].filter(rental => rental.id !== id))
    } catch (e) {
      console.log(e)
    }
  }

  return hasChecked && (
    <Layout>
      <PageTitle title={"Currently Rented Cars"}/>
      <table className="table table-striped">
        <thead>
        <tr>
          <th scope="col">Car</th>
          <th scope="col">PPH (CHF)</th>
          <th scope="col">Total (CHF)</th>
          <th scope="col">Until</th>
          <th scope="col">By</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        {
          rentals.map(rental => {
            const totalPrice = Math.floor((rental.end - rental.start) / 60 / 60) * rental.car.pricePerHour
            return (
              <tr key={rental.id}>
                <td>{rental.car.brand} {rental.car.model}</td>
                <td>{rental.car.pricePerHour}</td>
                <td>{totalPrice}</td>
                <td>{moment(rental.end * 1000).format("HH:mm DD.MM.YYYY")} ({Math.floor((rental.end - rental.start) / 86400)} Days)</td>
                <td>{rental.car.firm.name}</td>
                <td><Button onClick={() => onCancel(rental.id)}>Cancel</Button></td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </Layout>
  )
}