import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Medic } from '../../model/medic';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MedicService } from '../../services/medic.service';
import { MatDialog } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css'
})
export class MedicComponent implements OnInit {

  dataSource: MatTableDataSource<Medic>;
  columnDefinitions = [
    { def: 'idMedic', label: 'idMedic', hide: true},
    { def: 'primaryName', label: 'PrimaryName', hide: false},
    { def: 'surname', label: 'Surname', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private medicService: MedicService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.medicService.findAll().subscribe(data => {
      this.createTable(data);
    });

    this.medicService.getMedicChange().subscribe(data => {
      this.createTable(data);
    });

    this.medicService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
    });
  }

  createTable(data: Medic[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDisplayedColumns(){
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(medic?: Medic){
    this._dialog.open(MedicDialogComponent, {
      width: '350px',
      data: medic,
      disableClose: false,
    });
  }

  delete(idMedic: number){
    this.medicService.delete(idMedic)
    .pipe(switchMap( ()=> this.medicService.findAll() ))
    .subscribe(data => {
      this.medicService.setMedicChange(data);
      this.medicService.setMessageChange('DELETED!');
    });
  }
}
