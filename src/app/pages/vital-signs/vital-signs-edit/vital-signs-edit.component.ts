import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/patient';
import { map, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewPatientComponent } from '../new-patient/new-patient.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitalSigns } from '../../../model/vitalSignsDTO';
import { VitalSignsService } from '../../../services/vital-signs.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-vital-signs-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './vital-signs-edit.component.html',
  styleUrl: './vital-signs-edit.component.css'
})
export class VitalSignsEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitalsignService: VitalSignsService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  form: FormGroup;
  id: number;
  isEdit: boolean;

  patients: Patient[];
  patients$: Observable<Patient[]>;
  patientControl: FormControl = new FormControl();
  patientvalid: boolean;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idSigns: new FormControl(0),
      patient: [this.patientControl, Validators.required],
      registrationDate: new FormControl('', Validators.required),
      temperature: new FormControl('', Validators.required),
      pulse: new FormControl('', Validators.required),
      respiratoryRate: new FormControl('', Validators.required)
    })

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
      this.loadInitialDataPatient();
    })

  }

  showPatient(val: any) {
    return val ? `${val.firstName} ${val.lastName}` : val
  }

  loadInitialDataPatient() {
    this.patientService.findAll().subscribe(data => { this.patients = data; });
  }

  initForm() {
    if (this.isEdit) {
      this.patients$ = this.patientService.findAll();
      // Edit/:id -> precargar los datos
      this.vitalsignService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idSigns: new FormControl(data.idSigns),
          patient: new FormControl(data.patient, Validators.required),
          registrationDate: new FormControl(data.registrationDate, Validators.required),
          temperature: new FormControl(data.temperature, [Validators.required]),
          pulse: new FormControl(data.pulse, Validators.required),
          respiratoryRate: new FormControl(data.respiratoryRate, Validators.required),
        });
      })
    } else {
      //New 
      this.patientService.getPatientChange().subscribe(data => {
        this.patients = data;
      });
      this.patientService.getMessageChange().subscribe(data => {
        this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
      })

      this.patientvalid = true; //Mostrar + Add Patient
      this.patients$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
    }
  }

  operate() {
    if (!this.form.invalid) {
      const vitalsigns: VitalSigns = new VitalSigns();
      vitalsigns.idSigns = this.form.value['idSigns'];
      vitalsigns.patient = this.form.value['patient'];
      vitalsigns.registrationDate = this.form.value['registrationDate'];
      vitalsigns.temperature = this.form.value['temperature'];
      vitalsigns.pulse = this.form.value['pulse'];
      vitalsigns.respiratoryRate = this.form.value['respiratoryRate'];

      if (this.isEdit) {
        //UPDATE

        this.vitalsignService.update(this.id, vitalsigns).subscribe(() => {
          this.vitalsignService.findAll().subscribe(data => {
            this.vitalsignService.setVitalSignChange(data);
            this.vitalsignService.setMessageChange('UPDATED!');
          })
        });
      } else {
        //INSERT
        vitalsigns.patient = this.form.value['patient'].value; //Insert al object

        this.vitalsignService.save(vitalsigns)
          .pipe(switchMap(() => this.vitalsignService.findAll()))
          .subscribe(data => {
            this.vitalsignService.setVitalSignChange(data);
            this.vitalsignService.setMessageChange('CREATED!');
          });
      }

      this.router.navigate(['pages/vital-signs']);
    }


  }

  filterPatients(val: any) {
    if (val?.idPatient > 0) {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) ||
        el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      )
    } else {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) ||
        el.lastName.toLowerCase().includes(val?.toLowerCase())
      )
    }
  }

  get f() {
    return this.form.controls;
  }

  openDialog() {
    this.dialog.open(NewPatientComponent, {
      width: '500px',
      maxHeight: 'auto',
      data: null,
      disableClose: true
    });
  }


}
