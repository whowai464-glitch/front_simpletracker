import type { ReactNode } from 'react';
import { Stack, Text } from '@mantine/core';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py={60} gap="md">
      {icon}
      <Text c="dimmed" size="lg">
        {message}
      </Text>
    </Stack>
  );
}
