export type Place = {
  id: number,
  name: string,
  plz: number
}

export type PlaceDTO = {
  name: string,
  plz: number
}

export async function searchPlaces(q: string = ""): Promise<Place[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/places?q=${q}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const body = await response.json()

  if (!Array.isArray(body)) {
    throw new Error('The response is not an array.')
  }

  return body
}

export async function createPlace(place: PlaceDTO): Promise<Place> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/places`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(place)
    }
  )

  if (!response.ok) {
    throw new Error('An error occurred while creating the place.')
  }

  return await response.json()
}

export async function updatePlace(id: number, place: PlaceDTO): Promise<Place> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/places/${id}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(place)
    }
  )

  if (!response.ok) {
    throw new Error('An error occurred while updating the place.')
  }

  return await response.json()
}

export async function deletePlace(id: number): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/places/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('An error occurred while deleting the place.')
  }
}