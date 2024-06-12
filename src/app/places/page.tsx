'use client'

import usePermissions from "../../../hooks/usePermissions";
import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {createPlace, deletePlace, getAllPlaces, Place, PlaceDTO} from "../../../lib/place";

export default function Places() {
  const hasChecked = usePermissions("create:place")
  const [places, setPlaces] = useState<Place[]>([])
  const [isCreateModalShown, setIsCreateModalShown] = useState<boolean>(false)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const places = await getAllPlaces()
        setPlaces(places)
      } catch (e) {
        console.error(e)
      }
    }

    fetchPlaces()
  }, []);

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    try {
      await deletePlace(id)
      setPlaces(places.filter(place => place.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = (e.target as any).name.value
    const plz = parseInt((e.target as any).plz.value)

    if (!name || !plz) return

    const creatingPlace: PlaceDTO = {
      name: name,
      plz: plz
    }

    try {
      const place = await createPlace(creatingPlace)
      setPlaces([...places, place])
      setIsCreateModalShown(false)
    } catch (e) {
      console.error(e)
    }
  }

  return hasChecked && (
    <Layout>
      <PageTitle title={"Places"}>
        <button type={"button"} className={"btn btn-outline-success"} onClick={() => setIsCreateModalShown(true)}>
          Create new Place
        </button>
      </PageTitle>

      <Modal show={isCreateModalShown} onHide={() => setIsCreateModalShown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create new Place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="modalForm" onSubmit={onCreate}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name"/>
            </div>
            <div className="form-group">
              <label htmlFor="plz">Plz</label>
              <input type="number" className="form-control" id="plz"/>
            </div>
            <Button variant={"primary"} type={"submit"}>Create</Button>
          </form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped">
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Plz</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        {
          places.map((place) => (
            <tr key={place.id}>
              <td>{place.name}</td>
              <td>{place.plz}</td>
              <td className="d-flex gap-2">
                <Button variant={"outline-danger"} onClick={(e) => onDelete(e, place.id)}>Delete</Button>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </Layout>
  )
}