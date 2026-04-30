import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export default function AdminContacts() {
  const { API, authorizationToken } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/contacts`, {
        headers: { Authorization: authorizationToken },
        params: { search },
      });
      setContacts(response.data.contacts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken, search]);

  useEffect(() => {
    const id = setTimeout(() => {
      fetchContacts();
    }, 250);
    return () => clearTimeout(id);
  }, [fetchContacts]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
        Contact Messages
      </h1>

      <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-4 rounded-xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message"
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-dark-700 bg-zinc-50 dark:bg-dark-950"
        />
      </div>

      <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-zinc-500 dark:text-neutral-400">
            No contact messages found.
          </p>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-200 dark:border-dark-800">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Message</th>
                <th className="py-2">Received</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="align-top border-b border-zinc-100 dark:border-dark-900"
                >
                  <td className="py-2 pr-3 font-medium">{contact.username}</td>
                  <td className="py-2 pr-3">{contact.email}</td>
                  <td className="py-2 pr-3 whitespace-pre-wrap wrap-break-word max-w-xl">
                    {contact.message}
                  </td>
                  <td className="py-2">
                    {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
