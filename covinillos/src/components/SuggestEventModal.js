import React from 'react';
import { Modal } from '@material-ui/core';


function SuggestEventModal({ open, onClose}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
        <div>
          <h2 id="simple-modal-title">Text in a modal</h2>
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
        </div>
    </Modal>
  );
}


export default SuggestEventModal;
