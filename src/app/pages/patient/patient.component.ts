import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

//import { NgFor } from '@angular/common';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink], //NgFor
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit{

  //patients: Patient[] = [];
  dataSource: MatTableDataSource<Patient>;
  columnDefinitions = [
    { def: 'idPatient', label: 'idPatient', hide: true},
    { def: 'firstName', label: 'FirstName', hide: false},
    { def: 'lastName', label: 'LastName', hide: false},
    { def: 'dni', label: 'dni', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ]
  //displayedColumns: string[] = [ 'idPatient', 'firstName', 'lastName', 'dni', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalElements: number = 0;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    /*this.patientService.findAll().subscribe(data => {
      this.createTable(data);
    });*/

    this.patientService.listPageable(0, 2).subscribe(data => {
      this.createTable(data);
    });

    this.patientService.getPatientChange().subscribe(data => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });    
  }

  createTable(data: any){
    this.totalElements = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  getDisplayedColumns(){
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e : any){
    this.dataSource.filter = e.target.value.trim();
  }

  delete(idPatient: number){
    this.patientService.delete(idPatient)
    .pipe(switchMap( () => this.patientService.findAll()  ))
    .subscribe(data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('DELETED!');
    });
  }
  
  showMore(e : any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.createTable(data);
    })
  }
}
