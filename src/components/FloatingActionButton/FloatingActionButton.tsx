import React, { useState } from "react";
import './FloatingActionButton.css';

type Props = {
  onCreateUser: () => void;
  onDeactivateUser: () => void;
};

export default function FloatingActionButton({
  onCreateUser,
  onDeactivateUser,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fab-container">
      {open && (
        <div className="fab-menu">
          <button
            className="fab-menu-item"
            onClick={() => {
              onCreateUser();
              setOpen(false);
            }}
          >
            User anlegen
          </button>

          <button
            className="fab-menu-item"
            onClick={() => {
              onDeactivateUser();
              setOpen(false);
            }}
          >
            User deaktivieren
          </button>
        </div>
      )}

      <button
        className="fab-button"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "×" : "+"}
      </button>
    </div>
  );
}