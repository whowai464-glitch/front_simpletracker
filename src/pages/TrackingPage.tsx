import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Loader,
  Modal,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconTag,
  IconSpeakerphone,
  IconAdCircle,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCopy,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useSelectedBusinessId } from '@/stores/businessStore';
import {
  useTags,
  useTag,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useAddTagPixel,
  useRemoveTagPixel,
  useCustomParams,
  useCreateCustomParam,
  useUpdateCustomParam,
  useDeleteCustomParam,
  useTagScript,
} from '@/hooks/useTags';
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
} from '@/hooks/useCampaigns';
import {
  useAdvertisements,
  useCreateAdvertisement,
  useUpdateAdvertisement,
  useDeleteAdvertisement,
} from '@/hooks/useAdvertisements';
import { useDomains } from '@/hooks/useDomains';
import { usePixels, useCreatePixel } from '@/hooks/usePixels';
import type { Tag, TagType, Pixel, PixelType, Campaign, Advertisement, TrafficSource } from '@/types';

const PIXEL_TYPE_COLORS: Record<PixelType, string> = {
  facebook: 'blue',
  tiktok: 'dark',
  google: 'red',
  snapchat: 'yellow',
  pinterest: 'pink',
  twitter: 'cyan',
  linkedin: 'indigo',
};

const TRAFFIC_SOURCE_COLORS: Record<string, string> = {
  meta: 'blue',
  tiktok: 'dark',
  google: 'red',
  organic: 'green',
  direct_traffic: 'violet',
  whatsapp: 'teal',
};

