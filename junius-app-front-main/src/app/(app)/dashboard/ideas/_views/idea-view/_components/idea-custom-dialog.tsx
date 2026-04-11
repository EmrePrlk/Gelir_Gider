import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Dialog,
  Avatar,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import Iconify from 'src/components/iconify';

interface IdeaCustomDialogProps {
  title: string;
  content: string;
  ideaTitle: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
  confirmButtonColor: 'success' | 'error' | 'primary';
  icon: string;
  isLoading?: boolean;
}

export default function IdeaCustomDialog({
  title,
  content,
  ideaTitle,
  open,
  onClose,
  onConfirm,
  confirmButtonText,
  confirmButtonColor,
  icon,
  isLoading = false,
}: IdeaCustomDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center' }}>
        <Iconify
          icon={icon}
          width={24}
          sx={{ color: `${confirmButtonColor}.main`, mr: 2 }}
        />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
          {content}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }} src="/assets/images/idea_avatar.png" />
          <Box>
            <Typography variant="subtitle1">{ideaTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              Mastermind will be here
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color={confirmButtonColor}
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
