import { useState } from 'react';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

type Props = {
  sourceType: string;
  onUpload: (sourceType: string, file: File) => void;
};

export default function UploadCard({ sourceType, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Card sx={{ borderRadius: 4, border: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
      <CardContent sx={{ p: 4, display: 'grid', gap: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Upload a CSV export for <strong>{sourceType}</strong>. Use one of the sample shapes from the assignment spec.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Button variant="outlined" component="label" sx={{ borderColor: 'divider', color: 'text.primary' }}>
            Choose file
            <input
              hidden
              type="file"
              accept=".csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }}>
            {file?.name ?? 'No file selected'}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            disabled={!file}
            onClick={() => file && onUpload(sourceType, file)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Upload {sourceType} CSV
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
