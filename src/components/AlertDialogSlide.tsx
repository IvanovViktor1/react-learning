import { FC, Fragment, forwardRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { BlockOfLucturesProp } from "./contentBlock";

export type AlertDialogSlideProps = {
  title: string;
  dialogText: string;
  btnOkText: string;
  btnCancelText: string;
  onOk: (data: boolean) => void;
};
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = ({
  title,
  dialogText,
  btnOkText,
  btnCancelText,
  onOk,
}) => {
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onOk(false);
  };

  const handleOk = () => {
    setOpen(false);
    onOk(true);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{btnCancelText}</Button>
          <Button onClick={handleOk}>{btnOkText}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default AlertDialogSlide;
