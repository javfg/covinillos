import React from 'react';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  TableRow,
} from '@material-ui/core';


const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const useStyles2 = makeStyles({
  table: { minWidth: 500, tableLayout: 'fixed' },
  tableheader: { textTransform: 'uppercase' },
  root: { margin: '1rem 0', width: '100%', maxHeight: '314px' },
  cellsm: {
    padding: '0 .25rem 0 .25rem',
    height: '28px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tc: {
    padding: '.25rem',
    fontSize: '.75rem',
    backgroundColor: 'lightgrey',
  }
});


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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


function EnhancedTableHead({ order, orderBy, onRequestSort, cols }) {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const classes = useStyles2();


  return (
    <TableHead>
      <TableRow className={classes.tableheader}>
        {cols.map(col => (
          <TableCell
            key={col.id}
            className={classes.tc}
            align={col.align ? col.align : col.numeric ? 'right' : 'left'}
            sortDirection={orderBy === col.id ? order : false}
            width={`${col.width}%`}
          >
            {(col.sortable === undefined || col.sortable) ? (
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


function TablePaginationActions({ count, page, rowsPerPage, onChangePage }) {
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


export default function DataTable({ rows, cols, defaultSort }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState(defaultSort[1]);
  const [orderBy, setOrderBy] = React.useState(defaultSort[0]);

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

    if (orderBy === property) {
      setOrder(isAsc ? 'desc' : 'asc');
    }

    setOrderBy(property);
  };

  const classes = useStyles2();


  return (
    <>
      <TableContainer className={classes.root} component={Paper}>
        <Table className={classes.table} size="small" stickyHeader>
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
              .map((row) => (
                <TableRow
                  key={`${row.country}-${row.date}-${row.description}`}
                  style={{ whiteSpace: 'nowrap' }}
                  hover
                >
                  {cols.map(col =>
                    <TableCell
                      key={`tablecell-${col.id}`}
                      className={classes.cellsm}
                      align={col.align ? col.align : col.numeric ? 'right' : 'left'}
                      style={{ ...col.cellStyle, ...row.rowStyle }}
                    >
                      {col.cellContent(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            }

            {emptyRows > 0 && (
              <TableRow style={{ height: 28 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
        component="div"
        colSpan={cols.length}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </>
  );
}
