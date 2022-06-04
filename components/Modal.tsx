import { Box, Button } from "@mui/material";
import React from "react";
import styles from "../styles/Global.module.scss";

const Modal = ({
  onClose,
  children,
  closeOnOutsideClick = false,
}: React.PropsWithChildren<{
  onClose: (...args: any) => any;
  closeOnOutsideClick?: boolean;
}>) => {
  return (
    <div className={styles.modal}>
      <div
        className={styles.outside}
        onClick={() => {
          closeOnOutsideClick && onClose();
        }}
      ></div>
      <Box className={styles.content}>{children}</Box>
    </div>
  );
};

export default Modal;
