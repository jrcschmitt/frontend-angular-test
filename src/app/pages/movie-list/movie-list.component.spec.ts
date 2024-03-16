import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListComponent } from './movie-list.component';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MovieListComponent,
        HttpClientModule,
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should paginationPageSize initialize with value', () => {
    expect(component.paginationPageSize).toEqual(20);
  });

  it('should columnDefs have columns', () => {
    expect(component.columnDefs.length).toEqual(6);
    expect(component.columnDefs.some(col => col.field === 'id')).toBeTrue();
    expect(component.columnDefs.some(
      col => col.field === 'year' && col.floatingFilter)).toBeTrue();
    expect(component.columnDefs.some(col => col.field === 'title')).toBeTrue();
    expect(component.columnDefs.some(
      col => col.field === 'winner' && col.floatingFilter)).toBeTrue();
    expect(component.columnDefs.some(col => col.field === 'studios')).toBeTrue();
    expect(component.columnDefs.some(col => col.field === 'producers')).toBeTrue();
  });

  it('should onGridReady set up grid datasource', () => {
    const gridReadyParams = {
      api: {
        setGridOption: () => {},
      },
    };
    spyOn(gridReadyParams.api, 'setGridOption');
    component.onGridReady(gridReadyParams);
    expect(gridReadyParams.api.setGridOption).toHaveBeenCalled();
  });

  it('should getRows call mainService.get with', () => {
    const getRowsParams = {
      api: {
        paginationGetCurrentPage: () => 0,
        paginationGetPageSize: () => 20,
      },
      request: {
        filterModel: {
          year: {
            filter: 2024,
          },
          winner: {
            values: ['Yes']
          }
        }
      },
      success: () => {}
    };
    spyOn(component.mainService, 'get').and.returnValue(of({}));
    component.getRows(getRowsParams);
    expect(component.mainService.get).toHaveBeenCalledWith('/movies?page=0&size=20&year=2024&winner=true');
  });

  it('should getRows call mainService.get with error', () => {
    const getRowsParams = {
      api: {
        paginationGetCurrentPage: () => 0,
        paginationGetPageSize: () => 20,
      },
      request: {
        filterModel: {
          year: {
            filter: 2024,
          },
          winner: {
            values: ['Yes']
          }
        }
      },
      fail: () => {}
    };
    spyOn(component.mainService, 'get').and.returnValue(throwError(() => new Error('')));
    spyOn(getRowsParams, 'fail');
    component.getRows(getRowsParams);
    expect(component.mainService.get).toHaveBeenCalledWith('/movies?page=0&size=20&year=2024&winner=true');
    expect(getRowsParams.fail).toHaveBeenCalled();
  });
});
