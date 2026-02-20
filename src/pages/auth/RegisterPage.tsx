import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PinInput,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  useRegister,
  useVerifyRegistration,
  useResendCode,
} from '@/hooks/useAuth';

export default function RegisterPage() {
  const registerMutation = useRegister();
  const verifyMutation = useVerifyRegistration();
  const resendMutation = useResendCode();

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [verificationId, setVerificationId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      workspace_name: '',
    },
    validate: {
      name: (v) => (v.length >= 2 ? null : 'Nome deve ter pelo menos 2 caracteres'),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Email invalido'),
      password: (v) =>
        v.length >= 6 ? null : 'Senha deve ter pelo menos 6 caracteres',
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleRegister = form.onSubmit((values) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.workspace_name ? { workspace_name: values.workspace_name } : {}),
    };
    registerMutation.mutate(payload, {
      onSuccess: (data) => {
        setVerificationId(data.verification_id);
        setEmail(values.email);
        setStep('verify');
      },
    });
  });

  const handleVerify = () => {
    if (code.length === 6) {
      verifyMutation.mutate({ verification_id: verificationId, code });
    }
  };

  const handleResend = useCallback(() => {
    if (cooldown > 0) return;
    resendMutation.mutate(
      { verification_id: verificationId },
      {
        onSuccess: (data) => {
          setVerificationId(data.verification_id);
          setCooldown(data.next_resend_in_seconds);
        },
      },
    );
  }, [cooldown, resendMutation, verificationId]);

  return (
    <Container size={420} py={80}>
      <Title ta="center" fw={700}>
        {step === 'register' ? 'Criar conta' : 'Verificar email'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        {step === 'register'
          ? 'Preencha os dados para criar sua conta'
          : `Enviamos um codigo para ${email}`}
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        {step === 'register' ? (
          <form onSubmit={handleRegister}>
            <Stack>
              <TextInput
                label="Nome"
                placeholder="Seu nome"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Senha"
                placeholder="Minimo 6 caracteres"
                required
                {...form.getInputProps('password')}
              />
              <TextInput
                label="Nome do workspace"
                placeholder="Opcional"
                {...form.getInputProps('workspace_name')}
              />
              <Button
                type="submit"
                fullWidth
                loading={registerMutation.isPending}
              >
                Cadastrar
              </Button>
              <Text ta="center" size="sm">
                Ja tem conta?{' '}
                <Anchor component={Link} to="/login" size="sm">
                  Entrar
                </Anchor>
              </Text>
            </Stack>
          </form>
        ) : (
          <Stack>
            <PinInput
              length={6}
              type="number"
              mx="auto"
              value={code}
              onChange={setCode}
            />
            <Button
              fullWidth
              loading={verifyMutation.isPending}
              onClick={handleVerify}
              disabled={code.length !== 6}
            >
              Verificar
            </Button>
            <Text ta="center" size="sm">
              {cooldown > 0 ? (
                `Reenviar codigo em ${cooldown}s`
              ) : (
                <Anchor
                  component="button"
                  size="sm"
                  onClick={handleResend}
                >
                  Reenviar codigo
                </Anchor>
              )}
            </Text>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
