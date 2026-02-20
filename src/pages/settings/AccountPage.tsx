import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconMailPlus,
  IconTrash,
  IconUsers,
  IconMail,
} from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import {
  useWorkspaces,
  useMembers,
  useRemoveMember,
  useInvitations,
  useCreateInvitation,
  useDeleteInvitation,
} from '@/hooks/useWorkspaces';
import type { WorkspaceRole } from '@/types';

const ROLE_COLORS: Record<WorkspaceRole, string> = {
  owner: 'violet',
  admin: 'blue',
  analyst: 'cyan',
  viewer: 'gray',
};

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'viewer', label: 'Viewer' },
];

export default function AccountPage() {
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces();
  const workspaceId = workspaces?.[0]?.id ?? null;

  const { data: members, isLoading: membersLoading } = useMembers(workspaceId);
  const { data: invitations, isLoading: invitationsLoading } = useInvitations(workspaceId);
  const removeMutation = useRemoveMember();
  const createInvitationMutation = useCreateInvitation();
  const deleteInvitationMutation = useDeleteInvitation();

  const [removeModalOpened, { open: openRemoveModal, close: closeRemoveModal }] = useDisclosure();
  const [inviteModalOpened, { open: openInviteModal, close: closeInviteModal }] = useDisclosure();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const inviteForm = useForm({
    initialValues: { email: '', role: 'viewer' as WorkspaceRole },
    validate: {
      email: (v) => (/\S+@\S+\.\S+/.test(v) ? null : 'Email invalido'),
    },
  });

  const handleRemove = (userId: string) => {
    setMemberToRemove(userId);
    openRemoveModal();
  };

  const confirmRemove = () => {
    if (memberToRemove) {
      removeMutation.mutate(
        { userId: memberToRemove },
        {
          onSuccess: () => {
            closeRemoveModal();
            setMemberToRemove(null);
          },
        },
      );
    }
  };

  const handleInvite = inviteForm.onSubmit((values) => {
    createInvitationMutation.mutate(
      { email: values.email, role: values.role },
      {
        onSuccess: () => {
          inviteForm.reset();
          closeInviteModal();
        },
      },
    );
  });

  const handleRevokeInvitation = (invitationId: string) => {
    deleteInvitationMutation.mutate({ invitationId });
  };

  if (wsLoading) {
    return (
      <>
        <PageHeader title="Conta" />
        <Group justify="center" p="xl">
          <Loader />
        </Group>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Conta" />

      <Stack gap="xl">
        {/* Members Section */}
        <Paper withBorder radius="md" p="lg">
          <Title order={4} mb="md">
            Membros
          </Title>
          {membersLoading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
            </Group>
          ) : !members?.length ? (
            <EmptyState
              message="Nenhum membro encontrado"
              icon={<IconUsers size={48} color="gray" />}
            />
          ) : (
            <Table.ScrollContainer minWidth={500}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Papel</Table.Th>
                    <Table.Th>Acoes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {members.map((member) => (
                    <Table.Tr key={member.user_id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {member.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{member.email}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={ROLE_COLORS[member.role]}
                          variant="light"
                          size="sm"
                        >
                          {member.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {member.role !== 'owner' && (
                          <Tooltip label="Remover">
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="sm"
                              onClick={() => handleRemove(member.user_id)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>

        {/* Invitations Section */}
        <Paper withBorder radius="md" p="lg">
          <Group justify="space-between" mb="md">
            <Title order={4}>Convites</Title>
            <Button
              leftSection={<IconMailPlus size={16} />}
              size="xs"
              onClick={openInviteModal}
            >
              Convidar Membro
            </Button>
          </Group>
          {invitationsLoading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
            </Group>
          ) : !invitations?.length ? (
            <EmptyState
              message="Nenhum convite pendente"
              icon={<IconMail size={48} color="gray" />}
            />
          ) : (
            <Table.ScrollContainer minWidth={500}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Papel</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Acoes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invitations.map((invitation) => (
                    <Table.Tr key={invitation.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {invitation.email}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={ROLE_COLORS[invitation.role]}
                          variant="light"
                          size="sm"
                        >
                          {invitation.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={invitation.is_valid ? 'green' : 'red'}
                          variant="light"
                          size="sm"
                        >
                          {invitation.is_valid ? 'Valido' : 'Expirado'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label="Revogar">
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() => handleRevokeInvitation(invitation.id)}
                            loading={deleteInvitationMutation.isPending}
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
      </Stack>

      {/* Remove Member Confirmation Modal */}
      <Modal
        opened={removeModalOpened}
        onClose={closeRemoveModal}
        title="Confirmar remocao"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Tem certeza que deseja remover este membro do workspace?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeRemoveModal}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={confirmRemove}
              loading={removeMutation.isPending}
            >
              Remover
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        opened={inviteModalOpened}
        onClose={closeInviteModal}
        title="Convidar Membro"
        size="sm"
      >
        <form onSubmit={handleInvite}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="email@exemplo.com"
              required
              {...inviteForm.getInputProps('email')}
            />
            <Select
              label="Papel"
              data={ROLE_OPTIONS}
              value={inviteForm.values.role}
              onChange={(v) => inviteForm.setFieldValue('role', (v ?? 'viewer') as WorkspaceRole)}
            />
            <Button type="submit" loading={createInvitationMutation.isPending}>
              Enviar Convite
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
