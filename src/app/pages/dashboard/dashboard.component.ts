import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgGridAngular],
  providers: [MainService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  yearsMultipleWinners: any[] = [];
  topThreeStudiosWinners: any[] = [];
  maxWinIntervalProducers: any[] = [];
  minWinIntervalProducers: any[] = [];
  moviesWinnersByYear: any[] = [];

  yearFilter!: number;

  yearsMultipleWinnersColDefs: ColDef[] = [
    {
      flex: 2,
      headerName: 'Year',
      field: 'year'
    },
    {
      flex: 2,
      headerName: 'Win Count',
      field: 'winnerCount'
    },
  ];

  topThreeStudiosWinnersColDefs: ColDef[] = [
    {
      flex: 2,
      headerName: 'Name',
      field: 'name'
    },
    {
      flex: 2,
      headerName: 'Win Count',
      field: 'winCount'
    },
  ];

  maxWinIntervalProducersColDefs: ColDef[] = [
    {
      headerName: 'Producer',
      field: 'producer',
      flex: 1
    },
    {
      headerName: 'Interval',
      field: 'interval',
      width: 110
    },
    {
      headerName: 'Previous Year',
      field: 'previousWin',
      width: 140
    },
    {
      headerName: 'Following Win',
      field: 'followingWin',
      width: 140
    },
  ];

  minWinIntervalProducersColDefs: ColDef[] = [
    {
      headerName: 'Producer',
      field: 'producer',
      flex: 1
    },
    {
      headerName: 'Interval',
      field: 'interval',
      width: 110
    },
    {
      headerName: 'Previous Year',
      field: 'previousWin',
      width: 140
    },
    {
      headerName: 'Following Win',
      field: 'followingWin',
      width: 140
    },
  ];

  moviesWinnersByYearColDefs: any[] = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Year',
      field: 'year',
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 1,
    }
  ];

  constructor(private mainService: MainService) {
  }

  ngOnInit(): void {
    this.getYearsWithMultipleWinners();
    this.getTopThreeStudiosWinners();
    this.getMaxMinWinIntervalProducers();
  }

  getYearsWithMultipleWinners() {
    this.mainService.get('/movies?projection=years-with-multiple-winners').subscribe({
      next: res => {
        this.yearsMultipleWinners = res.years;
      }
    });
  }

  getTopThreeStudiosWinners() {
    this.mainService.get('/movies?projection=studios-with-win-count').subscribe({
      next: res => {
        this.topThreeStudiosWinners = res.studios.slice(0,3);
      }
    });
  }

  getMaxMinWinIntervalProducers() {
    this.mainService.get('/movies?projection=max-min-win-interval-for-producers').subscribe({
      next: res => {
        this.maxWinIntervalProducers = res.max;
        this.minWinIntervalProducers = res.min;
      }
    });
  }

  getMoviesWinnersByYear() {
    this.moviesWinnersByYear = [];
    if (!this.yearFilter) return;
    let url = `/movies?winner=true&year=${this.yearFilter}`;
    this.mainService.get(url).subscribe({
      next: res => {
        this.moviesWinnersByYear = res;
      }
    });
  }

  onInputChange(event: any) {
    if (event.target.value < 0) {
      this.yearFilter = 0;
    } else {
      this.yearFilter = event.target.value;
    }
  }
}
