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
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'organizer',
    description: '',
  });

  useEffect(() => {
    refreshUserList();
  }, []);

  const refreshUserList = () => {
    axios
      .get(`${apiBaseUrl}/users/all`)
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
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

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

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleUserDialogClickOpen = () => {
    setOpenUserDialog(true);
  };

  const handleUserDialogClose = () => {
    setOpenUserDialog(false);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) || '' : value, // Ensures age is handled as a number
    }));
  };

  const handleSubmitUser = async () => {
    // Validate newUser against userValidationSchema here...
    const userData = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      description: newUser.description,
    };
    try {
      const response = await axios.post(`${apiBaseUrl}/users/register`, userData);
      console.log(response.data);
      refreshUserList();
      handleUserDialogClose(); // Close the dialog upon successful submission
    } catch (error) {
      console.error('There was an error submitting the form', error);
      // Handle UI error feedback
    }
  };

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
                  // { id: 'isVerified', label: 'Verified', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id} // Using _id as key
                      id={row._id} // Ensure id is passed
                      selected={selected.indexOf(row.name) !== -1}
                      name={row.name}
                      avatarUrl={row.avatarUrl}
                      roleName={row.role}
                      email={row.email}
                      isVerified={row.isVerified}
                      description={row.description}
                      handleClick={handleClick}
                      refreshUserList={refreshUserList}
                    />
                  ))}
                <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, users.length)} />
                {dataFiltered.length === 0 && <TableNoData />}
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
      <Dialog open={openUserDialog} onClose={handleUserDialogClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
    </Container>
  );
}
