import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationChartComponent } from './location-chart.component';

describe('LocationChartComponent', () => {
  let component: LocationChartComponent;
  let fixture: ComponentFixture<LocationChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationChartComponent]
    });
    fixture = TestBed.createComponent(LocationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
