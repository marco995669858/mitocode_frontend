import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Medic } from '../../../model/medic';
import { FormsModule } from '@angular/forms';
import { SpecialtyService } from '../../../services/specialty.service';
import { Specialty } from '../../../model/specialty';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css'
})
export class MedicDialogComponent implements OnInit{

  medic: Medic;
  specialties: Specialty[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private _dialogRef: MatDialogRef<MedicDialogComponent>,
    private specialtyService: SpecialtyService,
    private medicService: MedicService
  ){}

  ngOnInit(): void {
    this.medic = {...this.data}; //spread operator
      //this.medic = this.data;
      /*this.medic = new Medic();
      this.medic.idMedic = this.data.idMedic;
      this.medic.primaryName = this.data.primaryName;
      this.medic.surname = this.data.surname;
      this.medic.photo = this.data.photo;*/

      this.specialtyService.findAll().subscribe(data => this.specialties = data);
  }

  operate(){
    if(this.medic != null && this.medic.idMedic > 0){
      //UPDATE
      this.medicService
        .update(this.medic.idMedic, this.medic)
        .pipe(switchMap( () => this.medicService.findAll()) )
        .subscribe(data => {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('UPDATED!')
        });
    }else{
      //INSERT
      this.medicService
        .save(this.medic)
        .pipe(switchMap( () => this.medicService.findAll()) )
        .subscribe(data => {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('CREATED!')
        });
    }
    this.close();
  }

  close(){
    this._dialogRef.close();    
  }
}
