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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
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

const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://localhost:3000';

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
    status: 'available', // Default status
    eventName:''
  });


  const [cameras, setCameras] = useState([]);

  const isDarkMode = localStorage.getItem('themeMode') === 'dark';

  useEffect(() => {
    refreshCameraList();
  }, []);

  const refreshCameraList = () => {
    let user = {
      id: localStorage.getItem('id'),
    };
    axios
      .get(`${apiBaseUrl}/cameras/all/${user.id}`)
      .then((response) => {
        setCameras(response.data);
        console.log("response of /cameras/all : ",response.data)
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
    try {
      newCamera.id = window.localStorage.getItem('id')
      const response = await axios.post(`${apiBaseUrl}/cameras/add`, newCamera);
      handleCameraDialogClose();
      refreshCameraList();
    } catch (error) {
      console.error('Error adding camera:', error);
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
    filterFields: ['manufacturer', 'model', 'eventName'], // Specify searchable fields
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Cameras</Typography>
        {window.localStorage.getItem("role")=='admin'?

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleCameraDialogOpen}
        >
          New Camera
        </Button>:null}
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
                  { id: 'model', label: 'Model' },
                  { id: 'manufacturer', label: 'Manufacturer' },
                  { id: 'supportedQuality', label: 'Quality' },
                  { id: 'framesPerSecond', label: 'FPS' },
                  { id: 'status', label: 'Status' }, // Added status
                  { id: 'eventName', label: 'Event Name' }, // Added event name

                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((camera) => (
                    <CameraTableRow
                      key={camera._id}
                      id={camera._id}
                      selected={selected.indexOf(camera.id) !== -1}
                      handleClick={(event) => handleClick(event, camera.id)}
                      manufacturer={camera.manufacturer}
                      model={camera.model}
                      supportedQuality={camera.supportedQuality}
                      framesPerSecond={camera.framesPerSecond}
                      status={camera.status} // Pass the status
                      eventName={camera.eventName} // Pass the event name
                      refreshCameraList={refreshCameraList}
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

      <Dialog open={openCameraDialog} onClose={handleCameraDialogClose}  sx={{
        '& .MuiDialog-paper': {
          boxShadow: isDarkMode ? 'none' : undefined,  // Conditionally apply boxShadow
        },
      }}
    >
        <DialogTitle>Add New Camera</DialogTitle>
        <DialogContent>
          <TextField
            
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

          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              row
              name="status"
              value={newCamera.status}
              onChange={handleCameraChange}
            >
              <FormControlLabel value="available" control={<Radio />} label="Available" />
              <FormControlLabel value="in-use" control={<Radio />} label="In Use" />
              <FormControlLabel value="maintenance" control={<Radio />} label="Maintenance" />
            </RadioGroup>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCameraDialogClose}>Cancel</Button>
          <Button onClick={handleSubmitCamera}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
