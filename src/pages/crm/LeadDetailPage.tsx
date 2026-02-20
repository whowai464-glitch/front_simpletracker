import {
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconUser } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useLead, useLeadEvents } from '@/hooks/useLeads';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR');
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value || '-'}
      </Text>
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id);
  const { data: eventsData, isLoading: eventsLoading } = useLeadEvents(id);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Lead" />
        <Group justify="center" p="xl">
          <Loader />
        </Group>
      </>
    );
  }

  if (!lead) {
    return (
      <>
        <PageHeader title="Lead" />
        <Paper withBorder p="xl" radius="md">
          <EmptyState
            message="Lead nao encontrado"
            icon={<IconUser size={48} color="gray" />}
          />
        </Paper>
      </>
    );
  }

  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Sem nome';

  return (
    <>
      <PageHeader
        title={fullName}
        action={
          <Button
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/crm/leads')}
          >
            Voltar
          </Button>
        }
      />

      <Stack gap="md">
        {/* Lead Info */}
        <Card withBorder radius="md" p="lg">
          <Title order={4} mb="md">
            Informacoes do Lead
          </Title>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
            <InfoItem label="Nome" value={fullName} />
            <InfoItem label="Email" value={lead.email} />
            <InfoItem label="Telefone" value={lead.phone} />
            <InfoItem label="Documento" value={lead.document} />
            <InfoItem label="Doc. Empresa" value={lead.business_document} />
            <InfoItem label="Pais" value={lead.country} />
            <InfoItem label="Cidade" value={lead.city} />
            <InfoItem label="Estado" value={lead.state} />
            <InfoItem label="Aniversario" value={lead.birthday} />
            <InfoItem label="Genero" value={lead.gender} />
            <InfoItem label="ID Externo" value={lead.external_id} />
            <InfoItem label="Criado em" value={formatDate(lead.created_at)} />
          </SimpleGrid>
        </Card>

        {/* UTM Attribution */}
        <Card withBorder radius="md" p="lg">
          <Title order={4} mb="md">
            Atribuicao UTM
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Title order={5} mb="sm" c="dimmed">
                Primeiro Toque
              </Title>
              <Stack gap="xs">
                <InfoItem label="UTM Source" value={lead.first_utm_source} />
                <InfoItem label="UTM Medium" value={lead.first_utm_medium} />
                <InfoItem label="UTM Campaign" value={lead.first_utm_campaign} />
                <InfoItem label="UTM Term" value={lead.first_utm_term} />
                <InfoItem label="UTM Content" value={lead.first_utm_content} />
                <InfoItem label="Campanha" value={lead.first_campaign?.name} />
                <InfoItem label="Tag" value={lead.first_tag?.name} />
                <InfoItem label="Anuncio" value={lead.first_advertisement?.name} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Title order={5} mb="sm" c="dimmed">
                Ultimo Toque
              </Title>
              <Stack gap="xs">
                <InfoItem label="UTM Source" value={lead.utm_source} />
                <InfoItem label="UTM Medium" value={lead.utm_medium} />
                <InfoItem label="UTM Campaign" value={lead.utm_campaign} />
                <InfoItem label="UTM Term" value={lead.utm_term} />
                <InfoItem label="UTM Content" value={lead.utm_content} />
                <InfoItem label="Campanha" value={lead.campaign?.name} />
                <InfoItem label="Tag" value={lead.tag?.name} />
                <InfoItem label="Anuncio" value={lead.advertisement?.name} />
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Events Timeline */}
        <Card withBorder radius="md" p="lg">
          <Title order={4} mb="md">
            Eventos ({eventsData?.total ?? 0})
          </Title>
          {eventsLoading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
            </Group>
          ) : !eventsData?.events.length ? (
            <Text c="dimmed" size="sm">
              Nenhum evento registrado
            </Text>
          ) : (
            <Timeline active={eventsData.events.length - 1} bulletSize={20} lineWidth={2}>
              {eventsData.events.map((event) => (
                <Timeline.Item key={event.id} title={event.event_name}>
                  <Text size="xs" c="dimmed" mt={4}>
                    {formatDate(event.timestamp)}
                  </Text>
                  {event.page_location && (
                    <Text size="xs" c="dimmed" mt={2}>
                      {event.page_location}
                    </Text>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </Card>
      </Stack>
    </>
  );
}
