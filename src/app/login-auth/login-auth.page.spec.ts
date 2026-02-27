import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginAuthPage } from './login-auth.page';

describe('LoginAuthPage', () => {
  let component: LoginAuthPage;
  let fixture: ComponentFixture<LoginAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
