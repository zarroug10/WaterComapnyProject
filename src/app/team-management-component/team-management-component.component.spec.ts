import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagementComponentComponent } from './team-management-component.component';

describe('TeamManagementComponentComponent', () => {
  let component: TeamManagementComponentComponent;
  let fixture: ComponentFixture<TeamManagementComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamManagementComponentComponent]
    });
    fixture = TestBed.createComponent(TeamManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
