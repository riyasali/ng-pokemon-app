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
      .pipe(catchError(this.errorHandler));
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
  private errorHandler(error: HttpErrorResponse) {
    return throwError('Something bad happened; please try again later.');
 } 
}
