'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminCharts({ data }: { data: any }) {
  // The original useState and useEffect are removed as data is now passed as a prop.
  // The instruction's Code Edit was malformed, so this interpretation makes it syntactically correct.

  if (!data) return null;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Books per Genre</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.genreData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
