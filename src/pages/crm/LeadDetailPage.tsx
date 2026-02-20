import { Paper } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <PageHeader title={`Lead ${id ?? ''}`} />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Detalhes do lead em desenvolvimento"
          icon={<IconUser size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
