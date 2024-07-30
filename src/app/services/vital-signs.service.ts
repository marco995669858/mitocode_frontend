import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VitalSigns } from '../model/vitalSignsDTO';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService extends GenericService<VitalSigns>{

  private vitalsignChange: Subject<VitalSigns[]> = new Subject<VitalSigns[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor( protected override http: HttpClient){
    super(http, `${environment.HOST}/vitalsigns`)
  }

  //////////////////////////////////////
  setVitalSignChange(data: VitalSigns[]){
    this.vitalsignChange.next(data);
  }
  getVitalSignChange(){
    return this.vitalsignChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
