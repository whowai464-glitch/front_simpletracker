import type { ReactNode } from 'react';
import { Group, Title } from '@mantine/core';

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Group justify="space-between" mb="lg">
      <Title order={2}>{title}</Title>
      {action}
    </Group>
  );
}
