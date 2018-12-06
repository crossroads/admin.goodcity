import Ember from 'ember';
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  attributeBindings: ["name", "inputId", "value", "invalid", "disabled", "packageId"],
  isCordovaApp: config.cordova.enabled,
  messageBox: Ember.inject.service(),
  showMenu: false,
  bardcodeReadonly: true,

  checkPermissionAndScan() {
    let _this = this;
    let permissions = cordova.plugins.permissions;
    let permissionError = () => {
      let error_message = this.get("i18n").t("camera_scan.permission_error");
      _this.get("messageBox").alert(error_message);
    };
    let permissionSuccess = (status) => {
      //after requesting check for permission then, permit to scan
      if( status.hasPermission ) {
        _this.scan();
      } else {
        permissionError();
      }
    };
    permissions.hasPermission(permissions.CAMERA, function( status ){
      //check permission here
      if ( status.hasPermission ) {
        _this.scan();
      }
      else {
        //request permission here
        permissions.requestPermission(permissions.CAMERA, permissionSuccess, permissionError);
      }
    });
  },

  scan() {
    let options = {"formats": "CODE_128"};
    let onError = error => this.get("messageBox").alert("Scanning failed: " + error);
    let onSuccess = res => {
      if (!res.cancelled) {
        this.set("value", res.text);
      }
    };
    cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
  },

  actions: {
    toggleMenu() {
      this.toggleProperty("showMenu");
    },

    scanBarcode() {
      this.checkPermissionAndScan();
    },

    printBarcode() {
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise("/packages/print_barcode", "POST", this.get('session.authToken'), {package_id: this.get("packageId")})
        .catch(xhr => {
          if (xhr.status !== 200) {
            var errors = xhr.responseText;
            try { errors = Ember.$.parseJSON(xhr.responseText).errors; }
            catch(err) {
              console.log(err);
            }
            this.get("messageBox").alert(errors);
          } else {
            throw xhr;
          }
        })
        .then(data => {
          this.set("value", data["inventory_number"]);
        })
        .finally(() => loadingView.destroy());
    },

    enterBarcode() {
      this.set("bardcodeReadonly", false);
    }
  }

});
