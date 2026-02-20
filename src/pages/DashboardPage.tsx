import { useMemo, useState } from 'react';
import {
  Card,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconChartBar } from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useEventVolumeByHour } from '@/hooks/useReports';

const COLORS = [
  '#228be6', '#40c057', '#fab005', '#fa5252', '#7950f2',
  '#15aabf', '#e64980', '#82c91e', '#fd7e14', '#868e96',
];

function getDefaultDateRange(): [string, string] {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return [from.toISOString().split('T')[0], to.toISOString().split('T')[0]];
}

export default function DashboardPage() {
  const [defaultFrom, defaultTo] = getDefaultDateRange();
  const [fromDate, setFromDate] = useState<string | null>(defaultFrom);
  const [toDate, setToDate] = useState<string | null>(defaultTo);

  const fromParam = fromDate || undefined;
  const toParam = toDate || undefined;

  const { data, isLoading } = useEventVolumeByHour(fromParam, toParam);

  // Transform rows into chart-friendly format: group by hour, with event names as keys
  const { chartData, eventNames } = useMemo(() => {
    if (!data?.rows.length) return { chartData: [], eventNames: [] };

    const names = [...new Set(data.rows.map((r) => r.event_name))];
    const hourMap = new Map<string, Record<string, number>>();

    for (const row of data.rows) {
      if (!hourMap.has(row.hour)) {
        hourMap.set(row.hour, { hour: row.hour } as unknown as Record<string, number>);
      }
      const entry = hourMap.get(row.hour)!;
      entry[row.event_name] = row.count;
    }

    const sorted = [...hourMap.values()].sort((a, b) =>
      String(a.hour).localeCompare(String(b.hour)),
    );

    return { chartData: sorted, eventNames: names };
  }, [data]);

  const totalEvents = useMemo(() => {
    if (!data?.rows.length) return 0;
    return data.rows.reduce((sum, r) => sum + r.count, 0);
  }, [data]);

  const uniqueEventTypes = useMemo(() => {
    if (!data?.rows.length) return 0;
    return new Set(data.rows.map((r) => r.event_name)).size;
  }, [data]);

  return (
    <>
      <PageHeader title="Dashboard" />

      <Stack gap="md">
        <Group gap="md">
          <DateInput
            label="De"
            value={fromDate}
            onChange={setFromDate}
            valueFormat="DD/MM/YYYY"
            clearable
          />
          <DateInput
            label="Ate"
            value={toDate}
            onChange={setToDate}
            valueFormat="DD/MM/YYYY"
            clearable
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card withBorder radius="md" p="lg">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Total de Eventos
            </Text>
            <Title order={2} mt="xs">
              {isLoading ? <Loader size="sm" /> : totalEvents.toLocaleString('pt-BR')}
            </Title>
          </Card>
          <Card withBorder radius="md" p="lg">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Tipos de Evento
            </Text>
            <Title order={2} mt="xs">
              {isLoading ? <Loader size="sm" /> : uniqueEventTypes}
            </Title>
          </Card>
        </SimpleGrid>

        <Paper withBorder radius="md" p="lg">
          <Title order={4} mb="md">
            Volume de Eventos por Hora
          </Title>
          {isLoading ? (
            <Group justify="center" p="xl">
              <Loader />
            </Group>
          ) : !chartData.length ? (
            <EmptyState
              message="Nenhum dado disponivel para o periodo selecionado"
              icon={<IconChartBar size={48} color="gray" />}
            />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                {eventNames.map((name, i) => (
                  <Bar
                    key={name}
                    dataKey={name}
                    stackId="events"
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Stack>
    </>
  );
}
