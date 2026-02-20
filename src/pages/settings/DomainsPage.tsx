import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Code,
  CopyButton,
  Drawer,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconWorld,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconCopy,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useSelectedBusinessId } from '@/stores/businessStore';
import { useDomains, useCreateDomain, useDeleteDomain, useSyncDomain } from '@/hooks/useDomains';
import { getHostnameStatusColor, getCertificateStatusColor } from '@/utils/statusColors';
import type { Domain } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function DomainsPage() {
  const businessId = useSelectedBusinessId();
  const { data: domains, isLoading } = useDomains(businessId);
  const createMutation = useCreateDomain();
  const deleteMutation = useDeleteDomain();
  const syncMutation = useSyncDomain();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [createdDomain, setCreatedDomain] = useState<Domain | null>(null);

  const form = useForm({
    initialValues: { domain: '', subdomain: '' },
    validate: {
      domain: (v) => (v.trim().length > 0 ? null : 'Dominio obrigatorio'),
    },
  });

  const handleCreate = form.onSubmit((values) => {
    if (!businessId) return;
    createMutation.mutate(
      {
        domain: values.domain,
        ...(values.subdomain ? { subdomain: values.subdomain } : {}),
        business_id: businessId,
      },
      {
        onSuccess: (domain) => {
          setCreatedDomain(domain);
          form.reset();
        },
      },
    );
  });

  const handleCloseDrawer = () => {
    setCreatedDomain(null);
    form.reset();
    closeDrawer();
  };

  const handleDelete = (id: string) => {
    setDomainToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (domainToDelete) {
      deleteMutation.mutate(domainToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setDomainToDelete(null);
        },
      });
    }
  };

  const handleSync = (id: string) => {
    syncMutation.mutate(id, {
      onSuccess: (updated) => {
        if (createdDomain?.id === id) {
          setCreatedDomain(updated);
        }
      },
    });
  };

  if (!businessId) {
    return (
      <>
        <PageHeader title="Dominios" />
        <Paper withBorder p="xl" radius="md">
          <EmptyState
            message="Selecione um negocio para ver os dominios"
            icon={<IconWorld size={48} color="gray" />}
          />
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dominios"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openDrawer}>
            Adicionar dominio
          </Button>
        }
      />

      <Paper withBorder radius="md">
        {isLoading ? (
          <Group justify="center" p="xl">
            <Loader />
          </Group>
        ) : !domains?.length ? (
          <EmptyState
            message="Nenhum dominio encontrado"
            icon={<IconWorld size={48} color="gray" />}
          />
        ) : (
          <Table.ScrollContainer minWidth={600}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Dominio</Table.Th>
                  <Table.Th>Hostname</Table.Th>
                  <Table.Th>Status DNS</Table.Th>
                  <Table.Th>Certificado</Table.Th>
                  <Table.Th>Criado em</Table.Th>
                  <Table.Th>Acoes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {domains.map((domain) => (
                  <Table.Tr key={domain.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {domain.domain}
                      </Text>
                      {domain.subdomain && (
                        <Text size="xs" c="dimmed">
                          sub: {domain.subdomain}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{domain.full_hostname}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getHostnameStatusColor(domain.hostname_status)}
                        variant="light"
                        size="sm"
                      >
                        {domain.hostname_status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getCertificateStatusColor(domain.certificate_status)}
                        variant="light"
                        size="sm"
                      >
                        {domain.certificate_status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(domain.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Sincronizar DNS">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => handleSync(domain.id)}
                            loading={syncMutation.isPending}
                          >
                            <IconRefresh size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Excluir">
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(domain.id)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      {/* Create Domain Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title="Adicionar dominio"
        position="right"
        size="md"
      >
        {!createdDomain ? (
          <form onSubmit={handleCreate}>
            <Stack>
              <TextInput
                label="Dominio"
                placeholder="exemplo.com"
                required
                {...form.getInputProps('domain')}
              />
              <TextInput
                label="Subdominio"
                placeholder="track (opcional)"
                {...form.getInputProps('subdomain')}
              />
              <Button type="submit" loading={createMutation.isPending}>
                Adicionar
              </Button>
            </Stack>
          </form>
        ) : (
          <DnsInstructions
            domain={createdDomain}
            onSync={() => handleSync(createdDomain.id)}
            syncing={syncMutation.isPending}
          />
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar exclusao"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Tem certeza que deseja excluir este dominio? Esta acao nao pode ser
            desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

function DnsInstructions({
  domain,
  onSync,
  syncing,
}: {
  domain: Domain;
  onSync: () => void;
  syncing: boolean;
}) {
  return (
    <Stack>
      <Alert
        icon={<IconInfoCircle size={18} />}
        title="Configuracao DNS necessaria"
        color="blue"
      >
        Configure os registros DNS abaixo no seu provedor de dominio para ativar
        o dominio.
      </Alert>

      {domain.txt_name && domain.txt_value && (
        <Paper withBorder p="md" radius="md">
          <Text size="sm" fw={600} mb="xs">
            Registro TXT (verificacao)
          </Text>
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed">Nome</Text>
                <Code>{domain.txt_name}</Code>
              </div>
              <CopyButton value={domain.txt_name}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copiado' : 'Copiar'}>
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={copy}
                      color={copied ? 'green' : 'gray'}
                    >
                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed">Valor</Text>
                <Code block style={{ wordBreak: 'break-all' }}>
                  {domain.txt_value}
                </Code>
              </div>
              <CopyButton value={domain.txt_value}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copiado' : 'Copiar'}>
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={copy}
                      color={copied ? 'green' : 'gray'}
                    >
                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Stack>
        </Paper>
      )}

      <Paper withBorder p="md" radius="md">
        <Text size="sm" fw={600} mb="xs">
          Hostname
        </Text>
        <Group justify="space-between">
          <Code>{domain.full_hostname}</Code>
          <CopyButton value={domain.full_hostname}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copiado' : 'Copiar'}>
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={copy}
                  color={copied ? 'green' : 'gray'}
                >
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" fw={600} mb="xs">
          Status atual
        </Text>
        <Group gap="md">
          <div>
            <Text size="xs" c="dimmed">DNS</Text>
            <Badge
              color={getHostnameStatusColor(domain.hostname_status)}
              variant="light"
              size="sm"
            >
              {domain.hostname_status}
            </Badge>
          </div>
          <div>
            <Text size="xs" c="dimmed">Certificado</Text>
            <Badge
              color={getCertificateStatusColor(domain.certificate_status)}
              variant="light"
              size="sm"
            >
              {domain.certificate_status}
            </Badge>
          </div>
        </Group>
      </Paper>

      <Button
        leftSection={<IconRefresh size={16} />}
        onClick={onSync}
        loading={syncing}
        variant="light"
      >
        Sincronizar DNS
      </Button>
    </Stack>
  );
}
