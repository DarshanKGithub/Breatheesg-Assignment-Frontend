import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

type Props = {
  records: any[];
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
};

const statusColor = (status: string) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
};

export default function ReviewTable({ records, onApprove, onDelete, loading }: Props) {
  if (loading) {
    return <Typography color="text.secondary">Loading review rows…</Typography>;
  }

  if (!records.length) {
    return (
      <Paper sx={{ borderRadius: 4, border: 1, borderColor: 'divider', bgcolor: 'background.default', p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No records ingested yet. Upload a CSV to begin.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, border: 1, borderColor: 'divider', bgcolor: 'background.default', boxShadow: 'none' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Emission (kg CO2e)</TableCell>
            <TableCell>Suspicious</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              sx={{
                bgcolor: record.status === 'pending' ? 'action.hover' : 'inherit',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell>
                <Chip label={record.status} color={statusColor(record.status)} size="small" />
              </TableCell>
              <TableCell>{record.source_type}</TableCell>
              <TableCell>{record.category}</TableCell>
              <TableCell>{record.event_date ?? 'n/a'}</TableCell>
              <TableCell>{record.normalized_quantity ?? record.quantity} {record.normalized_unit || record.quantity_unit}</TableCell>
              <TableCell>{record.emission_kg_co2e?.toFixed?.(2) ?? 'n/a'}</TableCell>
              <TableCell>{record.suspicious_reason || 'None'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {record.status === 'pending' ? (
                    <Button variant="contained" size="small" onClick={() => onApprove(record.id)}>
                      Approve
                    </Button>
                  ) : (
                    <Typography color="text.secondary">Locked</Typography>
                  )}
                  <Button variant="outlined" color="error" size="small" onClick={() => onDelete(record.id)}>
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
