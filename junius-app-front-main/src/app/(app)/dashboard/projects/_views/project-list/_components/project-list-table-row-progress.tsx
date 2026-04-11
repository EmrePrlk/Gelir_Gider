import { Box, Chip, Button } from '@mui/material';

interface ParamsProps {
  progressValue?: string;
}

export default function ProjectListTableRowProgress({
  progressValue,
}: ParamsProps) {
  // TODO: remove this when we have a real value
  const value =
    progressValue ?? `${Math.floor(Math.random() * (100 - 30 + 1) + 30)}%`;
  const color = getColorBg(value);
  const colorChip = getColorChip(value);

  const numericValue = Number.parseInt(value, 10);

  const chipWidth = Math.max((numericValue / 100) * 80, 10); // 80px is total button width

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          height: '6px',
          width: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: color,
          '&:hover': {
            backgroundColor: color,
          },
        }}
        aria-label={`Project progress: ${value}`}
      >
        <Chip
          sx={{
            ml: '-12px',
            height: '10px',
            width: `${chipWidth}px`,
            backgroundColor: colorChip,
          }}
        />
      </Button>
      {value}
    </Box>
  );
}

export const getColorBg = (value: string) => {
  const numericColor = Number.parseFloat(value.replace('%', ''));
  if (numericColor >= 75 && numericColor <= 100)
    return 'rgba(34, 197, 94, 0.24)';
  if (numericColor >= 50 && numericColor <= 75)
    return 'rgba(128, 0, 128, 0.24)';
  if (numericColor >= 25 && numericColor <= 50)
    return 'rgba(255, 165, 0, 0.24)';
  return 'rgba(255, 0, 0, 0.24)';
};
export const getColorChip = (value: string) => {
  const numericColorChip = Number.parseFloat(value.replace('%', ''));
  if (numericColorChip >= 75 && numericColorChip <= 100)
    return 'rgba(34, 197, 94, 0.24)';
  if (numericColorChip >= 50 && numericColorChip <= 75)
    return 'rgba(128, 0, 128)';
  if (numericColorChip >= 25 && numericColorChip <= 50)
    return 'rgba(255, 165, 0)';
  return 'rgba(255, 0, 0, 0.24)';
};
