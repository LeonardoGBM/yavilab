import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroresComponent } from './errores.component';

describe('ErroresComponent', () => {
  let component: ErroresComponent;
  let fixture: ComponentFixture<ErroresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
