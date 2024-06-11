'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import {Button, Modal} from "react-bootstrap";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Car, CarDTO, createCar, searchCars} from "../../../lib/cars";
import styles from "../../../styles/pages/cars/page.module.scss";

export default function Cars() {
  const [isShowingCreateModal, setIsShowingCreateModal] = useState(false);
  const [carDTO, setCarDTO] = useState<CarDTO>();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await searchCars();
        setCars(cars);
      } catch (e) {
        console.error(e)
      }
    }

    fetchCars()
  }, [])

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!carDTO) return;

    try {
      const car = await createCar(carDTO);
      setIsShowingCreateModal(false);
      setCars([...cars, car]);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Layout>
      <PageTitle title={"Rentable Cars"}>
        <button type={"button"} className={"btn btn-outline-success"} onClick={() => {
          setIsShowingCreateModal(true);
        }}>Rent out a new Car
        </button>
      </PageTitle>

      <Modal show={isShowingCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Rentable Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onCreate} className={styles.carsForm}>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input type="text" className="form-control" id="model" value={carDTO?.model}
                     placeholder="Enter Model" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCarDTO({...carDTO, model: e.target.value} as CarDTO);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" className="form-control" id="brand" value={carDTO?.brand}
                     placeholder="Enter Brand" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCarDTO({...carDTO, brand: e.target.value} as CarDTO);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="pricePerHour">Price Per Hour</label>
              <input type="number" className="form-control" id="pricePerHour" value={carDTO?.pricePerHour}
                     placeholder="Enter Price Per Hour" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCarDTO({...carDTO, pricePerHour: Number(e.target.value)} as CarDTO);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="pricePerHour">Picture</label>
              <input type="file" className="form-control" id="picture" accept={"image/png"}
                     placeholder="Add Picture" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.item(0);

                if (!file) return;

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                  if (!e.target?.result) return;

                  // @ts-ignore
                  setCarDTO({...carDTO, picture: e.target.result.toString()});
                }
              }}/>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowingCreateModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <table className="table table-striped">
        <thead>
        <tr>
          <th scope="col">Model</th>
          <th scope="col">Brand</th>
          <th scope="col">PPH (CHF)</th>
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
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </Layout>
  )
}