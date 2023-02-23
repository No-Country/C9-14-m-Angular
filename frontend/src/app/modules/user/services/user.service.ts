import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageTvShow, TvShow } from '../interfaces/user';
import { ReviewsGral, SeasonData } from './../interfaces/user';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api_key: string = '0167913abe154169ea9d85e3e8a3e7da';
  baseUrl: string = 'https://api.themoviedb.org/3';
  subUrl: string = '/tv/popular';
  subUrlToSearch: string = '/search/tv';
  headers = new HttpHeaders().set(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTY3OTEzYWJlMTU0MTY5ZWE5ZDg1ZTNlOGEzZTdkYSIsInN1YiI6IjYyMTU0ZWRhMGU0ZmM4MDA0NDExNjZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8-i63xqhXGI5bCPXp0dWpPktcxIJt_CUToTH5Sneyc8'
  ); //token para la autorización de la API de TMBD version 4
  // BD SEBA BACKEND
  user: any;
  baseUrlBack: string;
  epSavedList: string;
  epSavedList2: string;
  epLikedList: string;
  epLikedList2: string;

  constructor(private _http: HttpClient) {
    this.baseUrlBack = 'https://serial-backend.onrender.com/';
    this.epSavedList = 'list/client/1';
    this.epSavedList2 = 'list/client';
    this.epLikedList = 'list/client/like/1';
    this.epLikedList2 = 'list/client/like';
  }
  getUserToken() {
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
      console.log('token: ', this.user);
    }
  }
  getTvShow(page: number): Observable<PageTvShow> {
    let params = new HttpParams()
      .set('language', 'en')
      .set('page', page.toString());

    return this._http.get<PageTvShow>(this.baseUrl + this.subUrl, {
      headers: this.headers,
      params: params,
    });
  }
  getSearchTvShow(page: number, toSearch: string): Observable<PageTvShow> {
    let params = new HttpParams()
      .set('language', 'en')
      .set('query', toSearch)
      .set('page', page.toString())
      .set('include_adult', false);

    return this._http.get<PageTvShow>(this.baseUrl + this.subUrlToSearch, {
      headers: this.headers,
      params: params,
    });
  }
  getTvShowById(id: number): Observable<TvShow> {
    let params = new HttpParams().set('language', 'en');

    return this._http.get<TvShow>(this.baseUrl + '/tv/' + id, {
      headers: this.headers,
      params: params,
    });
  }
  getSeasonTvShow(id: number, season: number): Observable<SeasonData> {
    let params = new HttpParams().set('language', 'en');

    return this._http.get<SeasonData>(
      this.baseUrl + '/tv/' + id + '/season/' + season,
      {
        headers: this.headers,
        params: params,
      }
    );
  }

  getReviews(page: number, id: number): Observable<ReviewsGral> {
    console.log('svc reviews');

    let params = new HttpParams()
      .set('language', 'en')
      .set('page', page.toString());

    return this._http.get<ReviewsGral>(
      this.baseUrl + '/tv/' + id + '/reviews',
      {
        headers: this.headers,
        params: params,
      }
    );
  }
  getLikedList(): Observable<any> {
    console.log('svc LikedList');
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
    }
    const token = this.user.token;
    console.log('USER: ', this.user);
    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let params = new HttpParams().set('language', 'en');

    let epSub;
    this.user.dataValues.email === 'user@serial.com'
      ? (epSub = this.epLikedList)
      : (epSub = this.epLikedList2);

    return this._http.get<any>(this.baseUrlBack + epSub, {
      headers: headersBack,
      params: params,
    });
  }
  getSavedList(): Observable<any> {
    console.log('svc SavedList');
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
    }
    const token = this.user.token;
    console.log('USER: ', this.user);
    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let params = new HttpParams().set('language', 'en');
    let epSub;
    this.user.dataValues.email === 'user@serial.com'
      ? (epSub = this.epSavedList)
      : (epSub = this.epSavedList2);
    console.log('email: ', this.user.email);
    console.log('epSub:', epSub);

    return this._http.get<any>(this.baseUrlBack + epSub, {
      headers: headersBack,
      params: params,
    });
  }
}
