import Ember from "ember";
import AjaxPromise from "./../utils/ajax-promise";
import _ from "lodash";

function urlWithParams(url, params) {
  if (!params) {
    return url;
  }
  const paramStr = _.map(params, (value, key) => `${key}=${value}`).join("&");
  const separator = /\?/.test(url) ? "&" : "?";
  return `${url}${separator}${paramStr}`;
}

export default Ember.Service.extend({
  // ----- Services -----
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  // ----- Utilities -----
  _request(url, options, authorizedRequest) {
    const { action, body, persist = false } = options;

    url = this.baseUrl ? `${this.baseUrl}${url}` : url;

    return new AjaxPromise(
      url,
      action,
      authorizedRequest ? this.get("session.authToken") : null,
      body
    ).then(data => {
      if (persist) {
        this.get("store").pushPayload(data);
      }
      return data;
    });
  },

  // ----- Configuration -----

  useBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  },

  // ----- CRUD ACTIONS -----
  /**
    authorizedRequest is optional parameter to be be sent during request.
    By default requests are authorized
  **/
  GET(url, opts = {}) {
    const { authorizedRequest = true } = opts;
    return this._request(
      urlWithParams(url, opts),
      _.extend({}, opts, {
        action: "GET"
      }),
      authorizedRequest
    );
  },

  POST(url, body, opts = {}) {
    const { authorizedRequest = true } = opts;
    return this._request(
      url,
      _.extend({}, opts, {
        action: "POST",
        body
      }),
      authorizedRequest
    );
  },

  PUT(url, body, opts = {}) {
    const { authorizedRequest = true } = opts;
    return this._request(
      url,
      _.extend({}, opts, {
        action: "PUT",
        body
      }),
      authorizedRequest
    );
  },

  DELETE(url, opts = {}) {
    const { authorizedRequest = true } = opts;
    return this._request(
      urlWithParams(url, opts),
      _.extend({}, opts, {
        action: "DELETE"
      }),
      authorizedRequest
    );
  }
});
