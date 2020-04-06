import Ember from "ember";
import _ from "lodash";

const { getOwner } = Ember;

const getString = (obj, path) => {
  const val = _.get(obj, path);
  return val && _.isString(val) ? val : null;
};

/**
 * @enum {number}
 * @readonly
 * @memberof AsyncMixin
 * @static
 */
export const ERROR_STRATEGIES = {
  /** Will ignore errors */
  IGNORE: 1,
  /** Will display the error message in a modal */
  MODAL: 2,
  /** Will let the error go through */
  RAISE: 3
};

export default Ember.Mixin.create({
  messageBox: Ember.inject.service(),
  logger: Ember.inject.service(),

  ERROR_STRATEGIES,

  // ---- Helpers

  __tasksCount: 0,
  __loadingView: null,
  __modalActive: false,

  __handleError(err, errorStrategy = ERROR_STRATEGIES.RAISE) {
    if (errorStrategy === ERROR_STRATEGIES.RAISE) {
      return Ember.RSVP.reject(err);
    }

    if (errorStrategy === ERROR_STRATEGIES.MODAL) {
      return this.showErrorPopup(err);
    }
  },

  __incrementTaskCount(val = 1) {
    this.__tasksCount += val;
    if (this.__tasksCount > 0) {
      this.showLoadingSpinner();
    } else {
      this.__tasksCount = 0;
      this.hideLoadingSpinner();
    }
  },

  __toErrorMessage(reason) {
    const defaultMessage = this.get("i18n").t("unexpected_error");

    if (reason && reason.responseJSON) {
      reason = reason.responseJSON;
    }

    return (
      getString(reason, "error") ||
      getString(reason, "message") ||
      getString(reason, "errors[0].message") ||
      getString(reason, "errors[0].detail.message") ||
      getString(reason, "errors[0]") ||
      defaultMessage
    );
  },

  __run(task) {
    const res = typeof task === "function" ? task() : task;
    return Ember.RSVP.resolve(res);
  },

  // --- Mixin api

  /**
   * Runs the asynchronous task, showing and hiding loading spinners accordingly
   *
   * @memberof AsyncMixin
   * @instance
   * @param {Promise|Function} task the job to run
   * @param {number} [errorStrategy] an indicator of how to handle the error
   */
  runTask(task, errorStrategy) {
    this.__incrementTaskCount();
    return this.__run(task)
      .then(res => {
        this.__incrementTaskCount(-1);
        return res;
      })
      .catch(err => {
        this.__incrementTaskCount(-1);
        return this.__handleError(err, errorStrategy);
      });
  },

  showLoadingSpinner() {
    if (Ember.testing) {
      return;
    }
    if (!this.__loadingView) {
      this.__loadingView = getOwner(this)
        .factoryFor("component:loading")
        .create()
        .append();
    }
  },

  hideLoadingSpinner() {
    if (Ember.testing) {
      return;
    }
    if (this.__loadingView) {
      this.__loadingView.destroy();
      this.__loadingView = null;
    }
  },

  showErrorPopup(reason) {
    this.get("logger").error(reason);

    if (this.get("__modalActive")) {
      return;
    }

    this.set("__modalActive", true);
    this.get("messageBox").alert(this.__toErrorMessage(reason), () => {
      this.set("__modalActive", false);
    });
  },

  i18nAlert(key, cb) {
    this.get("messageBox").alert(this.get("i18n").t(key), cb);
  }
});
