import { Stack, Text, Title } from '@mantine/core';
import { IconRobot } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';

export default function AutomationsPage() {
  return (
    <>
      <PageHeader title="Automacoes" />
      <Stack align="center" justify="center" py={120} gap="md" style={{ opacity: 0.6 }}>
        <IconRobot size={64} stroke={1.5} />
        <Title order={3}>Automacoes</Title>
        <Text c="dimmed" size="lg" ta="center" maw={400}>
          Este recurso estara disponivel em breve.
        </Text>
      </Stack>
    </>
  );
}
