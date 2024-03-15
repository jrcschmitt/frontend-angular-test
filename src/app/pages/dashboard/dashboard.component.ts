import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [MainService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  movies: any[] = [];

  constructor(private mainService: MainService) {

  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies() {
    this.mainService.get('/movies?page=1&size=10').subscribe(res => {
      this.movies = res.content;
    });
  }
}
