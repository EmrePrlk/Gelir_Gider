import { type Options } from 'react-markdown';

import { type Theme, type SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface MarkdownProps extends Options {
  sx?: SxProps<Theme>;
}
