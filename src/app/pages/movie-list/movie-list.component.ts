import { Component } from '@angular/core';
import { MainService } from '../../services/main.service';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  IServerSideDatasource,
  ValueGetterParams
} from 'ag-grid-community';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular
  ],
  providers: [MainService],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  paginationPageSize = 20;
  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: false,
    },
    {
      headerName: 'Year',
      field: 'year',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 800,
        maxNumConditions: 1,
      },
      floatingFilter: true,
      suppressFloatingFilterButton: true,
      suppressHeaderMenuButton: true,
      sortable: false,
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 2,
      sortable: false,
      minWidth: 180,
    },
    {
      headerName: 'Winner',
      field: 'winner',
      filter: true,
      filterParams: {
        values: (params: any) => {
            params.success(['No', 'Yes'])
        }
      },
      floatingFilter: true,
      sortable: false,
      valueGetter: (params: ValueGetterParams) => params.data.winner ? 'Yes' : 'No',
    },
    {
      headerName: 'Studios',
      field: 'studios',
      sortable: false,
    },
    {
      headerName: 'Producers',
      field: 'producers',
      sortable: false,
    },
  ];

  constructor(public mainService: MainService) {
  }

  onGridReady(params: any) {
    var datasource = this.getServerSideDatasource();
    params.api!.setGridOption('serverSideDatasource', datasource);
  }

  getServerSideDatasource(): IServerSideDatasource {
    return {
      getRows: (params) => this.getRows(params),
    };
  }

  getRows(params: any) {
    const currentPage = params.api.paginationGetCurrentPage();
    const pageSize = params.api.paginationGetPageSize();

    const filterModel = params.request.filterModel as any;

    const yearFilter = filterModel['year'];
    const winnerFilter = filterModel['winner'];

    let url = `/movies?page=${currentPage}&size=${pageSize}`;

    if (yearFilter) {
      url = url + `&year=${yearFilter.filter}`; 
    }

    if (winnerFilter) {
      if (winnerFilter.values.length > 0) {
        const filterValue = winnerFilter.values[0] === 'Yes';
        url = url + `&winner=${filterValue}`;
      }
    }

    this.mainService.get(url)
    .subscribe({
      next: res => {
        params.success({
          rowData: res.content,
          rowCount: res.totalElements,
        });
      },
      error: () => params.fail()
    });
  }
}
