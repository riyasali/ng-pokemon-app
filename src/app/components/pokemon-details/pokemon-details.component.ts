import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {

  loaded = false;
   tiles: any[] = [
    {text: 'One', cols: 1, rows: 2, color: 'lightblue'},
    {text: 'Two', cols: 3, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 3, rows: 1, color: 'lightpink'},
  ];
  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.getPokemonDetails(param.id);
      }
    )
  }

  getPokemonDetails(pokemonId) {
    this.pokemonService.getPokemonDetails(pokemonId).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }

    )
  }

}
