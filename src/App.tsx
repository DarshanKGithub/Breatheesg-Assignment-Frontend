import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Button, Container, CssBaseline, Tab, Tabs, Typography, Alert } from '@mui/material';
import { fetchRecords, uploadFile, approveRecord, deleteRecord } from './api';
import UploadCard from './components/UploadCard';
import ReviewTable from './components/ReviewTable';
import createAppTheme from './theme';

const sourceOptions = [
  { key: 'SAP', label: 'SAP fuel/procurement' },
  { key: 'UTILITY', label: 'Electricity utility' },
  { key: 'TRAVEL', label: 'Corporate travel' },
];

function App() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState('SAP');
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const appTheme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    const savedMode = window.localStorage.getItem('esg-theme');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('esg-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const loadRecords = async () => {
    setLoading(true);
    const res = await fetchRecords();
    setRecords(res);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUpload = async (sourceType: string, file: File) => {
    setMessage('Uploading...');
    try {
      await uploadFile(sourceType, file);
      setMessage('Upload complete. Refreshing records.');
      await loadRecords();
    } catch (error) {
      setMessage('Upload failed. Check console.');
      console.error(error);
    }
  };

  const handleApprove = async (id: number) => {
    await approveRecord(id);
    setRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item)));
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((item) => item.id !== id));
      setMessage('Record deleted successfully.');
    } catch (error) {
      setMessage('Deletion failed.');
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 10 }}>
        <Box
          sx={{
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: { xs: 4, md: 6 },
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.35)',
          }}
        >
          <Box sx={{ mb: 10, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ mb: 1, color: 'text.primary' }}>
                Breathe ESG prototype
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Upload SAP, utility, or travel data, review suspect rows, and approve audit-ready emissions.
              </Typography>
            </Box>
            <Button variant="outlined" color="secondary" onClick={toggleMode}>
              {mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gap: 10 }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 4, color: 'text.primary' }}>
                Source ingest
              </Typography>
              <Tabs
                value={selectedSource}
                onChange={(_, value) => setSelectedSource(value)}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{
                  mb: 6,
                  borderRadius: 999,
                  bgcolor: 'background.default',
                  px: 2,
                }}
              >
                {sourceOptions.map((option) => (
                  <Tab
                    key={option.key}
                    label={option.label}
                    value={option.key}
                    sx={{ textTransform: 'none', color: 'text.primary' }}
                  />
                ))}
              </Tabs>
              <UploadCard sourceType={selectedSource} onUpload={handleUpload} />
            </Box>

            <Box>
              <Typography variant="h5" sx={{ mb: 4, color: 'text.primary' }}>
                Review dashboard
              </Typography>
              {message && (
                <Alert severity="info" sx={{ mb: 5, bgcolor: 'background.default', color: 'text.primary' }}>
                  {message}
                </Alert>
              )}
              <ReviewTable records={records} onApprove={handleApprove} onDelete={handleDelete} loading={loading} />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
