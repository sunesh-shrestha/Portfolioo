import { useState, useEffect } from "react";
import { Link } from "react-router";
import auth from "../lib/auth-helper.js";
import { list, remove } from "./api-contact.js";

// /contacts - messages sent from the Contact Me form.
// Signed-in users can view. Admin can also Edit / Delete.
export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list({ t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setError("");
        setContacts(data);
      }
    });
    return () => abortController.abort();
  }, []);

  const deleteContact = (contactId) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    remove({ contactId }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setContacts(contacts.filter((c) => c._id !== contactId));
      }
    });
  };

  return (
    <section>
      <div className="db-header">
        <h1>Contact Messages</h1>
        <Link to="/contact" className="button">+ New Message</Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      {contacts.length === 0 && !error && <p>No messages yet.</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Message</th>
            {auth.isAdmin() && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.firstname}</td>
              <td>{contact.lastname}</td>
              <td>{contact.email}</td>
              <td>{contact.message}</td>
              {auth.isAdmin() && (
                <td className="card-actions">
                  <Link to={`/contacts/edit/${contact._id}`} className="button button-small">Edit</Link>
                  <button className="button button-small button-danger" onClick={() => deleteContact(contact._id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
