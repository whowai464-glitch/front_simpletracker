import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Card, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Stack align="center" justify="center" py={120}>
          <Card withBorder radius="md" p="xl" maw={400} w="100%">
            <Stack align="center" gap="md">
              <IconAlertTriangle size={48} color="var(--mantine-color-red-6)" />
              <Title order={3} ta="center">
                Algo deu errado
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Ocorreu um erro inesperado. Tente novamente ou recarregue a pagina.
              </Text>
              <Button onClick={this.handleRetry} variant="light">
                Tentar novamente
              </Button>
            </Stack>
          </Card>
        </Stack>
      );
    }

    return this.props.children;
  }
}
