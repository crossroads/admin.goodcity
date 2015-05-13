import Ember from 'ember';

export default Ember.View.extend({
  templateName: "schedule_select_view",

  attributeBindings: ['schedules', 'selectedValue'],
  selectedValue: null,

  weekDays: function() {
    var _this = this;
    var currentDay = moment().day();
    var week = moment.weekdays();

    var options = [
      { name: Ember.I18n.t('scheduled.all_offers') + ' (' + _this.allCount() + ')', id: 'all' },
      { name: Ember.I18n.t('scheduled.overdue') + ' (' + _this.overdueCount() + ')', id: 'overdue' },
      { name: Ember.I18n.t('scheduled.today') + ' (' + _this.scheduleCount() + ')', id: 'today' }];

    for (var i = currentDay + 1; i < week.length; i++) {
      options.push(
        { name: week[i]+" ("+ _this.scheduleCount(week[i]) +")", id: week[i] }
      );
    }

    options.push({ name: Ember.I18n.t('scheduled.next_week') + ' (' + _this.nextWeekCount() + ')',
      id: 'next'});
    options.push({ name: Ember.I18n.t('scheduled.after_next_week') + ' (' + _this.afterNextWeekCount() + ')', id: 'after_next'});
    return options;
  }.property('schedules'),

  overdueCount: function(){
    return this.get('controller').overdue().length;
  },

  scheduleCount: function(dayValue){
    return this.get('controller').daySchedule(dayValue).length;
  },

  nextWeekCount: function(){
    return this.get('controller').nextWeek().length;
  },

  afterNextWeekCount: function(){
    return this.get('controller').afterNextWeek().length;
  },

  allCount: function() {
    return this.get('controller.allScheduled.length');
  },

  selectedObserver: function(){
    this.get('controller').send('filterOffers', this.get('selectedValue.id'));
  }.observes('selectedValue'),
});
