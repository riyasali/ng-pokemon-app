import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonDetails, PokemonListAPI } from '../../interfaces/pokemon';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  offset = 0;
  limit = 20;
  isProcessing = false;
  pokeMon: PokemonListAPI;
  pokeMonDataList: PokemonDetails[] = [];
  pageSizeOptions = [10, 20, 50, 100];
  totalCount = 0;
  currentPage = 0;
  query: string;
  noDataFound = 'Unable to fetch pokemons';
  getListSubscription: Subscription;
  getDetailsSubscription: Subscription;
  subscriptions: Subscription[] = [];
  sortKey = 'id';
  pokemonImageBaseUrl = environment.pokemonImageUrl;
  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemonList();
  }

  getPokemonList() {
    this.isProcessing = false;
    const pagination = {
      limit: this.limit,
      offset: this.offset,
    }
    this.getListSubscription = this.pokemonService.getPokemon(pagination).subscribe(
      (data: PokemonListAPI) => {
        this.isProcessing = true;
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
          this.getDetailsSubscription = forkJoin(detailsBatch).subscribe((data: PokemonDetails[]) => {
            this.pokeMonDataList = data;
          });
          this.subscriptions.push(this.getDetailsSubscription);
          return this.getDetailsSubscription;

        }
      },
      (error) => {
        this.isProcessing = true;
      });
    this.subscriptions.push(this.getListSubscription);
  }

  handlePage(paginator) {
    this.limit = paginator.pageSize;
    this.offset = paginator.pageIndex * paginator.pageSize;
    this.currentPage = paginator.pageIndex;
    this.getPokemonList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
