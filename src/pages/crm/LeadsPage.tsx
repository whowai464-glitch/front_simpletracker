import { useMemo, useState } from 'react';
import {
  Group,
  Modal,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  ActionIcon,
  Tooltip,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconTrash, IconUsers } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';

const PAGE_SIZE = 20;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function LeadsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useLeads(page, PAGE_SIZE);
  const deleteMutation = useDeleteLead();

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

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
      <PageHeader title="Leads" />

      <Stack gap="md">
        <TextInput
          placeholder="Buscar por nome, email ou telefone..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Paper withBorder radius="md">
          {isLoading ? (
            <Table.ScrollContainer minWidth={700}>
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
            <Table.ScrollContainer minWidth={700}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Telefone</Table.Th>
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
                        <Text size="sm">{lead.utm_source || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.campaign || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{lead.tag || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(lead.created_at)}</Text>
                      </Table.Td>
                      <Table.Td>
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
