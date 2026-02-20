import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Loader,
  Modal,
  Paper,
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
import { usePixels } from '@/hooks/usePixels';
import type { Tag, Pixel, PixelType, Campaign, Advertisement, TrafficSource } from '@/types';

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
  google_ads: 'red',
  meta_ads: 'blue',
  tiktok_ads: 'dark',
  kwai_ads: 'orange',
  organic: 'green',
  direct: 'violet',
  email: 'cyan',
  referral: 'orange',
  other: 'gray',
};

const TRAFFIC_SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'tiktok_ads', label: 'TikTok Ads' },
  { value: 'kwai_ads', label: 'Kwai Ads' },
  { value: 'organic', label: 'Organico' },
  { value: 'direct', label: 'Direto' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Referencia' },
  { value: 'other', label: 'Outro' },
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
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const addPixelMutation = useAddTagPixel();

  const [createdTag, setCreatedTag] = useState<Tag | null>(null);
  const isEdit = !!editingTag;

  const form = useForm({
    initialValues: {
      name: editingTag?.name ?? '',
      description: editingTag?.description ?? '',
      slug: editingTag?.slug ?? '',
      domain_id: editingTag?.domain_id ?? '',
    },
  });

  const handleOpen = () => {
    if (editingTag) {
      form.setValues({
        name: editingTag.name,
        description: editingTag.description ?? '',
        slug: editingTag.slug,
        domain_id: editingTag.domain_id ?? '',
      });
    } else {
      form.reset();
    }
    setCreatedTag(null);
  };

  // Reset form when drawer opens
  if (opened && !createdTag && form.values.name === '' && editingTag) {
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

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit && editingTag) {
      updateMutation.mutate(
        {
          id: editingTag.id,
          data: {
            name: values.name,
            description: values.description || undefined,
            slug: values.slug || undefined,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          tag_type: 'redirect' as const,
          description: values.description || undefined,
          slug: values.slug || undefined,
          domain_id: values.domain_id || undefined,
          business_id: businessId,
        },
        {
          onSuccess: (tag) => {
            setCreatedTag(tag);
          },
        },
      );
    }
  });

  const handleAddPixel = (pixelId: string) => {
    if (!createdTag) return;
    addPixelMutation.mutate({ tagId: createdTag.id, pixelId });
  };

  const handleClose = () => {
    form.reset();
    setCreatedTag(null);
    onClose();
  };

  // Pixels already linked to this tag
  const linkedPixelIds = new Set(createdTag?.tag_pixels?.map((tp) => tp.pixel.id) ?? []);
  // Pixel types already linked
  const linkedTypes = new Set(createdTag?.tag_pixels?.map((tp) => tp.pixel.pixel_type) ?? []);

  const availablePixels = (pixels ?? []).filter(
    (p) => !linkedPixelIds.has(p.id) && !linkedTypes.has(p.pixel_type),
  );

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar tag' : 'Criar tag'}
      position="right"
      size="md"
    >
      {!createdTag ? (
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
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </form>
      ) : (
        <Stack>
          <Text fw={600}>Tag criada: {createdTag.name}</Text>
          <Divider />
          <Text size="sm" fw={500}>Vincular pixels</Text>
          {availablePixels.length === 0 ? (
            <Text size="sm" c="dimmed">
              Nenhum pixel disponivel para vincular
            </Text>
          ) : (
            <Stack gap="xs">
              {availablePixels.map((pixel) => (
                <Group key={pixel.id} justify="space-between">
                  <Group gap="xs">
                    <Badge
                      color={PIXEL_TYPE_COLORS[pixel.pixel_type]}
                      variant="light"
                      size="sm"
                    >
                      {pixel.pixel_type}
                    </Badge>
                    <Text size="sm">{pixel.name}</Text>
                  </Group>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleAddPixel(pixel.id)}
                    loading={addPixelMutation.isPending}
                  >
                    Vincular
                  </Button>
                </Group>
              ))}
            </Stack>
          )}
          <Button variant="default" onClick={handleClose} mt="md">
            Fechar
          </Button>
        </Stack>
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
    initialValues: { param_key: '', param_value: '' },
    validate: {
      param_key: (v) => (v.trim() ? null : 'Campo obrigatorio'),
      param_value: (v) => (v.trim() ? null : 'Valor obrigatorio'),
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
      { tagId, data: values },
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
          param_key: paramForm.values.param_key,
          param_value: paramForm.values.param_value,
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

  const handleStartEditParam = (param: { id: string; param_key: string; param_value: string }) => {
    setEditingParamId(param.id);
    setAddingParam(false);
    paramForm.setValues({ param_key: param.param_key, param_value: param.param_value });
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
                          {...paramForm.getInputProps('param_key')}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          {...paramForm.getInputProps('param_value')}
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
                      <Table.Td><Text size="sm">{param.param_key}</Text></Table.Td>
                      <Table.Td><Text size="sm">{param.param_value}</Text></Table.Td>
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
                  placeholder="param_key"
                  style={{ flex: 1 }}
                  {...paramForm.getInputProps('param_key')}
                />
                <TextInput
                  size="xs"
                  label="Valor"
                  placeholder="param_value"
                  style={{ flex: 1 }}
                  {...paramForm.getInputProps('param_value')}
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
  const { data: tags } = useTags(businessId);
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: { name: '', description: '', tag_id: '' },
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
      tag_id: '',
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
          tag_id: values.tag_id || undefined,
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

  const tagOptions = (tags ?? []).map((t) => ({ value: t.id, label: t.name }));

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
            {!editingCampaign && (
              <Select
                label="Tag"
                placeholder="Selecione uma tag (opcional)"
                data={tagOptions}
                clearable
                {...form.getInputProps('tag_id')}
              />
            )}
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
