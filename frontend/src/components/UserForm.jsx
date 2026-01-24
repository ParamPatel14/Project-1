import { useState } from "react";
import { createUser } from "../api";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const submit = async () => {
    await createUser({ email, name });
    alert("User created!");
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <button onClick={submit}>Create User</button>
    </div>
  );
}
