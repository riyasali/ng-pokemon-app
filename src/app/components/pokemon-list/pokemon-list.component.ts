import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonDetails, PokemonListAPI } from '../../interfaces/pokemon';
import { Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  offset = 0;
  limit = 20;
  loaded = false;
  pokeMon: PokemonListAPI;
  pokeMonDataList: PokemonDetails[];
  pageSizeOptions = [10, 20, 50, 100];
  totalCount = 0;
  currentPage = 0;
  query: string;
  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemonList();
  }

  getPokemonList() {
    this.loaded = false;
    const pagination = {
      limit: this.limit,
      offset: this.offset,
    }
    this.pokemonService.getPokemon(pagination).subscribe((data: PokemonListAPI) => {
      if (data && data.results && data.results.length) {
        this.pokeMon = data;
        this.totalCount = data.count;
        let detailsBatch = [];
        this.pokeMon.results.forEach(pokemon => {
          pokemon.id = pokemon.url.split('/')[
            pokemon.url.split('/').length - 2
          ];
          detailsBatch.push(this.pokemonService.getPokemonDetails(pokemon.id));

        });
        return forkJoin(detailsBatch).subscribe((data: PokemonDetails[]) => {
          this.pokeMonDataList = data;
          this.loaded = true;
        });
      }
    })
  }
  handlePage(paginator) {
    this.limit = paginator.pageSize;
    this.offset = paginator.pageIndex*paginator.pageSize;
    this.currentPage = paginator.pageIndex;
    this.getPokemonList();
  }
  searchEvent(search): void {
    // check for cleared search
    if (search === '') {
      this.query = search;
    }
  }
}
