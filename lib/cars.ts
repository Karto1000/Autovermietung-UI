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
  picture?: string
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