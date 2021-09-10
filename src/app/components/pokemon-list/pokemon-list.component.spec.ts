import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { SortPipe } from 'src/app/pipes/sort.pipe';
import { PokemonService } from 'src/app/services/pokemon.service';

import { PokemonListComponent } from './pokemon-list.component';

let dummyPokemonList = {
  count: 123,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
  ]
};

class MockPokemonService {
  getPokemon() {
    return of(dummyPokemonList);
  }

  getPokemonDetails() {
    return of(
      {
        height: 9,
        weight: 14,
        name: 'bulbasaur',
        types: [],
        id:1,
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
      }
    )
  }
}


describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PokemonListComponent, SearchPipe, SortPipe],
      providers: [
        { provide: PokemonService, useClass: MockPokemonService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the pokemon list', () => {
    spyOn(pokemonService, 'getPokemon').and.callThrough();
    component.ngOnInit();
    expect(pokemonService.getPokemon).toHaveBeenCalled();
    expect(component.pokeMon).toEqual(dummyPokemonList);
    expect(component.totalCount).toBe(123);
    expect(component.pokeMonDataList.length).toBe(1);
  });

  it('should show a message if no data loaded', () => {
    spyOn(pokemonService, 'getPokemon').and.returnValue(throwError('error'));
    component.ngOnInit();
    expect(component.noDataFound).toEqual('Unable to fetch pokemons');
    expect(component.isProcessing).toBeTruthy();
  });

  it('should handle the pagination', () => {
    spyOn(pokemonService, 'getPokemon').and.callThrough();
    component.handlePage({ pageSize: 10, pageIndex: 1 });
    expect(component.limit).toBe(10);
    expect(component.offset).toBe(10);
    expect(pokemonService.getPokemon).toHaveBeenCalled();
  });

});
