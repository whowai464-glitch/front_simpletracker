import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Burger,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconPlus } from '@tabler/icons-react';
import { useBusinesses, useCreateBusiness } from '@/hooks/useBusinesses';
import { useBusinessStore } from '@/stores/businessStore';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function Header({ opened, onToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure();

  const { data: businesses, isLoading } = useBusinesses();
  const createMutation = useCreateBusiness();

  const selectedBusinessId = useBusinessStore((s) => s.selectedBusinessId);
  const setSelectedBusiness = useBusinessStore((s) => s.setSelectedBusiness);

  const [autoSelected, setAutoSelected] = useState(false);

  // Auto-select first business if none selected
  useEffect(() => {
    if (!autoSelected && businesses?.length && !selectedBusinessId) {
      setSelectedBusiness(businesses[0].id);
      setAutoSelected(true);
    }
  }, [businesses, selectedBusinessId, setSelectedBusiness, autoSelected]);

  const selectData = (businesses ?? []).map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const form = useForm({
    initialValues: { name: '', description: '' },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : 'Nome obrigatorio'),
    },
  });

  const handleCreate = form.onSubmit((values) => {
    createMutation.mutate(
      {
        name: values.name,
        ...(values.description ? { description: values.description } : {}),
      },
      {
        onSuccess: (created) => {
          setSelectedBusiness(created.id);
          form.reset();
          closeModal();
        },
      },
    );
  });

  return (
    <>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={onToggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Text
            fw={700}
            size="lg"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            SimpleTracker
          </Text>
        </Group>

        <Group gap="xs" visibleFrom="xs">
          <Select
            placeholder="Selecione um negocio"
            data={selectData}
            value={selectedBusinessId}
            onChange={(v) => v && setSelectedBusiness(v)}
            disabled={isLoading}
            w={250}
            searchable
          />
          <ActionIcon
            variant="light"
            size="lg"
            onClick={openModal}
            aria-label="Criar negocio"
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Group>

        <ActionIcon
          variant="default"
          size="lg"
          onClick={toggleColorScheme}
          aria-label="Alternar tema"
        >
          {colorScheme === 'dark' ? (
            <IconSun size={18} />
          ) : (
            <IconMoon size={18} />
          )}
        </ActionIcon>
      </Group>

      <Modal opened={modalOpened} onClose={closeModal} title="Criar negocio">
        <form onSubmit={handleCreate}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Nome do negocio"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Descricao"
              placeholder="Descricao opcional"
              {...form.getInputProps('description')}
            />
            <Button type="submit" loading={createMutation.isPending}>
              Criar
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
