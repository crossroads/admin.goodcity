export const offerSortingOptions = [
  {
    column_name: "schedules.scheduled_at",
    column_alias: "Due date",
    sort: "asc",
    isDesc: false,
    sorting_alias: "Newest"
  },
  {
    column_name: "schedules.scheduled_at",
    column_alias: "Due date",
    sort: "desc",
    isDesc: true,
    sorting_alias: "Oldest"
  },
  {
    column_name: "created_at",
    column_alias: "Created date",
    sort: "asc",
    isDesc: false,
    sorting_alias: "Newest"
  },
  {
    column_name: "created_at",
    column_alias: "Created date",
    sort: "desc",
    isDesc: true,
    sorting_alias: "Oldest"
  }
];
