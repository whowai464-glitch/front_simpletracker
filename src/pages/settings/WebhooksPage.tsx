import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  Loader,
  Modal,
  Paper,
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
import type { Webhook } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function WebhooksPage() {
  const businessId = useSelectedBusinessId();
  const { data: webhooks, isLoading } = useWebhooks(businessId);
  const createMutation = useCreateWebhook();
  const updateMutation = useUpdateWebhook();
  const deleteMutation = useDeleteWebhook();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: { event_type: '', url: '', is_active: true },
    validate: {
      event_type: (v) => (v.trim().length > 0 ? null : 'Tipo de evento obrigatorio'),
      url: (v) => {
        if (!v.trim()) return 'URL obrigatoria';
        try {
          new URL(v);
          return null;
        } catch {
          return 'URL invalida';
        }
      },
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
      event_type: webhook.event_type,
      url: webhook.url,
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
        { id: editingWebhook.id, data: values },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        { ...values, business_id: businessId },
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
          <Group justify="center" p="xl">
            <Loader />
          </Group>
        ) : !webhooks?.length ? (
          <EmptyState
            message="Nenhum webhook encontrado"
            icon={<IconWebhook size={48} color="gray" />}
          />
        ) : (
          <Table.ScrollContainer minWidth={600}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tipo de Evento</Table.Th>
                  <Table.Th>URL</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Data</Table.Th>
                  <Table.Th>Acoes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {webhooks.map((webhook) => (
                  <Table.Tr key={webhook.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {webhook.event_type}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" truncate maw={300}>
                        {webhook.url}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={webhook.is_active ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                      >
                        {webhook.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
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
              label="Tipo de Evento"
              placeholder="ex: lead.created"
              required
              {...form.getInputProps('event_type')}
            />
            <TextInput
              label="URL"
              placeholder="https://exemplo.com/webhook"
              required
              {...form.getInputProps('url')}
            />
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
