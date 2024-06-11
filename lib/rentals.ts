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

type SearchFilters = {
  start?: number,
  end?: number,
  carModel: string
}

export async function search(filters: SearchFilters): Promise<Rental[]> {
  const searchParams = new URLSearchParams()
  if (filters.start) searchParams.append("start", filters.start.toString())
  if (filters.end) searchParams.append("end", filters.end.toString())
  searchParams.append("carModel", filters.carModel)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals?${searchParams}`,
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