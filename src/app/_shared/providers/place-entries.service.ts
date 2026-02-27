import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GraphqlService } from 'src/app/_shared/services/graphql.service';
import { AlertsService } from 'src/app/_shared/services/alerts.service';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/_shared/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceEntriesService {

  private _watch: BehaviorSubject<any>;
  public watch: Observable<any>;

  constructor(
    private loadingService: LoadingService,
    private alertsService: AlertsService,
    private graphql: GraphqlService
  ) {
    this._watch = <BehaviorSubject<any>>new BehaviorSubject(false);
    this.watch = this._watch.asObservable();
  }
  trigger() {
    this._watch.next(true);
  }

  async getPlaceEntries(args?, fields?) {
    return this.graphql.query(environment.API.geomem, 'graphql', {
      query: `
      query PlaceEntries{
        PlaceEntries{
          _id
          ${fields || ""}
        }
      }`,
      name: "PlaceEntries",
      variables: args || {}
    });
  }
  async getPlaceEntryById(_id, fields?) {
    return this.graphql.query(environment.API.geomem, 'graphql', {
      query: `
      query PlaceEntryById($_id: ID){
        PlaceEntryById(_id: $_id){
          _id
          ${fields || ""}
        }
      }`,
      name: "PlaceEntryById",
      variables: {_id: _id}
    });
  }

  newPlaceEntry(data) {
    this.loadingService.show();
    return this.graphql.query(environment.API.geomem, 'graphql', {
      query: `
      mutation CreatePlaceEntry($input: PlaceEntryInput){
        CreatePlaceEntry(input: $input){
          status
          msg
        }
      }`,
      name: "CreatePlaceEntry",
      variables: data
    })
      .then(done => {
        this.loadingService.hide();
        return done;
      });
  }

  editPlaceEntry(data) {
    this.loadingService.show();

    return this.graphql.query(environment.API.geomem, 'graphql', {
      query: `
      mutation UpdatePlaceEntry($input: PlaceEntryInput){
        UpdatePlaceEntry(input: $input){
          status
          msg
        }
      }`,

      name: "UpdatePlaceEntry",
      variables: data
    })
      .then(done => {
        this.loadingService.hide();
        return done;
      });
  }

  delPlaceEntry(data) {
    return this.alertsService.confirmDel()
      .then(confirm => {
        if (!confirm) return;
        this.loadingService.show();
        return this.graphql.query(environment.API.geomem, 'graphql', {
          query: `
        mutation deletePlaceEntry($_id: ID){
          deletePlaceEntry(_id: $_id){
            status
            msg
          }
        }`,
          name: "deletePlaceEntry",
          variables: data
        });
      })
      .then(done => {
        this.loadingService.hide();
        return done;
      });
  }

  savePlaceEntry(data) {
    return this[data._id ? 'editPlaceEntry' : "newPlaceEntry"]({ input: data });
  }

}