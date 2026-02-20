import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Button,
  Container,
  Divider,
  Paper,
  PinInput,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin, useGoogleAuth, useVerify2fa } from '@/hooks/useAuth';

export default function LoginPage() {
  const loginMutation = useLogin();
  const verify2faMutation = useVerify2fa();
  const getGoogleAuth = useGoogleAuth();
  const [show2fa, setShow2fa] = useState(false);
  const [code2fa, setCode2fa] = useState('');

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Email invalido'),
      password: (v) => (v.length > 0 ? null : 'Senha obrigatoria'),
    },
  });

  const handleLogin = form.onSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        if (data.requires_2fa) {
          setShow2fa(true);
        }
      },
    });
  });

  const handleVerify2fa = () => {
    if (code2fa.length === 6) {
      verify2faMutation.mutate({ code: code2fa });
    }
  };

  return (
    <Container size={420} py={80}>
      <Title ta="center" fw={700}>
        SimpleTracker
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        Entre na sua conta
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        {!show2fa ? (
          <form onSubmit={handleLogin}>
            <Stack>
              <TextInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                required
                {...form.getInputProps('password')}
              />
              <Button
                type="submit"
                fullWidth
                loading={loginMutation.isPending}
              >
                Entrar
              </Button>

              <Divider label="ou" labelPosition="center" />

              <Button
                variant="outline"
                fullWidth
                onClick={() => getGoogleAuth()}
              >
                Entrar com Google
              </Button>

              <Text ta="center" size="sm">
                Nao tem conta?{' '}
                <Anchor component={Link} to="/register" size="sm">
                  Cadastre-se
                </Anchor>
              </Text>
            </Stack>
          </form>
        ) : (
          <Stack>
            <Text ta="center" size="sm">
              Digite o codigo de verificacao enviado para seu email
            </Text>
            <PinInput
              length={6}
              type="number"
              mx="auto"
              value={code2fa}
              onChange={setCode2fa}
            />
            <Button
              fullWidth
              loading={verify2faMutation.isPending}
              onClick={handleVerify2fa}
              disabled={code2fa.length !== 6}
            >
              Verificar
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
