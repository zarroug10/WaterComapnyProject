import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { MyMapComponent } from './my-map.component';

describe('MyMapComponent', () => {
  let component: MyMapComponent;
  let fixture: ComponentFixture<MyMapComponent>;

  beforeEach(async () => { // Change to async
    await TestBed.configureTestingModule({
      declarations: [MyMapComponent],
      imports: [HttpClientModule] // Add HttpClientModule to imports
    }).compileComponents(); // Add async compilation
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
