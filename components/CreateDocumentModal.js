import React, { useState } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";

export default function CreateDocumentModal({ showModal, onClose, onSave }) {
  const [input, setInput] = useState("");

  return (
    <Modal size="sm" active={showModal} toggler={onClose}>
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="outline-none w-full"
          placeholder="Enter name of document..."
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="blue" buttonType="link" onClick={onClose} ripple="dark">
          Cancel
        </Button>
        <Button color="blue" onClick={() => onSave(input)} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
}
