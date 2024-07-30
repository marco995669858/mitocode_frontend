import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../../model/patient';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PatientService } from '../../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { VitalSigns } from '../../model/vitalSignsDTO';
import { VitalSignsService } from '../../services/vital-signs.service';

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './vital-signs.component.html',
  styleUrl: './vital-signs.component.css'
})
export class VitalSignsComponent implements OnInit{
  dataSource: MatTableDataSource<VitalSigns>;

  columnDefinitions = [
    { def: 'idSigns', label: 'idSigns', hide: true },
    { def: 'patient', label: 'Patient', hide: false },
    { def: 'temperature', label: 'Temperature', hide: false },
    { def: 'pulse', label: 'Pulse', hide: false },
    { def: 'respiratoryRate', label: 'Respiratory Rate', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private vitalsignService: VitalSignsService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.vitalsignService.findAll().subscribe(data => {
      this.createTable(data);
    });

    this.vitalsignService.getVitalSignChange().subscribe(data => {
      this.createTable(data);
    });
    this.vitalsignService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
    })

  }

  createTable(data: VitalSigns[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDisplayedColumns() {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();

    console.log("-> dataSource:: ",this.dataSource.filteredData);
  }

  checkChildren(){
    return this.route.children.length > 0;
  }

  delete(idVitalsign: number) {
    this.vitalsignService.delete(idVitalsign)
      .pipe(switchMap(() => this.vitalsignService.findAll()))
      .subscribe(data => {
        this.vitalsignService.setVitalSignChange(data);
        this.vitalsignService.setMessageChange('DELETED!');
      });
  }
}
