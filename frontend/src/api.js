const API_URL = "http://127.0.0.1:8000";

export async function createUser(data) {
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users/`);
  return res.json();
}
