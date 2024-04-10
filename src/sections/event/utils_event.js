export const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)',
  };
  
  export const emptyRows = (page, rowsPerPage, totalItems) => {
    return rowsPerPage - Math.min(rowsPerPage, totalItems - page * rowsPerPage);
  };
  
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] === null) {
      return 1;
    }
    if (a[orderBy] === null) {
      return -1;
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  export function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  export function applyFilter({ inputData, comparator, filterName }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);
  console.log("filted Nmae: ",filterName)
  console.log("data Nmae: ",inputData)

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    let filteredData = stabilizedThis.map((el) => el[0]);
  
    if (filterName) {
      filteredData = filteredData.filter(
        // Change 'name' to 'eventName' or any other event-related attribute you wish to filter by
        (event) => event.name? event.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1:""
      );
    }
  
    return filteredData;
  }
  