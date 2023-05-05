import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent {

  tableData: any;
  columns = [{ name: 'Altura (cm)', field: 'height' }, { name: 'Masa (kg)', field: 'mass' }, { name: 'Color de pelo', field: 'hair_color' }, { name: 'Color de piel', field: 'skin_color' }, { name: 'Color de ojos', field: 'eye_color' }];
  selectedColumn: string;
  previousUrl: string;
  nextUrl: string;
  count: number;
  filterValue: string;
  filteredTableData: any[];
  selectedFilter: string;


  //Columnas desplegadas por defecto
  displayedColumns: any[] = [{ name: 'Nombre', field: 'name' }, { name: 'Género', field: 'gender' }, { name: 'Año de nacimiento', field: 'birth_year' }];

  constructor(private http: HttpClient) {
    this.selectedColumn = '';
    this.previousUrl = '';
    this.nextUrl = '';
    this.count = 0;
    this.filterValue = '';
    this.filteredTableData = [];
    this.selectedFilter = ''
  }

  ngOnInit() {

    const options = {
      params: new HttpParams().set('limit', '10').set('offset', '0'),
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    this.http.get('https://swapi.dev/api/people/', options)
      .subscribe((data: any) => {
        this.tableData = data.results;
        this.applyFilter(this.selectedFilter)
        this.previousUrl = data.previous;
        this.nextUrl = data.next;
        this.count = data.count;
      });


  }

  addColumn() {
    const column = this.columns.find(c => c.field === this.selectedColumn);
    if (column && !this.displayedColumns.includes(column)) {
      this.displayedColumns.push(column);
    }

  }

  previousPage() {
    this.loadPage(this.previousUrl);
  }

  nextPage() {
    this.loadPage(this.nextUrl);
  }

  loadPage(url: string) {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.get(url, options)
      .subscribe((data: any) => {
        this.tableData = data.results;
        this.applyFilter(this.selectedFilter)
        this.previousUrl = data.previous;
        this.nextUrl = data.next;
      });
  }

  applyFilter(selectedFilter: any) {

    if (this.selectedFilter === '') {
      this.filteredTableData = this.tableData;
    } else if (this.selectedFilter == 'male' || this.selectedFilter == 'female' || this.selectedFilter == 'n/a') {
      this.filteredTableData = this.tableData.filter((item: any) => item.gender == selectedFilter);
    } else if (this.selectedFilter == 'unknown') {
      this.filteredTableData = this.tableData.filter((item: any) => item.birth_year == selectedFilter);
    }
  }





}