const TRAFFIC_SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'meta', label: 'Meta' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google' },
  { value: 'organic', label: 'Organico' },
  { value: 'direct_traffic', label: 'Trafego Direto' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'tags';

  return (
    <>
      <PageHeader title="Rastreamento" />
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
            <TagsTab />
          </Tabs.Panel>

          <Tabs.Panel value="campaigns" pt="md">
            <CampaignsTab />
          </Tabs.Panel>

          <Tabs.Panel value="ads" pt="md">
            <AdsTab />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
}

// ─── Tags Tab ───────────────────────────────────────────────

function TagsTab() {
  const businessId = useSelectedBusinessId();
  const { data: tags, isLoading } = useTags(businessId);
  const { data: domains } = useDomains(businessId);
  const deleteMutation = useDeleteTag();

  const [formDrawerOpened, { open: openFormDrawer, close: closeFormDrawer }] = useDisclosure();
  const [detailDrawerOpened, { open: openDetailDrawer, close: closeDetailDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [detailTagId, setDetailTagId] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  const domainMap = new Map((domains ?? []).map((d) => [d.id, d.domain]));

  const handleOpenCreate = () => {
    setEditingTag(null);
    openFormDrawer();
  };

  const handleOpenEdit = (tag: Tag) => {
    setEditingTag(tag);
    openFormDrawer();
  };

  const handleOpenDetail = (tagId: string) => {
    setDetailTagId(tagId);
    openDetailDrawer();
  };

  const handleDelete = (id: string) => {
    setTagToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteMutation.mutate(tagToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setTagToDelete(null);
        },
      });
    }
  };

  if (!businessId) {
    return (
      <EmptyState
        message="Selecione um negocio para ver as tags"
        icon={<IconTag size={48} color="gray" />}
      />
    );
  }

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Criar tag
        </Button>
      </Group>

      {isLoading ? (
        <Group justify="center" p="xl">
          <Loader />
        </Group>
      ) : !tags?.length ? (
        <EmptyState
          message="Nenhuma tag encontrada"
          icon={<IconTag size={48} color="gray" />}
        />
      ) : (
        <Table.ScrollContainer minWidth={600}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Dominio</Table.Th>
                <Table.Th>Pixels</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Criado em</Table.Th>
                <Table.Th>Acoes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tags.map((tag) => (
                <Table.Tr
                  key={tag.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenDetail(tag.id)}
                >
                  <Table.Td>
                    <Text size="sm" fw={500}>{tag.name}</Text>
                    <Text size="xs" c="dimmed">{tag.slug}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {tag.domain_id ? domainMap.get(tag.domain_id) ?? '—' : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" size="sm">
                      {tag.tag_pixels?.length ?? 0}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={tag.is_active ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {tag.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(tag.created_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" onClick={(e) => e.stopPropagation()}>
                      <Tooltip label="Detalhes">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenDetail(tag.id)}
                        >
                          <IconEye size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Editar">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenEdit(tag)}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Excluir">
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(tag.id)}
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

      <TagFormDrawer
        opened={formDrawerOpened}
        onClose={closeFormDrawer}
        editingTag={editingTag}
        businessId={businessId}
      />

      <TagDetailDrawer
        opened={detailDrawerOpened}
        onClose={() => {
          closeDetailDrawer();
          setDetailTagId(null);
        }}
        tagId={detailTagId}
        businessId={businessId}
      />

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar exclusao"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Tem certeza que deseja excluir esta tag? Esta acao nao pode ser desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>Cancelar</Button>
            <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

// ─── Tag Form Drawer (Create / Edit) ────────────────────────

const TAG_TYPE_OPTIONS: { value: TagType; label: string }[] = [
  { value: 'own_page', label: 'Pagina Propria' },
  { value: 'redirect', label: 'Redirecionamento' },
  { value: 'link_whats', label: 'Link WhatsApp' },
];

const PIXEL_TYPE_OPTIONS: { value: PixelType; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
];

function TagFormDrawer({
  opened,
  onClose,
  editingTag,
  businessId,
}: {
  opened: boolean;
  onClose: () => void;
  editingTag: Tag | null;
  businessId: string;
}) {
  const { data: domains } = useDomains(businessId);
  const { data: pixels } = usePixels(businessId);
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const addPixelMutation = useAddTagPixel();
  const removePixelMutation = useRemoveTagPixel();
  const createPixelMutation = useCreatePixel();

  const isEdit = !!editingTag;

  const [selectedPixelIds, setSelectedPixelIds] = useState<string[]>([]);
  const [showPixelForm, setShowPixelForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      name: editingTag?.name ?? '',
      tag_type: (editingTag?.tag_type ?? 'redirect') as string,
      description: editingTag?.description ?? '',
      slug: editingTag?.slug ?? '',
      domain_id: editingTag?.domain_id ?? '',
      destination_url: editingTag?.destination_url ?? '',
      whatsapp_number: editingTag?.whatsapp_number ?? '',
      whatsapp_message: editingTag?.whatsapp_message ?? '',
    },
  });

  const pixelForm = useForm({
    initialValues: {
      name: '',
      pixel_type: '' as string,
      pixel_id: '',
      access_token: '',
      test_event_code: '',
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Nome obrigatorio'),
      pixel_type: (v) => (v ? null : 'Tipo obrigatorio'),
      pixel_id: (v) => (v.trim() ? null : 'ID do pixel obrigatorio'),
    },
  });

  const handleOpen = () => {
    if (editingTag) {
      form.setValues({
        name: editingTag.name,
        tag_type: editingTag.tag_type,
        description: editingTag.description ?? '',
        slug: editingTag.slug,
        domain_id: editingTag.domain_id ?? '',
        destination_url: editingTag.destination_url ?? '',
        whatsapp_number: editingTag.whatsapp_number ?? '',
        whatsapp_message: editingTag.whatsapp_message ?? '',
      });
      setSelectedPixelIds(editingTag.tag_pixels?.map((tp) => tp.pixel.id) ?? []);
    } else {
      form.reset();
      setSelectedPixelIds([]);
    }
    setShowPixelForm(false);
  };

  // Reset form when drawer opens
  if (opened && form.values.name === '' && editingTag) {
    handleOpen();
  }

  const handleNameChange = (name: string) => {
    form.setFieldValue('name', name);
    if (!isEdit) {
      form.setFieldValue('slug', slugify(name));
    }
  };

  const domainOptions = (domains ?? []).map((d) => ({
    value: d.id,
    label: d.full_hostname || d.domain,
  }));

  // Build a set of selected pixel types for duplicate prevention
  const selectedPixelTypes = new Set(
    (pixels ?? [])
      .filter((p) => selectedPixelIds.includes(p.id))
      .map((p) => p.pixel_type),
  );

  const handlePixelToggle = (pixelId: string, checked: boolean) => {
    setSelectedPixelIds((prev) =>
      checked ? [...prev, pixelId] : prev.filter((id) => id !== pixelId),
    );
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (!businessId) return;
    setSubmitting(true);

    if (isEdit && editingTag) {
      const currentPixelIds = new Set(editingTag.tag_pixels?.map((tp) => tp.pixel.id) ?? []);
      const toAdd = selectedPixelIds.filter((id) => !currentPixelIds.has(id));
      const toRemove = [...currentPixelIds].filter((id) => !selectedPixelIds.includes(id));

      updateTagMutation.mutate(
        {
          id: editingTag.id,
          data: {
            name: values.name,
            description: values.description || undefined,
            slug: values.slug || undefined,
            destination_url: values.destination_url || undefined,
            whatsapp_number: values.whatsapp_number || undefined,
            whatsapp_message: values.whatsapp_message || undefined,
          },
        },
        {
          onSuccess: async () => {
            try {
              await Promise.all([
                ...toAdd.map((pixelId) =>
                  addPixelMutation.mutateAsync({ tagId: editingTag.id, pixelId }),
                ),
                ...toRemove.map((pixelId) =>
                  removePixelMutation.mutateAsync({ tagId: editingTag.id, pixelId }),
                ),
              ]);
            } finally {
              setSubmitting(false);
              handleClose();
            }
          },
          onError: () => {
            setSubmitting(false);
          },
        },
      );
    } else {
      createTagMutation.mutate(
        {
          name: values.name,
          tag_type: values.tag_type as TagType,
          description: values.description || undefined,
          slug: values.slug || undefined,
          domain_id: values.domain_id || undefined,
          destination_url: values.destination_url || undefined,
          whatsapp_number: values.whatsapp_number || undefined,
          whatsapp_message: values.whatsapp_message || undefined,
          business_id: businessId,
        },
        {
          onSuccess: async (tag) => {
            try {
              if (selectedPixelIds.length > 0) {
                await Promise.all(
                  selectedPixelIds.map((pixelId) =>
                    addPixelMutation.mutateAsync({ tagId: tag.id, pixelId }),
                  ),
                );
              }
            } finally {
              setSubmitting(false);
              handleClose();
            }
          },
          onError: () => {
            setSubmitting(false);
          },
        },
      );
    }
  });

  const handlePixelFormSubmit = pixelForm.onSubmit((values) => {
    createPixelMutation.mutate(
      {
        name: values.name,
        pixel_type: values.pixel_type as PixelType,
        pixel_id: values.pixel_id,
        access_token: values.access_token,
        test_event_code: values.test_event_code || undefined,
        business_id: businessId,
      },
      {
        onSuccess: () => {
          pixelForm.reset();
          setShowPixelForm(false);
        },
      },
    );
  });

  const handleClose = () => {
    form.reset();
    pixelForm.reset();
    setSelectedPixelIds([]);
    setShowPixelForm(false);
    setSubmitting(false);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={showPixelForm ? 'Novo Pixel' : isEdit ? 'Editar tag' : 'Criar tag'}
      position="right"
      size="md"
    >
      {showPixelForm ? (
        <form onSubmit={handlePixelFormSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome do pixel"
              required
              {...pixelForm.getInputProps('name')}
            />
            <Select
              label="Tipo"
              placeholder="Selecione o tipo"
              data={PIXEL_TYPE_OPTIONS}
              required
              {...pixelForm.getInputProps('pixel_type')}
            />
            <TextInput
              label="Pixel ID"
              placeholder="ID do pixel na plataforma"
              required
              {...pixelForm.getInputProps('pixel_id')}
            />
            <PasswordInput
              label="Access Token"
              placeholder="Token de acesso"
              {...pixelForm.getInputProps('access_token')}
            />
            <TextInput
              label="Test Event Code"
              placeholder="Opcional"
              {...pixelForm.getInputProps('test_event_code')}
            />
            <Group>
              <Button
                variant="default"
                onClick={() => {
                  pixelForm.reset();
                  setShowPixelForm(false);
                }}
              >
                Voltar
              </Button>
              <Button type="submit" loading={createPixelMutation.isPending}>
                Criar Pixel
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome da tag"
              required
              value={form.values.name}
              onChange={(e) => handleNameChange(e.currentTarget.value)}
              error={form.errors.name}
            />
            <Select
              label="Tipo"
              placeholder="Selecione o tipo"
              data={TAG_TYPE_OPTIONS}
              required
              disabled={isEdit}
              {...form.getInputProps('tag_type')}
            />
            <TextInput
              label="Slug"
              placeholder="slug-da-tag"
              {...form.getInputProps('slug')}
            />
            <Textarea
              label="Descricao"
              placeholder="Descricao opcional"
              {...form.getInputProps('description')}
            />
            <Select
              label="Dominio"
              placeholder="Selecione um dominio"
              data={domainOptions}
              clearable
              disabled={isEdit}
              {...form.getInputProps('domain_id')}
            />
            {form.values.tag_type === 'redirect' && (
              <TextInput
                label="URL de destino"
                placeholder="https://exemplo.com"
                {...form.getInputProps('destination_url')}
              />
            )}
            {form.values.tag_type === 'link_whats' && (
              <>
                <TextInput
                  label="Numero WhatsApp"
                  placeholder="5511999999999"
                  {...form.getInputProps('whatsapp_number')}
                />
                <Textarea
                  label="Mensagem WhatsApp"
                  placeholder="Mensagem pre-definida"
                  {...form.getInputProps('whatsapp_message')}
                />
              </>
            )}

            <Divider label="Pixels" labelPosition="left" />
            {(pixels ?? []).length > 0 ? (
              <Stack gap="xs">
                {(pixels ?? []).map((pixel) => {
                  const isSelected = selectedPixelIds.includes(pixel.id);
                  const typeConflict =
                    !isSelected && selectedPixelTypes.has(pixel.pixel_type);
                  return (
                    <Checkbox
                      key={pixel.id}
                      label={`${pixel.name} (${pixel.pixel_type})`}
                      checked={isSelected}
                      disabled={typeConflict}
                      onChange={(e) =>
                        handlePixelToggle(pixel.id, e.currentTarget.checked)
                      }
                    />
                  );
                })}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                Nenhum pixel cadastrado
              </Text>
            )}
            <Button
              variant="light"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={() => setShowPixelForm(true)}
            >
              Novo Pixel
            </Button>

            <Button
              type="submit"
              loading={submitting}
            >
              {isEdit ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </form>
      )}
    </Drawer>
  );
}

// ─── Tag Detail Drawer ──────────────────────────────────────

function TagDetailDrawer({
  opened,
  onClose,
  tagId,
  businessId,
}: {
  opened: boolean;
  onClose: () => void;
  tagId: string | null;
  businessId: string;
}) {
  const { data: tag } = useTag(tagId);
  const { data: customParams } = useCustomParams(tagId);
  const { data: script } = useTagScript(tag?.slug ?? null);
  const { data: domains } = useDomains(businessId);
  const { data: pixels } = usePixels(businessId);

  const removePixelMutation = useRemoveTagPixel();
  const addPixelMutation = useAddTagPixel();
  const createParamMutation = useCreateCustomParam();
  const updateParamMutation = useUpdateCustomParam();
  const deleteParamMutation = useDeleteCustomParam();

  const [addingParam, setAddingParam] = useState(false);
  const [editingParamId, setEditingParamId] = useState<string | null>(null);

  const paramForm = useForm({
    initialValues: { field: '', value: '' },
    validate: {
      field: (v) => (v.trim() ? null : 'Campo obrigatorio'),
      value: (v) => (v.trim() ? null : 'Valor obrigatorio'),
    },
  });

  const [pixelSelectValue, setPixelSelectValue] = useState<string | null>(null);

  if (!tag) {
    return (
      <Drawer opened={opened} onClose={onClose} title="Detalhes da tag" position="right" size="lg">
        <Group justify="center" p="xl"><Loader /></Group>
      </Drawer>
    );
  }

  const domainName = tag.domain_id
    ? domains?.find((d) => d.id === tag.domain_id)?.domain ?? '—'
    : '—';

  const tagPixels: Pixel[] = (tag.tag_pixels ?? []).map((tp) => tp.pixel as Pixel);
  const linkedPixelIds = new Set(tagPixels.map((p) => p.id));
  const linkedTypes = new Set(tagPixels.map((p) => p.pixel_type));
  const availablePixels = (pixels ?? []).filter(
    (p) => !linkedPixelIds.has(p.id) && !linkedTypes.has(p.pixel_type),
  );

  const pixelSelectData = availablePixels.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.pixel_type})`,
  }));

  const handleAddPixel = () => {
    if (!pixelSelectValue || !tagId) return;
    addPixelMutation.mutate(
      { tagId, pixelId: pixelSelectValue },
      { onSuccess: () => setPixelSelectValue(null) },
    );
  };

  const handleCreateParam = paramForm.onSubmit((values) => {
    if (!tagId) return;
    createParamMutation.mutate(
      { tagId, data: { field: values.field, value: values.value } },
      {
        onSuccess: () => {
          paramForm.reset();
          setAddingParam(false);
        },
      },
    );
  });

  const handleUpdateParam = (paramId: string) => {
    if (!tagId) return;
    updateParamMutation.mutate(
      {
        tagId,
        paramId,
        data: {
          field: paramForm.values.field,
          value: paramForm.values.value,
        },
      },
      {
        onSuccess: () => {
          paramForm.reset();
          setEditingParamId(null);
        },
      },
    );
  };

  const handleStartEditParam = (param: { id: string; field: string; value: string }) => {
    setEditingParamId(param.id);
    setAddingParam(false);
    paramForm.setValues({ field: param.field, value: param.value });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Detalhes da tag" position="right" size="lg">
      <Stack>
        {/* Tag Info */}
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={600} size="lg">{tag.name}</Text>
              <Badge color={tag.is_active ? 'green' : 'gray'} variant="light">
                {tag.is_active ? 'Ativa' : 'Inativa'}
              </Badge>
            </Group>
            {tag.description && <Text size="sm" c="dimmed">{tag.description}</Text>}
            <Group gap="lg">
              <div>
                <Text size="xs" c="dimmed">Slug</Text>
                <Text size="sm">{tag.slug}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Dominio</Text>
                <Text size="sm">{domainName}</Text>
              </div>
            </Group>
          </Stack>
        </Paper>

        {/* Pixels */}
        <Paper withBorder p="md" radius="md">
          <Text fw={600} mb="sm">Pixels vinculados</Text>
          {tagPixels.length ? (
            <Stack gap="xs">
              {tagPixels.map((pixel: Pixel) => (
                <Group key={pixel.id} justify="space-between">
                  <Group gap="xs">
                    <Badge color={PIXEL_TYPE_COLORS[pixel.pixel_type]} variant="light" size="sm">
                      {pixel.pixel_type}
                    </Badge>
                    <Text size="sm">{pixel.name}</Text>
                  </Group>
                  <Tooltip label="Remover pixel">
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => removePixelMutation.mutate({ tagId: tag.id, pixelId: pixel.id })}
                      loading={removePixelMutation.isPending}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ))}
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">Nenhum pixel vinculado</Text>
          )}
          {availablePixels.length > 0 && (
            <Group mt="sm" gap="xs">
              <Select
                placeholder="Adicionar pixel"
                data={pixelSelectData}
                value={pixelSelectValue}
                onChange={setPixelSelectValue}
                size="xs"
                style={{ flex: 1 }}
              />
              <Button
                size="xs"
                variant="light"
                onClick={handleAddPixel}
                disabled={!pixelSelectValue}
                loading={addPixelMutation.isPending}
              >
                Vincular
              </Button>
            </Group>
          )}
        </Paper>

        {/* Custom Params */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <Text fw={600}>Parametros customizados</Text>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconPlus size={14} />}
              onClick={() => {
                setAddingParam(true);
                setEditingParamId(null);
                paramForm.reset();
              }}
            >
              Adicionar
            </Button>
          </Group>

          {customParams?.length ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Campo</Table.Th>
                  <Table.Th>Valor</Table.Th>
                  <Table.Th w={80}>Acoes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {customParams.map((param) =>
                  editingParamId === param.id ? (
                    <Table.Tr key={param.id}>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          {...paramForm.getInputProps('field')}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          {...paramForm.getInputProps('value')}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            size="sm"
                            variant="light"
                            color="green"
                            onClick={() => handleUpdateParam(param.id)}
                            loading={updateParamMutation.isPending}
                          >
                            <IconCheck size={14} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="light"
                            onClick={() => {
                              setEditingParamId(null);
                              paramForm.reset();
                            }}
                          >
                            <IconX size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    <Table.Tr key={param.id}>
                      <Table.Td><Text size="sm">{param.field}</Text></Table.Td>
                      <Table.Td><Text size="sm">{param.value}</Text></Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            size="sm"
                            variant="light"
                            onClick={() => handleStartEditParam(param)}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="light"
                            color="red"
                            onClick={() =>
                              deleteParamMutation.mutate({
                                tagId: tag.id,
                                paramId: param.id,
                              })
                            }
                            loading={deleteParamMutation.isPending}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ),
                )}
              </Table.Tbody>
            </Table>
          ) : !addingParam ? (
            <Text size="sm" c="dimmed">Nenhum parametro customizado</Text>
          ) : null}

          {addingParam && (
            <form onSubmit={handleCreateParam}>
              <Group mt="sm" gap="xs" align="flex-end">
                <TextInput
                  size="xs"
                  label="Campo"
                  placeholder="field"
                  style={{ flex: 1 }}
                  {...paramForm.getInputProps('field')}
                />
                <TextInput
                  size="xs"
                  label="Valor"
                  placeholder="value"
                  style={{ flex: 1 }}
                  {...paramForm.getInputProps('value')}
                />
                <Button
                  size="xs"
                  type="submit"
                  loading={createParamMutation.isPending}
                >
                  Salvar
                </Button>
                <ActionIcon
                  size="md"
                  variant="light"
                  onClick={() => {
                    setAddingParam(false);
                    paramForm.reset();
                  }}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            </form>
          )}
        </Paper>

        {/* Script */}
        <Paper withBorder p="md" radius="md">
          <Text fw={600} mb="sm">Script de instalacao</Text>
          {script ? (
            <Stack gap="sm">
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">Script Tag</Text>
                  <CopyButton value={script.script_tag}>
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
                <Code block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {script.script_tag}
                </Code>
              </div>
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">Script URL</Text>
                  <CopyButton value={script.script_url}>
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
                <Code block>{script.script_url}</Code>
              </div>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">Script nao disponivel</Text>
          )}
        </Paper>
      </Stack>
    </Drawer>
  );
}

// ─── Campaigns Tab ──────────────────────────────────────────

function CampaignsTab() {
  const businessId = useSelectedBusinessId();
  const { data: campaigns, isLoading } = useCampaigns(businessId);
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: { name: '', description: '' },
    validate: {
      name: (v) => (v.trim() ? null : 'Nome obrigatorio'),
    },
  });

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    form.reset();
    openDrawer();
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    form.setValues({
      name: campaign.name,
      description: campaign.description ?? '',
    });
    openDrawer();
  };

  const handleCloseDrawer = () => {
    setEditingCampaign(null);
    form.reset();
    closeDrawer();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (!businessId) return;

    if (editingCampaign) {
      updateMutation.mutate(
        {
          id: editingCampaign.id,
          data: {
            name: values.name,
            description: values.description || undefined,
          },
        },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          description: values.description || undefined,
          business_id: businessId,
        },
        { onSuccess: handleCloseDrawer },
      );
    }
  });

  const handleDelete = (id: string) => {
    setCampaignToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (campaignToDelete) {
      deleteMutation.mutate(campaignToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setCampaignToDelete(null);
        },
      });
    }
  };

  if (!businessId) {
    return (
      <EmptyState
        message="Selecione um negocio para ver as campanhas"
        icon={<IconSpeakerphone size={48} color="gray" />}
      />
    );
  }

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Criar campanha
        </Button>
      </Group>

      {isLoading ? (
        <Group justify="center" p="xl"><Loader /></Group>
      ) : !campaigns?.length ? (
        <EmptyState
          message="Nenhuma campanha encontrada"
          icon={<IconSpeakerphone size={48} color="gray" />}
        />
      ) : (
        <Table.ScrollContainer minWidth={500}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Descricao</Table.Th>
                <Table.Th>Criado em</Table.Th>
                <Table.Th>Acoes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {campaigns.map((campaign) => (
                <Table.Tr key={campaign.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{campaign.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {campaign.description || '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(campaign.created_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Editar">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenEdit(campaign)}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Excluir">
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(campaign.id)}
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

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title={editingCampaign ? 'Editar campanha' : 'Criar campanha'}
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome da campanha"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Descricao"
              placeholder="Descricao opcional"
              {...form.getInputProps('description')}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingCampaign ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </form>
      </Drawer>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar exclusao"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Tem certeza que deseja excluir esta campanha? Esta acao nao pode ser desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>Cancelar</Button>
            <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

// ─── Ads Tab ────────────────────────────────────────────────

function AdsTab() {
  const businessId = useSelectedBusinessId();
  const { data: ads, isLoading } = useAdvertisements(businessId);
  const { data: tags } = useTags(businessId);
  const { data: campaigns } = useCampaigns(businessId);
  const createMutation = useCreateAdvertisement();
  const updateMutation = useUpdateAdvertisement();
  const deleteMutation = useDeleteAdvertisement();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      observation: '',
      traffic_source: '',
      tag_id: '',
      campaign_id: '',
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Nome obrigatorio'),
      traffic_source: (v) => (v ? null : 'Fonte de trafego obrigatoria'),
    },
  });

  const handleOpenCreate = () => {
    setEditingAd(null);
    form.reset();
    openDrawer();
  };

  const handleOpenEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    form.setValues({
      name: ad.name,
      observation: ad.observation ?? '',
      traffic_source: ad.traffic_source,
      tag_id: ad.tag_id ?? '',
      campaign_id: ad.campaign_id ?? '',
    });
    openDrawer();
  };

  const handleCloseDrawer = () => {
    setEditingAd(null);
    form.reset();
    closeDrawer();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (!businessId) return;

    if (editingAd) {
      updateMutation.mutate(
        {
          id: editingAd.id,
          data: {
            name: values.name,
            observation: values.observation || undefined,
            campaign_id: values.campaign_id || undefined,
            tag_id: values.tag_id || undefined,
          },
        },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          observation: values.observation || undefined,
          traffic_source: values.traffic_source as TrafficSource,
          tag_id: values.tag_id || undefined,
          campaign_id: values.campaign_id || undefined,
          business_id: businessId,
        },
        { onSuccess: handleCloseDrawer },
      );
    }
  });

  const handleDelete = (id: string) => {
    setAdToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (adToDelete) {
      deleteMutation.mutate(adToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setAdToDelete(null);
        },
      });
    }
  };

  const tagOptions = (tags ?? []).map((t) => ({ value: t.id, label: t.name }));
  const campaignOptions = (campaigns ?? []).map((c) => ({ value: c.id, label: c.name }));

  if (!businessId) {
    return (
      <EmptyState
        message="Selecione um negocio para ver os anuncios"
        icon={<IconAdCircle size={48} color="gray" />}
      />
    );
  }

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Criar anuncio
        </Button>
      </Group>

      {isLoading ? (
        <Group justify="center" p="xl"><Loader /></Group>
      ) : !ads?.length ? (
        <EmptyState
          message="Nenhum anuncio encontrado"
          icon={<IconAdCircle size={48} color="gray" />}
        />
      ) : (
        <Table.ScrollContainer minWidth={700}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Fonte</Table.Th>
                <Table.Th>Campanha</Table.Th>
                <Table.Th>Tag</Table.Th>
                <Table.Th>Criado em</Table.Th>
                <Table.Th>Acoes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ads.map((ad) => (
                <Table.Tr key={ad.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{ad.name}</Text>
                    {ad.observation && (
                      <Text size="xs" c="dimmed" lineClamp={1}>{ad.observation}</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={TRAFFIC_SOURCE_COLORS[ad.traffic_source] ?? 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {ad.traffic_source}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{ad.campaign?.name ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{ad.tag?.name ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(ad.created_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Editar">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenEdit(ad)}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Excluir">
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
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

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title={editingAd ? 'Editar anuncio' : 'Criar anuncio'}
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome do anuncio"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Observacao"
              placeholder="Observacao opcional"
              {...form.getInputProps('observation')}
            />
            <Select
              label="Fonte de trafego"
              placeholder="Selecione a fonte"
              data={TRAFFIC_SOURCE_OPTIONS}
              required
              disabled={!!editingAd}
              {...form.getInputProps('traffic_source')}
            />
            <Select
              label="Tag"
              placeholder="Selecione uma tag (opcional)"
              data={tagOptions}
              clearable
              {...form.getInputProps('tag_id')}
            />
            <Select
              label="Campanha"
              placeholder="Selecione uma campanha (opcional)"
              data={campaignOptions}
              clearable
              {...form.getInputProps('campaign_id')}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingAd ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </form>
      </Drawer>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar exclusao"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Tem certeza que deseja excluir este anuncio? Esta acao nao pode ser desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>Cancelar</Button>
            <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
