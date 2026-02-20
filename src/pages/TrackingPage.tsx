import { Paper, Tabs } from '@mantine/core';
import { IconTag, IconSpeakerphone, IconAdCircle } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'tags';

  return (
    <>
      <PageHeader title="Tracking" />
      <Paper withBorder p="md" radius="md">
        <Tabs
          value={activeTab}
          onChange={(v) => setSearchParams({ tab: v || 'tags' })}
        >
          <Tabs.List>
            <Tabs.Tab value="tags" leftSection={<IconTag size={16} />}>
              Tags
            </Tabs.Tab>
            <Tabs.Tab value="campaigns" leftSection={<IconSpeakerphone size={16} />}>
              Campanhas
            </Tabs.Tab>
            <Tabs.Tab value="ads" leftSection={<IconAdCircle size={16} />}>
              Anuncios
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tags" pt="md">
            <EmptyState
              message="Nenhuma tag encontrada"
              icon={<IconTag size={48} color="gray" />}
            />
          </Tabs.Panel>

          <Tabs.Panel value="campaigns" pt="md">
            <EmptyState
              message="Nenhuma campanha encontrada"
              icon={<IconSpeakerphone size={48} color="gray" />}
            />
          </Tabs.Panel>

          <Tabs.Panel value="ads" pt="md">
            <EmptyState
              message="Nenhum anuncio encontrado"
              icon={<IconAdCircle size={48} color="gray" />}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
}
