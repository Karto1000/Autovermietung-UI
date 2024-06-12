'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {cancelRental, Rental, search} from "../../../lib/rentals";
import {Button} from "react-bootstrap";
import usePermissions from "../../../hooks/usePermissions";
import toast from "react-hot-toast";
import {confirmAlert} from "react-confirm-alert";
import {confirm} from "../../../lib/utils";

export default function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [query, setQuery] = useState("")
  const hasChecked = usePermissions("rent:car")

  useEffect(() => {
    const debounced= setTimeout(() => {
      const fetchRentals = async () => {
        try {
          const rentals = await search(query)
          setRentals(rentals)
        } catch (e) {
          console.error(e)
          toast.error("Failed to fetch rentals")
          return
        }
      }

      fetchRentals()
    }, 100)

    return () => clearTimeout(debounced)
  }, [query]);

  const onCancel = async (id: number) => {
    try {
      await cancelRental(id);
      setRentals([...rentals].filter(rental => rental.id !== id))
      toast.success("Rental cancelled successfully")
    } catch (e) {
      console.log(e)
      toast.error("Failed to cancel rental")
    }
  }

  return hasChecked && (
    <Layout>
      <PageTitle title={"Currently Rented Cars"}/>

      <div className="d-flex flex-column gap-2">
        <input type={"text"} id="search" className="form-control" onChange={(e) => setQuery(e.target.value)}
               value={query}/>

        <table className="table">
          <thead>
          <tr>
            <th scope="col">Car</th>
            <th scope="col">PPH (CHF)</th>
            <th scope="col">Total (CHF)</th>
            <th scope="col">Duration</th>
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
                  <td>{moment(rental.start * 1000).format("DD.MM.YYYY")} - {moment(rental.end * 1000).format("DD.MM.YYYY")} ({Math.floor((rental.end - rental.start) / 86400)} Days)</td>
                  <td>{rental.car.firm.name}</td>
                  <td><Button variant={"outline-danger"} onClick={async () => {
                    if (!await confirm("Confirm to cancel", "Are you sure you want to cancel this rental?")) return;
                    await onCancel(rental.id)
                  }}>Cancel</Button></td>
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