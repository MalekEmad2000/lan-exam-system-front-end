import React from 'react';
import PropTypes from 'prop-types';
import styles from './Message.module.css';

export const MessageTypes = {
    ERROR: "error",
    SUCCESS: "success",
    WARNING: "warning",
}
const MessageModal = ({ title="Mobile Exam Maker", message, buttonMessage = "Ok",onButtonClicked , type}) => {
  const handleButtonClick = () => {
    onButtonClicked();
  };

  

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.message}>{message}</div>
          <button className={
            `${styles.button} ${
                type === MessageTypes.ERROR ? styles.errorButton : 
                (type === MessageTypes.SUCCESS ? styles.successButton : styles.warningButton)}`
        
        } onClick={handleButtonClick}>
            {buttonMessage}
          </button>
        
      </div>
    </div>
  );
};

MessageModal.propTypes = {
  message: PropTypes.string.isRequired,
  onButtonClicked: PropTypes.func.isRequired,
  type : PropTypes.oneOf(Object.values(MessageTypes)),
};

export default MessageModal;
