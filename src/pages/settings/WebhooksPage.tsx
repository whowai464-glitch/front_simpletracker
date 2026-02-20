import { Paper } from '@mantine/core';
import { IconWebhook } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function WebhooksPage() {
  return (
    <>
      <PageHeader title="Webhooks" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Nenhum webhook encontrado"
          icon={<IconWebhook size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
