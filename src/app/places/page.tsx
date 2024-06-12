'use client'

import usePermissions from "../../../hooks/usePermissions";
import Layout from "../../../components/layout";
import PageTitle from "../../../components/pageTitle";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {createPlace, deletePlace, searchPlaces, Place, PlaceDTO, updatePlace} from "../../../lib/place";
import toast from "react-hot-toast";
import {confirm} from "../../../lib/utils";

export default function Places() {
  const hasChecked = usePermissions("create:place")
  const [places, setPlaces] = useState<Place[]>([])

  const [isCreateModalShown, setIsCreateModalShown] = useState<boolean>(false)
  const [isEditModalShown, setIsEditModalShown] = useState<boolean>(false)

  const [creatingPlaceDTO, setCreatingPlaceDTO] = useState<PlaceDTO>({name: "", plz: 0})
  const [editingPlace, setEditingPlace] = useState<Place>()

  const [query, setQuery] = useState("")

  useEffect(() => {
    const debounce = setTimeout(() => {
      const fetchPlaces = async () => {
        try {
          const places = await searchPlaces(query)
          setPlaces(places)
        } catch (e) {
          console.error(e)
        }
      }

      fetchPlaces()
    }, 100)

    return () => clearTimeout(debounce)
  }, [query]);

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    try {
      await deletePlace(id)
      setPlaces(places.filter(place => place.id !== id))
      toast.success("Place deleted successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete place")
    }
  }

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const place = await createPlace(creatingPlaceDTO)
      setPlaces([...places, place])
      setIsCreateModalShown(false)
      setCreatingPlaceDTO({name: "", plz: 0})
      toast.success("Place created successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to create place")
    }
  }

  const onEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!editingPlace) return;
    if (!editingPlace.name || !editingPlace.plz) return

    try {
      const place = await updatePlace(editingPlace.id, editingPlace)
      setPlaces(places.filter(p => p.id !== place.id).concat(place))
      setIsEditModalShown(false)
      setEditingPlace(undefined)
      toast.success("Place updated successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to update place")
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
              <input type="text" className="form-control" id="name" value={creatingPlaceDTO?.name} onChange={(e) => {
                setCreatingPlaceDTO({
                  ...creatingPlaceDTO,
                  name: e.target.value
                } as PlaceDTO)
              }}/>
            </div>
            <div className="form-group">
              <label htmlFor="plz">Plz</label>
              <input type="number" className="form-control" id="plz" value={creatingPlaceDTO?.plz} onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;

                setCreatingPlaceDTO({
                  ...creatingPlaceDTO,
                  plz: Number(e.target.value)
                } as PlaceDTO)
              }}/>
            </div>
            <Button variant={"primary"} type={"submit"}>Create</Button>
          </form>
        </Modal.Body>
      </Modal>

      {
        editingPlace ?
          <Modal show={isEditModalShown} onHide={() => setIsEditModalShown(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create new Place</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="modalForm" onSubmit={onEdit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" className="form-control" id="name" value={editingPlace.name} onChange={(e) => {
                    setEditingPlace({...editingPlace, name: e.target.value})
                  }}/>
                </div>
                <div className="form-group">
                  <label htmlFor="plz">Plz</label>
                  <input type="number" className="form-control" id="plz" value={editingPlace.plz} onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    setEditingPlace({...editingPlace, plz: Number(e.target.value)})
                  }}/>
                </div>
                <Button variant={"primary"} type={"submit"}>Save</Button>
              </form>
            </Modal.Body>
          </Modal>
          :
          <></>
      }

      <div className="d-flex flex-column gap-2">
        <input type={"text"} id="search" className="form-control" onChange={(e) => setQuery(e.target.value)}
               value={query}/>

        <table className="table">
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
                  <Button variant={"outline-danger"} onClick={async (e) => {
                    if (!await confirm("Confirm Delete", "Are you sure you want to delete this place?")) return;
                    await onDelete(e, place.id)}
                  }>Delete</Button>
                  <Button variant={"outline-primary"} onClick={(e) => {
                    setIsEditModalShown(true)
                    setEditingPlace(place)
                  }}>Edit</Button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </Layout>
  )
}