'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Car, rentCar, RentDTO, searchNotRentedCars} from "../../../lib/cars";
import {Button, Modal} from "react-bootstrap";
import usePermissions from "../../../hooks/usePermissions";
import toast from "react-hot-toast";

export default function RentCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isRentModalShown, setIsRentModalShown] = useState(false);
  const [rentingCar, setRentingCar] = useState<Car>();
  const [rentDTO, setRentDTO] = useState<{ start?: number, end?: number }>();
  const hasChecked = usePermissions("rent:car")
  const [query, setQuery] = useState("")

  useEffect(() => {
    // Debounce the search
    const timeout = setTimeout(() => {
      const fetchCars = async () => {
        try {
          const cars = await searchNotRentedCars(query);
          setCars(cars);
        } catch (e) {
          console.error(e)
        }
      }

      fetchCars()
    }, 100)

    return () => clearTimeout(timeout)
  }, [query])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()

    if (!rentDTO?.start || !rentDTO.end) return;
    if (rentDTO.start >= rentDTO.end) return;

    try {
      await rentCar(rentDTO as RentDTO, id)
      setCars([...cars].filter(car => car.id !== id))
      setIsRentModalShown(false)
      toast.success("Car rented successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to rent car")
    }
  }

  return hasChecked && (
    <Layout>
      <PageTitle title={"Rent new Cars"}/>

      <Modal show={isRentModalShown} onHide={() => setIsRentModalShown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rent {rentingCar?.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={"modalForm"} onSubmit={(e) => {
            if (!rentingCar) return;

            onSubmit(e, rentingCar.id)
          }
          }>
            <div className="form-group">
              <label htmlFor="start">Start</label>
              <input id="start" className="form-control" type="date"
                     onChange={(e: ChangeEvent<HTMLInputElement>) => setRentDTO({
                       ...rentDTO,
                       start: new Date(e.target.value).getTime() / 1000
                     })}/>
            </div>
            <div className="form-group">
              <label htmlFor="end">End</label>
              <input id="end" className="form-control" type="date"
                     onChange={(e: ChangeEvent<HTMLInputElement>) => setRentDTO({
                       ...rentDTO,
                       end: new Date(e.target.value).getTime() / 1000
                     })}/>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsRentModalShown(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex flex-column gap-2">
        <input type={"text"} id="search" className="form-control" onChange={(e) => setQuery(e.target.value)}
               value={query}/>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col">Brand</th>
            <th scope="col">PPH (CHF)</th>
            <th scope="col">By</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          {
            cars.map(car => {
              return (
                <tr key={car.id}>
                  <td>{car.model}</td>
                  <td>{car.brand}</td>
                  <td>{car.pricePerHour}</td>
                  <td>{car.firm.name}</td>
                  <td>
                    <Button
                      variant={"outline-primary"}
                      onClick={(e) => {
                        setRentingCar(car)
                        setIsRentModalShown(true)
                      }}>
                      Rent
                    </Button>
                  </td>
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