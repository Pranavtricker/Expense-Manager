import { PropsWithChildren } from 'react';

export default function ChartCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="min-h-[220px]">{children}</div>
    </div>
  );
}