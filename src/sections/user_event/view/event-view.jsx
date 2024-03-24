import React, { useState } from 'react';
import events from 'src/_mock/events'; // Adjust this path if necessary

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EventTableHead from '../event-table-head';
import EventTableRow from '../event-table-row';
import EventTableToolbar from '../event-table-toolbar';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils_event';

export default function EventPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('eventName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setPage(0); // Reset to the first page
    setFilterName(event.target.value); // Update filterName with the input field value
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = events.map((event) => event.eventName);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const dataFiltered = applyFilter({
    inputData: events,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Event
        </Button>
      </Stack>

      <Card>
        <EventTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EventTableHead
                order={order}
                orderBy={orderBy}
                rowCount={events.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'eventName', label: 'Event Name', width: '20%' },
                  { id: 'eventId', label: 'Event ID', width: '10%' },
                  { id: 'description', label: 'Description', width: '25%' },
                  { id: 'startDate', label: 'Start Date', width: '10%' },
                  { id: 'endDate', label: 'End Date', width: '10%' },
                  { id: 'status', label: 'Status', width: '10%' },
                  { id: 'location', label: 'Location', width: '15%' },
                ]}
              />
              <TableBody>
  {dataFiltered
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((event) => (
      <EventTableRow
        key={event.id}
        id={event.id}
        eventName={event.eventName}
        eventId={event.eventId} // Make sure to pass the eventId prop
        description={event.description}
        startDate={event.startDate}
        endDate={event.endDate}
        status={event.status}
        location={event.location}
        selected={selected.indexOf(event.id) !== -1}
        handleClick={handleClick}
      />
  ))}
    {emptyRows > 0 && (
    <TableEmptyRows
      height={77}
      emptyRows={emptyRows}
    />
  )}

</TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
