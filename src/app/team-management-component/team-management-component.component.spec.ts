import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagementComponent } from './team-management-component.component';

describe('TeamManagementComponent', () => {
  let component: TeamManagementComponent;
  let fixture: ComponentFixture<TeamManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamManagementComponent]
    });
    fixture = TestBed.createComponent(TeamManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
