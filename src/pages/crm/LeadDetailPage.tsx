import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Collapse,
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
import {
  IconArrowLeft,
  IconUser,
  IconChevronDown,
  IconChevronUp,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
  IconAd,
} from '@tabler/icons-react';
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

function detectPlatformIcon(utmSource: string | null, utmCampaign: string | null) {
  const text = `${utmSource ?? ''} ${utmCampaign ?? ''}`.toLowerCase();
  if (/facebook|meta|\bfb\b/.test(text)) return <IconBrandFacebook size={16} color="#228be6" />;
  if (/google/.test(text)) return <IconBrandGoogle size={16} color="#fa5252" />;
  if (/tiktok/.test(text)) return <IconBrandTiktok size={16} color="#343a40" />;
  if (/instagram|\big\b/.test(text)) return <IconBrandInstagram size={16} color="#e64980" />;
  if (/twitter|x\.com/.test(text)) return <IconBrandX size={16} color="#343a40" />;
  if (/linkedin/.test(text)) return <IconBrandLinkedin size={16} color="#4c6ef5" />;
  if (/kwai/.test(text)) return <IconAd size={16} color="#fd7e14" />;
  return null;
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id);
  const { data: eventsData, isLoading: eventsLoading } = useLeadEvents(id);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

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
              {eventsData.events.map((event) => {
                const platformIcon = detectPlatformIcon(event.utm_source, event.utm_campaign);
                const isExpanded = expandedEvents.has(event.id);
                const utmBadges = [
                  event.utm_source && { label: event.utm_source, color: 'blue' },
                  event.utm_medium && { label: event.utm_medium, color: 'cyan' },
                  event.utm_campaign && { label: event.utm_campaign, color: 'violet' },
                ].filter(Boolean) as { label: string; color: string }[];

                return (
                  <Timeline.Item
                    key={event.id}
                    title={
                      <Group gap="xs" align="center">
                        {platformIcon}
                        <Text size="sm" fw={500}>{event.event_name}</Text>
                        <ActionIcon
                          variant="subtle"
                          size="xs"
                          onClick={() => toggleEvent(event.id)}
                        >
                          {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                        </ActionIcon>
                      </Group>
                    }
                  >
                    <Text size="xs" c="dimmed" mt={4}>
                      {formatDate(event.timestamp)}
                    </Text>
                    {event.page_location && (
                      <Text size="xs" c="dimmed" mt={2}>
                        {event.page_location}
                      </Text>
                    )}
                    {utmBadges.length > 0 && (
                      <Group gap={4} mt={4}>
                        {utmBadges.map((b) => (
                          <Badge key={b.label} variant="light" size="xs" color={b.color}>
                            {b.label}
                          </Badge>
                        ))}
                      </Group>
                    )}
                    <Collapse in={isExpanded}>
                      <SimpleGrid cols={2} spacing="xs" mt="sm" p="xs" style={{ background: 'var(--mantine-color-gray-0)', borderRadius: 4 }}>
                        <InfoItem label="Titulo da pagina" value={event.page_title} />
                        <InfoItem label="Valor" value={event.value ? `${event.value}${event.currency ? ` ${event.currency}` : ''}` : null} />
                        <InfoItem label="IP" value={event.ip} />
                        <InfoItem label="Cidade" value={event.city} />
                        <InfoItem label="Pais" value={event.country} />
                        <InfoItem label="UTM Source" value={event.utm_source} />
                        <InfoItem label="UTM Medium" value={event.utm_medium} />
                        <InfoItem label="UTM Campaign" value={event.utm_campaign} />
                      </SimpleGrid>
                    </Collapse>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          )}
        </Card>
      </Stack>
    </>
  );
}
