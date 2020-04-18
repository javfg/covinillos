import React from 'react';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LastPageIcon from '@material-ui/icons/LastPage';
import {
  Link,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableSortLabel,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { countryToFlag } from '../utils/utils';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, cols } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {cols.map(col => (
          <TableCell
            key={col.id}
            align={col.numeric ? 'right' : 'left'}
            sortDirection={orderBy === col.id ? order : false}
            width={`${col.width}%`}
          >
            {col.sortable ? (
              <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : 'asc'}
                onClick={createSortHandler(col.id)}
              >
                {col.label}
              </TableSortLabel>
            ) : (
              col.label
            )}

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));


function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const classes = useStyles1();


  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}


const useStyles2 = makeStyles({
  table: { minWidth: 500 },
  root: { margin: '0 5% 0 5%', width: '90%' },
  cellsm: { padding: '0 1rem 0 1rem' },
});


export default function DataTable(props) {
  const { rows, cols } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('date');

  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, rows.length - page * rowsPerPage
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const classes = useStyles2();


  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} size="small">
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            cols={cols}
          />
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow key={`${row.country}-${row.date}-${row.description}`}>
                {cols.map(col =>
                  <TableCell
                    key={`tablecell-${col.id}`}
                    className={classes.cellsm}
                  >
                    {col.cellContent(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          }

          {emptyRows > 0 && (
            <TableRow style={{ height: 30 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
