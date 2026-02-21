import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Code,
  CopyButton,
  Drawer,
  Group,
  Modal,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconPlus,
  IconTrash,
  IconWebhook,
} from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useSelectedBusinessId } from '@/stores/businessStore';
import {
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
} from '@/hooks/useWebhooks';
import { useTags } from '@/hooks/useTags';
import type { Webhook } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

const PROVIDER_OPTIONS = [
  { value: 'hotmart', label: 'Hotmart' },
];

export default function WebhooksPage() {
  const businessId = useSelectedBusinessId();
  const { data: webhooks, isLoading } = useWebhooks(businessId);
  const { data: tags } = useTags(businessId);
  const createMutation = useCreateWebhook();
  const updateMutation = useUpdateWebhook();
  const deleteMutation = useDeleteWebhook();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);

  const tagOptions = (tags ?? []).map((t) => ({ value: t.id, label: t.name }));

  const form = useForm({
    initialValues: { name: '', tag_id: '', provider: 'hotmart', url: '', is_active: true },
    validate: {
      name: (v) => (v.trim() ? null : 'Nome obrigatorio'),
      tag_id: (v) => (v ? null : 'Tag obrigatoria'),
    },
  });

  const handleOpenCreate = () => {
    setEditingWebhook(null);
    form.reset();
    openDrawer();
  };

  const handleOpenEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    form.setValues({
      name: webhook.name,
      tag_id: webhook.tag?.id ?? '',
      provider: webhook.provider,
      url: webhook.url ?? '',
      is_active: webhook.is_active,
    });
    openDrawer();
  };

  const handleCloseDrawer = () => {
    setEditingWebhook(null);
    form.reset();
    closeDrawer();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (!businessId) return;

    if (editingWebhook) {
      updateMutation.mutate(
        {
          id: editingWebhook.id,
          data: { name: values.name, tag_id: values.tag_id, is_active: values.is_active },
        },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          tag_id: values.tag_id,
          business_id: businessId,
          provider: values.provider as 'hotmart' | 'custom',
        },
        { onSuccess: handleCloseDrawer },
      );
    }
  });

  const handleDelete = (id: string) => {
    setWebhookToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (webhookToDelete) {
      deleteMutation.mutate(webhookToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setWebhookToDelete(null);
        },
      });
    }
  };

  if (!businessId) {
    return (
      <>
        <PageHeader title="Webhooks" />
        <Paper withBorder p="xl" radius="md">
          <EmptyState
            message="Selecione um negocio para ver os webhooks"
            icon={<IconWebhook size={48} color="gray" />}
          />
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Webhooks"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            Novo Webhook
          </Button>
        }
      />

      <Paper withBorder radius="md">
        {isLoading ? (
          <Table.ScrollContainer minWidth={800}>
            <Table>
              <Table.Tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={60} /></Table.Td>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={40} /></Table.Td>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={50} /></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : !webhooks?.length ? (
          <EmptyState
            message="Nenhum webhook encontrado"
            icon={<IconWebhook size={48} color="gray" />}
          />
        ) : (
          <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Provider</Table.Th>
                  <Table.Th>Tag</Table.Th>
                  <Table.Th>URL / Token</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Data</Table.Th>
                  <Table.Th>Acoes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {webhooks.map((webhook) => (
                  <Table.Tr key={webhook.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{webhook.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {webhook.provider}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{webhook.tag?.name ?? '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        {webhook.url && (
                          <Text size="xs" truncate maw={250}>{webhook.url}</Text>
                        )}
                        <Group gap="xs">
                          <Code style={{ fontSize: 11 }}>
                            {webhook.webhook_token}
                          </Code>
                          <CopyButton value={webhook.webhook_token}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copiado' : 'Copiar token'}>
                                <ActionIcon
                                  variant="subtle"
                                  size="xs"
                                  onClick={copy}
                                  color={copied ? 'green' : 'gray'}
                                >
                                  {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        size="sm"
                        checked={webhook.is_active}
                        onChange={(e) =>
                          updateMutation.mutate({
                            id: webhook.id,
                            data: { is_active: e.currentTarget.checked },
                          })
                        }
                        disabled={updateMutation.isPending}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(webhook.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Editar">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => handleOpenEdit(webhook)}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Excluir">
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(webhook.id)}
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

      {/* Create/Edit Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title={editingWebhook ? 'Editar Webhook' : 'Novo Webhook'}
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome do webhook"
              required
              {...form.getInputProps('name')}
            />
            <Select
              label="Tag"
              placeholder="Selecione a tag"
              data={tagOptions}
              required
              searchable
              {...form.getInputProps('tag_id')}
            />
            {!editingWebhook && (
              <Select
                label="Provider"
                data={PROVIDER_OPTIONS}
                {...form.getInputProps('provider')}
              />
            )}
            <Switch
              label="Ativo"
              checked={form.values.is_active}
              onChange={(e) => form.setFieldValue('is_active', e.currentTarget.checked)}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingWebhook ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </form>
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
            Tem certeza que deseja excluir este webhook? Esta acao nao pode ser desfeita.
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
