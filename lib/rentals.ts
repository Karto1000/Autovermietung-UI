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
  car: {
    id: number,
    brand: string,
    model: string,
    pricePerHour: number,
    picture: string
  },
  start: number,
  end: number
}

type SearchFilters = {
  start: number,
  end: number,
  carModel: string
}

export async function search(filters: SearchFilters): Promise<Rental[]> {
  const searchParams = new URLSearchParams()
  searchParams.append("start", filters.start.toString())
  searchParams.append("end", filters.end.toString())
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