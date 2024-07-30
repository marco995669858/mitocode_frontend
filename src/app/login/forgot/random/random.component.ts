import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-random',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './random.component.html',
  styleUrl: './random.component.css'
})
export class RandomComponent {

  form: FormGroup;
  token: string;
  message: string;
  error: string;
  rpta: number;
  validRandom: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group(
      {
        password: [
          '',
          { validators: [Validators.required, Validators.minLength(3)] },
        ],
        confirmPassword: [
          '',
          { validators: [Validators.required, Validators.minLength(3)] },
        ],
      },
      { validators: this.matchingPasswords() }
    );

    this.route.params.subscribe((params: Params) => {
      this.token = params['random'];
      this.loginService.checkRandomReset(this.token).subscribe((data) => {
        if (data === 1) {
          this.validRandom = true;
        } else {
          this.validRandom = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    });
  }

  matchingPasswords() {
    return (controls: AbstractControl) => {
      if (controls) {
        const password = controls.get('password')!.value;
        const confirmPassword = controls.get('confirmPassword')!.value;        
        if (password !== confirmPassword) {          
          controls.get('confirmPassword')?.setErrors({ not_the_same: true });          
          return { mismatchedPassword: true };
        }
      }
      return null;
    };
  }

  onSubmit() {
    let newPassword: string = this.form.value.confirmPassword;
    this.loginService.reset(this.token, newPassword).subscribe((data) => {
      this.message = 'Password has been change';

      setTimeout(() => {
        this.router.navigate(['login']);
      }, 2000);
    });
  }

}
