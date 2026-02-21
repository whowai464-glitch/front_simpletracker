import { useMemo, useState } from 'react';
import {
  Drawer,
  Group,
  Modal,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  ActionIcon,
  Tooltip,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconTrash, IconUsers, IconPlus, IconPencil } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import type { Lead } from '@/types';

const PAGE_SIZE = 20;

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function LeadsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useLeads(page, PAGE_SIZE);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      document: '',
      birthday: '',
      gender: '',
      external_id: '',
    },
  });

  const openCreate = () => {
    setEditingLead(null);
    form.reset();
    openDrawer();
  };

  const openEdit = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    setEditingLead(lead);
    form.setValues({
      first_name: lead.first_name ?? '',
      last_name: lead.last_name ?? '',
      email: lead.email ?? '',
      phone: lead.phone ?? '',
      document: lead.document ?? '',
      birthday: lead.birthday ?? '',
      gender: lead.gender ?? '',
      external_id: '',
    });
    openDrawer();
  };

  const handleCloseDrawer = () => {
    setEditingLead(null);
    form.reset();
    closeDrawer();
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = {
      first_name: values.first_name || undefined,
      last_name: values.last_name || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      document: values.document || undefined,
      birthday: values.birthday || undefined,
      gender: values.gender || undefined,
    };

    if (editingLead) {
      updateMutation.mutate(
        { leadId: editingLead.id, data: payload },
        { onSuccess: handleCloseDrawer },
      );
    } else {
      createMutation.mutate(
        { ...payload, external_id: values.external_id || undefined },
        { onSuccess: handleCloseDrawer },
      );
    }
  });

  const filteredLeads = useMemo(() => {
    if (!data?.leads) return [];
    if (!search.trim()) return data.leads;
    const term = search.toLowerCase();
    return data.leads.filter((lead) => {
      const name = `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.toLowerCase();
      const email = (lead.email ?? '').toLowerCase();
      const phone = (lead.phone ?? '').toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [data?.leads, search]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLeadToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete, {
        onSuccess: () => {
          closeDeleteModal();
          setLeadToDelete(null);
        },
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Leads"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Criar lead
          </Button>
        }
      />

      <Stack gap="md">
        <TextInput
          placeholder="Buscar por nome, email ou telefone..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Paper withBorder radius="md">
          {isLoading ? (
            <Table.ScrollContainer minWidth={1100}>
              <Table>
                <Table.Tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} /></Table.Td>
                      <Table.Td><Skeleton height={16} width={30} /></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : !filteredLeads.length ? (
            <EmptyState
              message="Nenhum lead encontrado"
              icon={<IconUsers size={48} color="gray" />}
            />
          ) : (
            <Table.ScrollContainer minWidth={1100}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Telefone</Table.Th>
                    <Table.Th>Documento</Table.Th>
                    <Table.Th>Doc. Empresa</Table.Th>
                    <Table.Th>Pais</Table.Th>
                    <Table.Th>Cidade</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>UTM Source</Table.Th>
                    <Table.Th>Campanha</Table.Th>
                    <Table.Th>Tag</Table.Th>
                    <Table.Th>Data</Table.Th>
                    <Table.Th>Acoes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredLeads.map((lead) => (
                    <Table.Tr
                      key={lead.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/crm/leads/${lead.id}`)}
                    >
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.email || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.phone || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.document || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.business_document || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.country || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.city || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.state || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.utm_source || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.campaign?.name || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.tag?.name || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(lead.created_at)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="light"
                              size="sm"
                              onClick={(e) => openEdit(e, lead)}
                            >
                              <IconPencil size={14} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Excluir">
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="sm"
                              onClick={(e) => handleDelete(e, lead.id)}
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

        {totalPages > 1 && (
          <Group justify="center">
            <Pagination value={page} onChange={setPage} total={totalPages} />
          </Group>
        )}
      </Stack>

      {/* Create/Edit Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title={editingLead ? 'Editar lead' : 'Criar lead'}
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Nome" placeholder="Nome" {...form.getInputProps('first_name')} />
            <TextInput label="Sobrenome" placeholder="Sobrenome" {...form.getInputProps('last_name')} />
            <TextInput label="Email" placeholder="email@exemplo.com" type="email" {...form.getInputProps('email')} />
            <TextInput label="Telefone" placeholder="+55 11 99999-9999" {...form.getInputProps('phone')} />
            <TextInput label="Documento" placeholder="CPF ou RG" {...form.getInputProps('document')} />
            <TextInput label="Aniversario" placeholder="YYYY-MM-DD" {...form.getInputProps('birthday')} />
            <Select
              label="Genero"
              placeholder="Selecione"
              data={GENDER_OPTIONS}
              clearable
              {...form.getInputProps('gender')}
            />
            {!editingLead && (
              <TextInput label="ID Externo" placeholder="ID de sistema externo" {...form.getInputProps('external_id')} />
            )}
            <Button
              type="submit"
              loading={editingLead ? updateMutation.isPending : createMutation.isPending}
            >
              {editingLead ? 'Salvar' : 'Criar'}
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
            Tem certeza que deseja excluir este lead? Esta acao nao pode ser desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
