import React, { useMemo } from 'react';

import { Card, CardHeader, CardContent, type CardProps } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface ChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface Props extends CardProps {
  title?: string;
}

export default function ProjectBurndownChart({ title, ...other }: Props) {
  const chartData = useMemo<ChartData>(() => {
    const startDate = new Date('2024-06-01');
    const totalDays = 30;
    const totalTasks = 100;

    const categories = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    });

    const idealBurndown = Array.from({ length: totalDays }, (_, i) =>
      Math.round((totalTasks * (totalDays - i)) / totalDays),
    );

    const actualBurndown = [
      100, 98, 95, 93, 90, 88, 85, 83, 80, 78, 75, 73, 70, 68, 65, 63, 60, 58,
      55, 52, 50, 47, 45, 42, 40, 37, 35, 32, 30, 28,
    ];

    return {
      categories: categories.filter(
        (category): category is string => category !== undefined,
      ),
      series: [
        {
          name: 'Ideal Burndown',
          data: idealBurndown,
        },
        {
          name: 'Actual Remaining Tasks',
          data: actualBurndown,
        },
      ],
    };
  }, []);

  const chartOptions = useChart({
    colors: ['#00A76F', '#FF5630'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Project Timeline',
        style: {
          fontWeight: 600,
        },
      },
      type: 'datetime',
      labels: {
        format: 'dd MMM',
      },
    },
    yaxis: {
      title: {
        text: 'Remaining Tasks',
        style: {
          fontWeight: 600,
        },
      },
      min: 0,
      max: 100,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: value => `${value} tasks`,
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} />
      <CardContent>
        <Chart
          dir="ltr"
          type="line"
          series={chartData.series}
          options={chartOptions}
          width="100%"
          height={350}
        />
      </CardContent>
    </Card>
  );
}
