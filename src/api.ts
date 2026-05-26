const apiBase = '/api';

export async function fetchRecords() {
  const response = await fetch(`${apiBase}/records/`);
  if (!response.ok) throw new Error('Failed to load records');
  return response.json();
}

export async function uploadFile(sourceType: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${apiBase}/upload/${sourceType}/`, {
    method: 'POST',
    body: form,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Upload failed');
  }
  return response.json();
}

export async function approveRecord(id: number) {
  const response = await fetch(`${apiBase}/records/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved', approved_by: 'analyst@example.com' }),
  });
  if (!response.ok) throw new Error('Approval failed');
  return response.json();
}

export async function deleteRecord(id: number) {
  const response = await fetch(`${apiBase}/records/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Deletion failed');
}
