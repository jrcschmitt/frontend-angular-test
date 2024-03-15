import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  providers: [MainService],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
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
