import {Car} from "./cars";

export type Rental = {
  id: number,
  user: {
    id: number,
    email: string,
    role: {
      id: number,
      name: string
    }
  },
  car: Car,
  start: number,
  end: number
}

export async function search(q: string = ""): Promise<Rental[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals?q=${q}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")

  const body = await response.json()

  if (!body) throw new Error("Body is empty")

  return body as Rental[]
}

export async function cancelRental(id: number): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals/${id}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    }
  )

  if (!response.ok) throw new Error("Response is not ok")
}