'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UserCharts({ data }: { data: any }) {
  // Process data for charts
  const monthlyData = useMemo(() => {
    if (!data?.reviews) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize with 0
    const stats = months.map(m => ({ name: m, count: 0 }));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.reviews.forEach((review: any) => {
      const date = new Date(review.createdAt);
      if (date.getFullYear() === currentYear) {
        stats[date.getMonth()].count++;
      }
    });

    return stats;
  }, [data]);

  const genreData = useMemo(() => {
    if (!data?.reviews) return [];
    const stats: Record<string, number> = {};
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.reviews.forEach((review: any) => {
      if (review.book?.genres) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        review.book.genres.forEach((g: any) => {
          stats[g.name] = (stats[g.name] || 0) + 1;
        });
      }
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Genre Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.genreData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="books" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
