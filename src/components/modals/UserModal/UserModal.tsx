import { useState } from "react";
import './UserModal.css'

type UserFormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
};

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>User anlegen</h2>

        <input
          placeholder="Vorname"
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />

        <input
          placeholder="Nachname"
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          type="date"
          value={form.birthDate}
          onChange={(e) =>
            setForm({ ...form, birthDate: e.target.value })
          }
        />

        <input
          placeholder="Handynummer"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <div className="modal-actions">
          <button onClick={onClose}>Abbrechen</button>
          <button onClick={() => onSubmit(form)}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}