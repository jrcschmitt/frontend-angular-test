import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { ColDef } from 'ag-grid-community';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientModule
      ],
    })
    .compileComponents();    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with emtpy data', () => {
    expect(component.yearsMultipleWinners).toEqual([]);
    expect(component.topThreeStudiosWinners).toEqual([]);
    expect(component.maxWinIntervalProducers).toEqual([]);
    expect(component.minWinIntervalProducers).toEqual([]);
    expect(component.moviesWinnersByYear).toEqual([]);
  });

  it('should yearsMultipleWinnersColDefs have columns', () => {
    expect(component.yearsMultipleWinnersColDefs.length).toEqual(2);
    expect(
      component.yearsMultipleWinnersColDefs.some((col: ColDef) => col.field === 'year')
    ).toBeTrue();
    expect(
      component.yearsMultipleWinnersColDefs.some((col: ColDef) => col.field === 'winnerCount')
    ).toBeTrue();
  });

  it('should topThreeStudiosWinnersColDefs have columns', () => {
    expect(component.topThreeStudiosWinnersColDefs.length).toEqual(2);
    expect(
      component.topThreeStudiosWinnersColDefs.some((col: ColDef) => col.field === 'name')
    ).toBeTrue();
    expect(
      component.topThreeStudiosWinnersColDefs.some((col: ColDef) => col.field === 'winCount')
    ).toBeTrue();
  });

  it('should maxWinIntervalProducersColDefs have columns', () => {
    expect(component.maxWinIntervalProducersColDefs.length).toEqual(4);
    expect(
      component.maxWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'producer')
    ).toBeTrue();
    expect(
      component.maxWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'interval')
    ).toBeTrue();
    expect(
      component.maxWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'previousWin')
    ).toBeTrue();
    expect(
      component.maxWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'followingWin')
    ).toBeTrue();
  });

  it('should minWinIntervalProducersColDefs have columns', () => {
    expect(component.minWinIntervalProducersColDefs.length).toEqual(4);
    expect(
      component.minWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'producer')
    ).toBeTrue();
    expect(
      component.minWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'interval')
    ).toBeTrue();
    expect(
      component.minWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'previousWin')
    ).toBeTrue();
    expect(
      component.minWinIntervalProducersColDefs.some((col: ColDef) => col.field === 'followingWin')
    ).toBeTrue();
  });

  it('should moviesWinnersByYearColDefs have columns', () => {
    expect(component.moviesWinnersByYearColDefs.length).toEqual(3);
    expect(
      component.moviesWinnersByYearColDefs.some((col: ColDef) => col.field === 'id')
    ).toBeTrue();
    expect(
      component.moviesWinnersByYearColDefs.some((col: ColDef) => col.field === 'year')
    ).toBeTrue();
    expect(
      component.moviesWinnersByYearColDefs.some((col: ColDef) => col.field === 'title')
    ).toBeTrue();
  });

  it('should ngOnInit call functions', () => {
    spyOn(component, 'getYearsWithMultipleWinners');
    spyOn(component, 'getTopThreeStudiosWinners');
    spyOn(component, 'getMaxMinWinIntervalProducers');
    component.ngOnInit();
    expect(component.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(component.getTopThreeStudiosWinners).toHaveBeenCalled();
    expect(component.getMaxMinWinIntervalProducers).toHaveBeenCalled();
  });

  it('should getYearsWithMultipleWinners call mainService get with', () => {
    spyOn(component.mainService, 'get').and.returnValue(of({years: []}));
    component.getYearsWithMultipleWinners();
    expect(component.mainService.get).toHaveBeenCalledWith('/movies?projection=years-with-multiple-winners');
  });

  it('should getTopThreeStudiosWinners call mainService get with', () => {
    spyOn(component.mainService, 'get').and.returnValue(of({studios: []}));
    component.getTopThreeStudiosWinners();
    expect(component.mainService.get).toHaveBeenCalledWith('/movies?projection=studios-with-win-count');
  });

  it('should getMaxMinWinIntervalProducers call mainService get with', () => {
    spyOn(component.mainService, 'get').and.returnValue(of({min: [], max: []}));
    component.getMaxMinWinIntervalProducers();
    expect(component.mainService.get).toHaveBeenCalledWith('/movies?projection=max-min-win-interval-for-producers');
  });

  it('should getMoviesWinnersByYear do not call mainService get', () => {
    spyOn(component.mainService, 'get');
    component.getMoviesWinnersByYear();
    expect(component.mainService.get).toHaveBeenCalledTimes(0);
  });

  it('should getMoviesWinnersByYear call mainService get once with', () => {
    component.yearFilter = 2024;
    spyOn(component.mainService, 'get').and.returnValue(of({}));
    component.getMoviesWinnersByYear();
    expect(component.mainService.get).toHaveBeenCalledOnceWith('/movies?winner=true&year=2024');
  });

  it('should onInputChange set yearFilter', () => {
    component.onInputChange({target: {value: 2024}});
    expect(component.yearFilter).toEqual(2024);
    component.onInputChange({target: {value: -1}});
    expect(component.yearFilter).toEqual(0);
  });
});
