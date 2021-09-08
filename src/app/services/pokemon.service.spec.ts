import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  const dummyPokemonList = {
    count: 123,
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
    ]
  };
  const dummyPokemonDetails =  {
    id:1,
    height: 9,
    weight: 14,
    name: 'bulbasaur',
    types: [],
    sprites: {
      front_default: ''
    },
    abilities: [
      {
        ability: {
          name: 'overgrow',
          url: 'https://pokeapi.co/api/v2/ability/65/'
        }
      }
    ]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getPokemon return the list of pokemon', () => {
    const paginator = {
      limit: 10,
      offset:0,
    }
    service.getPokemon(paginator).subscribe((res) => {
      expect(res).toEqual(dummyPokemonList);
    });
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPokemonList);
  });

  it('should getPokemonDetails return the details of given pokemon', () => {
    service.getPokemonDetails(1).subscribe((res) => {
      expect(res).toEqual(dummyPokemonDetails);
    });
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPokemonDetails);
  });


});
