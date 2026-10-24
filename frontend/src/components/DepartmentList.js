import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllDepartments, deleteDepartment } from '../services/departmentService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Stack,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoadingOverlay from './LoadingOverlay';
import useAuth from '../hooks/useAuth';
import { notifyInfo, notifyApiError } from '../utils/toast';

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);
  const { authenticated: isLoggedIn } = useAuth();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [denseRows, setDenseRows] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) setShowSnackbar(true);
  }, [isLoggedIn]);

  // Fetch departments data if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getAllDepartments();
          setDepartments(data);
        } catch (error) {
          console.error('Error fetching departments:', error);
          notifyApiError(error, 'We could not load your departments. Please try again.');
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [isLoggedIn]);

  const handleDelete = async id => {
    setDeletingDepartmentId(id);
    const removed = departments.find(department => department.id === id);
    try {
      await deleteDepartment(id);
      setDepartments(prevDepartments => prevDepartments.filter(department => department.id !== id));
      notifyInfo(`${removed ? `Department "${removed.name}"` : 'Department'} was removed.`);
    } catch (error) {
      console.error('Error deleting department:', error);
      notifyApiError(error, 'We could not delete this department. It may still have employees assigned.');
    }
    setDeletingDepartmentId(null);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page to 0 whenever search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const handleExportCsv = () => {
    const header = ['Department Name', 'Department ID'];
    const rows = departments.map(dep => [dep.name || '', dep.id || '']);
    const escapeCell = cell => `"${cell.toString().replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(row => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'departments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyId = id => {
    if (navigator?.clipboard?.writeText && id !== undefined) {
      navigator.clipboard.writeText(String(id));
    }
  };

  const filteredDepartments = departments
    .filter(department => department.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortDirection === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const totalDepartments = departments.length;
  const visibleDepartments = filteredDepartments.length;

  if (loading) {
    return <LoadingOverlay message="Loading departments…" />;
  }

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Box>
      <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          You must be logged in to access the department list.{' '}
          <span
            onClick={handleLoginRedirect}
            style={{
              color: '#4f46e5',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => (e.target.style.color = '#3730a3')}
            onMouseLeave={e => (e.target.style.color = '#4f46e5')}
          >
            Login
          </span>
        </Alert>
      </Snackbar>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Departments
          </Typography>
          <Typography color="text.secondary">Organize teams with quick filters, exports, and at-a-glance stats.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleExportCsv}
            sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { backgroundColor: 'primary.main', color: '#ffffff', borderColor: 'primary.main' } }}
          >
            Export CSV
          </Button>
          <Button variant="contained" component={Link} to="/add-department">
            Add Department
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
              border: '1px solid rgba(99, 102, 241, 0.18)',
              boxShadow: '0 12px 35px rgba(79, 70, 229, 0.09)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total departments
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {totalDepartments}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across your organization
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)',
              border: '1px solid rgba(8, 145, 178, 0.18)',
              boxShadow: '0 12px 35px rgba(8, 145, 178, 0.09)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Visible now
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {visibleDepartments}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Matching search
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
              border: '1px solid rgba(139, 92, 246, 0.18)',
              boxShadow: '0 12px 35px rgba(139, 92, 246, 0.09)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Quick actions
            </Typography>
            <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
              <Chip label="Add dept" color="primary" component={Link} to="/add-department" clickable />
              <Chip label="View employees" component={Link} to="/employees" clickable />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField label="Search for a department" variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="sort-dept-label">Sort by</InputLabel>
              <Select labelId="sort-dept-label" value={sortDirection} label="Sort by" onChange={e => setSortDirection(e.target.value)}>
                <MenuItem value="asc">Name A-Z</MenuItem>
                <MenuItem value="desc">Name Z-A</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel control={<Switch checked={denseRows} onChange={e => setDenseRows(e.target.checked)} color="primary" />} label="Compact rows" />
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size={denseRows ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f7f7f7' }}>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(department => (
              <TableRow
                key={department.id}
                hover
                sx={{
                  backgroundColor: '#ffffff',
                  '&:nth-of-type(2n)': { backgroundColor: '#fbfbfb' },
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 25px rgba(23, 23, 23, 0.08)' },
                }}
              >
                <TableCell>{department.name}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{department.id}</Typography>
                    <Tooltip title="Copy ID">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleCopyId(department.id)}
                          sx={{ minWidth: 36, borderColor: '#3a3a3a', color: '#3a3a3a', '&:hover': { backgroundColor: '#3a3a3a', color: '#ffffff' } }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="outlined" component={Link} to={`/edit-department/${department.id}`}>
                      Edit
                    </Button>
                    <Tooltip title="This will remove the department">
                      <span>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(department.id)}
                          sx={{ minWidth: 90 }}
                          disabled={deletingDepartmentId === department.id}
                          startIcon={deletingDepartmentId === department.id ? <CircularProgress size={20} /> : null}
                        >
                          {deletingDepartmentId === department.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDepartments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DepartmentList;
