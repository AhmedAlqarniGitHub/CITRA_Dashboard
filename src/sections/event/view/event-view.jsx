import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EventTableHead from '../event-table-head';
import EventTableRow from '../event-table-row';
import EventTableToolbar from '../event-table-toolbar';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { applyFilter, getComparator} from '../utils_event';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('eventName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/events/all`)
      .then((response) => {
        setEvents(response.data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const refreshEventList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/events/all`);
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? events.map((n) => n._id) : []);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected =
      selectedIndex === -1 ? [...selected, id] : selected.filter((selectedId) => selectedId !== id);
    setSelected(newSelected);
  };

  const dataFiltered = applyFilter({
    inputData: events,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataFiltered.length - page * rowsPerPage);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
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
                  { id: 'eventId', label: 'Event ID', align: 'left' },
                  { id: 'eventName', label: 'Event Name', align: 'left' },
                  { id: 'description', label: 'Description', align: 'left' },
                  { id: 'startDate', label: 'Start Date', align: 'left' },
                  { id: 'endDate', label: 'End Date', align: 'left' },
                  { id: 'location', label: 'Location', align: 'left' },
                  { id: 'status', label: 'Status', align: 'left' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6}>Error: {error}</td>
                  </tr>
                ) : dataFiltered.length > 0 ? (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EventTableRow
                        key={row._id}
                        eventName={row.name}
                        organizer={row.organizer}
                        eventId={row._id}
                        id={row._id}
                        description={row.description}
                        startDate={row.startingDate}
                        endDate={row.endingDate}
                        status={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        location={row.location}
                        selected={selected.includes(row._id)}
                        handleClick={() => handleClick(row._id)}
                        refreshEventList={refreshEventList}
                      />
                    ))
                ) : (
                  <TableNoData query={filterName} />
                )}
 

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
    </Container>
  );
}
