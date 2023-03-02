import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Genre, PageTvShow, TvShow } from '../../interfaces/user';
import { Subject, takeUntil } from 'rxjs';

import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tvShowCover: TvShow = {} as TvShow;
  tvShows: TvShow[] = [];
  tvShows_toSearch: TvShow[] = [];
  tvShows_toShow: TvShow[] = [];
  totalPages: number = 0; /*numero total de paginas que se obtienen de la API*/
  numbersPages: number[] =
    []; /*arreglo de numeros del 1 al pagesToShow, si se quieren mostrar todas entonces en createNumbersPagesArray() cambiar pagesToShow por totalPages*/
  pagesToShow: number = 100; /*cantidad de peliculas a mostrar en la paginación*/
  pageSelected: number = 1;
  arrowPagination: number = 1;
  translatePaginationNumber: number = 0;
  translatePaginationString: string = '0px';
  toSearch: string = '';
  quantity: number = 0;

  loading = false;
  openSearch: boolean;
  notFound: boolean;
  // Id de la card seleccionada -  se usa para voltear la carta si se selecciona otra
  idTvShowSelected: number;
  trailer: string | undefined;

  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService, private _route: Router) {
    this.openSearch = false;
    this.notFound = false;
    this.idTvShowSelected = 0;
    this.trailer = undefined;
  }

  ngOnInit(): void {
    this.getTvShow();
  }

  getFromLclStg(key: string): any {
    let value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  // ----------------------
  getTvShow() {
    this._UserSvc
      .getTvShow(this.pageSelected)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          data.results.length === 0
            ? (this.notFound = true)
            : (this.notFound = false);
          this.tvShows = data.results;
          this.checkSavedLiked(this.tvShows);
          let firstElement = this.tvShows.shift();
          if (firstElement) {
            this.tvShowCover = firstElement;
            this.getTvShowTrailer(firstElement.id);
          }
          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows;
          console.log(this.tvShows_toShow);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  checkSavedLiked(tvs: TvShow[]) {
    tvs.map((tv: TvShow) => {
      tv.isLiked = false;
      tv.isSaved = false;
    });
  }
  onSavedOrLikedCover(type: string) {
    // type === 'saved'
    //   ? (this.tvShowCover.isSaved = !this.tvShowCover.isSaved)
    //   : (this.tvShowCover.isLiked = !this.tvShowCover.isLiked);
    if (type === 'like') {
      if (this.tvShowCover.isLiked) {
        console.log('Aqui endpoint de eliminar de liked');
      } else {
        console.log('Listo endpoint de guardar en favoritos');
        this.onLikeTvShow(this.tvShowCover);
      }
      this.tvShowCover.isLiked = !this.tvShowCover.isLiked;
    } else {
      if (this.tvShowCover.isSaved) {
        console.log('Aqui endpoint de eliminar de saved');
        this.tvShowCover.isSaved = !this.tvShowCover.isSaved;
      } else {
        this.tvShowCover.isSaved = !this.tvShowCover.isSaved;
        this.tvShowCover.isSaved
          ? this._route.navigate(['./lists/', this.tvShowCover.id])
          : null;
      }
    }
  }
  onSavedOrLiked(type: string, id: number) {
    type === 'saved'
      ? (this.tvShowCover.isSaved = !this.tvShowCover.isSaved)
      : (this.tvShowCover.isLiked = !this.tvShowCover.isLiked);
  }
  onLikeTvShow(tv: TvShow) {
    this._UserSvc
      .likeTvShow(tv)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('onLikeTvShow: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  loadMore() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    if (this.toSearch === '') {
      this.pageSelected += 1;
      console.log('_UserSvc');
      this._UserSvc
        .getTvShow(this.pageSelected)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: PageTvShow) => {
            this.tvShows.push(...data.results);
            this.tvShows_toShow = this.tvShows;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.pageSelected += 1;
      this._UserSvc
        .getSearchTvShow(this.pageSelected, this.toSearch)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: PageTvShow) => {
            this.tvShows.push(...data.results);
            this.totalPages = data.total_pages;
            this.tvShows_toShow = this.tvShows;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  onOpenSearch(value: boolean) {
    this.openSearch = value;
  }
  namedGenre(genresNames: Genre[], listTvShows: TvShow[]) {
    listTvShows.map((item: TvShow) => {
      let genreSelected: Genre[] = genresNames.filter((gen: Genre) =>
        item.genre_ids.includes(gen.id)
      );
      item.genres = genreSelected;
    });
  }

  /*para buscar la informacion del input dentro de las cards mostradas en el home*/
  onSearch(e: string) {
    /*informacion a buscar, que viene desde el componente searcher*/
    this.toSearch = e;

    // lo siguiente se hace para volver la paginación a la pagina 1 cada vez que se busca algo
    this.arrowPagination = 1;
    this.translatePaginationNumber = 0;
    this.translatePaginationString = '0px';
    this.pageSelected = 1;

    /*vacío el arreglo en donde guardaremos las series que coincidan con la busqueda */
    this.tvShows_toSearch = [];
    if (e !== '') {
      this.getSearchTvShow();
    } else {
      /*si el input de busqueda esta vacio se muestra el arreglo de todas las series*/
      this.getTvShow();
    }
    /*se calcula la cantidad de series mostradas*/
    this.quantity = this.tvShows_toShow.length;
  }
  getSearchTvShow() {
    this._UserSvc
      .getSearchTvShow(this.pageSelected, this.toSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          data.results.length === 0
            ? (this.notFound = true)
            : (this.notFound = false);
          this.tvShows = data.results;
          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  }
  getIdTvShowSelected(id: number) {
    this.idTvShowSelected = id;
  }
  getTvShowTrailer(id: number) {
    this._UserSvc
      .getTvShowTrailer(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (trailersbd: any) => {
          console.log(trailersbd);
          this.trailer = '';
          for (let trailer of trailersbd.results) {
            trailer.type === 'Trailer'
              ? (this.trailer = trailer.key)
              : (this.trailer = '');
            console.log(this.trailer);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  Search(toSearchVal: string) {}
  ngOnDestroy() {
    this.onDestroy$.next(true);
    // window.removeEventListener('scroll', this.onScroll.bind(this));
  }
}