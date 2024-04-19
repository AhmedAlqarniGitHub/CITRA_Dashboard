import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Stack,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Grid,
  IconButton,
  Avatar
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openAvatarSelector, setOpenAvatarSelector] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'organizer',
    description: '',
    avatarUrl: '',
  });
  const defaultAvatar = '/assets/images/avatars/avatar_2.jpg';
  //const avatarOptions = ['avatar_1.jpg', 'avatar_2.jpg', 'avatar_3.jpg']; // Example avatar filenames
  const avatarOptions = Array.from({ length: 15 }, (_, i) => `avatar_${i + 1}.jpg`);

  useEffect(() => {
    refreshUserList();
  }, []);


  const isDarkMode = localStorage.getItem('themeMode') === 'dark';


  const refreshUserList = () => {
    let user = {
      id: localStorage.getItem('id'),
    };
    axios
      .get(`${apiBaseUrl}/users/all/${user.id}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error('Error fetching users:', err));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? users.map((n) => n.name) : []);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = selectedIndex === -1 ? [...selected, name] : selected.filter((selectedId) => selectedId !== name);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleUserDialogClickOpen = () => {
    setOpenUserDialog(true);
  };

  const handleUserDialogClose = () => {
    setOpenUserDialog(false);
  };

  const handleAvatarClickOpen = () => {
    setOpenAvatarSelector(true);
  };

  const handleAvatarClose = () => {
    setOpenAvatarSelector(false);
  };

  const handleAvatarSelect = (avatar) => {
    setNewUser({ ...newUser, avatarUrl: avatar });
    setOpenAvatarSelector(false);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUser = async () => {
    try {
      let user = {
        id: localStorage.getItem('id'),
      };
      const response = await axios.post(`${apiBaseUrl}/users/register`, userData);
      handleUserDialogClose(); // Close dialog upon successful submission
      refreshUserList(); // Refresh the user list
    } catch (error) {
      console.error('There was an error submitting the form', error);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleUserDialogClickOpen}
        >
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer>
            <Table>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'role', label: 'Role' },
                  { id: 'email', label: 'Email' },
                  { id: 'description', label: 'Description' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id}
                      selected={selected.includes(row.name)}
                      name={row.name}
                      roleName={row.role}
                      email={row.email}
                      description={row.description}
                      avatarUrl={"/assets/images/avatars/"+row.avatarUrl}
                      handleClick={handleClick}
                    />
                  ))}
                <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, users.length)} />
                {notFound && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog open={openUserDialog} onClose={handleUserDialogClose}    sx={{
        '& .MuiDialog-paper': {
          boxShadow: isDarkMode ? 'none' : undefined,  // Conditionally apply boxShadow
        },
      }}
    >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {/* Avatar Selection Button */}
          <IconButton onClick={handleAvatarClickOpen} sx={{ margin: 'auto', display: 'block' }}>
            <Avatar
              src={newUser.avatarUrl ? `/assets/images/avatars/${newUser.avatarUrl}` : defaultAvatar}
              alt="Avatar"
              sx={{ width: 64, height: 64 }}
            />
          </IconButton>


          {/* User Information Fields */}
          <TextField
            
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={handleUserChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={handleUserChange}
          />
          <TextField
            margin="dense"
            name="role"
            label="Role"
            select
            fullWidth
            value={newUser.role}
            onChange={handleUserChange}
          >
            <MenuItem value="organizer">Organizer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={newUser.description}
            onChange={handleUserChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDialogClose}>Cancel</Button>
          <Button onClick={handleSubmitUser}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Avatar Selection Dialog */}
      <Dialog open={openAvatarSelector} onClose={handleAvatarClose}>
        <DialogTitle>Select Avatar</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {avatarOptions.map((avatar, index) => (
              <Grid item xs={4} key={index}>
                <IconButton onClick={() => handleAvatarSelect(avatar)} style={{ padding: 0 }}>
                  <img src={`/assets/images/avatars/${avatar}`} alt={`Avatar ${index + 1}`} style={{ width: 64, height: 64, borderRadius: '50%' }} />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAvatarClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container >
  );
}
