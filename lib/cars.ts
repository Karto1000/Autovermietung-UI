export type CarDTO = {
  brand: string,
  model: string,
  pricePerHour: number,
  picture?: string
}

export type Car = {
  id: number,
  brand: string,
  model: string,
  pricePerHour: number,
  picture?: string,
  firm: {
    id: number,
    name: string,
    place: {
      id: number,
      name: string,
      plz: number
    }
  }
}

export type RentDTO = {
  start: number,
  end: number
}

export async function createCar(car: CarDTO): Promise<Car> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`,
    {
      method: "POST",
      body: JSON.stringify(car),
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
        "Content-Type": "application/json"
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")

  const body = await response.json()

  if (!body) throw new Error("Body is empty")

  return body as Car
}

export async function updateCar(car: CarDTO, id: number): Promise<Car> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(car),
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
        "Content-Type": "application/json"
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")

  const body = await response.json()

  if (!body) throw new Error("Body is empty")

  return body as Car
}

export async function searchCars(): Promise<Car[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars?brand=&model=`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")

  const body = await response.json()

  if (!body) throw new Error("Body is empty")

  return body as Car[]
}

export async function searchNotRentedCars(): Promise<Car[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/not-rented?brand=&model=`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")

  const body = await response.json()

  if (!body) throw new Error("Body is empty")

  return body as Car[]
}

export async function deleteCar(id: number): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")
}

export async function rentCar(rentDTO: RentDTO, id: number): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}/rent`,
    {
      method: "POST",
      body: JSON.stringify(rentDTO),
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
        "Content-Type": "application/json"
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")
}