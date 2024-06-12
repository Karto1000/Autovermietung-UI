'use client'

import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import {Button, Modal} from "react-bootstrap";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Car, CarDTO, createCar, deleteCar, searchCars, updateCar} from "../../../lib/cars";
import toast from "react-hot-toast";
import {confirm} from "../../../lib/utils";

export default function Cars() {
  const [isShowingCreateModal, setIsShowingCreateModal] = useState<boolean>(false);
  const [isShowingEditModal, setIsShowingEditModal] = useState<boolean>(false);

  const [creatingCarDTO, setCreatingCarDTO] = useState<CarDTO>();
  const [editingCar, setEditingCar] = useState<Car>();

  const [cars, setCars] = useState<Car[]>([]);

  const [query, setQuery] = useState("")

  useEffect(() => {
    const debounce = setTimeout(() => {
      const fetchCars = async () => {
        try {
          const cars = await searchCars(query);
          setCars(cars);
        } catch (e) {
          console.error(e)
        }
      }

      fetchCars()
    }, 100)

    return () => clearTimeout(debounce)
  }, [query])

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!creatingCarDTO) return;

    try {
      const car = await createCar(creatingCarDTO);
      setIsShowingCreateModal(false);
      setCars([...cars, car]);
      setCreatingCarDTO(undefined)
      toast.success("Car created successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to create car")
    }
  }

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault()

    try {
      await deleteCar(id);
      setCars([...cars].filter(car => car.id !== id))
      toast.success("Car deleted successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete car")
    }
  }

  const onEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!editingCar) return;

    try {
      const car = await updateCar(editingCar as CarDTO, editingCar.id);
      setIsShowingEditModal(false);
      setCars([...cars].map(c => c.id === car.id ? car : c));
      setEditingCar(undefined)
      toast.success("Car updated successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to update car")
    }

  }

  return (
    <Layout>
      <PageTitle title={"Rentable Cars"}>
        <button type={"button"} className={"btn btn-outline-success"} onClick={() => setIsShowingCreateModal(true)}>Rent
          out a new Car
        </button>
      </PageTitle>

      <Modal show={isShowingCreateModal} onHide={() => setIsShowingCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Rentable Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onCreate} className="modalForm">
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input type="text" className="form-control" id="model" value={creatingCarDTO?.model}
                     placeholder="Enter Model" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCreatingCarDTO({...creatingCarDTO, model: e.target.value} as CarDTO);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" className="form-control" id="brand" value={creatingCarDTO?.brand}
                     placeholder="Enter Brand" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCreatingCarDTO({...creatingCarDTO, brand: e.target.value} as CarDTO);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="pricePerHour">Price Per Hour</label>
              <input type="number" className="form-control" id="pricePerHour" value={creatingCarDTO?.pricePerHour}
                     placeholder="Enter Price Per Hour" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCreatingCarDTO({...creatingCarDTO, pricePerHour: Number(e.target.value)} as CarDTO);
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
                  setCreatingCarDTO({...creatingCarDTO, picture: e.target.result.toString()});
                }
              }}/>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={isShowingEditModal} onHide={() => setIsShowingEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onEdit} className="modalForm">
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input type="text" className="form-control" id="model" value={editingCar?.model}
                     placeholder="Enter Model" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditingCar({...editingCar, model: e.target.value} as Car);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" className="form-control" id="brand" value={editingCar?.brand}
                     placeholder="Enter Brand" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditingCar({...editingCar, brand: e.target.value} as Car);
              }}/>
            </div>

            <div className="form-group">
              <label htmlFor="pricePerHour">Price Per Hour</label>
              <input type="number" className="form-control" id="pricePerHour" value={editingCar?.pricePerHour}
                     placeholder="Enter Price Per Hour" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditingCar({...creatingCarDTO, pricePerHour: Number(e.target.value)} as Car);
              }}/>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="d-flex gap-2 flex-column">
        <input type={"text"} id="search" className="form-control" onChange={(e) => setQuery(e.target.value)}
               value={query}/>

        <table className="table">
          <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col">Brand</th>
            <th scope="col">PPH (CHF)</th>
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
                  <td className="d-flex gap-2">
                    <Button variant={"outline-danger"} onClick={async (e) => {
                      if (!await confirm("Confirm Delete", "Are you sure you want to delete this car?")) return;
                      await onDelete(e, car.id)}
                    }>Delete</Button>
                    <Button variant={"outline-primary"} onClick={(e) => {
                      setIsShowingEditModal(true)
                      setEditingCar(car)
                    }}>Edit</Button>
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