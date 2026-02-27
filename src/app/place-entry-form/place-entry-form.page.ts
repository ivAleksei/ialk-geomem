import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { I18nService } from '../_shared/services/i18n.service';
import { LocalStorageService } from '../_shared/services/local-storage.service';
import { UserService } from '../_shared/providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { PlaceEntriesService } from '../_shared/providers/place-entries.service';
import { LoadingService } from '../_shared/services/loading.service';

@Component({
  selector: 'app-place-entry-form',
  templateUrl: './place-entry-form.page.html',
  styleUrls: ['./place-entry-form.page.scss'],
})
export class PlaceEntryFormPage implements OnInit {
  @ViewChild("EntryForm") EntryForm: any;

  _id: any;
  extras: any;
  name: any;
  date: any;
  lat: any;
  lng: any;

  loading: boolean = false;

  constructor(
    public i18n: I18nService,
    public nav: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService,
    private loadingService: LoadingService,
    private placeEntriesService: PlaceEntriesService,
    private UserService: UserService
  ) {
    this.route.params.subscribe((params: any) => {
      this._id = params?.id || null;
      this.getEntrySaved();
    })
    this.extras = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.extras) {
      this.lat = this.extras?.coords?.lat || null;
      this.lng = this.extras?.coords?.lng || null;
    }
    this.setupPage();
  }

  setupPage() {
    this.date = moment().format('YYYY-MM-DD');
    this.EntryForm.form.patchValue({
      lat: this.lat,
      lng: this.lng,
      date: this.date,
    })
  }

  async getEntrySaved() {
    if (!this._id) return;

    let data = await this.placeEntriesService.getPlaceEntryById(this._id, `
      name
      date
    `);
    setTimeout(() => this.EntryForm.form.patchValue(data || {}), 200);
  }

  saveEntry() {
    let obj = Object.assign({}, this.EntryForm.value);
    console.log(obj);
    this.loading = true;
    this.placeEntriesService.savePlaceEntry(obj)
      .then(done => {
        this.loading = false;
        this.loadingService.hide();
        if (done?.status != 'success') return;

        this.EntryForm.form.reset();
        return this.nav.back();
      })
  }
}
