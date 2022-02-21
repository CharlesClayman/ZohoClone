import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { SharedService } from './_services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ZohoClone';

  constructor(
    public sharedService: SharedService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.getUserFromStorage();
  }

  toggleSidebar() {
    let toggle: boolean = false;
    this.sharedService.sidebarToggle$.subscribe((response) => {
      toggle = response;
    });

    this.sharedService.toggleSidebar(!toggle);
  }
}
