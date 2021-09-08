import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PokemonDetails, PokemonListAPI } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  PokemonListAPI: any;
  pokeSpeciesAPI: any;

  constructor(private http: HttpClient) {
    this.PokemonListAPI = environment.pokemonListURL;
  }

  /**
   * Return the pokemon list
   */
  getPokemon(paginationObject): Observable<PokemonListAPI> {
    const { limit, offset } = paginationObject;
    return this.http
      .get<PokemonListAPI>(`${this.PokemonListAPI}?limit=${limit}&offset=${offset}`)
      .pipe(catchError(this._handleError));
  }

  /**
   * Returns the single pokemon details
   * @param id integer 
   */
  getPokemonDetails(id): Observable<PokemonDetails> {
    return this.http
      .get<PokemonDetails>(`${this.PokemonListAPI}/${id}`);
  }


  /**
   * Handles any request error
   */
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something went wrong, please try again later.');
  }
}
