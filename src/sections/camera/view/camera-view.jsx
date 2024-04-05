import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { cameras } from 'src/_mock/camera';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import CameraTableRow from '../camera-table-row';
import CameraTableHead from '../camera-table-head';
import TableEmptyRows from '../table-empty-rows';
import CameraTableToolbar from '../camera-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ----------------------------------------------------------------------

export default function CameraPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCameraDialog, setOpenCameraDialog] = useState(false);
  const [newCamera, setNewCamera] = useState({
    manufacturer: '',
    model: '',
    supportedQuality: '1080p', // Default quality
    framesPerSecond: 30, // Default FPS
  });

  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    refreshCameraList();
  }, []);

  const refreshCameraList = () => {
    axios
      .get(`${apiBaseUrl}/cameras/all`)
      .then((response) => {
        setCameras(response.data);
      })
      .catch((err) => console.error('Error fetching cameras:', err));
  };

  const handleCameraDialogOpen = () => setOpenCameraDialog(true);
  const handleCameraDialogClose = () => setOpenCameraDialog(false);

  const handleCameraChange = (e) => {
    const { name, value } = e.target;
    setNewCamera((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCamera = async () => {
    // Validation logic here...
    try {
      const response = await axios.post(`${apiBaseUrl}/cameras/add`, newCamera);
      console.log(response.data);
      handleCameraDialogClose();
      refreshCameraList(); // Refresh the camera list
    } catch (error) {
      console.error('Error adding camera:', error);
      // Show error feedback...
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = cameras.map((n) => n.name);
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
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: cameras,
    comparator: getComparator(order, orderBy),
    filterName,
    filterFields: ['manufacturer', 'model', 'supportedQuality', 'framesPerSecond'], // Specify searchable fields
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Cameras</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleCameraDialogOpen}
        >
          New Camera
        </Button>
      </Stack>

      <Card>
        <CameraTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CameraTableHead
                order={order}
                orderBy={orderBy}
                rowCount={cameras.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'manufacturer', label: 'Manufacturer' },
                  { id: 'model', label: 'Model' },
                  { id: 'supportedQuality', label: 'Quality' },
                  { id: 'framesPerSecond', label: 'FPS' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((camera) => (
                    <CameraTableRow
                      key={camera._id} // Unique key for each row
                      id={camera._id}
                      selected={selected.indexOf(camera.id) !== -1}
                      handleClick={(event) => handleClick(event, camera.id)}
                      manufacturer={camera.manufacturer} // Correctly pass manufacturer info
                      model={camera.model || camera.name} // Correctly pass model name
                      supportedQuality={camera.supportedQuality} // Pass quality info
                      framesPerSecond={camera.framesPerSecond} // Ensure FPS data is passed
                      status={camera.status} // Assuming you have a 'status' field in your camera objects
                      refreshCameraList={refreshCameraList} // Add this to refresh the list after update/delete
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, cameras.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={cameras.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openCameraDialog} onClose={handleCameraDialogClose}>
        <DialogTitle>Add New Camera</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="manufacturer"
            label="Manufacturer"
            type="text"
            fullWidth
            value={newCamera.manufacturer}
            onChange={handleCameraChange}
          />
          <TextField
            margin="dense"
            name="model"
            label="Model"
            type="text"
            fullWidth
            value={newCamera.model}
            onChange={handleCameraChange}
          />
          <TextField
            margin="dense"
            name="supportedQuality"
            label="Supported Quality"
            select
            fullWidth
            value={newCamera.supportedQuality}
            onChange={handleCameraChange}
          >
            {/* Add MenuItem components for each supported quality option */}
            <MenuItem value="720p">720p</MenuItem>
            <MenuItem value="1080p">1080p</MenuItem>
            <MenuItem value="4k">4k</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="framesPerSecond"
            label="Frames Per Second (FPS)"
            select
            fullWidth
            value={newCamera.framesPerSecond}
            onChange={handleCameraChange}
          >
            <MenuItem value={24}>24 FPS (Cinematic)</MenuItem>
            <MenuItem value={30}>30 FPS (Standard)</MenuItem>
            <MenuItem value={60}>60 FPS (Smooth)</MenuItem>
            <MenuItem value={120}>120 FPS (High Frame Rate)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCameraDialogClose}>Cancel</Button>
          <Button onClick={handleSubmitCamera}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
