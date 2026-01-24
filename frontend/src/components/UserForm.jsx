import { useState } from "react";
import { createUser } from "../api";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const submit = async () => {
    await createUser({ email, name });
    alert("User created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create User
        </h2>

        <input
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create User
        </button>
      </div>
    </div>
  );
}
