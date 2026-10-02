import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export function StatCard({ title, value, detail, color }: { title: string; value: string; detail: string; color: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {detail}
        </Typography>
      </CardContent>
    </Card>
  );
}
