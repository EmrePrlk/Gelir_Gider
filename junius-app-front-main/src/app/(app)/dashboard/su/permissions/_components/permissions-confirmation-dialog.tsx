import {
  Dialog,
  Button,
  Typography,
  DialogContent,
  DialogActions,
} from '@mui/material';

type DialogBoxProps = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
};

export default function PermissionsConfirmationDialog({
  open,
  handleClose,
  handleSubmit,
  isSubmitting,
}: DialogBoxProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography variant="h6" color="text.primary" mt={3}>
          Are you sure you want to update the role?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          autoFocus
          variant="contained"
          color="warning"
          disabled={isSubmitting}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
