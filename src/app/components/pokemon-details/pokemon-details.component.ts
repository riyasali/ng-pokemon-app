import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit, OnDestroy {
  getDetailsSubscription: Subscription;
  subscriptions: Subscription[] = [];
  loaded = false;
  pokemonData;
  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.getPokemonDetails(param.id);
      }
    )
  }

  getPokemonDetails(pokemonId) {
    this.getDetailsSubscription = this.pokemonService.getPokemonDetails(pokemonId).subscribe(
      response => {
        this.pokemonData = response;
      },
      error => {
        console.log(error);
      }

    );
    this.subscriptions.push(this.getDetailsSubscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
