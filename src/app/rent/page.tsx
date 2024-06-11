'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Car, rentCar, RentDTO, searchNotRentedCars} from "../../../lib/cars";
import {Button, Modal} from "react-bootstrap";

export default function RentCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isRentModalShown, setIsRentModalShown] = useState(false);
  const [rentingCar, setRentingCar] = useState<Car>();
  const [rentDTO, setRentDTO] = useState<{ start?: number, end?: number }>();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await searchNotRentedCars();
        setCars(cars);
      } catch (e) {
        console.error(e)
      }
    }

    fetchCars()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()

    if (!rentDTO?.start || !rentDTO.end) return;
    if (rentDTO.start >= rentDTO.end) return;

    try {
      await rentCar(rentDTO as RentDTO, id)
      setCars([...cars].filter(car => car.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
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

      <table className="table table-striped">
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
                  <Button onClick={(e) => {
                    setRentingCar(car)
                    setIsRentModalShown(true)
                  }
                  }>
                    Rent
                  </Button>
                </td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </Layout>
  )
}