import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';
import { environment } from 'src/environments/environment';

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
  breakpoint;
  pokemonImageBaseUrl = environment.pokemonImageUrl;
  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
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
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 2;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
