'use client';
import { useMemo } from 'react';

import { Card, CardHeader, CardContent, type CardProps } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
}

export default function ProjectPieChart({ title, ...other }: Props) {
  const chartSeries = useMemo(() => [70, 8, 22], []);
  const mdUp = useResponsive('up', 'md');

  const chartOptions = useChart({
    labels: ['JuniusApp', 'Shared with Investors', 'Available for Investors'],
    legend: {
      position: mdUp ? 'right' : 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetY: 0,
      itemMargin: {
        horizontal: 8,
        vertical: 5,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: value => `${value}%`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title || 'Project Shares Distribution'} />
      <CardContent>
        <Chart
          dir="ltr"
          type="pie"
          series={chartSeries}
          options={chartOptions}
          width="100%"
          height={400}
        />
      </CardContent>
    </Card>
  );
}
