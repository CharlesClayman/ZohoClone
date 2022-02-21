import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  public sidebarOpened = false;

  constructor(
    public accountService: AccountService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.sharedService.toggleSidebar(!this.sidebarOpened);
  }

  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }
}
