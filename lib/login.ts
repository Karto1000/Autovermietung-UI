export type JWT = string;

export async function login(email: string, password: string): Promise<JWT> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

  if (!response.ok) {
    throw new Error("Failed Login")
  }

  const body = response.text()

  if (!body) {
    throw new Error("No Body Received")
  }

  return body;
}