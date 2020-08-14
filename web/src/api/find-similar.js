import {
  from
} from "rxjs";
import {
  finalize,
  catchError,
  mergeMap,
  map
} from "rxjs/operators";
import {
  timeParse,
  nest
} from "d3";

import store from "@/store";
import {
  getAll
} from "@/api/biothings.js";


export function findSimilar(apiUrl, locationID, variable, similarityMetric) {
  store.state.admin.loading = true;
  // Choosing one specific date, since all dates contain the current info.
  // First get the location's data for the most recent date.
  // Use that value to get the most recent value of `similarityMetric` and find locations with similar values
  // Then get ALL the data for all those locations.
  return getLocation(apiUrl, locationID, variable, similarityMetric).pipe(
    mergeMap(locationData => getSimilarData(apiUrl, locationData, similarityMetric, true).pipe(
      mergeMap(similar => {
        const locationString = `(${similar.map(d => d.location_id).join(" OR ")})`;
        return (getLocation(apiUrl, locationString, variable, similarityMetric)).pipe(
          map(results => {
            const nested = nest()
              .key(d => d.location_id)
              .entries(results);

            nested.forEach(d => {
              d.values.sort((a, b) => a.date - b.date);
              const mostRecent = d.values.slice(-1)[0];
              d["name"] = mostRecent.name;
              d["lat"] = mostRecent.lat;
              d["lon"] = mostRecent.long;
              d["similarValue"] = mostRecent[similarityMetric];
            })

            const location = nested.filter(d => d.key == locationID)[0];
            const locationValue = location.similarValue;

            nested.forEach(d => {
              d["valueDiff"] = Math.abs(d.similarValue - locationValue);
            })

            nested.sort((a, b) => a.valueDiff - b.valueDiff);


            return ({
              similar: nested.filter(d => d.key != locationID),
              location: location
            })
          })
        )
      })
    )),
    catchError(e => {
      console.log("%c Error in getting map data!", "color: red");
      console.log(e);
      return from([]);
    }),
    finalize(() => (store.state.admin.loading = false))
  );
}

export function getLocation(apiUrl, locationID, variable, similarityMetric, mostRecent = false) {
  const parseDate = timeParse("%Y-%m-%d");

  const query = mostRecent ? `location_id:${locationID} AND mostRecent:true` : `location_id:${locationID}`

  return getAll(
    apiUrl,
    `${query}&fields=${variable},${similarityMetric},name,lat,long,date,location_id`
  ).pipe(
    map(results => {
      results.forEach(d => {
        d["date"] = parseDate(d["date"]);
      });
      return results;
    }),
    catchError(e => {
      console.log("%c Error in getting map data!", "color: red");
      console.log(e);
      return from([]);
    }),
    finalize(() => (store.state.admin.loading = false))
  );
}

export function getSimilarData(apiUrl, locationData, similarityMetric, logged = true) {
  const threshold = 0.02;
  const mostRecent = locationData[0];
  const value = logged ? Math.log10(mostRecent[similarityMetric]) : mostRecent[similarityMetric];

  const thresholdString = logged ? `${Math.pow(10, (1-threshold) * value)} TO ${Math.pow(10, (1+threshold) * value)}` : `${(1-threshold) * value} TO ${(1+threshold) * value}`;

  // threshold for numbers 2147483647

  return getAll(
    apiUrl,
    `mostRecent:true AND ${similarityMetric}:[${thresholdString}]&fields=location_id`
  ).pipe(
    catchError(e => {
      console.log("%c Error in getting map data!", "color: red");
      console.log(e);
      return from([]);
    }),
    finalize(() => (store.state.admin.loading = false))
  );
}
