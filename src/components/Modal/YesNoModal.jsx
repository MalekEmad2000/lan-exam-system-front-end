import React from 'react';
import PropTypes from 'prop-types';
import styles from './YesNoModal.module.css';

const YesNoModal = ({ title, message, onYes, onNo, onCancel }) => {
  const handleYesClick = () => {
    onYes();
  };

  const handleNoClick = () => {
    onNo();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>{title}</div>
          <button className={styles.cancelButton} onClick={handleCancelClick}>
            X
          </button>
        </div>
        <div className={styles.modalMessage}>{message}</div>
        <div className={styles.modalButtons}>
          <button className={styles.yesButton} onClick={handleYesClick}>
            Yes
          </button>
          <button className={styles.noButton} onClick={handleNoClick}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

YesNoModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default YesNoModal;
