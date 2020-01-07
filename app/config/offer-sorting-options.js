export const offerSortingOptions = [
  {
    column_name: "schedules.scheduled_at",
    column_alias: "offer_sorts.due_date",
    sort: "asc",
    is_desc: false,
    sorting_alias: "offer_sorts.oldest"
  },
  {
    column_name: "schedules.scheduled_at",
    column_alias: "offer_sorts.due_date",
    sort: "desc",
    is_desc: true,
    sorting_alias: "offer_sorts.newest"
  },
  {
    column_name: "created_at",
    column_alias: "offer_sorts.create_date",
    sort: "asc",
    is_desc: false,
    sorting_alias: "offer_sorts.oldest"
  },
  {
    column_name: "created_at",
    column_alias: "offer_sorts.create_date",
    sort: "desc",
    is_desc: true,
    sorting_alias: "offer_sorts.newest"
  }
];
