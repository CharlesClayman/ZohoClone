import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { EventService } from 'src/app/_services/event.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  public sidebarOpened = false;
  searchForm!: FormGroup;
  searchEventSubs: Subscription | undefined;

  constructor(
    public accountService: AccountService,
    public sharedService: SharedService,
    private eventService: EventService,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      searchWord: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.searchEventSubs = this.searchForm
      .get('searchWord')
      ?.valueChanges.subscribe((value) => {
        this.eventService.searchEvent.emit(value);
      });
  }

  toggleSidebar() {
    this.sharedService.toggleSidebar(!this.sidebarOpened);
  }

  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }

  ngOnDestroy(): void {
    this.searchEventSubs?.unsubscribe();
  }
}
