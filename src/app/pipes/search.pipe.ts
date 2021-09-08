import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) {
      return;
    }
    if (!searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();

    return value.filter(item => {
      let matchFound = false;
      let abilityFiltered = [];
      if (item.name) {
        const name = item.name;
        const index = item.id;

        const searchName = JSON.stringify(name).toLowerCase().includes(searchText);
        const searchId = JSON.stringify(index).toLowerCase().includes(searchText);

        if (searchName || searchId) {
          matchFound = true;
        }
       } 
       if(!matchFound) {

          if (item.abilities) {
            abilityFiltered = item.abilities.filter((abilities) => {
            return abilities.ability.name.indexOf(searchText) > -1;
           });
           matchFound = abilityFiltered.length > 0 ? true : false;
          }

        }

        return matchFound;
      });
  }
}
