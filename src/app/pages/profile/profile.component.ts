import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  username: string;
  rol: string;
  constructor(private menuService: MenuService){}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token); 
    console.log(decodedToken)
    this.username = decodedToken.sub;
    this.rol = decodedToken.role;
    this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));
  }
}
