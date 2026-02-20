import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCode,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useSelectedBusinessId } from '@/stores/businessStore';
import {
  usePixels,
  useCreatePixel,
  useUpdatePixel,
  useDeletePixel,
} from '@/hooks/usePixels';
import type { Pixel, PixelType } from '@/types';

const PIXEL_TYPE_COLORS: Record<PixelType, string> = {
  facebook: 'blue',
  tiktok: 'dark',
  google: 'red',
  snapchat: 'yellow',
  pinterest: 'pink',
  twitter: 'cyan',
  linkedin: 'indigo',
};

const PIXEL_TYPE_OPTIONS: { value: PixelType; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

interface PixelFormValues {
  name: string;
  pixel_type: string;
  pixel_id: string;
  access_token: string;
  test_event_code: string;
}

export default function PixelsPage() {
  const businessId = useSelectedBusinessId();
  const { data: pixels, isLoading } = usePixels(businessId);
  const createMutation = useCreatePixel();
  const updateMutation = useUpdatePixel();
  const deleteMutation = useDeletePixel();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingPixel, setEditingPixel] = useState<Pixel | null>(null);
  const [pixelToDelete, setPixelToDelete] = useState<string | null>(null);

  const form = useForm<PixelFormValues>({
    initialValues: {
      name: '',
      pixel_type: '',
      pixel_id: '',
      access_token: '',
      test_event_code: '',
    },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : 'Nome obrigatorio'),
      pixel_type: (v) => (v ? null : 'Tipo obrigatorio'),
      pixel_id: (v) => (v.trim().length > 0 ? null : 'ID do pixel obrigatorio'),
    },
  });

  const handleOpenCreate = () => {
    setEditingPixel(null);
    form.reset();
    openDrawer();
  };

  const handleOpenEdit = (pixel: Pixel) => {
    setEditingPixel(pixel);
    form.setValues({
      name: pixel.name,
      pixel_type: pixel.pixel_type,
      pixel_id: pixel.pixel_id,
      access_token: pixel.access_token,
      test_event_code: pixel.test_event_code ?? '',
    });
    openDrawer();
  };

  const handleCloseDrawer = () => {
    setEditingPixel(null);
    form.reset();
    closeDrawer();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (!businessId) return;

    if (editingPixel) {
      updateMutation.mutate(
        {
          id: editingPixel.id,
          data: {
            name: values.name,
            access_token: values.access_token,
            test_event_code: values.test_event_code || undefined,
          },
        },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          pixel_type: values.pixel_type as PixelType,
          pixel_id: values.pixel_id,
          access_token: values.access_token,
          test_event_code: values.test_event_code || undefined,
          business_id: businessId,
        },
        { onSuccess: handleCloseDrawer },
      );
    }
  });

  const handleDelete = (id: string) => {
    setPixelToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (pixelToDelete) {
      deleteMutation.mutate(pixelToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setPixelToDelete(null);
        },
      });
    }
  };

  if (!businessId) {
    return (
      <>
        <PageHeader title="Pixels" />
        <Paper withBorder p="xl" radius="md">
          <EmptyState
            message="Selecione um negocio para ver os pixels"
            icon={<IconCode size={48} color="gray" />}
          />
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Pixels"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            Adicionar pixel
          </Button>
        }
      />

      <Paper withBorder radius="md">
        {isLoading ? (
          <Table.ScrollContainer minWidth={600}>
            <Table>
              <Table.Tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={60} /></Table.Td>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={50} /></Table.Td>
                    <Table.Td><Skeleton height={16} /></Table.Td>
                    <Table.Td><Skeleton height={16} width={50} /></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : !pixels?.length ? (
          <EmptyState
            message="Nenhum pixel encontrado"
            icon={<IconCode size={48} color="gray" />}
          />
        ) : (
          <Table.ScrollContainer minWidth={600}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Pixel ID</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Criado em</Table.Th>
                  <Table.Th>Acoes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pixels.map((pixel) => (
                  <Table.Tr key={pixel.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{pixel.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={PIXEL_TYPE_COLORS[pixel.pixel_type]}
                        variant="light"
                        size="sm"
                      >
                        {pixel.pixel_type}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{pixel.pixel_id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={pixel.is_active ? 'green' : 'gray'}
                        variant="light"
                        size="sm"
                      >
                        {pixel.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(pixel.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Editar">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => handleOpenEdit(pixel)}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Excluir">
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(pixel.id)}
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
        title={editingPixel ? 'Editar pixel' : 'Adicionar pixel'}
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome do pixel"
              required
              {...form.getInputProps('name')}
            />
            <Select
              label="Tipo"
              placeholder="Selecione o tipo"
              data={PIXEL_TYPE_OPTIONS}
              required
              disabled={!!editingPixel}
              {...form.getInputProps('pixel_type')}
            />
            <TextInput
              label="Pixel ID"
              placeholder="ID do pixel na plataforma"
              required
              disabled={!!editingPixel}
              {...form.getInputProps('pixel_id')}
            />
            <PasswordInput
              label="Access Token"
              placeholder="Token de acesso"
              {...form.getInputProps('access_token')}
            />
            <TextInput
              label="Test Event Code"
              placeholder="Opcional"
              {...form.getInputProps('test_event_code')}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingPixel ? 'Salvar' : 'Criar'}
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
            Tem certeza que deseja excluir este pixel? Esta acao nao pode ser
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
