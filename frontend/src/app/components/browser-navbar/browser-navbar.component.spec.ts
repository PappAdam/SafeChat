import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrowserNavbarComponent } from './browser-navbar.component';

describe('BrowserNavbarComponent', () => {
  let component: BrowserNavbarComponent;
  let fixture: ComponentFixture<BrowserNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserNavbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowserNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
