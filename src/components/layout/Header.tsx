import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Burger,
  Group,
  Select,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function Header({ opened, onToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
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

      <Select
        placeholder="Selecione um negocio"
        data={[]}
        disabled
        w={250}
        visibleFrom="xs"
      />

      <ActionIcon
        variant="default"
        size="lg"
        onClick={toggleColorScheme}
        aria-label="Alternar tema"
      >
        {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Group>
  );
}
