import Ember from "ember";

export default Ember.Mixin.create({
  messageBox: Ember.inject.service(),

  // ---- Helpers

  __tasksCount: 0,
  __loadingView: null,

  __incrementTaskCount(val = 1) {
    this.__tasksCount += val;
    if (this.__tasksCount > 0) {
      this.showLoadingSpinner();
    } else {
      this.__tasksCount = 0;
      this.hideLoadingSpinner();
    }
  },

  __run(task) {
    const res = typeof task === "function" ? task() : task;
    return Ember.RSVP.resolve(res);
  },

  // --- Mixin api

  runTask(task) {
    this.__incrementTaskCount();
    return this.__run(task)
      .then(res => {
        this.__incrementTaskCount(-1);
        return res;
      })
      .catch(err => {
        this.__incrementTaskCount(-1);
        return Ember.RSVP.reject(err);
      });
  },

  showLoadingSpinner() {
    if (Ember.testing) {
      return;
    }
    if (!this.__loadingView) {
      this.__loadingView = Ember.getOwner(this)
        .lookup("component:loading")
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

  i18nAlert(key, cb) {
    this.get("messageBox").alert(this.get("i18n").t(key), cb);
  }
});