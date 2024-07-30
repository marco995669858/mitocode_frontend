import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Patient } from '../../../model/patient';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-patient.component.html',
  styleUrl: './new-patient.component.css'
})
export class NewPatientComponent {
  constructor(
    private patientService: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewPatientComponent>
  ) { }

  form: FormGroup;
  id: number;
  isEdit: boolean;

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
      dni: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.pattern('[0-9]+')),
      email: new FormControl('', Validators.email),
    });
  }

  operate() {
    if (this.form.valid) {
      const patient: Patient = new Patient();
      patient.idPatient = this.form.value['idPatient'];
      patient.firstName = this.form.value['firstName'];
      patient.lastName = this.form.value['lastName'];
      patient.dni = this.form.value['dni'];
      patient.address = this.form.value['address'];
      patient.phone = this.form.value['phone'];
      patient.email = this.form.value['email'];

      this.patientService.save(patient)
        .pipe(switchMap(() => this.patientService.findAll()))
        .subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!');
          this.onClose();
        });
    }

  }

  get f() {
    return this.form.controls;
  }

  onClose(){
    this.dialogRef.close();
  }
}
