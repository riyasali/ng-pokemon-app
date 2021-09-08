import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

import { PokemonDetailsComponent } from './pokemon-details.component';

class MockPokemonService {

  getPokemonDetails() {
    return of(
      {
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
      }
    )
  }
}


describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonDetailsComponent],
      imports:[HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              params: { id: 1 }
            })
          }
        },
        { provide: PokemonService, useClass: MockPokemonService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the details of pokemon on pageLoad', () => {
    spyOn(pokemonService,'getPokemonDetails').and.callThrough();
    component.ngOnInit();
    expect(pokemonService.getPokemonDetails).toHaveBeenCalled();
  });
});
